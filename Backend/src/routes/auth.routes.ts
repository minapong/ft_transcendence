// src/routes/auth.routes.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "../services/auth.service.js";

interface SignupBody {
  email: string;
  username: string;
  password: string;
}

export async function registerAuthRoutes(server: FastifyInstance) {
  server.post(
    "/api/auth/signup",
    async (req: FastifyRequest<{ Body: SignupBody }>, reply: FastifyReply) => {
      const { email, username, password } = req.body;

      if (!email || !username || !password) {
        return reply.code(400).send({ error: "Missing fields" });
      }

      try {
        const user = await AuthService.signup(email, username, password);

        const token = server.jwt.sign(
          { userId: user.id, email: user.email, isAdmin: user.isAdmin },
          {expiresIn: "1h" }
        )

        return reply.code(201).send({user, token});
        
      } catch (err: any) {
        if (err.message === "EMAIL_ALREADY_EXISTS") {
          return reply.code(409).send({ error: "Email already used" });
        }
        if (err.message === "USERNAME_ALREADY_EXISTS") {
          return reply.code(409).send({ error: "Username already used" });
        }
        if (err?.code === "P2002") {
          // err.meta.target usually contains ["username"] or ["email"]
          return reply.code(409).send({ error: "Email or username already used" });
        }
        console.error("SIGNUP ERROR:", err);
        return reply.code(500).send({ error: "Internal server error" });
      }
    }
  );
}   

