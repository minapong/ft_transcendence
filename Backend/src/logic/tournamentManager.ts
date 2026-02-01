// src/logic/tournamentManager.ts
import {
  insertTournament,
  getTournamentById,
  insertTournamentPlayer,
  insertMatch,
  // insertMatchPlayer, // available in repo, but not used here
  getRegisteredPlayers,
  getMatchPlayers,
  getMatchDTO,
  get_ActiveTournament,
  getTournamentWithMatches,
  updateTournamentState,
  recordMatchWinner,
} from "../repositories/tournament.repo.js";

import {
  updateUserGameStats,
  updateUserTournamentStats
} from "../repositories/stats.repo.js"

import type { MatchDTO } from "../types/tournament.js";

// helper function for true randonmess on shuffling.
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Create a tournament
export async function createTournament(name: string, maxPlayers: number = 4) {
  // If an active/waiting tournament exists, reuse it
  const activeTournament = await get_ActiveTournament();
  if (activeTournament) return activeTournament;

  const idOrError = await insertTournament(name, maxPlayers);

  //  your repo returns { error: string } on failure
  if (typeof idOrError !== "number") {
    throw new Error(idOrError.error);
  }

  return await getTournamentById(idOrError);
}

// Register a user to a tournament
export async function registerUserToTournament(tournamentId: number, userId: number) {
  const tournament = await getTournamentById(tournamentId);
  if (!tournament) throw new Error("Tournament not found");
  if (tournament.state !== "waiting") throw new Error("Tournament already started");

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

  const maxPlayers = tournament.max_players || 4;
  const players = shuffleArray(await getRegisteredPlayers(tournamentId));

  if (players.length !== maxPlayers) {
    throw new Error(`Cannot start tournament. Required ${maxPlayers}, but ${players.length} registered.`);
  }

  // Shuffle first round
  const shuffled = shuffleArray(players);

  const round = 1;
  let matchNumber = 1;

  for (let i = 0; i < shuffled.length; i += 2) {
    const p1 = shuffled[i];
    const p2 = shuffled[i + 1];
    await insertMatch(tournamentId, p1.id, p2.id, round, matchNumber++);
  }

  return await updateTournamentState(tournamentId, "active", round);
}

// Advance round
export async function advanceRound(tournamentId: number) {
  const tournament = await getTournamentWithMatches(tournamentId);
  if (!tournament) throw new Error("Tournament not found");

  // Get matches for the current round
  const currentRoundMatches = tournament.matches.filter((m: MatchDTO) => m.round === tournament.currentRound);

  // Ensure all matches in current round are finished
  const unfinished = currentRoundMatches.filter((m: MatchDTO) => m.status === "pending");
  if (unfinished.length) throw new Error("Not all matches are finished");

  // Winners from current round
  const winners = currentRoundMatches
    .map((m: MatchDTO) => m.winnerId)
    .filter((id): id is number => id != null);

  if (winners.length === 1) {
    // Tournament finished – award the championship
    await updateUserTournamentStats(winners[0]);

    return await updateTournamentState(
      tournamentId,
      "finished",
      tournament.currentRound,
      winners[0]
    );
  }

  const nextRound = tournament.currentRound + 1;
  let matchNumber = 1;

  // Preserve bracket order: sort by previous match number
  const winnersByIndex = currentRoundMatches
    .filter(m => m.winnerId != null)
    .sort((a, b) => (a.matchNumber ?? 0) - (b.matchNumber ?? 0));

  for (let i = 0; i < winnersByIndex.length; i += 2) {
    const p1 = winnersByIndex[i].winnerId!;
    const p2 = winnersByIndex[i + 1]?.winnerId ?? null;

    if (!p2) {
      // odd player out → auto-advance placeholder
      await insertMatch(tournamentId, p1, 0, nextRound, matchNumber++);
    } else {
      await insertMatch(tournamentId, p1, p2, nextRound, matchNumber++);
    }
  }

  return await updateTournamentState(tournamentId, "active", nextRound);
}

// Record match result
export async function recordMatchResult(
    matchId: number,
    winnerId: number, 
    scoreP1: number, 
    scoreP2: number
)  {
  const matchPlayers = await getMatchPlayers(matchId);
  const validIds = matchPlayers.map(p => p.id);

  if (!validIds.includes(winnerId)) throw new Error("Invalid winner for this match");

  await recordMatchWinner(matchId, winnerId, scoreP1, scoreP2);
  
  // UPDATE USER STATS (both winner and loser)
  const winnerPlayer = matchPlayers.find(p => p.id === winnerId);
  const loserPlayer = matchPlayers.find(p => p.id !== winnerId);

  if (!winnerPlayer) {
    throw new Error("Winner not found in match players");
  }

  // Winner: +1 win
  await updateUserGameStats(winnerId, true);

  // Loser: +1 loss (only if valid player exists)
  if (loserPlayer && loserPlayer.id !== 0) {
    await updateUserGameStats(loserPlayer.id, false);
  }

  return await getMatchDTO(matchId);
}

export async function getTournament(tournamentId: number) {
  return await getTournamentWithMatches(tournamentId);
}

export async function getActiveTournament() {
  return await get_ActiveTournament();
}
