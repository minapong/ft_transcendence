import { FastifyInstance } from "fastify";
import { requireAuth } from "../plugins/auth.guard.js";
// import { SettingsService } from "../services/settings.service.js";
import { UserRepo } from "../repositories/user.repo.js";
import { unwrap } from "../lib/input/unwrap.js";
import { vAge, vLocation } from "../lib/input/validators.js";
import { WAREHOUSES } from "../lib/input/locations.js";
// settings.routes.ts
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

     
      const patch: { age?: number | null; location?: string | null } = {};

      try {
        // Apply EXACT same validation rules as frontend
        if (hasAge) patch.age = unwrap(vAge(body.age));
        if (hasLoc) patch.location = unwrap(vLocation(body.location, WAREHOUSES));

        const user = await UserRepo.updateBasics(userId, patch);
        return reply.code(200).send({ ok: true, user });
      } catch (e: any) {
        // Validation errors use unwrap() -> Error(message)
        return reply.code(200).send({ ok: false, error: e?.message ?? "Invalid input" });
      }
    }
  );
}