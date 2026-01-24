import { navigate, useEffect } from "Reactor";
import { connect4Logic } from "@/core/engine/connect4_logic";

type Player = { id: number; name: string };
type NavState = {
  matchId: string;
  p1: Player;
  p2: Player;
} | null;

export default function Connect4Game() {
  const navState = history.state as NavState;

  if (!navState || !navState.matchId || !navState.p1 || !navState.p2) {
    navigate("/connect4_single", { replace: true });
    return null;
  }

  const { matchId, p1, p2 } = navState;

  useEffect(() => {
    const overlay = document.getElementById("winnerOverlay")!;
    const text = document.getElementById("winnerText")!;
    const turnIndicator = document.getElementById("turnIndicator")!;
    let winTimeout: number | null = null;

    // Fire-and-forget finish match
    const finishMatch = (winnerId: number) => {
      fetch("http://localhost:3000/api/matchmaking/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, winnerId }),
        keepalive: true,
      }).catch((err) => {
        console.warn("[Connect4] Failed to send finishMatch (network/offline):", err);
      });
    };

    const cleanup = connect4Logic(
      (winner) => {
        // Show winner message
        if (winner === "R") {
          text.textContent = `${p1.name} Wins! 🏆`;
          finishMatch(p1.id);
        } else if (winner === "Y") {
          text.textContent = `${p2.name} Wins! 🏆`;
          finishMatch(p2.id);
        } else {
          text.textContent = "Draw!";
        }

        overlay.classList.remove("hidden");

        winTimeout = window.setTimeout(() => {
          navigate("/connect4_single", { replace: true });
        }, 2000);
      },
      (currentPlayer) => {
        // Update turn indicator color
        if (currentPlayer === "R") {
          turnIndicator.className = "w-8 h-8 rounded-full bg-red-500 shadow-lg shadow-red-500/50 animate-pulse";
        } else {
          turnIndicator.className = "w-8 h-8 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50 animate-pulse";
        }
      }
    );

    // Hide overlay on mount
    overlay.classList.add("hidden");

    return () => {
      if (winTimeout !== null) {
        clearTimeout(winTimeout);
      }
      cleanup();
    };
  }, [matchId, p1, p2]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-6">
      {/* Player names */}
      <div className="flex justify-between w-full max-w-3xl mb-4 px-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-red-500"></div>
          <span>{p1.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-yellow-500"></div>
          <span>{p2.name}</span>
        </div>
      </div>

      {/* Turn indicator */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-lg font-medium">Turn:</span>
        <div
          id="turnIndicator"
          className="w-8 h-8 rounded-full bg-red-500 shadow-lg shadow-red-500/50 animate-pulse"
        ></div>
      </div>

      {/* Board */}
      <div
        className="grid grid-cols-7 grid-rows-6 gap-2 p-2 bg-blue-900 rounded-lg max-w-[720px] w-full aspect-[7/6]"
        id="board"
      >
        {Array.from({ length: 42 }).map((_, i) => (
          <div
            key={i}
            id={`${i}`}
            className="cell w-full aspect-square bg-white rounded-full"
          ></div>
        ))}
      </div>

      <button
        id="resetBtn"
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Reset Game
      </button>

      {/* Winner overlay */}
      <div
        id="winnerOverlay"
        className="hidden absolute inset-0 flex bg-black/70 items-center justify-center text-white text-4xl font-bold z-50"
      >
        <div id="winnerText"></div>
      </div>
    </div>
  );
}