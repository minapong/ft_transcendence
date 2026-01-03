import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// ─────────────────────────────────────────────
// DB bootstrap 
// ─────────────────────────────────────────────

const dbPath = path.join(process.cwd(), "database", "transcendence.db");

const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

const QUEUE_TIMEOUT_SECONDS = 240;

export type MatchStatus = "matched" | "started" | "finished" | "abandoned";

export interface Player {
  id: number;
  name: string;
}

export interface ActiveMatchDTO {
  id: string;
  game: "connect4";
  p1: { id: number; name: string };
  p2: { id: number; name: string };
  status: MatchStatus;
  createdAt: number;           // epoch ms
  startedAt?: number;           // epoch ms
  timeout?: NodeJS.Timeout;     // in-memory only
}

// ─────────────────────────────────────────────
// Queue persistence
// ─────────────────────────────────────────────

export function cleanupQueue(game: string): void {
  db.prepare(`
    DELETE FROM matchmaking_queue
    WHERE game_name = ?
      AND joined_at < datetime('now', ?)
  `).run(game, `-${QUEUE_TIMEOUT_SECONDS} seconds`);
}

export function enqueuePlayer(userId: number, game: string): void {
  // cleanupQueue(game);

  db.prepare(`
    INSERT OR REPLACE INTO matchmaking_queue (user_id, game_name, joined_at)
    VALUES (?, ?, datetime('now'))
  `).run(userId, game);
}

export function dequeueTwoPlayers(game: string): [number, number] | null {
  cleanupQueue(game);

  const rows = db.prepare(`
    SELECT user_id
    FROM matchmaking_queue
    WHERE game_name = ?
    ORDER BY joined_at ASC
    LIMIT 2
  `).all(game) as { user_id: number }[];

  if (rows.length < 2) return null;

  const [p1, p2] = rows.map(r => r.user_id);

  db.prepare(`
    DELETE FROM matchmaking_queue
    WHERE game_name = ?
      AND user_id IN (?, ?)
  `).run(game, p1, p2);

  return [p1, p2];
}

export function isUserQueued(userId: number, game: string): boolean {
  const row = db.prepare(`
    SELECT 1
    FROM matchmaking_queue
    WHERE user_id = ? AND game_name = ?
  `).get(userId, game);

  return !!row;
}

export function removeFromQueue(userId: number, game: string): void {
  db.prepare(`
    DELETE FROM matchmaking_queue
    WHERE user_id = ? AND game_name = ?
  `).run(userId, game);
}

// ─────────────────────────────────────────────
// Match persistence (Connect4)
// ─────────────────────────────────────────────

export function recordConnect4Game(
  p1Id: number,
  p2Id: number,
  winnerId: number
): number {
  if (!p1Id || !p2Id || !winnerId) {
    throw new Error("Invalid input");
  }
  if (winnerId !== p1Id && winnerId !== p2Id) {
    throw new Error("Winner must be one of the players");
  }

  const insert = db.transaction(() => {
    // 1. Create finished match
    const matchStmt = db.prepare(`
      INSERT INTO matches (game_name, winner_id, finished_at)
      VALUES ('connect4', ?, datetime('now'))
    `);
    const matchInfo = matchStmt.run(winnerId);
    const matchId = matchInfo.lastInsertRowid as number;

    // 2. Insert players
    const mpStmt = db.prepare(`
      INSERT INTO match_players (match_id, user_id, is_winner)
      VALUES (?, ?, ?)
    `);

    mpStmt.run(matchId, p1Id, p1Id === winnerId ? 1 : 0);
    mpStmt.run(matchId, p2Id, p2Id === winnerId ? 1 : 0);

    return matchId;
  });

  return insert();
}

// Insert an active match into DB
export function insertActiveMatch(match: ActiveMatchDTO) {
  const stmt = db.prepare(`
    INSERT INTO active_matches
      (match_id, game_name, p1_id, p2_id, status, created_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `);
  stmt.run(match.id, match.game, match.p1.id, match.p2.id, match.status);
}

// Update match status
export function updateActiveMatchStatus(matchId: string, status: MatchStatus) {
  const stmt = db.prepare(`
    UPDATE active_matches
    SET status = ?,
        started_at = CASE WHEN ? = 'started' THEN datetime('now') ELSE started_at END
    WHERE match_id = ?
  `);
  stmt.run(status, status, matchId);
}

// Delete finished/abandoned match
export function deleteActiveMatch(matchId: string) {
  db.prepare(`
    DELETE FROM active_matches
    WHERE match_id = ?
  `).run(matchId);
}

// check if a user exists
export function isUserValid(userId: number): boolean {
  const row = db.prepare(`
    SELECT 1 FROM users WHERE id = ?
  `).get(userId);

  return !!row;
}

// Fetch active match for a user
export function getActiveMatchDTO(userId: number): ActiveMatchDTO | null {
  const stmt = db.prepare(`
    SELECT 
      am.match_id,
      am.game_name,
      am.status,
      am.created_at,
      am.started_at,

      u1.id AS p1_id,
      u1.username AS p1_name,

      u2.id AS p2_id,
      u2.username AS p2_name

    FROM active_matches am

    LEFT JOIN users u1 ON u1.id = am.p1_id
    LEFT JOIN users u2 ON u2.id = am.p2_id

    WHERE (am.p1_id = ? OR am.p2_id = ?)
      AND am.status IN ('matched','started')
    LIMIT 1
  `);

  const row = stmt.get(userId, userId) as {
    match_id: string;
    game_name: "connect4";
    status: MatchStatus;
    created_at: string;
    started_at?: string;
    p1_id: number;
    p1_name: string;
    p2_id: number;
    p2_name: string;
  };

  if (!row) return null;

  return {
    id: row.match_id,
    game: row.game_name,
    p1: { id: row.p1_id, name: row.p1_name },
    p2: { id: row.p2_id, name: row.p2_name },
    status: row.status,
    createdAt: new Date(row.created_at).getTime(),
    startedAt: row.started_at ? new Date(row.started_at).getTime() : undefined
  };
}

export function getActiveMatchById(matchId: string): ActiveMatchDTO | null {
  const stmt = db.prepare(`
    SELECT *
    FROM active_matches
    WHERE match_id = ?
  `);

  const row = stmt.get(matchId) as {
    match_id: string;
    game_name: "connect4";
    status: MatchStatus;
    created_at: string;
    started_at?: string;
    p1_id: number;
    p1_name: string;
    p2_id: number;
    p2_name: string;
  };

  if (!row) return null;

  return {
    id: row.match_id,
    game: row.game_name,
    p1: { id: row.p1_id, name: "Player" },
    p2: { id: row.p2_id, name: "Player" },
    createdAt: new Date(row.created_at).getTime(),
    startedAt: row.started_at ? new Date(row.started_at).getTime() : undefined,
    status: row.status as MatchStatus,
  };
}
