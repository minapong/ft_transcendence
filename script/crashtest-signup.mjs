// backend/scripts/crashtest-signup.mjs
// Usage: node crashtest-signup.mjs http://localhost:3000
//    or: node crashtest-signup.mjs https://localhost:8443

import process from "node:process";

const base = process.argv[2] || "http://localhost:3000";
const url = new URL("/api/auth/signup", base).toString();

// If you're using self-signed certs in dev:
if (base.startsWith("https://")) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

function j(v) {
  return JSON.stringify(v);
}

async function post(payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: j(payload),
  });

  let bodyText = "";
  try {
    bodyText = await res.text();
  } catch {
    bodyText = "";
  }

  let data = null;
  try {
    data = bodyText ? JSON.parse(bodyText) : null;
  } catch {
    data = { parseError: true, raw: bodyText.slice(0, 200) };
  }

  return { status: res.status, data, raw: bodyText };
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function repeat(ch, n) {
  return ch.repeat(n);
}

const cases = [
  // Missing / wrong types
  { name: "empty body", payload: {} },
  { name: "nulls", payload: { email: null, username: null, password: null } },
  { name: "wrong types", payload: { email: 42, username: {}, password: [] } },

  // Email
  { name: "bad email no at", payload: { email: "abc", username: "Abc_1", password: "12345678" } },
  { name: "bad email no dot", payload: { email: "a@b", username: "Abc_1", password: "12345678" } },
  { name: "email trim", payload: { email: "  a@b.com  ", username: "Abc_1", password: "12345678" } },
  { name: "email uppercase", payload: { email: "A@B.COM", username: "Abc_1", password: "12345678" } },

  // Username
  { name: "username starts digit", payload: { email: "a@b.com", username: "1abc", password: "12345678" } },
  { name: "username has space", payload: { email: "a@b.com", username: "ab cd", password: "12345678" } },
  { name: "username unicode emoji", payload: { email: "a@b.com", username: "ab🔥cd", password: "12345678" } },
  { name: "username xss-ish", payload: { email: "a@b.com", username: "<img src=x>", password: "12345678" } },

  // Password
  { name: "password too short", payload: { email: "a@b.com", username: "Abc_1", password: "123" } },
  { name: "password with trailing space", payload: { email: "a@b.com", username: "Abc_1", password: "12345678 " } },
  { name: "password with leading space", payload: { email: "a@b.com", username: "Abc_1", password: " 12345678" } },
  { name: "password with newline", payload: { email: "a@b.com", username: "Abc_1", password: "pass\nword123" } },
  { name: "password too long", payload: { email: "a@b.com", username: "Abc_1", password: repeat("a", 1000) } },

  // Control chars
  {
    name: "email with null char",
    payload: { email: "a\u0000@b.com", username: "Abc_1", password: "12345678" },
  },
  {
    name: "username with control chars",
    payload: { email: "a@b.com", username: "Abc\n_1\t", password: "12345678" },
  },

  // Oversized fields
  { name: "huge username", payload: { email: "a@b.com", username: repeat("A", 20000), password: "12345678" } },
  { name: "huge email", payload: { email: repeat("a", 20000) + "@b.com", username: "Abc_1", password: "12345678" } },
];

let passed = 0;
let failed = 0;

for (const tc of cases) {
  try {
    const res = await post(tc.payload);

    // hard requirements for crash resistance
    assert(res.status === 200, `[${tc.name}] expected status 200, got ${res.status}`);
    assert(res.data && typeof res.data === "object", `[${tc.name}] expected JSON object response`);
    assert(typeof res.data.ok === "boolean", `[${tc.name}] expected {ok:boolean}`);
    if (res.data.ok === false) {
      assert(typeof res.data.error === "string", `[${tc.name}] expected {error:string} when ok:false`);
      // should not leak stack traces
      const leak = /Error:|Prisma|FastifyError|stack|at\s+\w+\s+\(/i.test(res.data.error);
      assert(!leak, `[${tc.name}] error message looks like internal leak: "${res.data.error}"`);
    }

    console.log(`✅ ${tc.name}`);
    passed++;
  } catch (e) {
    console.error(`❌ ${tc.name}: ${e.message}`);
    failed++;
  }
}

console.log(`\nDone. Passed: ${passed}, Failed: ${failed}`);
process.exitCode = failed ? 1 : 0;
