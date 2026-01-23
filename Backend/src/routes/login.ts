import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import { AuthService } from "../services/auth.service.js"

interface LoginBody {
  email: string;
  password: string;
}

export async function registerLoginRoutes(server: FastifyInstance) {
  server.post(
    "/api/auth/login",
    async (
      req: FastifyRequest<{ Body: LoginBody }>,
      reply: FastifyReply
    ) => {
      const { email, password } = req.body;

      if (!email || !password) {
        return reply.code(400).send({ error: "Missing email or password" });
      }

      try {
        const user = await AuthService.login(email, password);

        const token = server.jwt.sign(
          { userId: user.id, email: user.email },
          { expiresIn: "1h"}
        );

        reply.send({
          user,
          token
      });
      } catch (err: any) {
        if (err.message === "INVALID_CREDENTIALS") {
          return reply.code(401).send({ error: "Invalid credentials" });
        }
        console.error("LOGIN ERROR:", err);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );
}