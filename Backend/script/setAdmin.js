import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const url = process.env.DATABASE_URL ?? "file:/app/database/transcendence.db";
console.log("[SCRIPT] DATABASE_URL =", url);

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url }),
});

async function main() {
  const user = await prisma.user.update({
    where: { id: 1 },
    data: { isAdmin: true },
  });

  console.log("User promoted to admin:", {
    id: user.id,
    username: user.username,
    isAdmin: user.isAdmin,
  });
}

main()
  .catch((err) => {
    console.error("Failed to promote user:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
