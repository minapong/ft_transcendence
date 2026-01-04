import { pongLogic } from "../engine/pong_logic";
import { navigate, useEffect } from "Reactor";

export default function PongGame() {
  // Read navigation state (tournament or free play)
  const navState = history.state as any;

  let p1Name: string;
  let p2Name: string;
  let useAI = false;
  let aiDifficulty: "easy" | "medium" | "hard" = "medium";
  let matchId: number | null = null;
  let p1Id: number | null = null;
  let p2Id: number | null = null;

  if (navState?.mode === "tournament") {
    // Tournament mode
    p1Name = navState.p1.name;
    p2Name = navState.p2.name;
    p1Id = navState.p1.id;
    p2Id = navState.p2.id;
    matchId = navState.matchId;
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

        // If this was a tournament match, report result directly
        if (matchId !== null && p1Id !== null && p2Id !== null) {
          const winnerId = winner === p1Name ? p1Id : p2Id;

          fetch("http://localhost:3000/api/tournament/result", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ matchId, winnerId }),
            keepalive: true, // Survives page unload
          }).catch((err) => {
            console.warn("[Pong] Failed to report tournament result:", err);
          });
        }

        // Navigate back after 2 seconds
        winTimeout = window.setTimeout(() => {
          if (matchId !== null) {
            navigate("/tournament/active", { replace: true });
          } else {
            navigate("/single_game", { replace: true });
          }
        }, 2000);
      },
      useAI,
      aiDifficulty
    );

    overlay.classList.add("hidden");

    return () => {
      if (winTimeout !== null) {
        clearTimeout(winTimeout);
      }
      cleanup();
    };
  }, []);

  return (
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

      <div
        id="winnerOverlay"
        className="hidden absolute inset-0 flex bg-black/70 items-center justify-center text-white text-4xl font-bold z-50"
      >
        <div id="winnerText"></div>
      </div>
    </div>
  );
}