const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(process.cwd(), "database", "transcendence.db");
const db = new Database(dbPath);

const gameName = "connect4";

// Show all queued players
const queue = db.prepare(`
  SELECT *
  FROM matchmaking_queue
  ORDER BY joined_at ASC
`).all();

console.log("Current matchmaking queue:", queue);

// Show active matches
const activeMatches = db.prepare(`
  SELECT *
  FROM active_matches
  WHERE status IN ('matched', 'started')
`).all();

console.log("Current active matches:", activeMatches);
