import { FastifyInstance } from "fastify";
import { requireAuth } from "../plugins/auth.guard.js";
import { MeService } from "../services/me.service.js";

export async function registerMeRoutes(server: FastifyInstance) {
  server.get("/api/me", { preHandler: requireAuth }, async (req: any, reply) => {
    const userId = Number(req.user?.userId);

    try {
      const me = await MeService.getMe(userId);
      return reply.code(200).send({ ok: true, ...me });
    } catch (e: any) {
      const msg = String(e?.message ?? "");

      if (msg === "UNAUTHORIZED") {
        return reply.code(200).send({ ok: false, error: "Unauthorized" });
      }
      if (msg === "USER_NOT_FOUND") {
        return reply.code(200).send({ ok: false, error: "User not found" });
      }

      return reply.code(200).send({ ok: false, error: "Server error" });
    }
  });
}
