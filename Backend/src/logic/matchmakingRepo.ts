import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// ─────────────────────────────────────────────
// DB bootstrap (IDENTICAL PATTERN to TournamentRepo)
// ─────────────────────────────────────────────

const dbPath = path.join(process.cwd(), "database", "transcendence.db");

const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
	fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);


// ─────────────────────────────────────────────
// Finish match + stats update
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

	const loserId = winnerId === p1Id ? p2Id : p1Id;

	const insert = db.transaction(() => {
		// 1. Create match (already finished)
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