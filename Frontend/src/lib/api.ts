import { getAuth } from "@/lib/auth";

export async function apiFetch(url: string, options: RequestInit = {}) {
  const auth = getAuth();
  const token = auth?.token;

  const headers = new Headers(options.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type") && options.body) headers.set("Content-Type", "application/json");

  return fetch(url, { ...options, headers });
}
