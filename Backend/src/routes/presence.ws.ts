import { FastifyInstance } from "fastify";
import {
  addOnline,
  removeOnline,
  onlineUserIds,
} from "../presence/presence.store.js";

export async function registerPresenceWs(server: FastifyInstance) {
  server.get("/ws/presence", { websocket: true }, (connection, req) => {
      const close = (reason: string) => connection.socket.close(1008, reason);
      
      const token = (req.query as any)?.token;
      if (!token) 
        return close("missing token");
      let userId: number;

      try {
        const payload = server.jwt.verify(token) as any;
        userId = Number(payload?.userId);
        if (!Number.isFinite(userId)) return connection.socket.close("invalid token");
      } catch {
        return close("missing token");
      }

      // track this exact connection
      addOnline(userId, connection);

      connection.socket.send(
        JSON.stringify({
          type: "hello",
          userId,
          online: onlineUserIds(),
        })
      );

      connection.socket.on("close", () => {
        //  only goes offline when the LAST connection is removed
        removeOnline(userId, connection);
      });
  });
}
