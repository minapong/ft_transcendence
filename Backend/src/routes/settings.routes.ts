import { FastifyInstance } from "fastify";
import { requireAuth } from "../plugins/auth.guard.js";
// import { SettingsService } from "../services/settings.service.js";
import { ProfileService } from "../services/profile.service.js";

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

      const ageRaw = hasAge ? (body.age as any) : undefined;
      const locRaw = hasLoc ? (body.location as any) : undefined;

      const age =
        ageRaw === undefined ? undefined : ageRaw === null ? null : Number(ageRaw);

      const location =
        locRaw === undefined ? undefined : locRaw === null ? null : String(locRaw);

      try {
        // ✅ still 3-argument call
        const user = await ProfileService.updateBasics(userId, age, location);
        return reply.code(200).send({ ok: true, user });
      } catch (e: any) {
        const msg = e?.message;
        if (msg === "AGE_INVALID") return reply.code(200).send({ ok: false, error: "Invalid age" });
        if (msg === "LOCATION_TOO_LONG") return reply.code(200).send({ ok: false, error: "Location too long" });
        return reply.code(200).send({ ok: false, error: "Server error" }); // ✅ never 500
      }
    }
  );
}
