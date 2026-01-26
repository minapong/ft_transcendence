import { FastifyInstance } from "fastify";
import { prisma } from "../db/prisma.js";
import { requireAuth } from "../plugins/auth.guard.js";

export async function registerMeRoutes(server: FastifyInstance) {
    server.get(
        "/api/me",
        {preHandler: requireAuth},
        async (req: any, reply) => {
            const userId = Number((req.user as any).userId);
            const base = process.env.PUBLIC_BASE_URL ?? "";
            const me = await prisma.user.findUnique({
                where: { id: userId },
                select: { 
                    id: true,
                    email: true,
                    username: true,
                    created_at: true,
                    avatarId: true,
                    avatar: { select: { file_path: true } },
                    },
                });
            
            if (!me)
                return reply.code(404).send({error: "User not found"});
            return reply.send({me,
                avatarUrl: me.avatar?.file_path ? `${process.env.PUBLIC_BASE_URL ?? ""}/static/${me.avatar.file_path}` : null,
            });
        }
    );
}