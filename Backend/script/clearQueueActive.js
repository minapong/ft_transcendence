// Backend/script/clearQueueActive.js
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
  console.log("[SCRIPT] DATABASE_URL =", process.env.DATABASE_URL);

  await prisma.$transaction(async (tx) => {
    console.log("[SCRIPT] Clearing matchmaking queue...");
    await tx.matchmakingQueue.deleteMany({});

    console.log("[SCRIPT] Clearing active matches...");
    await tx.activeMatches.deleteMany({});
  });

  const queueCount = await prisma.matchmakingQueue.count();
  const activeCount = await prisma.activeMatches.count();

  console.log(`[SCRIPT] Queue entries remaining: ${queueCount}`);
  console.log(`[SCRIPT] Active matches remaining: ${activeCount}`);
  console.log("[SCRIPT] Matchmaking state cleared successfully.");
  console.log("[SCRIPT] Note: auto-increment counters are NOT reset (recommended).");
}

main()
  .catch((err) => {
    console.error("[SCRIPT] Error:", err?.message ?? err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// // Backend/script/clearQueueActive.js
// const Database = require("better-sqlite3");
// const path = require("path");

// const dbPath = path.join(process.cwd(), "database", "transcendence.db");
// console.log("[SCRIPT] Using database:", dbPath);

// const db = new Database(dbPath);

// try {
//   db.pragma("foreign_keys = ON");

//   db.transaction(() => {
//     console.log("[SCRIPT] Clearing matchmaking queue...");
//     db.prepare("DELETE FROM matchmaking_queue").run();

//     console.log("[SCRIPT] Clearing active matches...");
//     db.prepare("DELETE FROM  active_matches").run();

//     console.log("[SCRIPT] Resetting auto-increment counters...");
//     db.prepare("DELETE FROM sqlite_sequence WHERE name='matchmaking_queue'").run();
//     db.prepare("DELETE FROM sqlite_sequence WHERE name=' active_matches'").run();
//   })();

//   const queueCount = db.prepare("SELECT COUNT(*) as count FROM matchmaking_queue").get().count;
//   const activeCount = db.prepare("SELECT COUNT(*) as count FROM  active_matches").get().count;

//   console.log(`[SCRIPT] Queue entries remaining: ${queueCount}`);
//   console.log(`[SCRIPT] Active matches remaining: ${activeCount}`);

//   console.log("[SCRIPT] Matchmaking state cleared successfully.");
// } catch (err) {
//   console.error("[SCRIPT] Error:", err.message);
//   process.exit(1);
// } finally {
//   db.close();
// }
