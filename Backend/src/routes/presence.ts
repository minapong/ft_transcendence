// src/routes/presence.ts
import { FastifyInstance} from "fastify";
import { requireAuth } from "../plugins/auth.guard.js";
import { isOnline, listOnline } from "../presence/store.js";

export async function registerPresenceRoutes(server: FastifyInstance) {
  // list all online userIds
  server.get("/api/presence/online", { preHandler: requireAuth }, async (_req, reply) => {
    return reply.send({ online: listOnline() });
  });

  // check one user
  server.get <{ Params: { id: string } }>(
    "/api/presence/status/:id",
    { preHandler: requireAuth },
    async (req, reply) => {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) return reply.code(400).send({ error: "Invalid id" });
      return reply.send({ userId: id, online: isOnline(id) });
    }
  );

  // check many users at once (nice for friends list later)
  server.get <{ Querystring: { ids?: string } }>(
    "/api/presence/status",
    { preHandler: requireAuth },
    async (req, reply) => {
      const ids = (req.query.ids || "")
        .split(",")
        .map((x) => Number(x))
        .filter((n) => Number.isFinite(n));

      return reply.send({
        online: ids.filter((id) => isOnline(id)),
      });
    }
  );
}
