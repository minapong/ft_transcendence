import { pongLogic } from "../engine/pong_logic";
import { navigate, useEffect } from "Reactor";

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
	useEffect(() => {
		const overlay = document.getElementById("winnerOverlay")!;
		const text = document.getElementById("winnerText")!;
		let winTimeout: number | null = null;
		
		const cleanup = pongLogic(
		  p1Name,
		  p2Name,
		  (winner: string) => {
			text.textContent = `${winner} Wins! 🏆`;
			overlay.classList.remove("hidden");
	  
			winTimeout = window.setTimeout(() => {
			  if (matchIndex !== null) {
				const winnerId = winner === p1Name ? p1Id : p2Id;
				localStorage.setItem(
				  "pongResult",
				  JSON.stringify({ matchId: matchIndex, winnerId })
				);
				localStorage.removeItem("currentMatch");
				navigate("/tournament/active");
			  } else {
				navigate("/single_game");
			  }
			}, 2000);
		  },
		  useAI,
		  aiDifficulty
		);
		
		// Hide overlay initially
		overlay.classList.add("hidden");

		// Cleanup function runs on unmount
		return () => {
			if (winTimeout !== null) {
				clearTimeout(winTimeout);
				winTimeout = null;
			}
			cleanup();
		};
	  }, []);

	  return (
			<div className="bg-gray-900 flex flex-col items-center justify-center min-h-screen px-2">
				
				{/* Scoreboard */}
				<div className="
				flex justify-between 
				w-full max-w-[320px] sm:max-w-[500px] lg:max-w-[800px] 
				text-white 
				text-lg sm:text-xl lg:text-2xl 
				font-bold mb-2
				">
				<span id="scoreLeft">{p1Name}: 0</span>
				<span id="scoreRight">{p2Name}: 0</span>
				</div>

				{/* LEFT TOUCH CONTROLS */}
				<div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 sm:gap-3 lg:gap-4 ml-1 sm:ml-2">
				<button
					id="left-up"
					className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/80 text-black text-xl sm:text-2xl font-bold rounded-lg active:bg-white"
				>
					▲
				</button>
				<button
					id="left-down"
					className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/80 text-black text-xl sm:text-2xl font-bold rounded-lg active:bg-white"
				>
					▼
				</button>
				</div>

				{/* Game board */}
				<div
				id="game_board"
				className="
					bg-gray-800 border-4 sm:border-6 lg:border-8 border-white rounded-lg relative
					w-[320px] h-[200px]
					sm:w-[400px] sm:h-[280px]
					lg:w-[600px] lg:h-[380px]
					xl:w-[800px] xl:h-[500px]
				"
				>
				{/* Left paddle */}
				<div
					id="left_p"
					className="absolute left-2 sm:left-3 lg:left-4 top-1/2 
							w-2 sm:w-3 h-16 sm:h-20 xl:h-24 bg-white"
				/>

				{/* Right paddle */}
				<div
					id="right_p"
					className="absolute right-2 sm:right-3 lg:right-4 top-1/2 
							w-2 sm:w-3 h-16 sm:h-20 xl:h-24 bg-white"
				/>

				{/* Ball */}
				<div
					id="ball"
					className="absolute 
							w-3 h-3 sm:w-4 sm:h-4 
							bg-white rounded-full 
							top-1/2 left-1/2"
				/>
				</div>

				{/* RIGHT TOUCH CONTROLS */}
				<div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 sm:gap-3 lg:gap-4 mr-1 sm:mr-2">
				<button
					id="right-up"
					className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/80 text-black text-xl sm:text-2xl font-bold rounded-lg active:bg-white"
				>
					▲
				</button>
				<button
					id="right-down"
					className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/80 text-black text-xl sm:text-2xl font-bold rounded-lg active:bg-white"
				>
					▼
				</button>
				</div>

				{/* Pause button */}
				<button
				id="pauseBtn"
				className="
					mt-3 sm:mt-4 
					px-3 sm:px-4 py-1.5 sm:py-2 
					bg-yellow-500 text-black font-bold rounded 
					hover:bg-yellow-400 text-sm sm:text-base
				"
				>
				⏸️ Pause
				</button>

				{/* Winner overlay */}
				<div
				id="winnerOverlay"
				className="hidden absolute inset-0 flex bg-black/70 items-center justify-center 
							text-white text-2xl sm:text-3xl lg:text-4xl font-bold z-50"
				>
				<div id="winnerText"></div>
				</div>
			</div>
		);
}
