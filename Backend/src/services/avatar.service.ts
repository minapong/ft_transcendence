import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { AvatarRepo } from "../repositories/avatar.repo.js";
import { prisma } from "../db/prisma.js";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export type UploadAvatarInput = {
  userId: number;
  mimetype: string;
  bytes: Buffer;
  maxBytes?: number;
};

function extFromMime(mime: string) {
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  return "";
}

export const AvatarService = {
  async uploadMyAvatar(input: UploadAvatarInput) {
    const maxBytes = input.maxBytes ?? 2 * 1024 * 1024; // 2MB default

    // --- validate
    if (!Number.isFinite(input.userId)) throw new Error("UNAUTHORIZED");
    if (!input.bytes || input.bytes.length === 0) throw new Error("EMPTY_FILE");
    if (input.bytes.length > maxBytes) throw new Error("FILE_TOO_LARGE");

    if (!ALLOWED_MIME.has(input.mimetype)) throw new Error("UNSUPPORTED_TYPE");
    const ext = extFromMime(input.mimetype);
    if (!ext) throw new Error("UNSUPPORTED_TYPE");

    // --- generate safe path
    const name = crypto.randomBytes(16).toString("hex") + ext;

    // store under assets/uploads/u<id>/...
    const relDir = path.posix.join("uploads", `u${input.userId}`);
    const relPath = path.posix.join(relDir, name); // stored in DB
    const absDir = path.join(process.cwd(), "assets", relDir);
    const absPath = path.join(process.cwd(), "assets", relPath);

    await fs.mkdir(absDir, { recursive: true });
    await fs.writeFile(absPath, input.bytes);

    // --- DB: create avatar + set as selected
    const avatar = await AvatarRepo.createForUser({
      userId: input.userId,
      filePath: relPath,
      isDefault: false,
    });

    await prisma.user.update({
      where: { id: input.userId },
      data: { avatarId: avatar.id },
      select: { id: true }, 
    });

    return {
      avatarId: avatar.id,
      avatarUrl: `/static/${avatar.file_path}`,
      filePath: avatar.file_path, // optional internal info
    };
  },
};
