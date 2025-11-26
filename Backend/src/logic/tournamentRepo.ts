import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(__dirname, "..", "database", "transcendence.db");
const db = new Database(dbPath);


export function insertTournament(name: string): number | { error: string } {
    if (!name || !name.trim()) return { error: "Tournament name cannot be empty" };

    try {
        const stmt = db.prepare(`INSERT INTO tournaments (name) VALUES (?)`);
        const info = stmt.run(name.trim());
        return info.lastInsertRowid as number;
    } catch (err: any) {
        return { error: "Database error: " + err.message };
    }
}

export function getTournamentById(id: number) {
    if (!id) return null;
    const stmt = db.prepare(`SELECT * FROM tournaments WHERE id = ?`);
    return stmt.get(id);
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

export function getMatchesForTournament(tournamentId: number) {
    if (!tournamentId) return [];
    const stmt = db.prepare(`
        SELECT tm.*, m.winner_id 
        FROM tournament_matches tm
        JOIN matches m ON m.id = tm.match_id
        WHERE tm.tournament_id = ?
        ORDER BY tm.round_number, tm.match_number_in_round
    `);
    return stmt.all(tournamentId);
}

export function recordMatchWinner(matchId: number, winnerId: number) {
    if (!matchId || !winnerId) throw new Error("Invalid input");

    const stmt = db.prepare(`UPDATE matches SET winner_id = ? WHERE id = ?`);
    stmt.run(winnerId, matchId);
}

// Get all registered players for a tournament
export function getRegisteredPlayers(tournamentId: number) {
    const stmt = db.prepare(`
        SELECT tp.user_id as id, u.username as name
        FROM tournament_players tp
        JOIN users u ON u.id = tp.user_id
        WHERE tp.tournament_id = ?
        ORDER BY tp.id
    `);
    return stmt.all(tournamentId);
}

// Get all players for a match
export function getMatchPlayers(matchId: number) {
    const stmt = db.prepare(`
        SELECT mp.user_id as id, u.username as name
        FROM match_players mp
        JOIN users u ON u.id = mp.user_id
        WHERE mp.match_id = ?
    `);
    return stmt.all(matchId);
}

// Get single match DTO
export function getMatchDTO(matchId: number) {
    const stmt = db.prepare(`
        SELECT tm.match_id, tm.round_number, tm.match_number_in_round,
               m.winner_id,
               p1.user_id as p1_id, p1.username as p1_name,
               p2.user_id as p2_id, p2.username as p2_name
        FROM tournament_matches tm
        JOIN matches m ON m.id = tm.match_id
        LEFT JOIN match_players mp1 ON mp1.match_id = m.id
        LEFT JOIN users p1 ON p1.id = mp1.user_id
        LEFT JOIN match_players mp2 ON mp2.match_id = m.id AND mp2.user_id != mp1.user_id
        LEFT JOIN users p2 ON p2.id = mp2.user_id
        WHERE tm.match_id = ?
    `);
    const m = stmt.get(matchId);
    return {
        id: m.match_id,
        p1: { id: m.p1_id, name: m.p1_name },
        p2: { id: m.p2_id, name: m.p2_name },
        winnerId: m.winner_id,
        status: m.winner_id ? "finished" : "pending",
        round: m.round_number,
        matchNumber: m.match_number_in_round
    };
}

// Update tournament state and optionally winner
export function updateTournamentState(tournamentId: number, state: "waiting" | "active" | "finished", currentRound: number, winnerId?: number) {
    const stmt = db.prepare(`
        UPDATE tournaments
        SET state=?, current_round=?, winner_id=?
        WHERE id=?
    `);
    stmt.run(state, currentRound, winnerId ?? null, tournamentId);
    return getTournamentWithMatches(tournamentId);
}

// Get tournament with all matches
function mapMatchRow(m: any) {
	return {
	  id: m.match_id,
	  p1: { id: m.p1_id, name: m.p1_name },
	  p2: { id: m.p2_id, name: m.p2_name },
	  winnerId: m.winner_id,
	  status: m.winner_id ? "finished" : "pending",
	  round: m.round_number,
	  matchNumber: m.match_number_in_round,
	};
}
  
export function getTournamentWithMatches(tournamentId: number) {
	const tournament = getTournamentById(tournamentId);
	if (!tournament) return null;
  
	const matches = getMatchesForTournament(tournamentId).map(mapMatchRow);
  
	return {
	  id: tournament.id,
	  name: tournament.name,
	  currentRound: tournament.current_round,
	  state: tournament.state,
	  matches,
	  winnerId: tournament.winner_id,
	};
}
