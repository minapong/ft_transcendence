import {useState, useEffect, navigate} from "Reactor"

// Temporary placeholder user — replace with real login context later
const mockUser = { id: 2, name: "Player1" };

export default function ActiveTournamentPage() {
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingResult, setSavingResult] = useState(false);

  // 1️ Handle: we returned from Pong

  useEffect(() => {
	const gameResultRaw = localStorage.getItem("pongResult");
	if (!gameResultRaw || !tournament?.id) return; // nothing to process
  
	const { matchId, winnerId } = JSON.parse(gameResultRaw);
	localStorage.removeItem("pongResult");
	setSavingResult(true);
  
	(async () => {
	  try {
		// 1. Save match result
		const resultRes = await fetch("http://localhost:3000/api/tournament/result", {
		  method: "POST",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify({ matchId, winnerId }),
		});
		const resultData = await resultRes.json();
		console.log("Result reported", resultData);
  
		// 2. Reload tournament
		await loadActiveTournament();
  
	  } catch (err) {
		console.error("Failed to save result ", err);
		alert("There was an issue updating the result");
	  } finally {
		setSavingResult(false);
	  }
	})();
  }, [tournament?.id]);

  // 2️ Load active tournament on mount

  async function loadActiveTournament() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/tournament/active");
      const data = await res.json();

      if (!data?.tournament) {
        setTournament(null);
      } else {
        setTournament(data.tournament);
      }
    } catch (err) {
      console.error(err);
      setTournament(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadActiveTournament();
  }, []);

  // 3️ Start Game

  function handleStartGame(match: any) {
    // Only players of this match may start it
    const isPlayer =
      match.p1.id === mockUser.id || match.p2.id === mockUser.id;

    if (!isPlayer) {
      alert("You are not a player in this match.");
      return;
    }

    // Store match info for Pong
    localStorage.setItem(
      "currentMatch",
      JSON.stringify({
        matchId: match.id,
        p1: match.p1,
        p2: match.p2,
        tournamentId: tournament.id,
      })
    );

    navigate("/pong");
	}

  // 4️ Render


  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-xl">Loading active tournament...</p>
      </div>
    );
  }

  if (savingResult) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-xl">Saving result...</p>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-900 text-white">
        <h2 className="text-2xl font-bold">No active tournament found.</h2>
      </div>
    );
  }

	const pendingMatches = tournament.matches.filter(
    	(m: any) => m.status === "pending"
	);
	// Check if we can show the "Advance Round" button
	const canAdvanceRound =
		pendingMatches.length === 0 && tournament?.state !== "finished";

	// Manual advance round handler
	async function handleAdvanceRound() {
		if (!tournament) return;

	setSavingResult(true);
	try {
		const res = await fetch("http://localhost:3000/api/tournament/next", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ tournamentId: tournament.id }),
		});
		const data = await res.json();
		console.log("Advance round result:", data);

		if (data?.tournament) {
			setTournament(data.tournament);
		} else {
			alert("Unable to advance round: " + (data?.error ?? "unknown error"));
		}
	} catch (err) {
		console.error(err);
		alert("Failed to advance round");
	} finally {
		setSavingResult(false);
	}
	}

	
  return (
    <div className="w-screen min-h-screen flex flex-col items-center gap-8 py-12 bg-gray-900 text-white">

      {/* User placeholder */}
      <div className="text-lg font-bold">
        Logged in as:{" "}
        <span className="text-cyan-400">{mockUser.name} - ID: {mockUser.id}</span>
      </div>

      <h1 className="text-3xl font-bold">
        Tournament #{tournament.id} {tournament.name} — Round {tournament.currentRound}
      </h1>

      {/* Pending matches */}
      {pendingMatches.length > 0 ? (
        <div className="space-y-6 w-full max-w-xl">
          <h2 className="text-xl font-semibold text-center">Pending Matches</h2>

          {pendingMatches.map((match: any) => (
            <div
              key={match.id}
              className="bg-gray-800 p-6 rounded-2xl shadow-lg text-center"
            >
              <p className="text-xl mb-4">
                <strong>{match.p1.name}</strong> vs{" "}
                <strong>{match.p2.name}</strong>
              </p>

              <button
                onClick={() => handleStartGame(match)}
                className="bg-linear-to-br from-cyan-900 to-cyan-600 hover:from-cyan-100 hover:to-cyan-400 hover:text-cyan-900 
                  text-white text-lg font-bold px-6 py-2 rounded-xl border-2 border-cyan-200
                  shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                Start Game
              </button>
            </div>
          ))}
        </div>
      ) : tournament.state === "finished" ? (
        <div className="text-center space-y-4">
          <p className="text-3xl font-bold">Tournament Completed!</p>
          <p className="text-2xl">
            Winner:{" "}
            <span className="text-4xl text-cyan-400 font-bold">
              {tournament.winnerName ?? "Unknown"}
            </span>
          </p>
        </div>
      ) : (
		<div className="flex flex-col items-center gap-4">
		  <p className="text-xl text-gray-400">No pending matches.</p>
	  
		  {/* Manual advance round button */}
		  {canAdvanceRound === true && (
			<button
			  onClick={handleAdvanceRound}
			  className="mt-4 px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-500"
			>
			  Advance Round
			</button>
		  )}
		</div>
	  )}

      <button
        className="text-cyan-400 underline hover:text-cyan-200 mt-8"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>
    </div>
  );
}
