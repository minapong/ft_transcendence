export default function TournamentPage() {
	const handleStartTournament = async () => {
	  // Get all inputs
	  const inputs = Array.from(document.querySelectorAll<HTMLInputElement>("input"));
	  const rawNames = inputs.map(i => i.value);
	  
	  // ———— VALIDATION ————
	  const seen = new Set<string>();
	  const errors: string[] = [];
	  const cleanNames: string[] = [];
  
	  for (let i = 0; i < rawNames.length; i++) {
		const raw = rawNames[i];
		const trimmed = raw.trim();
		const upper = trimmed.toUpperCase();
  
		if (!raw) {
			//only placeholder in place
			continue;
		}
		
		if (!trimmed) {
			//it was only spaces
		  errors.push(`Player ${i + 1}: 'Name cannot be empty`);
		  continue;
		}
  
		if (upper === "AWIN") {
		  errors.push(`Player ${i + 1}: 'AWIN' is reserved`);
		  continue;
		}
  
		if (seen.has(upper)) {
		  errors.push(`Player ${i + 1}: '${trimmed}' is already used`);
		} else {
		  seen.add(upper);
		  cleanNames.push(trimmed);
		}
	  }
  
	  // At least 2 valid players
	  if (cleanNames.length < 2) {
		alert("Enter at least 2 different player names");
		return;
	  }
  
	  // Show all errors at once
	  if (errors.length > 0) {
		alert("Fix these errors:\n• " + errors.join("\n• "));
		return;
	  }
  
	  // ———— SEND TO BACKEND ————
	  try {
		const res = await fetch("http://localhost:3000/api/tournament/start", {
		  method: "POST",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify({ players: cleanNames }),
		});
  
		const data = await res.json();
  
		if (res.ok) {
		  localStorage.setItem("tournament", JSON.stringify(data));
		  window.location.href = "/tournament/active";
		} else {
		  alert(`Error: ${data.error || "Failed to start tournament"}`);
		}
	  } catch (err) {
		console.error(err);
		alert("Network error");
	  }
	};
  
	return (
	  <div className="h-screen flex flex-col items-center justify-center gap-4 bg-gray-900 text-white p-4">
		<h1 className="text-4xl font-bold mb-6">New Tournament</h1>
  
		<input className="px-4 py-2 rounded text-white bg-gray-800 focus:outline-none" placeholder="Player 1" />
		<input className="px-4 py-2 rounded text-white bg-gray-800 focus:outline-none" placeholder="Player 2" />
		<input className="px-4 py-2 rounded text-white bg-gray-800 focus:outline-none" placeholder="Player 3" />
		<input className="px-4 py-2 rounded text-white bg-gray-800 focus:outline-none" placeholder="Player 4" />
  
		<button
		  onClick={handleStartTournament}
		  className="active:scale-90 bg-linear-to-br hover:from-cyan-100 hover:text-cyan-900 hover:to-cyan-400 from-cyan-900 to-cyan-600 text-white border-4 border-cyan-200 text-2xl font-bold px-4 py-2 rounded-xl shadow-2xl hover:scale-110 transition-all duration-150 cursor-pointer hover:shadow-cyan-500/50 hover:shadow-2xl"
		>
		  Start Tournament
		</button>
	  </div>
	);
  }