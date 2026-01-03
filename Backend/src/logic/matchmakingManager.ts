import crypto from "crypto"
import { recordConnect4Game } from "./matchmakingRepo";


export interface Player {
  id: string
  name: string
}

export interface ActiveMatch {
  id: string
  game: "connect4"
  p1: Player
  p2: Player
  createdAt: number
}

const queue: Player[] = []
const activeMatches = new Map<string, ActiveMatch>()

export function joinQueue(player: Player) {
  // prevent duplicates
  if (queue.find(p => p.id === player.id)) {
    return { status: "waiting" as const }
  }

  queue.push(player)

  if (queue.length < 2) {
    return { status: "waiting" as const }
  }

  const p1 = queue.shift()!
  const p2 = queue.shift()!

  const match: ActiveMatch = {
    id: crypto.randomUUID(),
    game: "connect4",
    p1,
    p2,
    createdAt: Date.now(),
  }

  activeMatches.set(match.id, match)

  return {
    status: "matched" as const,
    match,
  }
}

export function getMatch(matchId: string) {
  return activeMatches.get(matchId)
}


export function finishMatch(matchId: string, winnerId: number) {
	const match = activeMatches.get(matchId);
	if (!match) throw new Error("Match not found");

	// Persist game to DB
	recordConnect4Game(
		Number(match.p1.id),
		Number(match.p2.id),
		winnerId
	);

	// Remove from active matches
	removeActiveMatch(matchId);
	return { success: true };
}

export function removeActiveMatch(matchId: string) {
	activeMatches.delete(matchId);
}

export function getQueue() {
  return queue
}

export function getActiveMatches() {
  return Array.from(activeMatches.values())
}