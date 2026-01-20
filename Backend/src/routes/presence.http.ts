// src/routes/presence.http.ts
import type { FastifyInstance } from "fastify";
import { isOnline, onlineUserIds } from "../presence/presence.store.js";
import { requireAuth } from "../plugins/auth.guard.js";

export async function registerPresenceHttpRoutes(server: FastifyInstance) {
  // list online users (protected)
  server.get("/api/presence/online", { preHandler: requireAuth }, async (_req, reply) => {
    return reply.send({ online: onlineUserIds() });
  });

  // check one user (protected)
  server.get("/api/presence/:id", { preHandler: requireAuth }, async (req: any, reply) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return reply.code(400).send({ error: "Invalid id" });
    return reply.send({ userId: id, online: isOnline(id) });
  });
}
