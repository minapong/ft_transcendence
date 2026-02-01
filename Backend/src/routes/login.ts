import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import { AuthService } from "../services/auth.service.js"

import { unwrap } from "../lib/input/unwrap.js";
import { vEmail, vPasswordLogin } from "../lib/input/validators.js";

type LoginBody = {
  email?: unknown;
  password?: unknown;
};

export async function registerLoginRoutes(server: FastifyInstance) {
  server.post(
    "/api/auth/login",
    async (
      req: FastifyRequest<{ Body: LoginBody }>,
      reply: FastifyReply
    ) => {
      const body = (req.body ?? {}) as LoginBody;

     let email: string;
      let password: string;

      try {
        // Email normalized like signup (trim/lowercase/length + basic format)
        email = unwrap(vEmail(body.email));

        // Password : only length sanity check
        password = unwrap(vPasswordLogin(body.password));
      } catch {
        // keep malformed input distinct from "wrong credentials"
        return reply.code(200).send({ ok: false, error: "Missing email or password" });
      }

      try {
        const user = await AuthService.login(email, password);

        const token = server.jwt.sign(
          { userId: user.id, email: user.email, isAdmin: user.isAdmin },
          { expiresIn: "1h" }
        );

        return reply.code(200).send({ ok: true, user, token });
      } catch (err: any) {
        const msg = String(err?.message ?? "");

        // Always generic to avoid account enumeration
        if (msg === "INVALID_CREDENTIALS" || msg === "USER_NOT_FOUND") {
          return reply.code(200).send({ ok: false, error: "Invalid credentials" });
        }

        return reply.code(200).send({ ok: false, error: "Internal server error" });
      }
    }
  );
}