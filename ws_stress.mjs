// ws_stress.mjs
import WebSocket from "ws";

const URL = process.env.URL || "ws://localhost:8080/ws/presence";
const TOKEN = process.env.TOKEN || "";
const N = Number(process.env.N || 25);          // concurrent sockets
const LOOPS = Number(process.env.LOOPS || 10);  // reconnect cycles
const WAIT_MS = Number(process.env.WAIT_MS || 100);

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function oneConnection(i, token) {
  return new Promise((resolve) => {
    const u = token ? `${URL}?token=${encodeURIComponent(token)}` : URL;
    const ws = new WebSocket(u);

    let gotHello = false;

    ws.on("message", (buf) => {
      const msg = buf.toString();
      if (msg.includes('"type":"hello"')) gotHello = true;
    });

    ws.on("close", (code, reason) => {
      resolve({ i, gotHello, code, reason: reason?.toString?.() || "" });
    });

    ws.on("error", () => {
      // error -> treat as closed; still resolve so script ends
      resolve({ i, gotHello, code: "ERR", reason: "" });
    });

    // close after a short time to force add/removeOnline churn
    setTimeout(() => {
      try { ws.close(); } catch {}
    }, WAIT_MS);
  });
}

async function main() {
  if (!TOKEN) {
    console.error("Set TOKEN env var for valid-token stress test.");
    process.exit(2);
  }

  console.log(`URL=${URL}`);
  console.log(`N=${N} LOOPS=${LOOPS} WAIT_MS=${WAIT_MS}`);

  for (let loop = 1; loop <= LOOPS; loop++) {
    const results = await Promise.all(
      Array.from({ length: N }, (_, i) => oneConnection(i, TOKEN))
    );

    const okHello = results.filter(r => r.gotHello).length;
    const notHello = results.length - okHello;

    console.log(`loop ${loop}: hello=${okHello}/${results.length} missingHello=${notHello}`);

    // show any weird closes
    const weird = results.filter(r => r.code === "ERR" || (typeof r.code === "number" && r.code !== 1000 && r.code !== 1005));
    if (weird.length) {
      console.log("weird closes:", weird.slice(0, 5));
    }

    await sleep(50);
  }

  console.log("done");
}

main().catch((e) => {
  console.error("stress script failed", e);
  process.exit(1);
});
