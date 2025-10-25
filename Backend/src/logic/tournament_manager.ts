
interface Match {
	id: number;
	p1: string;
	p2: string;
	status: "pending" | "completed";
	winner?: string;
  }
  
  interface Tournament {
	id: number;
	round: number;
	matches: Match[];
  }
  
  let tournamentCounter = 1; // static global counter
  
  export function createTournament(players: string[]): Tournament | { error: string } {
	if (players.length < 2) {
	  return { error: "Need at least 2 players to start a tournament." };
	}
  
	// Shuffle players randomly
	players = [...players].sort(() => Math.random() - 0.5);
  
	const matches: Match[] = [];
	let matchId = 1;
  
	for (let i = 0; i < players.length; i += 2) {
	  const p1 = players[i];
	  const p2 = players[i + 1] || "BYE"; // BYE = auto-win for p1
	  matches.push({ id: matchId++, p1, p2, status: "pending" });
	}
  
	const tournament: Tournament = {
	  id: tournamentCounter++,
	  round: 1,
	  matches,
	};
  
	// later you'll store this in memory or DB
	return tournament;
  }