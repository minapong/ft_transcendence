// logic/matchmakingManager.ts
import { Match } from "../logic/tournamentManager.js"

export interface Player {
	id: string
	name: string
}

const matchmakingQueue: Player[] = []
const activeMatches: Match[] = []
let matchCounter = 1

export function joinQueue(player: Player): { match?: Match; waiting?: true } {
	// to prevent duplicate addition to the queue (playing with yourself)
	if (matchmakingQueue.find(p => p.id === player.id)) {
		return { waiting: true }
	}

	matchmakingQueue.push(player)
	console.log(`Added ${player.name} to queue`)
	console.log("Current queue:", matchmakingQueue.map(p => p.name))

	// when 2 players are available → create a match
	if (matchmakingQueue.length >= 2) {
		const p1 = matchmakingQueue.shift()!
		const p2 = matchmakingQueue.shift()!

		const match: Match = {
			p1: p1.name,
			p2: p2.name,
			winner: null,
			status: "pending",
		}

		activeMatches.push(match)
		console.log(`Match created: ${match.p1} vs ${match.p2}`)
		return { match }
	}

	return { waiting: true }
}

export function getActiveMatches() {
	return activeMatches
}

export function getQueue() {
	return matchmakingQueue
}
