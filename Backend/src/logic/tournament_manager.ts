export function createTournament(players: string[]) {
	if (players.length < 2) {
		return { error: "Need at least 2 players to start a tournament." };
	}

	players = [...players].sort(() => Math.random() - 0.5); // Copy and sort it randomly.

	const matches = [];
	for (let i = 0; i < players.length; i += 2) {
	  const p1 = players[i];
	  const p2 = players[i + 1] || "AWIN"; //AWIN = Automatic Win
	  matches.push({ p1, p2, status: "pending" });
	}
	return {
		round: 1,
		matches,
	};
}