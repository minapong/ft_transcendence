import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import { AuthService } from "../services/auth.service.js"

interface SignupBody {
  email: string
  username: string
  password: string
}

export async function registerAuthRoutes(server: FastifyInstance) {
  server.post(
    "/api/auth/signup",
    async (
      req: FastifyRequest<{ Body: SignupBody }>,
      reply: FastifyReply
    ) => {
      const { email, username, password } = req.body

      if (!email || !username || !password) {
        return reply.code(400).send({ error: "Missing fields" })
      }

      // try {
      //   const user = await AuthService.signup(email, username, password)
      //   reply.code(201).send(user)
      // } catch (err: any) {
      //   if (err.message === "EMAIL_ALREADY_EXISTS") {
      //     return reply.code(409).send({ error: "Email already used" })
      //   }
        reply.code(500).send({ error: "Internal error" })
      // }
    }
  )
}
