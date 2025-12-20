import { navigate, useEffect, useState } from "Reactor";
import { connect4Logic } from "../engine/connect4_logic";


type NavState =
  | {
      mode: "2p";
      p1: string;
      p2: string;
    }
  | null;

export default function Connect4Game() {
  const navState = history.state as NavState;

  if (!navState || navState.mode !== "2p") {
    navigate("/connect4_single", { replace: true });
    return null;
  }

  const { p1, p2 } = navState;

  useEffect(() => {
	const overlay = document.getElementById("winnerOverlay")!;
	const text = document.getElementById("winnerText")!;
	let winTimeout: number | null = null;

	const cleanup = connect4Logic((winner) => {
		text.textContent = winner === "R" ? `${p1} Wins! 🏆` 
			: winner === "Y" ? `${p2} Wins! 🏆` 
			: "Draw!";
		overlay.classList.remove("hidden");

		winTimeout = window.setTimeout(() => {
			navigate("/connect4_single");
		}, 2000);
	});

	overlay.classList.add("hidden");

	return () => {
		if (winTimeout !== null) {
			clearTimeout(winTimeout);
			winTimeout = null;
		}
		cleanup();
	};
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-6">
      {/* Player names and turn indicator */}
      <div className="flex justify-between w-full max-w-3xl mb-4 px-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-red-500"></div>
          <span>{p1}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-yellow-500"></div>
          <span>{p2}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <span>Turn:</span>
        <div className={`w-6 h-6 rounded-full ${p1}`}></div>
      </div>

      {/* Board */}
      <div className="grid grid-cols-7 grid-rows-6 gap-2 p-2 bg-blue-900 rounded-lg max-w-[720px] w-full aspect-[7/6]" id="board">
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