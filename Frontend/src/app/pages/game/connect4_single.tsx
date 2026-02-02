import { useEffect, useState, useRef } from "Reactor";
import { navigate } from "Reactor";
import { getAuth } from "@/core/lib/auth";
import { apiFetch } from "@/core/lib/api";
import UserAvatar from "@/app/components/ui/UserAvatar";


type Player = {
  id: number;
  name: string
};

type Match = {
  id: string;
  p1: Player;
  p2: Player;
  status: "matched" | "started" | "finished"
};

export default function Connect4Single() {

  const auth = getAuth();
  const user = auth?.user;
  const token = auth?.token;

  if (!user) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Please login to play matchmaking.</p>
          <button onClick={() => (navigate("/auth/login"))} className="btn btn-primary btn-lg">
            Go to Login
          </button>
        </div>
      </div>
    );
  }


  const [status, setStatus] = useState<"loading" | "idle" | "waiting" | "matched">("loading");
  const [match, setMatch] = useState<Match | null>(null);

  const intervalRef = useRef<any | null>(null);

  // ──────────────── Polling effect ────────────────
  useEffect(() => {
    const pollMatch = async () => {
      try {
        const res = await apiFetch(`/api/matchmaking/state/${user.id}`);
        if (!res.ok) return;

        const data = await res.json();


        if (data.state === "active") {
          setMatch(data.match);
          setStatus("matched");

          // Stop polling if match already started
          if (data.match.status === "started" && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        } else if (data.state === "queued") {
          setMatch(null);
          setStatus("waiting");
        } else {
          setMatch(null);
          setStatus("idle");
        }
      } catch (err) {
        console.error("[poll] error:", err);
        setMatch(null);
        setStatus("idle");
      }
    };

    // Initial poll immediately
    pollMatch();

    // Only create interval once
    if (!intervalRef.current) {
      intervalRef.current = setInterval(pollMatch, 2000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []); // Empty dependency

  // ──────────────── Join Queue ────────────────
  async function join() {
    try {
      const res = await apiFetch("/api/matchmaking/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, username: user.username }),
      });
      const data = await res.json();


      if (data.status === "waiting") setStatus("waiting");
      else if (data.status === "matched") {
        setMatch(data.match);
        setStatus("matched");
      } else if (data.status === "already_active") {
        setMatch(data.match || null);
        setStatus("matched");
      }
    } catch (err) {
    }
  }

  // ──────────────── Start Game ────────────────
  async function startGame() {
    if (!match || match.p1.id !== user.id) return;

    // Stop polling before navigating
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    try {
      const res = await apiFetch("/api/matchmaking/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: match.id }),
      });

      navigate("/game/connect4", {
        state: {
          matchId: match.id,
          p1: match.p1, // { id: number; name: string }
          p2: match.p2, // { id: number; name: string }
        },
      });
    } catch (err) {
      console.error("[startGame] fetch error:", err);
    }
  }

  const opponent_name = match && (match.p1.id === user.id ? match.p2.name : match.p1.name);
  const opponent_id = match && (match.p1.id === user.id ? match.p2.id : match.p1.id);

  // Helper to determine active step
  const getStep = () => {
    if (status === 'idle') return 1;
    if (status === 'waiting') return 2;
    if (status === 'matched') return 3;
    return 0; // loading
  };
  const currentStep = getStep();

  return (
    <div className="min-h-screen text-white bg-gray-950 pb-20 selection:bg-red-500/30">
      {/* Scanline & Ambient background - Copied from Tournament Style */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_1px]" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-yellow-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 relative z-10 flex flex-col items-center justify-center min-h-[80vh]">

        {/* Phase Stepper - Visual Directions */}
        <div className="w-full max-w-lg mb-8">
          <div className="flex items-center justify-between relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -z-10" />

            {/* Step 1: Lobby */}
            <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${currentStep >= 1 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${currentStep >= 1 ? 'bg-red-500 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-gray-900 border-white/10'}`}>
                <span className="icon-[solar--user-circle-bold] text-sm text-white" />
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase">Lobby</span>
            </div>

            {/* Step 2: Searching */}
            <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${currentStep >= 2 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${currentStep >= 2 ? 'bg-red-500 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-gray-900 border-white/10'}`}>
                <span className={`icon-[solar--radar-2-bold] text-sm text-white ${currentStep === 2 ? 'animate-spin' : ''}`} />
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase">Searching</span>
            </div>

            {/* Step 3: Ready */}
            <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${currentStep >= 3 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${currentStep >= 3 ? 'bg-red-500 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-gray-900 border-white/10'}`}>
                <span className="icon-[solar--swords-bold] text-sm text-white" />
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase">Ready</span>
            </div>
          </div>
        </div>

        {/* Hero Header */}
        <header className="mb-12 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gray-900 border border-white/10 flex items-center justify-center relative z-10 shadow-2xl group">
            <div className="absolute -inset-1 bg-gradient-to-br from-red-500 to-yellow-500 rounded-3xl opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-500" />
            <span className="icon-[solar--gamepad-bold] text-5xl text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white mb-2">
            Connect 4
          </h1>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] uppercase text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            Ranked Match
          </div>
        </header>


        <div className="w-full max-w-lg">

          {/* Loading State */}
          {status === "loading" && (
            <div className="panel-surface p-12 rounded-3xl text-center border border-white/5 bg-white/[0.02]">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-400 rounded-full animate-spin" />
              </div>
              <p className="text-lg text-red-400/60 font-mono tracking-widest animate-pulse">CONNECTING...</p>
            </div>
          )}

          {/* Idle State */}
          {status === "idle" && (
            <div className="panel-surface p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden group min-h-[300px] flex flex-col justify-between">
              {/* Background Tech Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-500/20 to-transparent blur-2xl" />
              </div>

              <div className="relative z-10 text-center space-y-8">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs font-bold tracking-widest uppercase mb-4">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    Season 4 Live
                  </div>
                  <h2 className="text-3xl font-black text-white italic tracking-tight">READY TO PLAY?</h2>
                  <p className="text-gray-400 text-sm max-w-xs mx-auto">Join the queue to find a match.</p>
                </div>

                <button
                  onClick={join}
                  className="btn-cyber btn-xl w-full group/btn"
                >
                  <span className="icon-[solar--play-circle-bold] mr-3 text-2xl relative z-10 icon" />
                  <span className="relative z-10">JOIN QUEUE</span>
                </button>

                {/* Footer Stats similar to Tournament */}
                <div className="pt-6 border-t border-white/5 flex items-center justify-between text-xs font-mono text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="icon-[solar--users-group-rounded-bold] text-red-500" />
                    <span>424 ONLINE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span>SERVER ONLINE</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Waiting State */}
          {status === "waiting" && (
            <div className="panel-surface p-12 rounded-3xl text-center border border-white/5 bg-white/[0.02] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent opacity-50 animate-pulse" />

              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto bg-gray-800/50 rounded-full flex items-center justify-center mb-6 border border-white/5 relative">
                  <span className="icon-[solar--radar-2-bold-duotone] text-4xl text-red-400 animate-[spin_3s_linear_infinite]" />
                  <div className="absolute inset-0 rounded-full border border-red-500/30 animate-ping" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Searching...</h3>
                <p className="text-gray-500 text-sm font-mono tracking-wide">LOOKING FOR OPPONENT</p>
              </div>
            </div>
          )}

          {/* Matched State */}
          {status === "matched" && match && (
            <div className="panel-surface p-0 rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-500 to-transparent" />

              <div className="p-8 flex flex-col items-center gap-8">
                {/* Matchup Layout similar to Tournament */}
                <div className="flex items-center justify-center gap-6 w-full">
                  {/* YOU */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-md" />
                      <UserAvatar userId={user.id} username={user.username} size="xl" className="border-4 border-blue-500/50" />
                    </div>
                    <span className="font-bold text-blue-400">YOU</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-black italic text-gray-700/50">VS</span>
                  </div>

                  {/* OPPONENT */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <div className="absolute -inset-2 bg-red-500/20 rounded-full blur-md" />
                      <UserAvatar userId={opponent_id || -1} username={opponent_name || "Opponent"} size="xl" className="border-4 border-red-500/50" />
                    </div>
                    <span className="font-bold text-red-400 truncate max-w-[100px]">{opponent_name}</span>
                  </div>
                </div>

                <div className="w-full h-px bg-white/5" />
                {/* Action Button */}
                <div className="w-full">
                  {match.status === "matched" && match.p1.id === user.id && (
                    <button onClick={startGame} className="btn-cyber btn-lg w-full">
                      <span className="icon-[solar--play-bold] mr-2 text-xl icon" />
                      START GAME
                    </button>
                  )}

                  {match.status === "matched" && match.p1.id !== user.id && (
                    <div className="flex flex-col items-center gap-2 p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-xl text-yellow-500 animate-pulse">
                      <div className="flex items-center gap-2 font-bold tracking-widest text-sm uppercase">
                        <span className="icon-[solar--clock-circle-bold]" />
                        Waiting for Host
                      </div>
                      <p className="text-xs text-yellow-500/60 font-mono text-center max-w-[200px]">
                        Only {opponent_name} can start the game.
                      </p>
                    </div>
                  )}

                  {match.status === "started" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 flex items-center justify-center gap-2">
                        <span className="icon-[solar--check-circle-bold]" />
                        <span className="font-bold tracking-wide text-xs">GAME STARTED</span>
                      </div>
                      <button onClick={startGame} className="btn-cyber w-full py-4 text-emerald-400 border-emerald-500/30 hover:border-emerald-400">
                        <span className="icon-[solar--login-3-bold] mr-2 text-xl icon" />
                        {match.p1.id === user.id ? "RETURN TO GAME" : "PLAY ON HOST SCREEN"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer/Back */}
        <div className="mt-12 text-center">
          <button onClick={() => navigate("/game/pre_match_scene")} className="group px-6 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-gray-400 flex items-center gap-2 mx-auto">
            <span className="icon-[solar--arrow-left-linear] group-hover:-translate-x-1 transition-transform" />
            <span>Return to Menu</span>
          </button>
        </div>

      </div>
    </div>
  );
}
