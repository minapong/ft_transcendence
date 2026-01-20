// src/routes/presence.ws.ts
import type { FastifyInstance } from "fastify";
import type { SocketStream } from "@fastify/websocket";
import { addOnline, removeOnline, onlineUserIds } from "../presence/presence.store.js";

function getToken(req: any): string | null {
  // ws://host/ws/presence?token=...
  const t = req.query?.token;
  if (typeof t === "string" && t.length > 0) return t;

  // Optional fallback: "Authorization: Bearer <token>" (not typical in browser WS)
  const auth = req.headers?.authorization;
  if (typeof auth === "string" && auth.startsWith("Bearer ")) return auth.slice(7);

  return null;
}

export async function registerPresenceWsRoutes(server: FastifyInstance) {
  server.get("/ws/presence", { websocket: true }, (conn: SocketStream, req: any) => {
    const token = getToken(req);
    if (!token) {
      conn.socket.close(1008, "Missing token");
      return;
    }

    let payload: any;
    try {
      payload = server.jwt.verify(token);
    } catch {
      conn.socket.close(1008, "Invalid token");
      return;
    }

    const userId = Number(payload.userId);
    if (!Number.isFinite(userId)) {
      conn.socket.close(1008, "Bad token payload");
      return;
    }

    addOnline(userId, conn);

    // Useful debug message for client
    conn.socket.send(JSON.stringify({ type: "hello", userId, online: onlineUserIds() }));

    conn.socket.on("close", () => {
      removeOnline(userId, conn);
    });
  });
}
