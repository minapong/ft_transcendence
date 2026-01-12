import Database from "better-sqlite3";
import path from "path";
import { 
	PlayerDTO, 
	MatchDTO, 
	TournamentDTO, 
	TournamentRow, 
	MatchRow } from "../types/tournament.js";

	import fs from "fs";

	// Use absolute path from project root, not relative to __dirname
	// This ensures we use the same DB file as migrations
	const dbPath = path.join(process.cwd(), "database", "transcendence.db");
	
	// Ensure the database directory exists
	const dbDir = path.dirname(dbPath);
	if (!fs.existsSync(dbDir)) {
		fs.mkdirSync(dbDir, { recursive: true });
	}
	
	const db = new Database(dbPath);

	
	export function insertTournament(name: string, maxPlayers: number = 4): number | { error: string } {
		if (!name || !name.trim()) return { error: "Tournament name cannot be empty" };
		if (![4, 8, 16].includes(maxPlayers)) return { error: "Max players must be 4, 8, or 16" };

		try {
			const stmt = db.prepare(`INSERT INTO tournaments (name, max_players) VALUES (?, ?)`);
			const info = stmt.run(name.trim(), maxPlayers);
			return info.lastInsertRowid as number;
		} catch (err: any) {
			return { error: "Database error: " + err.message };
  		  }
	}
	
	export function getTournamentById(id: number): TournamentRow | undefined {
		if (!id) return undefined;
		const stmt = db.prepare(`SELECT * FROM tournaments WHERE id = ?`);
		return stmt.get(id) as TournamentRow | undefined;
	}
	
	export function insertTournamentPlayer(tournamentId: number, userId: number | null, alias?: string) {
		if (!tournamentId) throw new Error("Invalid tournament ID");
	
		const stmt = db.prepare(`
			INSERT INTO tournament_players (tournament_id, user_id, alias)
			VALUES (?, ?, ?)
		`);
	
		try {
			const info = stmt.run(tournamentId, userId, alias ?? null);
			return info.lastInsertRowid as number;
		} catch (err: any) {
			if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
				throw new Error("Player is already registered in this tournament");
			}
			throw err;
		}
	}
	
	export function insertMatch(
		tournamentId: number, 
		p1Id: number | null, 
		p2Id: number | null, 
		roundNumber: number, 
		matchNumber: number, 
		nextMatchId?: number
	) {
		const insert = db.transaction(() => {
			// Create the match
			const matchStmt = db.prepare(`INSERT INTO matches DEFAULT VALUES`);
			const matchInfo = matchStmt.run();
			const matchId = matchInfo.lastInsertRowid as number;
	
			// Link match to tournament
			const tournamentMatchStmt = db.prepare(`
				INSERT INTO tournament_matches 
				(tournament_id, match_id, round_number, match_number_in_round, next_tournament_match_id)
				VALUES (?, ?, ?, ?, ?)
			`);
			tournamentMatchStmt.run(
				tournamentId, 
				matchId, 
				roundNumber, 
				matchNumber, 
				nextMatchId ?? null
			);
	
			// Insert players 
			if (p1Id !== null) insertMatchPlayer(matchId, p1Id);
			if (p2Id !== null) insertMatchPlayer(matchId, p2Id);
	
			return matchId;
		});
	
		return insert();
	}
	
	export function insertMatchPlayer(matchId: number, userId: number) {
		const stmt = db.prepare(`
			INSERT INTO match_players (match_id, user_id) VALUES (?, ?)
		`);
		const info = stmt.run(matchId, userId);
		return info.lastInsertRowid as number;
	}
	
	export function getMatchesForTournament(tournamentId: number): MatchDTO[] {
		if (!tournamentId) return [];
	
		// Get all match IDs for this tournament
		const stmt = db.prepare(`
			SELECT match_id
			FROM tournament_matches
			WHERE tournament_id = ?
			ORDER BY round_number, match_number_in_round
		`);
	
		const rows = stmt.all(tournamentId) as { match_id: number }[];
	
		// Map each match ID to a full MatchDTO 
		return rows.map(row => getMatchDTO(row.match_id));
	}
	
	export function recordMatchWinner(matchId: number, winnerId: number) {
		if (!matchId || !winnerId) throw new Error("Invalid input");
	
		const stmt = db.prepare(`UPDATE matches SET winner_id = ? WHERE id = ?`);
		stmt.run(winnerId, matchId);
	}
	
	// Get all registered players for a tournament
	export function getRegisteredPlayers(tournamentId: number): PlayerDTO[] {
		const stmt = db.prepare(`
			SELECT 
				tp.user_id as id, 
				u.username as name
	
			FROM tournament_players tp
			JOIN users u ON u.id = tp.user_id
			WHERE tp.tournament_id = ?
			ORDER BY tp.id
		`);
		return stmt.all(tournamentId) as PlayerDTO[];
	}
	
	// Get all players for a match
	export function getMatchPlayers(matchId: number): PlayerDTO[] {
		const stmt = db.prepare(`
			SELECT 
				mp.user_id as id, 
				u.username as name
			FROM match_players mp
			JOIN users u ON u.id = mp.user_id
			WHERE mp.match_id = ?
		`);
		return stmt.all(matchId) as PlayerDTO[];
	}
	
	// Get single match DTO
	export function getMatchDTO(matchId: number): MatchDTO {
		const stmt = db.prepare(`
			SELECT 
				tm.match_id,
				tm.round_number,
				tm.match_number_in_round,
				m.winner_id,

				p1.user_id AS p1_id,
				p1.username AS p1_name,

				p2.user_id AS p2_id,
				p2.username AS p2_name

			FROM tournament_matches tm
			JOIN matches m ON m.id = tm.match_id

			LEFT JOIN (
				SELECT mp.user_id, u.username
				FROM match_players mp
				JOIN users u ON u.id = mp.user_id
				WHERE mp.match_id = ?
				ORDER BY mp.id ASC
				LIMIT 1
			) p1 ON 1=1

			LEFT JOIN (
				SELECT mp.user_id, u.username
				FROM match_players mp
				JOIN users u ON u.id = mp.user_id
				WHERE mp.match_id = ?
				ORDER BY mp.id DESC
				LIMIT 1
			) p2 ON 1=1

			WHERE tm.match_id = ?
		`);
		const m = stmt.get(matchId, matchId, matchId) as MatchRow;
		return {
			id: m.match_id,
			p1: { id: m.p1_id!, name: m.p1_name! },
			p2: { id: m.p2_id!, name: m.p2_name! },
			winnerId: m.winner_id,
			status: m.winner_id ? "finished" : "pending",
			round: m.round_number,
			matchNumber: m.match_number_in_round
		};
	}
	
	// Update tournament state and optionally winner
	export function updateTournamentState(
		tournamentId: number, 
		state: "waiting" | "active" | "finished", 
		currentRound: number, 
		winnerId?: number
	): TournamentDTO | null {
		const stmt = db.prepare(`
			UPDATE tournaments
			SET state=?, current_round=?, winner_id=?
			WHERE id=?
		`);
		stmt.run(state, currentRound, winnerId ?? null, tournamentId);
		return getTournamentWithMatches(tournamentId);
	}
	
	// Get tournament with all matches
	function mapMatchRow(m: MatchRow): MatchDTO {
		return {
		  id: m.match_id,
		  p1: { id: m.p1_id!, name: m.p1_name! },
		  p2: { id: m.p2_id!, name: m.p2_name! },
		  winnerId: m.winner_id,
		  status: m.winner_id ? "finished" : "pending",
		  round: m.round_number,
		  matchNumber: m.match_number_in_round,
		};
	}
	  
	export function getTournamentWithMatches(tournamentId: number): TournamentDTO | null {
		const tournament = getTournamentById(tournamentId);
		if (!tournament) return null;
	  
		const matches = getMatchesForTournament(tournamentId);
		const registeredPlayers = getRegisteredPlayers(tournamentId) || [];

		const winnerMatch = matches.find(m => m.winnerId === tournament.winner_id);
		const winnerName =
			winnerMatch?.p1.id === tournament.winner_id
				? winnerMatch.p1.name
				: winnerMatch?.p2.name ?? null;

		return {
		  id: tournament.id,
		  name: tournament.name,
		  currentRound: tournament.current_round,
		  state: tournament.state,
		  matches,
		  winnerName,
		  winnerId: tournament.winner_id,
		  max_players: tournament.max_players,
		  registeredPlayers,
		};
	}

	export function get_ActiveTournament(): TournamentDTO | null {
		const row = db.prepare(`
			SELECT id 
			FROM tournaments
			WHERE state IN ('waiting', 'active')
			ORDER BY id ASC
			LIMIT 1
		`).get() as { id: number } | undefined;
	
		if (!row) return null;
	
		// Reuse the full DTO builder
		return getTournamentWithMatches(row.id);
	}