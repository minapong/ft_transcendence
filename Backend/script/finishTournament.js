// Backend/script/finishTournament.js
import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const url = process.env.DATABASE_URL ?? "file:/app/database/transcendence.db";
console.log("[SCRIPT] DATABASE_URL =", url);

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url }),
});

// Change this to the tournament you want to finish
const TOURNAMENT_ID = 4;

async function main() {
  console.log("[SCRIPT] DATABASE_URL =", process.env.DATABASE_URL);

  const tournament = await prisma.tournament.findUnique({
    where: { id: TOURNAMENT_ID },
    select: { id: true, state: true, winner_id: true },
  });

  if (!tournament) {
    console.error(`[SCRIPT] Tournament with ID ${TOURNAMENT_ID} not found`);
    process.exit(1);
  }

  // Pick a winner: first registered player with a real user_id
  const winner = await prisma.tournamentPlayer.findFirst({
    where: { tournament_id: TOURNAMENT_ID, user_id: { not: null } },
    orderBy: { id: "asc" },
    select: { user_id: true },
  });

  const winnerId = winner?.user_id ?? null;

  await prisma.$transaction(async (tx) => {
    // Mark tournament finished + set winner
    await tx.tournament.update({
      where: { id: TOURNAMENT_ID },
      data: {
        state: "finished",
        winner_id: winnerId,
        finished_at: new Date(),
      },
    });

    // Mark all tournament matches as finished (set winner_id + finished_at)
    // 1) get match ids for tournament
    const tms = await tx.tournamentMatch.findMany({
      where: { tournament_id: TOURNAMENT_ID },
      select: { match_id: true },
    });

    const matchIds = tms.map((x) => x.match_id);

    if (matchIds.length) {
      await tx.match.updateMany({
        where: { id: { in: matchIds } },
        data: {
          winner_id: winnerId,
          finished_at: new Date(),
        },
      });

      // optional: also set MatchPlayer.is_winner flags when winner is known
      if (winnerId != null) {
        await tx.matchPlayer.updateMany({
          where: { match_id: { in: matchIds } },
          data: { is_winner: false },
        });

        await tx.matchPlayer.updateMany({
          where: { match_id: { in: matchIds }, user_id: winnerId },
          data: { is_winner: true },
        });
      }
    }
  });

  console.log(`[SCRIPT] Tournament ${TOURNAMENT_ID} marked as finished.`);
  if (winnerId != null) console.log(`[SCRIPT] Winner set to user ID ${winnerId}`);
  else console.log("[SCRIPT] No winner user_id found (tournament had only guests?)");
}

main()
  .catch((err) => {
    console.error("[SCRIPT] Error:", err?.message ?? err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


// // Backend/script/finishTournament.js
// const Database = require("better-sqlite3");
// const path = require("path");

// // Change this to the tournament you want to finish
// const TOURNAMENT_ID = 2;

// const dbPath = path.join(process.cwd(), "database", "transcendence.db");
// console.log("[SCRIPT] Using database:", dbPath);

// const db = new Database(dbPath);

// try {
//   db.pragma("foreign_keys = ON");

//   const tournament = db
//     .prepare("SELECT * FROM tournaments WHERE id = ?")
//     .get(TOURNAMENT_ID);

//   if (!tournament) {
//     console.error(`[SCRIPT] Tournament with ID ${TOURNAMENT_ID} not found`);
//     process.exit(1);
//   }

//   // Optional: Pick a winner (e.g., first registered player)
//   const winner = db
//     .prepare("SELECT user_id FROM tournament_players WHERE tournament_id = ? LIMIT 1")
//     .get(TOURNAMENT_ID);

//   db.transaction(() => {
//     db.prepare(
//       "UPDATE tournaments SET state = 'finished', winner_id = ? WHERE id = ?"
//     ).run(winner?.user_id || null, TOURNAMENT_ID);

//     // Optionally, mark all pending matches as finished with the winner
//     db.prepare(
//       "UPDATE matches SET winner_id = ? WHERE id IN (SELECT match_id FROM tournament_matches WHERE tournament_id = ?)"
//     ).run(winner?.user_id || null, TOURNAMENT_ID);
//   })();

//   console.log(`[SCRIPT] Tournament ${TOURNAMENT_ID} marked as finished.`);
//   if (winner) console.log(`[SCRIPT] Winner set to user ID ${winner.user_id}`);
// } catch (err) {
//   console.error("[SCRIPT] Error:", err.message);
//   process.exit(1);
// } finally {
//   db.close();
// }