import { disconnectPresenceWS } from "@/lib/presence";

const AUTH_KEY = "auth";

export function logout() {
  // close WS first (so backend marks you offline immediately)
  disconnectPresenceWS();

  // remove auth token/user
  localStorage.removeItem("auth");

  // go to login
  window.location.href = "/login";
}

export function getAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAuth(data: any){
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}
