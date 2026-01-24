import { getAuth, logout } from "@/core/lib/auth";

export async function apiFetch(url: string, options: RequestInit = {}) {
  const auth = getAuth();
  const token = auth?.token;

  const headers = new Headers(options.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
 if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401 && token) {
    console.warn("401 → auto logout");
    logout(); // closes WS + clears auth + redirects
    return res;
  }
  return res;
}
