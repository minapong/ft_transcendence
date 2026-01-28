import { FastifyInstance } from "fastify";
import { requireAuth } from "../plugins/auth.guard.js";
import { AvatarService } from "../services/avatar.service.js";

const MAX_BYTES = 2 * 1024 * 1024;

export async function registerAvatarRoutes(server: FastifyInstance) {
    server.post("/api/me/avatar",
      { preHandler: requireAuth },
      async (req: any, reply) => {
      const userId = Number((req.user as any).userId);
      server.log.info({ type: req.headers["content-type"] }, "avatar upload content-type");
      const file = await req.file({
        limit: {
          fileSize: MAX_BYTES,
          files: 1,
          parts: 5,
        },
      });
      server.log.info({ gotFile: !!file }, "avatar upload got file");

      if (file) {
        server.log.info(
          { fieldname: file.fieldname, filename: file.filename, mimetype: file.mimetype },
          "avatar upload file meta"
        );
      } 
      server.log.info({ fieldname: file.fieldname }, "[AVATAR] BEFORE FIELDNAME CHECK");

      if (!file) return reply.code(400).send({ error: "Missing file (fiels name avatar)" });
      if (file.fieldname !== "avatar") {
        file.file.resume();
        return reply.code(400).send({error: `Invalid field name "${file.fieldname}" (expected: "avatar")`,});
          // server.log.warn({ fieldname: file.fieldname }, "Unexpected field name; accepting anyway");
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
      const bytes = Buffer.concat(chunks);
      server.log.info({ size: bytes.length }, "avatar upload buffer size");


      try {
        const out = await AvatarService.uploadMyAvatar({
          userId,
          mimetype: file.mimetype,
          bytes: Buffer.concat(chunks),
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
