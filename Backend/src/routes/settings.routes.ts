import { FastifyInstance } from "fastify";
import { requireAuth } from "../plugins/auth.guard.js";
// import { SettingsService } from "../services/settings.service.js";
import { ProfileService } from "../services/profile.service.js";

// type ChangeEmailBody = {
//   email: string;
//   password: string;
// };

// type ChangePasswordBody = {
//   currentPassword: string;
//   newPassword: string;
// };

type Body = { age?: number | null; location?: string | null };

export async function registerProfileSettingsRoutes(server: FastifyInstance) {
    server.patch<{ Body: Body }>(
    "/api/me/profile",
    { preHandler: requireAuth },
    async (req, reply) => {
      const userId = Number((req.user as any).userId);
      const age = (req.body?.age ?? null) as any;
      const location = (req.body?.location ?? null) as any;

      try {
        const user = await ProfileService.updateBasics(
          userId,
          age === null ? null : Number(age),
          location === null ? null : String(location)
        );
        return reply.send({ user });
      } catch (e: any) {
        const msg = e?.message;
        if (msg === "AGE_INVALID") return reply.code(400).send({ error: "Invalid age" });
        if (msg === "LOCATION_TOO_LONG") return reply.code(400).send({ error: "Location too long" });
        return reply.code(500).send({ error: "Internal server error" });
      }
    }
  );
}


// export async function registerSettingsRoutes(server: FastifyInstance) {
//   server.patch<{ Body: ChangeEmailBody }>(
//     "/api/me/email",
//     { preHandler: requireAuth },
//     async (req, reply) => {
//       const userId = Number((req.user as any).userId);
//       const { email, password } = req.body ?? ({} as any);

//       try {
//         const updated = await SettingsService.changeEmail(userId, email, password);

//         const token = server.jwt.sign(
//           { userId: updated.id, email: updated.email },
//           { expiresIn: "1h" }
//         );

//         return reply.send({ user: updated, token });
//       } catch (e: any) {
//         const msg = e?.message;
//         if (msg === "EMAIL_REQUIRED" || msg === "EMAIL_INVALID")
//           return reply.code(400).send({ error: "Invalid email" });
//         if (msg === "INVALID_PASSWORD")
//           return reply.code(401).send({ error: "Wrong password" });
//         if (msg === "EMAIL_ALREADY_EXISTS")
//           return reply.code(409).send({ error: "Email already used" });
//         return reply.code(500).send({ error: "Internal server error" });
//       }
//     }
//   );

//   server.patch<{ Body: ChangePasswordBody }>(
//     "/api/me/password",
//     { preHandler: requireAuth },
//     async (req, reply) => {
//       const userId = Number((req.user as any).userId);
//       const { currentPassword, newPassword } = req.body ?? ({} as any);

//       try {
//         await SettingsService.changePassword(userId, currentPassword, newPassword);
//         return reply.send({ ok: true });
//       } catch (e: any) {
//         const msg = e?.message;
//         if (msg === "PASSWORD_TOO_SHORT")
//           return reply.code(400).send({ error: "Password must be at least 8 chars" });
//         if (msg === "PASSWORD_SAME")
//           return reply.code(400).send({ error: "New password must be different" });
//         if (msg === "INVALID_PASSWORD")
//           return reply.code(401).send({ error: "Wrong current password" });
//         return reply.code(500).send({ error: "Internal server error" });
//       }
//     }
//   );
// }
