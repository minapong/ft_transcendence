export function stripControlChars(s: string) {
  // remove ASCII control chars incl. NULL; rm \n\r\t 
  return s.replace(/[\u0000-\u001F\u007F]/g, "");
}

export function normalizeText(s: string, maxLen: number) {
  let out = (s ?? "").toString();

  // unicode normalize to reduce weird homoglyph tricks 
  // NFC -Characters are decomposed by canonical equivalence
  out = out.normalize("NFC");

  out = stripControlChars(out);
  out = out.trim();
  out = out.replace(/\s+/g, " "); // collapse whitespace
  if (out.length > maxLen) out = out.slice(0, maxLen);
  return out;
}

// use if output into HTML strings exists
export function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
