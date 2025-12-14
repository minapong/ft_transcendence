import { pongLogic } from "../engine/pong_logic";
import { navigate } from "Reactor";

type NavState =
  | {
      mode: "ai";
      p1: string;
      difficulty: "easy" | "medium" | "hard";
    }
  | {
      mode: "2p";
      p1: string;
      p2: string;
    }
  | null;

export default function PongGame() {
    // Read match info from localStorage (tournament mode)
    const matchData = localStorage.getItem("currentMatch");

    // Read query params (free play mode)
	const navState = history.state as NavState;
	
	let p1Name: string;
	let p2Name: string;
	let useAI = false;
	let aiDifficulty: "easy" | "medium" | "hard" = "medium";
	let matchIndex: number | null = null;
	let p1Id = 0;
	let p2Id = 0;

	if (matchData) {
		// Tournament
		const parsed = JSON.parse(matchData);
		p1Name = parsed.p1.name;
		p2Name = parsed.p2.name;
		p1Id = parsed.p1.id;
		p2Id = parsed.p2.id;
		matchIndex = parsed.matchId;
	  } else if (navState?.mode === "ai") {
		// Free play vs AI
		p1Name = navState.p1;
		p2Name = "AI";
		useAI = true;
		aiDifficulty = navState.difficulty;
	  } else if (navState?.mode === "2p") {
		// Free play 2P
		p1Name = navState.p1;
		p2Name = navState.p2;
	  } else {
		// Invalid entry 
		navigate("/single_game", { replace: true });
		return null;
	  }

    // Start game
    setTimeout(() => {
        pongLogic(
			p1Name, 
			p2Name, 
			(winner: string) => {
            if (matchIndex !== null) {
                // Tournament mode → store result
				const winnerId = winner === p1Name ? p1Id : p2Id;
				localStorage.setItem("pongResult", JSON.stringify({ matchId: matchIndex , winnerId }));
				localStorage.removeItem("currentMatch");
				navigate("/tournament/active");
            } else {
                // Free play mode → return to single page
                navigate("/single_game");
            }
        }, 
		useAI, 
		aiDifficulty);
    }, 0);

	return(
        <div className="bg-gray-900 flex flex-col items-center justify-center h-screen">
            <div className="flex justify-between w-[800px] text-white text-2xl font-bold mb-2">
                <span id="scoreLeft">{p1Name}: 0</span>
                <span id="scoreRight">{p2Name}: 0</span>
            </div>
            
            {/* Game board */}
            <div id="game_board" className="bg-gray-800 border-8 border-white rounded-lg w-[800px] h-[500px] relative">
            
                {/* Left paddle */}
                <div id="left_p" className="absolute left-4 top-1/2 w-3 h-24 bg-white"></div>

                {/* Right paddle */}
                <div id="right_p" className="absolute right-4 top-1/2 w-3 h-24 bg-white"></div>

                {/* Ball */}
                <div id="ball" className="absolute w-4 h-4 bg-white rounded-full top-1/2 left-1/2"></div>
            
            </div>
            <button id="pauseBtn" className="mt-4 px-4 py-2 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400">
                ⏸️ Pause
            </button>
        </div>
	);
}