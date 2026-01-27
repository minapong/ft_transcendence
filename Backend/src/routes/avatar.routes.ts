import { FastifyInstance } from "fastify";
import { requireAuth } from "../plugins/auth.guard.js";
import { AvatarService } from "../services/avatar.service.js";

const MAX_BYTES = 2 * 1024 * 1024;

export async function registerAvatarRoutes(server: FastifyInstance) {
    server.post("/api/me/avatar",
      { preHandler: requireAuth },
      async (req: any, reply) => {
      const userId = Number((req.user as any).userId);

      const file = await req.file({
        limit: {fileSize: MAX_BYTES},
      });

      if (!file) return reply.code(400).send({ error: "Missing file (fiels name avatar)" });
      if (file.filename !== "avatar") {
        file.file.resume();
        return reply.code(400).send({error: "Invalid field name (expected: avatar"});
      }
      
      const chunks: Buffer[] = [];
      let total = 0;

      for await (const chunk of file.file) {
        total += chunk.length;
        if (total > MAX_BYTES) {
          return reply.code(413).send({ error: "File too large" });
        }
        chunks.push(chunk);
      }
      
      try {
        const out = await AvatarService.uploadMyAvatar({
          userId,
          mimetype: file.mimetype,
          bytes: Buffer.concat(chunks);
          maxBytes: MAX_BYTES,
        });

        return reply.send({
          avatarId: out.avatarId,
          avatarUrl: out.avatarUrl,
        });
      } catch (e: any) {
        const msg = String(e?.message ?? "");

        if (msg === "UNAUTHORIZED") return reply.code(401).send({ error: "Unauthorized" });
          if (msg === "EMPTY_FILE") return reply.code(400).send({ error: "Empty file" });
          if (msg === "FILE_TOO_LARGE") return reply.code(413).send({ error: "File too large" });
          if (msg === "UNSUPPORTED_TYPE") return reply.code(415).send({ error: "Unsupported file type" });

          server.log.error(e);
          return reply.code(500).send({ error: "Internal server error" });
      }
    }
  );
}
