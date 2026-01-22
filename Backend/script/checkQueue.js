
// Backend/script/checkQueue.js
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
  const queue = await prisma.matchmakingQueue.findMany({
    orderBy: { joined_at: "asc" },
    include: { user: { select: { id: true, username: true } } },
  });

  const activeMatches = await prisma.activeMatches.findMany({
    where: { status: { in: ["matched", "started"] } },
    orderBy: { created_at: "asc" },
    include: {
      p1: { select: { id: true, username: true } },
      p2: { select: { id: true, username: true } },
    },
  });

  console.log("Current matchmaking queue:", queue);
  console.log("Current active matches:", activeMatches);
}

main()
  .catch((e) => {
    console.error("[SCRIPT] Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


// const Database = require("better-sqlite3");
// const path = require("path");

// const dbPath = path.join(process.cwd(), "database", "transcendence.db");
// const db = new Database(dbPath);

// const gameName = "connect4";

// // Show all queued players
// const queue = db.prepare(`
//   SELECT *
//   FROM matchmaking_queue
//   ORDER BY joined_at ASC
// `).all();

// console.log("Current matchmaking queue:", queue);

// // Show active matches
// const activeMatches = db.prepare(`
//   SELECT *
//   FROM active_matches
//   WHERE status IN ('matched', 'started')
// `).all();

// console.log("Current active matches:", activeMatches);
