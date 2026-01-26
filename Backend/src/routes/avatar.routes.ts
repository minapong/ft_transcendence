import { FastifyInstance } from "fastify";
import multipart from "@fastify/multipart";
import fs from "fs";
import path from "path";
import { prisma } from "../db/prisma.js";
import { requireAuth } from "../plugins/auth.guard.js";

export async function registerAvatarRoutes(server: FastifyInstance) {
  server.register(multipart, {
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  });

  server.post("/api/me/avatar", { preHandler: requireAuth }, async (req: any, reply) => {
    const userId = Number(req.user.userId);

    const file = await req.file(); // field name "file"
    if (!file) return reply.code(400).send({ error: "Missing file" });

    // basic type validation
    const allowed = new Set(["image/png", "image/jpeg", "image/webp"]);
    if (!allowed.has(file.mimetype)) {
      return reply.code(415).send({ error: "Unsupported image type" });
    }

    const ext =
      file.mimetype === "image/png" ? "png" :
      file.mimetype === "image/webp" ? "webp" : "jpg";

    const dir = path.join(process.cwd(), "assets", "uploads", "avatars");
    fs.mkdirSync(dir, { recursive: true });

    const filename = `u${userId}_${Date.now()}.${ext}`;
    const fullpath = path.join(dir, filename);

    await new Promise<void>((resolve, reject) => {
      const ws = fs.createWriteStream(fullpath);
      file.file.pipe(ws);
      file.file.on("error", reject);
      ws.on("finish", () => resolve());
      ws.on("error", reject);
    });

    // create avatar row owned by user
    const avatar = await prisma.avatar.create({
      data: {
        user_id: userId,
        file_path: `uploads/avatars/${filename}`,
        is_default: false,
      },
      select: { id: true, file_path: true },
    });

    // set as selected
    await prisma.user.update({
      where: { id: userId },
      data: { avatarId: avatar.id },
    });

    return reply.send({
      avatarId: avatar.id,
      url: `/static/${avatar.file_path}`,
    });
  });
}
