/**
 * Removes ASCII control characters, including NULL.
 */
export function stripControlChars(s: string) {
  return s.replace(/[\u0000-\u001F\u007F]/g, "");
}

/**
 * Normalize human-facing text:
 * - Convert to string
 * - Unicode normalize NFC
 * - Strip control chars
 * - Trim
 * - Collapse whitespace
 * - Hard cap length
 */
export function normalizeText(s: string, maxLen: number) {
  let out = (s ?? "").toString();

  // NFC: canonical equivalence normalization (helps reduce weird unicode variants)
  out = out.normalize("NFC");

  out = stripControlChars(out);
  out = out.trim();
  out = out.replace(/\s+/g, " "); // collapse whitespace
  if (out.length > maxLen) out = out.slice(0, maxLen);
  return out;
}


export function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
