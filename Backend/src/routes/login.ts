import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import { AuthService } from "../services/auth.service"

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
        const result = await AuthService.login(email, password);
        reply.send(result);
      } catch (err: any) {
        // if (err.message === "INVALID_CREDENTIALS") {
        //   return reply.code(401).send({ error: "Invalid credentials" });
        // }
        // reply.code(500).send({ error: "Internal server error" });
        console.error("LOGIN ERROR:", err);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );
}