// Backend/script/finishTournament.js
const Database = require("better-sqlite3");
const path = require("path");

// Change this to the tournament you want to finish
const TOURNAMENT_ID = 10;

const dbPath = path.join(process.cwd(), "database", "transcendence.db");
console.log("[SCRIPT] Using database:", dbPath);

const db = new Database(dbPath);

try {
  db.pragma("foreign_keys = ON");

  const tournament = db
    .prepare("SELECT * FROM tournaments WHERE id = ?")
    .get(TOURNAMENT_ID);

  if (!tournament) {
    console.error(`[SCRIPT] Tournament with ID ${TOURNAMENT_ID} not found`);
    process.exit(1);
  }

  // Optional: Pick a winner (e.g., first registered player)
  const winner = db
    .prepare("SELECT user_id FROM tournament_players WHERE tournament_id = ? LIMIT 1")
    .get(TOURNAMENT_ID);

  db.transaction(() => {
    db.prepare(
      "UPDATE tournaments SET state = 'finished', winner_id = ? WHERE id = ?"
    ).run(winner?.user_id || null, TOURNAMENT_ID);

    // Optionally, mark all pending matches as finished with the winner
    db.prepare(
      "UPDATE matches SET winner_id = ? WHERE id IN (SELECT match_id FROM tournament_matches WHERE tournament_id = ?)"
    ).run(winner?.user_id || null, TOURNAMENT_ID);
  })();

  console.log(`[SCRIPT] Tournament ${TOURNAMENT_ID} marked as finished.`);
  if (winner) console.log(`[SCRIPT] Winner set to user ID ${winner.user_id}`);
} catch (err) {
  console.error("[SCRIPT] Error:", err.message);
  process.exit(1);
} finally {
  db.close();
}