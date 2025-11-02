
export interface Match {
	p1: string;
	p2: string;
	winner: string | null;
	status: "pending" | "finished";
}

export interface Tournament {
	id: number;
	round: number;
	matches: Match[];
	isOver: boolean;
}

const tournaments: Tournament[] = [];

export function createTournament(players: string[]): Tournament | { error: string } {
	if (players.length < 2) {
		return { error: "Need at least 2 players to start a tournament." };
	}

	players = [...players].sort(() => Math.random() - 0.5);

	const matches: Match[] = [];
	for (let i = 0; i < players.length; i += 2) {
		const p1 = players[i];
		const p2 = players[i + 1] || "AWIN"; // Automatic WIN - AWIN
		matches.push({ p1, p2, winner: null, status: "pending" });
	}

	const tournament: Tournament = {
		id: tournaments.length + 1,
		round: 1,
		matches,
		isOver: false,
	};

	tournaments.push(tournament);
	return tournament;
}

export function recordMatchResult(
	tournamentId: number,
	matchIndex: number,
	winner: string
): { success: true; match: Match } | { error: string } {
	const t = tournaments.find(t => t.id === tournamentId);
	if (!t) return { error: "Tournament not found" };

	const match = t.matches[matchIndex];
	if (!match) return { error: "Match not found" };
	if (match.status === "finished") return { error: "Match already finished" };

	match.winner = winner;
	match.status = "finished";

	return { success: true, match };
}

export function advanceRound(
	tournamentId: number
): Tournament | { error?: string; message?: string } {
	const t = tournaments.find(t => t.id === tournamentId);
	if (!t) return { error: "Tournament not found" };

	if (t.matches.some(m => m.status !== "finished")) {
		return { error: "Not all matches are finished" };
	}

	const winners = t.matches.map(m => m.winner).filter(Boolean) as string[];

	if (winners.length === 1) {
		t.isOver = true;
		return { message: `Tournament finished! Winner: ${winners[0]}` };
	}

	const nextMatches: Match[] = [];
	for (let i = 0; i < winners.length; i += 2) {
		const p1 = winners[i];
		const p2 = winners[i + 1] || "AWIN";
		nextMatches.push({ p1, p2, winner: null, status: "pending" });
	}

	t.round++;
	t.matches = nextMatches;

	return t;
}
