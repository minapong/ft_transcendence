export default function ActiveTournamentPage() {
	const tournamentData = localStorage.getItem("tournament");
	if (!tournamentData) {
	  return (
		<div className="w-screen h-screen flex items-center justify-center bg-gray-900 text-white">
		  <h2 className="text-2xl font-bold">No active tournament found.</h2>
		</div>
	  );
	}
  
	const tournament = JSON.parse(tournamentData);
	const pendingMatches = tournament.matches.filter((m: any) => m.status === "pending");
  
	const handleStartGame = async (matchIndex: number) => {
	  const match = tournament.matches[matchIndex];
	  if (!match || match.status !== "pending") return;
  
	  console.log(`Starting match: ${match.p1} vs ${match.p2}`);
	  const winner = Math.random() < 0.5 ? match.p1 : match.p2;
  
	  try {
		// 1. Record result
		const resultRes = await fetch("http://localhost:3000/api/tournament/result", {
		  method: "POST",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify({
			tournamentId: tournament.id,
			matchIndex,
			winner,
		  }),
		});
  
		if (!resultRes.ok) throw new Error("Failed to record result");
  
		// 2. GET fresh tournament from backend 
		const getRes = await fetch("http://localhost:3000/api/tournament/get", {
		  method: "POST",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify({ tournamentId: tournament.id }),
		});
  
		if (!getRes.ok) throw new Error("Failed to fetch updated tournament");
		const freshTournament = await getRes.json();
  
		// 3. Check if round is complete using updated data
		const allFinished = freshTournament.matches.every((m: any) => m.status === "finished");
  
		if (allFinished) {
		  // 4. Advance round
		  const nextRes = await fetch("http://localhost:3000/api/tournament/next", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ tournamentId: tournament.id }),
		  });
  
		  if (!nextRes.ok) throw new Error("Failed to advance round");
		  const nextData = await nextRes.json();
  
		  if (nextData.message) {
			// Tournament over
			freshTournament.isOver = true;
			localStorage.setItem("tournament", JSON.stringify(freshTournament));
		  } else {
			// New round
			localStorage.setItem("tournament", JSON.stringify(nextData));
		  }
		} else {
		  // Just save updated state
		  localStorage.setItem("tournament", JSON.stringify(freshTournament));
		}
  
		window.location.reload();
	  } catch (err: any) {
		console.error("Backend error:", err);
		alert("Error: " + err.message);
	  }
	};
  
	return (
	  <div className="w-screen h-screen flex flex-col items-center justify-center gap-6 bg-gray-900 text-white">
		<h1 className="text-3xl font-bold">
		  Tournament #{tournament.id} — Round {tournament.round}
		</h1>
  
		{pendingMatches.length > 0 ? (
		  <div className="space-y-6 w-full max-w-xl">
			<h2 className="text-xl font-semibold text-center">Pending Matches</h2>
			{pendingMatches.map((match: any, idx: number) => {
			  const globalIndex = tournament.matches.indexOf(match);
			  return (
				<div
				  key={globalIndex}
				  className="bg-gray-800 p-6 rounded-2xl shadow-lg text-center"
				>
				  <p className="text-xl mb-3">
					<strong>{match.p1}</strong> vs <strong>{match.p2}</strong>
				  </p>
				  <button
					onClick={() => handleStartGame(globalIndex)}
					className="bg-linear-to-br from-cyan-900 to-cyan-600 hover:from-cyan-100 hover:to-cyan-400 hover:text-cyan-900 text-white text-lg font-bold px-6 py-2 rounded-xl border-2 border-cyan-200 shadow-lg hover:scale-105 active:scale-95 transition-all"
				  >
					Start Game
				  </button>
				</div>
			  );
			})}
		  </div>
		) : tournament.isOver ? (
		  <div className="text-center space-y-3">
			<p className="text-3xl font-bold">Tournament Completed!</p>
			{tournament.matches[0]?.winner ? (
			  <p className="text-2xl">
				Winner:{" "}
				<span className="text-4xl font-bold text-cyan-400">
				  {tournament.matches[0].winner}
				</span>
			  </p>
			) : (
			  <p className="text-xl text-gray-400">Winner data unavailable</p>
			)}
		  </div>
		) : (
		  <p className="text-xl text-gray-400">No matches pending.</p>
		)}
  
		<a
		  href="/"
		  className="text-cyan-400 underline hover:text-cyan-200 mt-8"
		  onClick={() => localStorage.removeItem("tournament")}
		>
		  ← Back to Home
		</a>
	  </div>
	);
  }