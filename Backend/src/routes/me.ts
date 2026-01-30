import { FastifyInstance } from "fastify";
import { prisma } from "../db/prisma.js";
import { requireAuth } from "../plugins/auth.guard.js";

export async function registerMeRoutes(server: FastifyInstance) {
   server.get("/api/me", { preHandler: requireAuth }, async (req: any, reply) => {
    const userId = Number(req.user?.userId);
    if (!Number.isFinite(userId)) {
        return reply.code(200).send({ ok: false, error: "Unauthorized" });
    }

    try {
        const me = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            username: true,
            created_at: true,
            avatarId: true,
            avatar: { select: { file_path: true } },
            age: true,
            location: true,
        },
        });

        if (!me) return reply.code(200).send({ ok: false, error: "User not found" });

        return reply.code(200).send({
        ok: true,
        ...me,
        avatarUrl: me.avatar?.file_path ? `/static/${me.avatar.file_path}` : null,
        });
    } catch {
        return reply.code(200).send({ ok: false, error: "Server error" });
    }
    });
}