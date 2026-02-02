import { navigate, useEffect } from "Reactor";
import { connect4Logic } from "@/core/engine/connect4_logic";
import { apiFetch } from "@/core/lib/api";
import UserAvatar from "@/app/components/ui/UserAvatar";

type Player = { id: number; name: string };
type NavState = {
  matchId: string;
  p1: Player;
  p2: Player;
} | null;

export default function Connect4Game() {
  const navState = history.state as NavState;

  if (!navState || !navState.matchId || !navState.p1 || !navState.p2) {
    navigate("/game/connect4_single", { replace: true });
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
      apiFetch("/api/matchmaking/finish", {
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
          text.innerHTML = `
            <div class="flex flex-col items-center gap-4">
                <span class="icon-[solar--crown-bold] text-6xl text-yellow-500 animate-bounce"></span>
                <span class="text-red-500 text-5xl font-black tracking-tighter drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] uppercase">${p1.name} WINS</span>
            </div>
          `;
          finishMatch(p1.id);
        } else if (winner === "Y") {
          text.innerHTML = `
            <div class="flex flex-col items-center gap-4">
                <span class="icon-[solar--crown-bold] text-6xl text-yellow-500 animate-bounce"></span>
                <span class="text-yellow-400 text-5xl font-black tracking-tighter drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] uppercase">${p2.name} WINS</span>
            </div>
          `;
          finishMatch(p2.id);
        } else {
          text.innerHTML = '<span class="text-gray-400 text-5xl font-black tracking-widest uppercase">DRAW</span>';
        }

        overlay.classList.remove("hidden");
        overlay.classList.add("flex");

        winTimeout = window.setTimeout(() => {
          navigate("/game/connect4_single", { replace: true });
        }, 3000);
      },
      (currentPlayer) => {
        // Update turn indicator color - logic handles classes
        // We will style the container in JSX, logic injects bg colors
        if (currentPlayer === "R") {
          turnIndicator.className = "w-4 h-4 rounded-full bg-red-500 shadow-[0_0_15px_red] animate-pulse";
        } else {
          turnIndicator.className = "w-4 h-4 rounded-full bg-yellow-400 shadow-[0_0_15px_yellow] animate-pulse";
        }
      }
    );

    // Hide overlay on mount
    overlay.classList.add("hidden");
    overlay.classList.remove("flex");

    return () => {
      if (winTimeout !== null) {
        clearTimeout(winTimeout);
      }
      cleanup();
    };
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center py-8 relative overflow-hidden selection:bg-red-500/30">

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_1px]" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center gap-4 md:gap-8 min-h-screen justify-center">

        {/* Header / Scoreboard */}
        <div className="w-full flex items-center justify-between panel-surface p-3 md:p-6 rounded-2xl border border-white/10 bg-white/[0.02] relative overflow-hidden">

          {/* Background Gradient for subtle team separation */}
          <div className="absolute inset-0 flex">
            <div className="w-1/2 bg-red-500/[0.02]" />
            <div className="w-1/2 bg-yellow-500/[0.02]" />
          </div>

          {/* Player 1 (Left) */}
          <div className="relative z-10 flex items-center gap-3 w-[40%]">
            <div className="relative group shrink-0">
              <UserAvatar userId={p1.id} username={p1.name} size="md" className="w-10 h-10 md:w-16 md:h-16 border-2 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-6 md:h-6 bg-red-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                <span className="text-[8px] md:text-[10px] font-black">P1</span>
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-red-50 tracking-wide text-xs md:text-lg truncate">{p1.name}</span>
              <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono text-red-400/60 uppercase">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="hidden md:inline">Host</span>
              </div>
            </div>
          </div>

          {/* Turn Indicator (Center) */}
          <div className="relative z-10 flex flex-col items-center justify-center w-[20%]">
            <span className="text-xl md:text-3xl font-black italic text-white/10 select-none hidden md:block">VS</span>
            <div className="px-2 py-1 md:px-4 md:py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center gap-2">
              <span className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase hidden md:inline">Turn</span>
              <div id="turnIndicator" className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-500 shadow-[0_0_15px_red] animate-pulse" />
            </div>
          </div>

          {/* Player 2 (Right) */}
          <div className="relative z-10 flex items-center gap-3 flex-row-reverse text-right w-[40%]">
            <div className="relative group shrink-0">
              <UserAvatar userId={p2.id} username={p2.name} size="md" className="w-10 h-10 md:w-16 md:h-16 border-2 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 md:w-6 md:h-6 bg-yellow-500 rounded-full border-2 border-gray-900 flex items-center justify-center bg-gray-900">
                <span className="text-[8px] md:text-[10px] font-black text-black">P2</span>
              </div>
            </div>
            <div className="flex flex-col min-w-0 items-end">
              <span className="font-bold text-yellow-50 tracking-wide text-xs md:text-lg truncate">{p2.name}</span>
              <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono text-yellow-400/60 uppercase justify-end">
                <span className="hidden md:inline">Client</span>
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* CSS for Drop Animation */}
        <style>{`
            @keyframes dropIn {
                0% { transform: translateY(-700%); opacity: 0; }
                40% { opacity: 1; }
                80% { transform: translateY(5%); }
                100% { transform: translateY(0); }
            }
            .animate-drop {
                animation: dropIn 0.5s cubic-bezier(0.5, 0, 0.2, 1) forwards;
                position: relative;
                z-index: 10;
            }
        `}</style>

        {/* Game Board Container */}
        <div className="relative w-full max-w-[680px] aspect-[7/6] p-2 md:p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl shrink-0">
          {/* Board Frame Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl pointer-events-none" />

          {/* The Grid */}
          <div
            id="board"
            className="relative z-10 grid grid-cols-7 grid-rows-6 gap-1.5 md:gap-3 w-full h-full"
          >
            {/* Cells generated via loop */}
            {Array.from({ length: 42 }).map((_, i) => (
              <div
                key={i}
                id={`${i}`}
                className="cell w-full h-full rounded-full bg-gray-950/80 shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)] border border-white/5 relative overflow-hidden group transition-all duration-300 hover:border-white/20"
              >
                {/* Inner highlight for 3D depth */}
                <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)] pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <button
          onClick={() => navigate("/game/connect4_single", { replace: true })}
          className="btn-cyber px-8 py-3 text-sm opacity-50 hover:opacity-100 transition-opacity"
        >
          <div className="flex items-center gap-2">
            <span className="icon-[solar--exit-bold] text-lg icon" />
            <span>EXIT MATCH</span>
          </div>
        </button>
      </div>

      {/* Winner Overlay - Cyberpunk Style */}
      <div
        id="winnerOverlay"
        className="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex-col items-center justify-center animate-in fade-in duration-300"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
        <div
          id="winnerText"
          className="relative z-10 p-12 text-center"
        >
          {/* Content injected via JS */}
        </div>
        <div className="mt-8 text-xs font-mono text-gray-500 tracking-[0.5em] animate-pulse">
          REDIRECTING TO LOBBY
        </div>
      </div>
    </div>
  );
}