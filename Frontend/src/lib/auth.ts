import { disconnectPresenceWS } from "@/lib/presence";
import { useRef, navigate } from "Reactor";

const AUTH_KEY = "auth";

export function logout() {
  // close WS first (so backend marks you offline immediately)
  disconnectPresenceWS();

  // remove auth token/user
  sessionStorage.removeItem(AUTH_KEY);

  // go to login
  navigate("/login");
}

export function getAuth() {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAuth(data: any){
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(data));
}

export function clearAuth() {
  sessionStorage.removeItem(AUTH_KEY);
}
