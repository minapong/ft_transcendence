export default function TournamentPage() {
	// Handler for starting the tournament
	const handleStartTournament = async () => {
		const inputs = Array.from(document.querySelectorAll<HTMLInputElement>("input"));
		const players = inputs.map(i => i.value.trim()).filter(Boolean);

		if (players.length < 2) {
			alert("❌ Enter at least 2 player names");
			return;
		}

		try {
			const res = await fetch("http://localhost:3000/api/tournament/start", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ players }),
		});
  
		const data = await res.json();
		if (res.ok) {
			//Save tournament data locally
			localStorage.setItem("tournament", JSON.stringify(data));

			//Navigate to active tournament page
			window.location.href = "/tournament/active";
		} else {
		  alert(`❌ ${data.error || "Failed to start tournament"}`);
		}
	  } catch (err) {
		console.error(err);
		alert("❌ Network error");
	  }
	};
  
	return (
	  <div className="w-screen h-screen flex flex-col items-center justify-center gap-4 bg-gray-900 text-white p-4">
		{/* Title */}
		<h1 className="text-4xl font-bold mb-6">New Tournament</h1>
  
		{/* Inputs for 4 players */}
		<input className="px-4 py-2 rounded text-white bg-gray-800 focus:outline-none" placeholder="Player 1" />
		<input className="px-4 py-2 rounded text-white bg-gray-800 focus:outline-none" placeholder="Player 2" />
		<input className="px-4 py-2 rounded text-white bg-gray-800 focus:outline-none" placeholder="Player 3" />
		<input className="px-4 py-2 rounded text-white bg-gray-800 focus:outline-none" placeholder="Player 4" />
  
		{/* Start button */}
		<button
		  onClick={handleStartTournament}
		  className="active:scale-90 bg-linear-to-br hover:from-cyan-100 hover:text-cyan-900 hover:to-cyan-400 from-cyan-900 to-cyan-600 text-white border-4 border-cyan-200 text-2xl font-bold px-4 py-2 rounded-xl shadow-2xl hover:scale-110 transition-all duration-150 cursor-pointer hover:shadow-cyan-500/50 hover:shadow-2xl"
		>
		  Start Tournament
		</button>
	  </div>
	);
  }
  