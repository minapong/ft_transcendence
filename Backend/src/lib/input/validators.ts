import { normalizeText } from "./sanitize.js";

export type Validation<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

// ----------------------------
// Identity / auth
// ----------------------------

export function vUsername(raw: unknown): Validation<string> {
  const s = normalizeText(String(raw ?? ""), 32);

  // 3-20, starts with letter, then letters/digits/_/-
  if (s.length < 3 || s.length > 20) {
    return { ok: false, error: "Username must be 3-20 chars" };
  }
  if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(s)) {
    return { ok: false, error: "Username can contain letters, digits, _ and -" };
  }
  return { ok: true, value: s };
}

export function vEmail(raw: unknown): Validation<string> {
  const s = normalizeText(String(raw ?? ""), 254).toLowerCase();

  if (s.length < 3 || s.length > 254) {
    return { ok: false, error: "Invalid email length" };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) {
    return { ok: false, error: "Invalid email format" };
  }
  return { ok: true, value: s };
}

/**
 * Signup/change password validator.
 */
export function vPassword(raw: unknown): Validation<string> {
  const s = String(raw ?? "");

  if (s.length < 8 || s.length > 72) {
    return { ok: false, error: "Password must be 8-72 chars" };
  }
  return { ok: true, value: s };
}

export function vPasswordLogin(raw: unknown): Validation<string> {
  const s = String(raw ?? "");
  if (s.length < 1 || s.length > 128) {
    return { ok: false, error: "Invalid password length" };
  }
  return { ok: true, value: s };
}

// ----------------------------
// App/game inputs
// ----------------------------

export function vTournamentName(raw: unknown): Validation<string> {
  const s = normalizeText(String(raw ?? ""), 40);

  if (s.length < 1 || s.length > 32) {
    return { ok: false, error: "Tournament name must be 1-32 chars" };
  }
  // allowlist: letters, numbers, spaces, basic punctuation
  if (!/^[a-zA-Z0-9 _.-]+$/.test(s)) {
    return { ok: false, error: "Tournament name has invalid characters" };
  }
  return { ok: true, value: s };
}

export function vInt(
  raw: unknown,
  name = "value",
  opts?: { min?: number; max?: number }
): Validation<number> {
  // Accept numbers or numeric strings, reject objects/arrays
  const n = Number(raw);

  if (!Number.isFinite(n) || !Number.isInteger(n)) {
    return { ok: false, error: `${name} must be an integer` };
  }

  if (opts?.min != null && n < opts.min) {
    return { ok: false, error: `${name} must be >= ${opts.min}` };
  }
  if (opts?.max != null && n > opts.max) {
    return { ok: false, error: `${name} must be <= ${opts.max}` };
  }

  return { ok: true, value: n };
}

export function vIntId(raw: unknown, name = "id"): Validation<number> {
  const n = Number(raw);
  if (!Number.isInteger(n) || n <= 0) {
    return { ok: false, error: `Invalid ${name}` };
  }
  return { ok: true, value: n };
}

export function vAge(raw: unknown): Validation<number | null> {
  if (raw === "" || raw == null) return { ok: true, value: null };
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0 || n > 130) {
    return { ok: false, error: "Age must be 0-130" };
  }
  return { ok: true, value: Math.floor(n) };
}

export function vLocation(
  raw: unknown,
  allowed: readonly string[]
): Validation<string | null> {
  const s = normalizeText(String(raw ?? ""), 64);
  if (!s) return { ok: true, value: null };
  if (!allowed.includes(s)) return { ok: false, error: "Invalid location" };
  return { ok: true, value: s };
}

export function vPlayerName(raw: unknown, fallback: string): Validation<string> {
  const rawStr = String(raw ?? "");

  // allow empty => fallback
  if (!rawStr.trim()) return { ok: true, value: fallback };

  // allowed: letters, numbers, spaces, _ and -
  if (/[^a-zA-Z0-9 _-]/.test(rawStr)) {
    return {
      ok: false,
      error: "Name can contain letters, numbers, spaces, _ and -",
    };
  }

  const s = normalizeText(rawStr, 24);

  if (s.length < 1 || s.length > 20) {
    return { ok: false, error: "Name must be 1-20 chars" };
  }

  return { ok: true, value: s };
}
