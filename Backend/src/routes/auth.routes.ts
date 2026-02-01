// backend/src/routes/auth.routes.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "../services/auth.service.js";

import { unwrap } from "../lib/input/unwrap.js";
import { vEmail, vUsername, vPassword } from "../lib/input/validators.js";

interface SignupBody {
  email?: unknown;
  username?: unknown;
  password?: unknown;
}

function asTrimmedString(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s.length ? s : null;
}

// limits  to avoid DB errors + huge tokens
const MAX_EMAIL = 320;
const MAX_USERNAME = 32;
const MAX_PASSWORD = 128;

export async function registerAuthRoutes(server: FastifyInstance) {
  server.post(
    "/api/auth/signup",
    async (req: FastifyRequest<{ Body: SignupBody }>, reply: FastifyReply) => {
      const body = (req.body ?? {}) as SignupBody;

      // Validate + normalize using shared validators
      let email: string;
      let username: string;
      let password: string;

      try {
        email = unwrap(vEmail(body.email));
        username = unwrap(vUsername(body.username));
        password = unwrap(vPassword(body.password));
      } catch (e: any) {
        return reply
          .code(200)
          .send({ ok: false, error: e?.message ?? "Invalid input" });
      }

      try {
        const user = await AuthService.signup(email, username, password);

        const token = server.jwt.sign(
          { userId: user.id, email: user.email, isAdmin: user.isAdmin },
          { expiresIn: "1h" }
        );

        return reply.code(200).send({ ok: true, user, token });
      } catch (err: any) {
        const msg = err?.message;

        if (msg === "EMAIL_ALREADY_EXISTS") {
          return reply.code(200).send({ ok: false, error: "Email already used" });
        }
        if (msg === "USERNAME_ALREADY_EXISTS") {
          return reply.code(200).send({ ok: false, error: "Username already used" });
        }

        if (err?.code === "P2002") {
          return reply
            .code(200)
            .send({ ok: false, error: "Email or username already used" });
        }

        return reply.code(200).send({ ok: false, error: "Server error" });
      }
    }
  );
}
