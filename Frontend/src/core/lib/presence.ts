import { getAuth, logout } from "@/core/lib/auth";

const PRESENCE_EVENT = "presence:msg";
let ws: WebSocket | null = null;

const WS_BASE =
  import.meta.env.VITE_WS_BASE ??
  (location.protocol === "https:" ? "wss://" : "ws://") + location.host;

export function connectPresenceWS() {
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return ws;

  const token = getAuth()?.token;
  if (!token) return null;

  ws = new WebSocket(`${WS_BASE}/ws/presence?token=${encodeURIComponent(token)}`);

  ws.onopen = () => console.log("presence ws open");
  ws.onclose = () => {
    console.log("presence ws closed");
    ws = null;
  };

  ws.onmessage = (ev) => {
    try {
      const msg = JSON.parse(ev.data);
      window.dispatchEvent(new CustomEvent(PRESENCE_EVENT, { detail: msg }));
    } catch {
      console.log("bad ws msg", ev.data);
    }
  };

  ws.onerror = (e) => console.log("ws error", e);

  return ws;
}

export function onPresenceMessage(handler: (msg: any) => void) {
  const listener = (e: any) => handler(e.detail);
  window.addEventListener(PRESENCE_EVENT, listener);
  return () => window.removeEventListener(PRESENCE_EVENT, listener);
}

export function disconnectPresenceWS() {
  if (ws) ws.close();
  ws = null;
}
 
