import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../db/prisma.js";

export async function registerProfileRoutes(server: FastifyInstance) {
  // console.log("🔥 PROFILE ROUTES LOADED");

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
      // console.log(`searching for user id ${userId}`);

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          created_at: true,
          avatarId: true,
          avatar: { select: { file_path: true } },
        },
      });
      if (!user) {
        return reply.code(404).send({ error: "User not found" });
      }

      return reply.send({
        ...user,
        avatarUrl: user.avatar?.file_path ? `${process.env.PUBLIC_BASE_URL ?? ""}/static/${user.avatar.file_path}` : null,
      });
    }
  );
}
