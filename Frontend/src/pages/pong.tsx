import {pongLogic} from "../engine/pong_logic"


export default function PongGame() {
	// Read match info
	const matchData = localStorage.getItem("currentMatch");
	if (!matchData) {
	  alert("No match found. Go back.");
	  window.location.href = "/tournament/active";
	  return <div>Error</div>;
	}
  
	const { p1, p2, matchIndex } = JSON.parse(matchData);
  
	// Start game
	setTimeout(() => {
	  pongLogic(p1, p2, (winner: string) => {
		// Save result
		localStorage.setItem("pongResult", JSON.stringify({ winner, matchIndex }));
		// Go back
		window.location.href = "/tournament/active";
	  });
	}, 0);

	return(
        <div className="bg-gray-900 flex flex-col items-center justify-center h-screen">
            <div className="flex justify-between w-[800px] text-white text-2xl font-bold mb-2">
                <span id="scoreLeft">{p1}: 0</span>
                <span id="scoreRight">{p2}: 0</span>
            </div>
            
            {/* Game board */}
            <div id="game_board" className="bg-gray-800 border-8 border-white rounded-lg w-[800px] h-[500px] relative">
            
                {/* Left paddle */}
                <div id="left_p" className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-24 bg-white"></div>

                {/* Right paddle */}
                <div id="right_p" className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-24 bg-white"></div>

                {/* Ball */}
                <div id="ball" className="absolute w-4 h-4 bg-white rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            
            </div>
            <button id="pauseBtn" className="mt-4 px-4 py-2 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400">
                ⏸️ Pause
            </button>
        </div>
	);
}