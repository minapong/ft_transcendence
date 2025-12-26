const tournaments = [];
export function createTournament(players) {
    if (players.length < 2) {
        return { error: "Need at least 2 players to start a tournament." };
    }
    const seen = new Set();
    let cleanPlayers = [];
    for (const name of players) {
        const trimmed = name.trim();
        if (!trimmed) {
            return { error: "Player name cannot be empty" };
        }
        const key = trimmed.toUpperCase();
        if (key === "AWIN") {
            return { error: "Name 'AWIN' is reserved for automatic wins" };
        }
        if (seen.has(key)) {
            return { error: `Duplicate name: '${trimmed}'` };
        }
        cleanPlayers.push(trimmed);
        seen.add(key);
    }
    cleanPlayers = [...cleanPlayers].sort(() => Math.random() - 0.5);
    const matches = [];
    for (let i = 0; i < cleanPlayers.length; i += 2) {
        const p1 = cleanPlayers[i];
        const p2 = cleanPlayers[i + 1] || "AWIN"; // Automatic WIN - AWIN
        if (p2 === "AWIN")
            matches.push({ p1, p2, winner: p1, status: "finished" });
        else
            matches.push({ p1, p2, winner: null, status: "pending" });
    }
    const tournament = {
        id: tournaments.length + 1,
        round: 1,
        matches,
        isOver: false,
    };
    tournaments.push(tournament);
    return tournament;
}
export function recordMatchResult(tournamentId, matchIndex, winner) {
    const t = tournaments.find(t => t.id === tournamentId);
    if (!t)
        return { error: "Tournament not found" };
    const match = t.matches[matchIndex];
    if (!match)
        return { error: "Match not found" };
    if (match.status === "finished")
        return { error: "Match already finished" };
    if (winner !== match.p1 && winner !== match.p2) {
        return { error: `Invalid winner: ${winner} was not part of this match` };
    }
    match.winner = winner;
    match.status = "finished";
    return { success: true, match };
}
export function advanceRound(tournamentId) {
    const t = tournaments.find(t => t.id === tournamentId);
    if (!t)
        return { error: "Tournament not found" };
    if (t.matches.some(m => m.status !== "finished")) {
        return { error: "Not all matches are finished" };
    }
    const winners = t.matches.map(m => m.winner).filter(Boolean);
    if (winners.length === 1) {
        t.isOver = true;
        return { message: `Tournament finished! Winner: ${winners[0]}` };
    }
    const nextMatches = [];
    for (let i = 0; i < winners.length; i += 2) {
        const p1 = winners[i];
        const p2 = winners[i + 1] || "AWIN";
        if (p2 === "AWIN")
            nextMatches.push({ p1, p2, winner: p1, status: "finished" });
        else
            nextMatches.push({ p1, p2, winner: null, status: "pending" });
    }
    t.round++;
    t.matches = nextMatches;
    return t;
}
export function getTournament(tournamentId) {
    const t = tournaments.find(t => t.id === tournamentId);
    if (!t)
        return { error: "Tournament not found" };
    return t;
}
