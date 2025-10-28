export default function TournamentPage() {
	return (
	  <div className="w-screen h-screen flex flex-col items-center justify-center gap-4 bg-gray-900 text-white p-4">
		
		{/* Title */}
		<h1 className="text-4xl font-bold mb-6">New Tournament</h1>
  
		{/* Inputs for 4 players */}
		<input
		  className="px-4 py-2 rounded text-white"
		  placeholder="Player 1"
		/>
		<input
		  className="px-4 py-2 rounded text-white"
		  placeholder="Player 2"
		/>
		<input
		  className="px-4 py-2 rounded text-white"
		  placeholder="Player 3"
		/>
		<input
		  className="px-4 py-2 rounded text-white"
		  placeholder="Player 4"
		/>
  
		{/* Start button */}
		<button
		  className="mt-4 px-6 py-3 bg-blue-600 rounded hover:bg-blue-700"
		  onClick={() => alert("Starting tournament (dummy handler)")}
		>
		  Start Tournament
		</button>
	  </div>
	);
  }
  