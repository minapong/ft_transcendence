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

		  <a href="/tournament" className="active:scale-90 bg-linear-to-br 
		  hover:from-cyan-100 hover:text-cyan-900 hover:to-cyan-400 from-cyan-900 to-cyan-600 text-white border-4
		  border-cyan-200 text-2xl font-bold px-2 py-1 rounded-xl shadow-2xl 
		  hover:scale-110 transition-all duration-150 cursor-pointer hover:shadow-cyan-500/50 hover:shadow-2xl">Start Tournament</a>

	  </div>
	);
  }
  