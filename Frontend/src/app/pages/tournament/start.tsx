import { getAuth } from "@/core/lib/auth";
import { apiFetch } from "@/core/lib/api";
import {useState, useEffect, navigate} from "Reactor"


export default function TournamentPage() {
	const auth = getAuth();
	const user = auth?.user;

	if (!user) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Please login to join tournament.</p>
          <button onClick={() => navigate("/auth/login")} className="bg-blue-500 px-6 py-3 rounded text-xl">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const isAdmin = user.isAdmin;
//   if (!isAdmin) console.log("user is not admin");
  const [tournament, setTournament] = useState(null);
  const [max_players, setMax_players] = useState(4);
  const [tournamentName, setTournamentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch active tournament on load
  useEffect(() => {
	// console.log("Tournament fetch triggered");
	let mounted = true;

    const loadTournament = async () => {
		setLoading(true);
		try {
			const res = await apiFetch("/api/tournament/active");
			if (res.ok) {
			const data = await res.json();
			setTournament(data.tournament); // null = no tournament
			} else {
			setTournament(null);
			setError("Failed to load tournament");
			}
		} catch (err) {
			setTournament(null);
			setError("Network error");
		} finally {
			if (mounted) setLoading(false);
		}
	};

    loadTournament();

    return () => {
      mounted = false;
    };
  },[]);

	const refreshTournament = async () => {
	try {
		const res = await apiFetch("/api/tournament/active");
		const data = await res.json();
		if (data.success) {
		setTournament(data.tournament);
		}
	} catch {
		// Silent fail on refresh — don't show error banner for refresh
	}
	};

  const handleCreateTournament = async () => {
    try {
		if (max_players === 0) {
			setError("Please select number of players");
			return;
		}
		const res = await apiFetch("/api/tournament/create", {
        method: "POST",
        // headers: { "Content-Type": "application/json" }, //apiFetch sets same header
        body: JSON.stringify({ name: tournamentName, max_players  }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create tournament");
        return;
      }
      setTournament(data.tournament);
      setError("");
    } catch {
      setError("Network error creating tournament");
    }
  };

  const handleRegister = async () => {
    if (!tournament) return;
    try {
      const res = await apiFetch("/api/tournament/register", {
        method: "POST",
        // headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tournamentId: tournament.id}),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to register");
        return;
      }
      setError("");
      await refreshTournament();
    } catch {
      setError("Network error registering");
    }
  };

  const handleStartTournament = async () => {
    if (!tournament) return;
    try {
      const res = await apiFetch("/api/tournament/start", {
        method: "POST",
        // headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tournamentId: tournament.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to start tournament");
        return;
      }
      setTournament(data.tournament);
      setError("");
    } catch {
      setError("Network error starting tournament");
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  const isRegistered = tournament?.registeredPlayers?.some((p: any) => p.id === user.id);
  const canRegister =
	// !user.isAdmin &&
	!isAdmin &&
	tournament?.state === "waiting" &&
	!isRegistered &&
	(tournament.registeredPlayers?.length || 0) < (tournament?.max_players ?? max_players);

	return (
		<div className="w-screen h-screen flex flex-col items-center justify-center gap-4 bg-gray-900 text-white p-4">
		  <h1 className="text-4xl font-bold mb-6">Tournament</h1>
	
		  {error && (
			<div className="bg-red-500 text-white px-4 py-2 rounded mb-4">
			  {error}
			</div>
		  )}
	
		  {/* Admin: Create Tournament */}
		  {!tournament && isAdmin && (

			<div className="flex flex-col gap-4 items-center">
			  <input
				type="text"
				placeholder="Enter Tournament Name"
				value={tournamentName}
				onChange={e => setTournamentName(e.target.value)}
				className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 w-64"
			  />
			  <div className="flex items-center gap-2">
				<label className="text-lg">
				  Players:
				  <select 
					value={(max_players)}
					onChange={e => setMax_players(Number(e.target.value))}
					className="ml-2 bg-gray-800 text-white px-3 py-2 rounded border border-gray-700"
				  >
					<option value="4">4 Players</option>
					<option value="8">8 Players</option>
				  </select>
				</label>
			  </div>
			  <button 
				onClick={handleCreateTournament} 
				className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-semibold transition"
			  >
				Create Tournament
			  </button>
			</div>
		  )}
	
		  {/* No tournament & not admin */}
		  {!tournament && !isAdmin && (
			<p className="text-xl text-gray-400 font-semibold text-center">
			  No Tournament active or open for registration
			</p>
		  )}
	
		  {/* Tournament info */}
		  {tournament && (
			<div className="flex flex-col gap-4 items-center max-w-md">
			  <div className="bg-gray-800 p-6 rounded-lg w-full">
				<p className="text-xl mb-2 font-bold">Name: {tournament.name} - ID:  {tournament.id}</p>
				<p className="text-lg">Status: <span className="capitalize font-semibold">{tournament.state}</span></p>
				<p className="text-lg">Registered: {tournament.registeredPlayers?.length || 0}/{tournament?.max_players ?? max_players}</p>
			  </div>
	
			  {isAdmin && tournament.state === "waiting" && (tournament.registeredPlayers?.length || 0) === (tournament?.max_players ?? max_players) && (
				<button 
				  onClick={handleStartTournament} 
				  className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded font-semibold transition w-full"
				>
				  Start Tournament
				</button>
			  )}
	
			  {canRegister && (
				<button 
				  onClick={handleRegister} 
				  className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-semibold transition w-full"
				>
				  Join Tournament
				</button>
			  )}
	
			  {!isRegistered && !isAdmin && tournament.state === "waiting" && (tournament.registeredPlayers?.length || 0) >= (tournament.max_players || max_players) && (
				<p className="text-red-400 font-semibold">Tournament Full – Cannot Register</p>
			  )}
			  {isRegistered && !isAdmin && tournament.state === "waiting" && (
				<p className="text-yellow-300">You are already registered.</p>
			  )}
	
			  {tournament.state !== "waiting" && (
				<div className="bg-green-800 p-4 rounded text-center w-full">
				  <p className="text-lg font-semibold">Tournament is active!</p>
				  {isRegistered ? (
					<p 
					  className="text-sm mt-2 underline cursor-pointer text-blue-300 hover:text-blue-400"
					  onClick={() => navigate("/tournament/active")}
					>
					  You can see your matches in the active tournament page.
					</p>
				  ) : (
					<p className="text-sm mt-2">You are not a participant in this tournament.</p>
				  )}
				</div>
			  )}
	
			  {tournament.registeredPlayers && tournament.registeredPlayers.length > 0 && (
				<div className="bg-gray-800 p-4 rounded w-full">
				  <h3 className="font-bold mb-2">Registered Players:</h3>
				  <ul className="list-disc list-inside">
					{tournament.registeredPlayers.map((p: any) => (
					  <li key={p.id}>{p.name}</li>
					))}
				  </ul>
				</div>
			  )}
			</div>
		  )}
		</div>
	);
}