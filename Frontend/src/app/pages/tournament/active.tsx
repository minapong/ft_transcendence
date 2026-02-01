import { useState, useEffect, navigate } from "Reactor"
import { getAuth } from "@/core/lib/auth"
import { apiFetch } from "@/core/lib/api"
import UserAvatar from "@/app/components/ui/UserAvatar"

export default function ActiveTournamentPage() {
  const auth = getAuth();
  const currentUser = auth?.user;
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load active tournament on mount
  async function loadActiveTournament() {
    setLoading(true);
    try {
      const res = await apiFetch("/api/tournament/active");
      const data = await res.json();

      // Success = 200, even with null
      setTournament(data?.tournament ?? null);
    } catch (err) {
      console.error(err);
      setTournament(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadActiveTournament();
  }, []);

  // Start Game
  function handleStartGame(match: any) {
    if (!currentUser) {
      alert("Please login");
      return;
    }
    const isPlayer =
      match.p1.id === currentUser.id || match.p2.id === currentUser.id;

    if (!isPlayer) {
      alert("You are not a player in this match.");
      return;
    }

    // Pass match data via navigation state (no localStorage)
    navigate("/game/pong", {
      state: {
        mode: "tournament",
        matchId: match.id,
        p1: match.p1,
        p2: match.p2,
        tournamentId: tournament.id,
      },
    });
  }

  // Manual advance round handler
  async function handleAdvanceRound() {
    if (!tournament) return;

    setLoading(true);
    try {
      const res = await apiFetch("/api/tournament/next", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tournamentId: tournament.id }),
      });
      const data = await res.json();

      if (data?.tournament) {
        setTournament(data.tournament);
        // Diagnostic: Explicitly confirm advancement
        if (data.tournament.currentRound > (tournament.currentRound || 0)) {
          // We could add a toast here, but for now relying on UI update
        }
      } else {
        alert("Unable to advance round: " + (data?.error ?? "unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to advance round");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-950">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,1)]" />
          </div>
        </div>
        <p className="text-lg text-cyan-400/60 font-mono tracking-widest animate-pulse">SYNCING DATA...</p>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 p-6">
        <div className="panel-surface p-12 rounded-3xl text-center border border-white/5 bg-white/[0.02]">
          <div className="w-24 h-24 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-6 border border-white/10">
            <span className="icon-[solar--ghost-smile-bold-duotone] text-5xl text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Signal Lost</h2>
          <p className="text-gray-400 max-w-sm mx-auto mb-8">No active tournament frequency detected.</p>
          <button
            onClick={() => navigate("/")}
            className="btn-glass btn-lg group"
          >
            <span className="icon-[solar--home-2-bold] mr-2 group-hover:text-cyan-400 transition-colors" />
            Return to Base
          </button>
        </div>
      </div>
    );
  }

  const pendingMatches = tournament.matches.filter(
    (m: any) => m.status === "pending"
  );

  const canAdvanceRound =
    pendingMatches.length === 0 && tournament?.state !== "finished";

  return (
    <div className="min-h-screen text-white bg-gray-950 pb-20 selection:bg-purple-500/30">
      {/* Scanline & Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_1px]" />
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 relative z-10">

        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/tournament/start")}
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-cyan-400/50 hover:text-cyan-400 transition-all group"
            >
              <span className="icon-[solar--arrow-left-linear] text-2xl group-hover:-translate-x-0.5 transition-transform" />
            </button>

            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
                {tournament.name}
                <span className="inline-flex items-center gap-3 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full font-mono text-sm text-gray-400 select-none">
                  <span className="flex items-center justify-center w-6 h-6 bg-white/10 rounded-md">
                    <span className="icon-[solar--hashtag-bold] text-[10px]" />
                  </span>
                  <span className="tracking-widest leading-none pt-[2px]">ID: {tournament.id}</span>
                </span>
              </h1>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-400 font-medium">
                <span className="icon-[solar--flag-bold-duotone] text-purple-400" />
                Currently in <span className="text-purple-300 font-bold uppercase">Round {tournament.currentRound}</span> of combat
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-gray-900/50 p-2 rounded-xl border border-white/5 backdrop-blur-sm">
            <UserAvatar userId={currentUser?.id} username={currentUser?.username} size="md" />
            <div className="text-left pr-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Operator</p>
              <p className="font-bold text-cyan-400 leading-none">{currentUser?.username ?? "Guest"}</p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="w-full max-w-4xl mx-auto">

          {/* Pending Matches Section */}
          {pendingMatches.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span className="w-2 h-8 bg-cyan-400 rounded-full" />
                  Pending Battles
                </h2>
                <span className="text-sm font-mono text-cyan-400/60 animate-pulse">● LIVE FEED</span>
              </div>

              <div className="grid gap-6">
                {pendingMatches.map((match: any) => {
                  const isParticipant = match.p1.id === currentUser?.id || match.p2.id === currentUser?.id;

                  return (
                    <div
                      key={match.id}
                      className={`panel-surface relative p-0 rounded-2xl overflow-hidden group transition-all duration-500 ${isParticipant ? 'border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.1)]' : 'border-white/10 hover:border-white/20'}`}
                    >
                      {isParticipant && (
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent group-hover:via-cyan-300" />
                      )}

                      <div className="p-8 flex flex-col md:flex-row items-center gap-8">
                        {/* Players */}
                        <div className="flex-1 flex items-center justify-center gap-8 w-full">
                          {/* P1 */}
                          <div className="flex-1 flex flex-col items-end text-right">
                            <UserAvatar userId={match.p1.id} username={match.p1.name} size="lg" className="mb-2" />
                            <h3 className={`text-2xl font-black ${match.p1.id === currentUser?.id ? 'text-cyan-400' : 'text-white'}`}>{match.p1.name}</h3>
                            <p className="text-xs font-mono text-gray-500 mt-1">ID: {match.p1.id}</p>
                          </div>

                          {/* VS */}
                          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 font-black text-white/20 text-sm italic">
                            VS
                          </div>

                          {/* P2 */}
                          <div className="flex-1 flex flex-col items-start text-left">
                            <UserAvatar userId={match.p2.id} username={match.p2.name} size="lg" className="mb-2" />
                            <h3 className={`text-2xl font-black ${match.p2.id === currentUser?.id ? 'text-cyan-400' : 'text-white'}`}>{match.p2.name}</h3>
                            <p className="text-xs font-mono text-gray-500 mt-1">ID: {match.p2.id}</p>
                          </div>
                        </div>

                        {/* Action */}
                        <div className="w-full md:w-auto shrink-0 flex justify-center">
                          {isParticipant ? (
                            <button
                              onClick={() => handleStartGame(match)}
                              className="btn-hero btn-lg group/btn overflow-hidden relative"
                            >
                              <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-300" />
                              <span className="icon-[solar--gamepad-bold] mr-2 text-xl" />
                              Start Match
                            </button>
                          ) : (
                            <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-medium flex items-center gap-2">
                              <span className="icon-[solar--lock-keyhole-bold-duotone] opacity-50" />
                              Awaiting Result
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : tournament.state === "finished" ? (
            // Finished State
            <div className="panel-surface relative overflow-hidden rounded-3xl p-12 md:p-20 text-center group">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent opacity-50" />
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-400 to-transparent" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-8 relative">
                  <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse" />
                  <UserAvatar
                    userId={tournament.winnerId}
                    username={tournament.winnerName}
                    size="3xl"
                    className="border-4 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                  />
                </div>

                <p className="text-xs font-bold tracking-[0.4em] uppercase text-purple-400/70 mb-4">Tournament Champion</p>
                <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-2">
                  {tournament.winnerName ?? "Unknown"}
                </h2>
                <p className="text-xl text-gray-400 mb-10">Victory Achieved</p>

                <button
                  onClick={() => navigate("/")}
                  className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all flex items-center gap-3 font-bold text-lg"
                >
                  <span className="icon-[solar--home-2-bold-duotone]" />
                  Return to Home Base
                </button>
              </div>
            </div>
          ) : (
            // No Pending Matches - Advance Round State
            <div className="panel-surface rounded-3xl p-12 text-center border border-white/5 bg-white/[0.02]">
              <div className="w-20 h-20 mx-auto bg-gray-800/50 rounded-full flex items-center justify-center mb-6 border border-white/5">
                <span className="icon-[solar--checklist-minimalistic-bold-duotone] text-4xl text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">All Matches Complete</h2>
              <p className="text-gray-400 max-w-sm mx-auto mb-8">All active battles in this bracket have concluded.</p>

              {canAdvanceRound && (
                <div className="flex flex-col items-center gap-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
                  <p className="text-sm font-mono text-emerald-400/70 uppercase tracking-widest">Next Stage Ready</p>
                  <button
                    onClick={handleAdvanceRound}
                    className="group relative px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xl rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95"
                  >
                    <div className="flex items-center gap-3">
                      <span className="icon-[solar--double-alt-arrow-right-bold-duotone] text-2xl group-hover:translate-x-1 transition-transform" />
                      ADVANCE ROUND
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}