import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const url = process.env.DATABASE_URL ?? "file:/app/database/transcendence.db";
console.log("[SCRIPT] DATABASE_URL =", url);

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url }),
});

const defaults = [
  "default_avatars/a1.jpg",
  "default_avatars/a2.jpg",
  "default_avatars/a3.jpg",
  "default_avatars/a4.jpg",
  "default_avatars/a5.jpg",
];

async function main() {
  for (const p of defaults) {
    const existing = await prisma.avatar.findFirst({ where: { file_path: p } });
    if (!existing) {
      await prisma.avatar.create({
        data: {
          user_id: null,
          file_path: p,
          is_default: true,
        },
      });
    } else if (!existing.is_default || existing.user_id !== null) {
      await prisma.avatar.update({
        where: { id: existing.id },
        data: { is_default: true, user_id: null },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
