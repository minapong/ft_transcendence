import { pongLogic } from "../engine/pong_logic";
import { navigate } from "../reactor/router";

export default function PongGame() {
    // Read match info from localStorage (tournament mode)
    const matchData = localStorage.getItem("currentMatch");

    // Read query params (free play mode)
    const params = new URLSearchParams(window.location.search);
    const useAI = params.get("useAI") === "true";
    const aiDifficulty = (params.get("difficulty") || "medium") as "easy" | "medium" | "hard";
	const single_p1 = (params.get("p1") || "Player 1");
	const single_p2 = params.get("p2") || (useAI ? "AI" : "Player 2");

    let p1Name: string;
    let p2Name: string;
	let p1Id: number;
	let p2Id: number;
    let matchIndex: number | null = null;

    if (matchData) {
        // Tournament match
        const parsed = JSON.parse(matchData);
        p1Name = parsed.p1.name;
        p2Name = parsed.p2.name;
		p1Id = parsed.p1.id;
		p2Id = parsed.p2.id;
        matchIndex = parsed.matchId;
    } else {
        // Free play (AI or 2p)
        p1Name = single_p1;
        p2Name = single_p2;
    }

	let cleanup = () => {};

    // Start game
    setTimeout(() => {
        pongLogic(p1Name, p2Name, (winner: string) => {
            if (matchIndex !== null) {
                // Tournament mode → store result
				const winnerId = winner === p1Name ? p1Id : p2Id;
				localStorage.setItem("pongResult", JSON.stringify({ matchId: matchIndex , winnerId }));
				localStorage.removeItem("currentMatch");
				navigate("/tournament/active");
            } else {
                // Free play mode → simply return to menu
                navigate("/single_game");
            }
        }, useAI, aiDifficulty);
    }, 0);

	window.addEventListener("beforeunload", () => {
		cleanup();
	});

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