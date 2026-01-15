import {
    insertTournament,
    getTournamentById,
    insertTournamentPlayer,
    insertMatch,
    getMatchesForTournament,
    recordMatchWinner,
    getRegisteredPlayers,
    getMatchPlayers,
    getMatchDTO,
	get_ActiveTournament,
    getTournamentWithMatches,
    updateTournamentState
} from "./tournamentRepo.js";

import {
    PlayerDTO,
    MatchDTO,
    TournamentDTO
} from "../types/tournament.js";

// Create a tournament
export async function createTournament(name: string, maxPlayers: number = 4) {
    // Check for existing active/waiting tournament
    const activeTournament = await get_ActiveTournament();
    if (activeTournament) {
        return activeTournament; // Return existing tournament instead of creating a new one
    }

    const idOrError = await insertTournament(name, maxPlayers);
    if (typeof idOrError !== "number") throw new Error(idOrError.error);
    return await getTournamentById(idOrError);
}

// Register a user to a tournament
export async function registerUserToTournament(tournamentId: number, userId: number) {
    const tournament = await getTournamentById(tournamentId);
    if (!tournament) throw new Error("Tournament not found");
    if (tournament.state !== "waiting") throw new Error("Tournament already started");
    
    // Check if tournament is full
    const players = await getRegisteredPlayers(tournamentId);
    if (players.length >= tournament.max_players) {
        throw new Error("Tournament is full");
    }
    
    return await insertTournamentPlayer(tournamentId, userId);
}

// Start tournament: only allowed if full quantity is registered
export async function startTournament(tournamentId: number) {
    const tournament = await getTournamentById(tournamentId);
    if (!tournament) throw new Error("Tournament not found");
    if (tournament.state !== "waiting") throw new Error("Tournament already started");
    
    const maxPlayers = tournament.max_players || 4; // Fallback to 4 if not set
    const players =  await getRegisteredPlayers(tournamentId);
    
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
        await insertMatch(
            tournamentId,
            p1.id,
            p2.id,
            round,
            matchNumber++
        );
    }
    
    return await updateTournamentState(tournamentId, "active", round);
}

// Advance round
export async function advanceRound(tournamentId: number) {
    const tournament = await getTournamentWithMatches(tournamentId);
    if (!tournament) throw new Error("Tournament not found");

    // Get matches for the current round
    const currentRoundMatches = tournament.matches.filter(
        (m: MatchDTO) => m.round === tournament.currentRound
    );

    // Check all current-round matches are finished
    const unfinished = currentRoundMatches.filter((m: MatchDTO) => m.status === "pending");
    if (unfinished.length) throw new Error("Not all matches are finished");

    // Collect winners only from current round
    const winners = currentRoundMatches
        .map((m: MatchDTO) => m.winnerId)
        .filter(Boolean) as number[];

    if (winners.length === 1) {
        // Tournament finished
        return await updateTournamentState(
            tournamentId,
            "finished",
            tournament.currentRound,
            winners[0]
        );
    }

    const nextRound = tournament.currentRound + 1;
    let matchNumber = 1;

    // Sort winners by their previous match number to preserve order
    const winnersByIndex = currentRoundMatches
        .filter(m => m.winnerId)
        .sort((a, b) => (a.matchNumber ?? 0) - (b.matchNumber ?? 0));

	for (let i = 0; i < winnersByIndex.length; i += 2) {
		const p1 = winnersByIndex[i].winnerId!;
		const p2 = winnersByIndex[i + 1]?.winnerId;
	
		if (!p2) {
			// Odd player out → automatically advances to next round
			insertMatch(tournamentId, p1, 0, nextRound, matchNumber++); // 0 or null as placeholder
		} else {
			insertMatch(tournamentId, p1, p2, nextRound, matchNumber++);
		}
	}

    return updateTournamentState(tournamentId, "active", nextRound);
}

// Record match result
export async function recordMatchResult(matchId: number, winnerId: number) {
    const matchPlayers = await getMatchPlayers(matchId);
    const validIds = matchPlayers.map((p: { id: number }) => p.id);
    
    if (!validIds.includes(winnerId)) throw new Error("Invalid winner for this match");
    
    await recordMatchWinner(matchId, winnerId);
    return await getMatchDTO(matchId);
}

export async function getTournament(tournamentId: number) {
	return await getTournamentWithMatches(tournamentId);
}

export async function getActiveTournament() {
	return await get_ActiveTournament();
}