import { FastifyRequest, FastifyReply } from "fastify";

export async function requireAuth(req: FastifyRequest, reply: FastifyReply): Promise<void>  {
  try {
    await req.jwtVerify();
  } catch {
    return reply.code(401).send({ error: "Unauthorized" });
  }
}

export const requireAdmin = async (req: FastifyRequest, reply: FastifyReply) => {
  const user = req.user as { isAdmin?: boolean } | undefined;

  if (!user?.isAdmin) {
    reply.code(403).send({ error: "Admin access required" });
    return;
  }
};

