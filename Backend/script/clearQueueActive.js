// Backend/script/clearQueueActive.js
const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(process.cwd(), "database", "transcendence.db");
console.log("[SCRIPT] Using database:", dbPath);

const db = new Database(dbPath);

try {
  db.pragma("foreign_keys = ON");

  db.transaction(() => {
    console.log("[SCRIPT] Clearing matchmaking queue...");
    db.prepare("DELETE FROM matchmaking_queue").run();

    console.log("[SCRIPT] Clearing active matches...");
    db.prepare("DELETE FROM active_matches").run();

    console.log("[SCRIPT] Resetting auto-increment counters...");
    db.prepare("DELETE FROM sqlite_sequence WHERE name='matchmaking_queue'").run();
    db.prepare("DELETE FROM sqlite_sequence WHERE name='active_matches'").run();
  })();

  const queueCount = db.prepare("SELECT COUNT(*) as count FROM matchmaking_queue").get().count;
  const activeCount = db.prepare("SELECT COUNT(*) as count FROM active_matches").get().count;

  console.log(`[SCRIPT] Queue entries remaining: ${queueCount}`);
  console.log(`[SCRIPT] Active matches remaining: ${activeCount}`);

  console.log("[SCRIPT] Matchmaking state cleared successfully.");
} catch (err) {
  console.error("[SCRIPT] Error:", err.message);
  process.exit(1);
} finally {
  db.close();
}
