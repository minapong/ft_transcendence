import { FastifyInstance } from "fastify";
import { requireAuth } from "../plugins/auth.guard.js";
import { ProfileIdService } from "../services/profile_id.service.js";

export async function registerProfileRoutes(server: FastifyInstance) {
  server.get<{ Params: { id: string } }>(
    "/api/users/:id",
    { preHandler: requireAuth },
    async (req, reply) => {
      const targetId = Number(req.params.id);
      if (!Number.isFinite(targetId)) {
        return reply.code(400).send({ error: "Invalid user id" });
      }

      const viewerId = Number((req.user as any).userId);

      const user = await ProfileIdService.getProfileForViewer(viewerId, targetId);
      if (!user) return reply.code(404).send({ error: "User not found" });

      return reply.send(user);
    }
  );
}
