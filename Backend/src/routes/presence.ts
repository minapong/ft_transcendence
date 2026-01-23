import { FastifyInstance } from "fastify";
import { requireAuth } from "../plugins/auth.guard.js";
import { isOnline, onlineUserIds } from "../presence/presence.store.js";

export async function registerPresenceRoutes(server: FastifyInstance) {
  server.get("/api/presence/online", { preHandler: requireAuth }, async (_req, reply) => {
    reply.header("Cache-Control", "no-store"); // avoid any caching weirdness
    return reply.send({ online: onlineUserIds() });
  });

  server.get<{ Params: { id: string } }>(
    "/api/presence/status/:id",
    { preHandler: requireAuth },
    async (req, reply) => {
      reply.header("Cache-Control", "no-store");
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) return reply.code(400).send({ error: "Invalid id" });
      return reply.send({ userId: id, online: isOnline(id) });
    }
  );
}
