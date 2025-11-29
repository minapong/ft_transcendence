import {
    insertTournament,
    getTournamentById,
    insertTournamentPlayer,
    insertMatch,
    insertMatchPlayer,
    getMatchesForTournament,
    recordMatchWinner,
    getRegisteredPlayers,
    getMatchPlayers,
    getMatchDTO,
	get_ActiveTournament,
    getTournamentWithMatches,
    updateTournamentState
} from "./tournamentRepo";

import {
    PlayerDTO,
    MatchDTO,
    TournamentDTO
} from "../types/tournament";

// Create a tournament
export function createTournament(name: string, maxPlayers: number = 4) {
    // Check for existing active/waiting tournament
    const activeTournament = get_ActiveTournament();
    if (activeTournament) {
        return activeTournament; // Return existing tournament instead of creating a new one
    }

    const idOrError = insertTournament(name, maxPlayers);
    if (typeof idOrError !== "number") throw new Error(idOrError.error);
    return getTournamentById(idOrError);
}

// Register a user to a tournament
export function registerUserToTournament(tournamentId: number, userId: number) {
    const tournament = getTournamentById(tournamentId);
    if (!tournament) throw new Error("Tournament not found");
    if (tournament.state !== "waiting") throw new Error("Tournament already started");
    
    // Check if tournament is full
    const players = getRegisteredPlayers(tournamentId);
    if (players.length >= tournament.max_players) {
        throw new Error("Tournament is full");
    }
    
    return insertTournamentPlayer(tournamentId, userId);
}

// Start tournament: only allowed if full quantity is registered
export function startTournament(tournamentId: number) {
    const tournament = getTournamentById(tournamentId);
    if (!tournament) throw new Error("Tournament not found");
    if (tournament.state !== "waiting") throw new Error("Tournament already started");
    
    const maxPlayers = tournament.max_players || 4; // Fallback to 4 if not set
    const players = getRegisteredPlayers(tournamentId);
    
    if (players.length !== maxPlayers) {
        throw new Error(`Cannot start tournament. Required ${maxPlayers}, but ${players.length} registered.`);
    }

    // Shuffle first round
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    let matchNumber = 1;
    const round = 1;
    
    for (let i = 0; i < shuffled.length; i += 2) {
        const p1 = shuffled[i];
        const p2 = shuffled[i + 1];
        insertMatch(
            tournamentId,
            p1.id,
            p2.id,
            round,
            matchNumber++
        );
    }
    
    return updateTournamentState(tournamentId, "active", round);
}

// Advance round
export function advanceRound(tournamentId: number) {
    const tournament = getTournamentWithMatches(tournamentId);
    if (!tournament) throw new Error("Tournament not found");
    
    // Check all matches finished
    const unfinished = tournament.matches.filter((m: MatchDTO) => m.status === "pending");
    if (unfinished.length) throw new Error("Not all matches are finished");
    
    // Collect winners
    const winners = tournament.matches.map((m: MatchDTO) => m.winnerId).filter(Boolean) as number[];
    
    if (winners.length === 1) {
        // Tournament finished
        return updateTournamentState(tournamentId, "finished", tournament.currentRound, winners[0]);
    }

    const nextRound = tournament.currentRound + 1;
    let matchNumber = 1;
    
    for (let i = 0; i < winners.length; i += 2) {
        const p1 = winners[i];
        const p2 = winners[i + 1];
        insertMatch(
            tournamentId,
            p1,
            p2,
            nextRound,
            matchNumber++
        );
    }
    
    return updateTournamentState(tournamentId, "active", nextRound);
}

// Record match result
export function recordMatchResult(matchId: number, winnerId: number) {
    const matchPlayers = getMatchPlayers(matchId);
    const validIds = matchPlayers.map((p: { id: number }) => p.id);
    
    if (!validIds.includes(winnerId)) throw new Error("Invalid winner for this match");
    
    recordMatchWinner(matchId, winnerId);
    return getMatchDTO(matchId);
}

export function getTournament(tournamentId: number) {
	return getTournamentById(tournamentId);
}

export function getActiveTournament() {
	return(get_ActiveTournament());
}