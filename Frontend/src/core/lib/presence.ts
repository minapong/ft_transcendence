import { getAuth, logout } from "@/core/lib/auth";

let ws: WebSocket | null = null;

export function connectPresenceWS() {
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return ws;

  const token = getAuth()?.token;
  if (!token) return null;

  ws = new WebSocket(`ws://localhost:3000/ws/presence?token=${token}`);

  ws.onopen = () => console.log("✅ presence ws open");
  ws.onclose = () => {
    console.log("❌ presence ws closed");
    ws = null;
  };
  ws.onerror = (e) => console.log("🔥 ws error", e);

  return ws;
}

export function disconnectPresenceWS() {
  if (ws) ws.close();
  ws = null;
}
 
