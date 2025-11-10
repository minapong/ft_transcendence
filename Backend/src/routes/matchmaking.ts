import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import { joinQueue, getActiveMatches, getQueue, Player } from "../logic/matchmakingManager"

interface JoinQueueBody {
  id: string
  name: string
}

export async function registerMatchmakingRoutes(server: FastifyInstance) {
  // Join matchmaking queue
  server.post(
    "/api/matchmaking/join",
    async (
      req: FastifyRequest<{ Body: JoinQueueBody }>,
      reply: FastifyReply
    ) => {
      const { id, name } = req.body

      if (!id || !name) {
        return reply.code(400).send({ error: "Missing player info" })
      }

      const result = joinQueue({ id, name } as Player)
      reply.send(result)
    }
  )

  // Get active matches
  server.get(
    "/api/matchmaking/active",
    async (_req: FastifyRequest, reply: FastifyReply) => {
      reply.send(getActiveMatches())
    }
  )

  // Get queue
  server.get(
    "/api/matchmaking/queue",
    async (_req: FastifyRequest, reply: FastifyReply) => {
      reply.send(getQueue())
    }
  )
}
