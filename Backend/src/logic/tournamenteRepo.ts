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