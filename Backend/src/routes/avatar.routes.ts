import { FastifyInstance } from "fastify";
import { requireAuth } from "../plugins/auth.guard.js";
import { AvatarService } from "../services/avatar.service.js";

const MAX_BYTES = 2 * 1024 * 1024;


export async function registerAvatarRoutes(server: FastifyInstance) {
  server.post(
    "/api/me/avatar",
    { preHandler: requireAuth },
    async (req: any, reply) => {
      const userId = Number((req.user as any).userId);

      let file: any;
      try {
        file = await req.file({
          limit: { fileSize: MAX_BYTES, files: 1, parts: 5 },
        });
      } catch (e: any) {
        // multipart parser errors / limits / invalid content-type etc.
        return reply.code(200).send({ ok: false, error: "Invalid upload" });
      }

      if (!file) return reply.code(200).send({ ok: false, error: "Missing file (field name avatar)" });

      if (file.fieldname !== "avatar") {
        file.file.resume();
        return reply.code(200).send({
          ok: false,
          error: `Invalid field name "${file.fieldname}" (expected: "avatar")`,
        });
      }

      const chunks: Buffer[] = [];
      let total = 0;

      try {
        for await (const chunk of file.file) {
          total += chunk.length;
          if (total > MAX_BYTES) {
            return reply.code(200).send({ ok: false, error: "File too large" });
          }
          chunks.push(chunk);
        }
      } catch {
        return reply.code(200).send({ ok: false, error: "Invalid upload stream" });
      }

      try {
        const out = await AvatarService.uploadMyAvatar({
          userId,
          mimetype: file.mimetype,
          bytes: Buffer.concat(chunks),
          maxBytes: MAX_BYTES,
        });

        return reply.code(200).send({
          ok: true,
          avatarId: out.avatarId,
          avatarUrl: out.avatarUrl,
        });
      } catch (e: any) {
        const msg = String(e?.message ?? "");

        if (msg === "UNAUTHORIZED") return reply.code(200).send({ ok: false, error: "Unauthorized" });
        if (msg === "EMPTY_FILE") return reply.code(200).send({ ok: false, error: "Empty file" });
        if (msg === "FILE_TOO_LARGE") return reply.code(200).send({ ok: false, error: "File too large" });
        if (msg === "UNSUPPORTED_TYPE") return reply.code(200).send({ ok: false, error: "Unsupported file type" });

        return reply.code(200).send({ ok: false, error: "Server error" });
      }
    }
  );
}

