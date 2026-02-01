import { getAuth, logout } from "@/core/lib/auth";
import { useEffect, navigate } from "Reactor";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const auth = getAuth();
  const token = auth?.token;

  const headers = new Headers(options.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);

  if (options.body && !headers.has("Content-Type")) {
    const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
    if (!isFormData) headers.set("Content-Type", "application/json");
  }

  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, { ...options, headers });

  if (res.status === 401 && token) {
    // console.warn("401 → auto logout");
    logout(); // closes WS + clears auth + redirects
    return res;
  }

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try {
      const data = await res.clone().json();

      // Support both styles:
      // 1) { ok:false, error:"ADMIN_ONLY" }
      // 2) { error:"Admin access required" } 
      const err = String(data?.error ?? "");

      if (err === "ADMIN_ONLY" || err === "Admin access required") {

        // redirect
        navigate("/dance");;
      }
    } catch {
      // ignore parse errors
    }
  }
  return res;
}
