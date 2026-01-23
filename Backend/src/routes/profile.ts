import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../db/prisma.js";

export async function registerProfileRoutes(server: FastifyInstance) {

  server.get(
    "/api/users/:id",
    async (
      req: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      const userId = Number(req.params.id);
      if (Number.isNaN(userId)) {
        return reply.code(400).send({ error: "Invalid user id" });
      }
      console.log(`searching for user id ${userId}`);

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          created_at: true,
          avatarId: true,
        },
      });
      if (!user) {
        return reply.code(404).send({ error: "User not found" });
      }

      return user;
    }
  );
}
