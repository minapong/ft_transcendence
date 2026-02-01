import { FastifyInstance } from "fastify";
import { requireAuth } from "../plugins/auth.guard.js";
import { ProfileService } from "../services/profile.service.js";

type Body = { age?: number | null; location?: string | null };

export async function registerProfileSettingsRoutes(server: FastifyInstance) {
  server.patch<{ Body: Body }>(
    "/api/me/profile",
    { preHandler: requireAuth },
    async (req: any, reply) => {
      const userId = Number(req.user?.userId);

      const body = (req.body ?? {}) as Body;

      const hasAge = Object.prototype.hasOwnProperty.call(body, "age");
      const hasLoc = Object.prototype.hasOwnProperty.call(body, "location");

      if (!hasAge && !hasLoc) {
        return reply.code(200).send({ ok: false, error: "No fields to update" });
      }

     
      try {
        const user = await ProfileService.updateBasics(
          userId,
          hasAge ? body.age : undefined,
          hasLoc ? body.location : undefined
        );

        return reply.code(200).send({ ok: true, user });
      } catch (e: any) {
        const msg = String(e?.message ?? "");

        // service can throw UNAUTHORIZED if userId is invalid
        if (msg === "UNAUTHORIZED") {
          return reply.code(200).send({ ok: false, error: "Unauthorized" });
        }

        // validator messages are already user-facing:
        // "Age must be 0-130", "Invalid location"
        if (msg) {
          return reply.code(200).send({ ok: false, error: msg });
        }

        return reply.code(200).send({ ok: false, error: "Server error" });
      }
    }
  );
}