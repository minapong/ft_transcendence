import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../db/prisma.js";

export async function registerProfileRoutes(server: FastifyInstance) {
  console.log("🔥 PROFILE ROUTES LOADED");

  server.get(
    "/users/:id",
    async (
      req: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      const userId = Number(req.params.id);
      if (Number.isNaN(userId)) {
        return reply.code(400).send({ error: "Invalid user id" });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          username: true,
          created_at: true,
        },
      });
       console.log(`searching for user id ${userId}`);
      if (!user) {
        return reply.code(404).send({ error: "User not found" });
      }

      return user;
    }
  );
}
