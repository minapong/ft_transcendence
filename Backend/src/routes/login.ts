import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import { AuthService } from "../services/auth.service.js"

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

      const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
      const password = typeof body.password === "string" ? body.password : "";

      if (!email || !password) {
        return reply.code(200).send({ ok: false, error: "Missing email or password" });
      }

      try {
        const user = await AuthService.login(email, password);

        const token = server.jwt.sign(
          { userId: user.id, email: user.email, isAdmin: user.isAdmin },
          { expiresIn: "1h"}
        );

        return reply.code(200).send({ ok: true, user, token });
      } catch (err: any) {
        const msg = String(err?.message ?? "");
        // Map known login errors from AuthService
        if (msg === "INVALID_CREDENTIALS") {
          return reply.code(200).send({ ok: false, error: "Invalid credentials" });
        }
        if (msg === "USER_NOT_FOUND") {
          return reply.code(200).send({ ok: false, error: "Invalid credentials" });
        }
        // console.error("LOGIN ERROR:", err);
        return reply.code(200).send({ ok: false, error: "Internal server error" });
      }
    }
  );
}