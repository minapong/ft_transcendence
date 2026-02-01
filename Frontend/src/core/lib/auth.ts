import { disconnectPresenceWS } from "@/core/lib/presence";
import { navigate } from "Reactor";

const AUTH_KEY = "auth";
const AUTH_EVENT = "auth:changed";

export function getAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAuth(data: any) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function logout() {
  disconnectPresenceWS();   // tell backend you’re gone
  clearAuth();              // update local state + UI
  navigate("/auth/login");       // redirect
}
