import { useState } from "Reactor";
import { navigate } from "Reactor";
import { GameType, Difficulty } from "@/core/engine/match_config";

/**
 * This screen exists to prepare and commit a match.
 * It is not a selector. It is not a settings page. It is not a dashboard.
 * It is a commit gate.
 */
export default function PreMatchScene() {
  const [activeMode, setActiveMode] = useState<GameType>("AI");
  const [declarations, setDeclarations] = useState<{
    p1: string;
    p2: string;
    p3: string;
    p4: string;
    difficulty: Difficulty;
  }>({
    p1: "Player 1",
    p2: "Player 2",
    p3: "Player 3",
    p4: "Player 4",
    difficulty: "medium",
  });

  const commitMatch = () => {
    // Declarations -> Conditions
    if (activeMode === "AI") {
      navigate("/game/pong", { state: { mode: "ai", p1: declarations.p1, difficulty: declarations.difficulty } });
    } else if (activeMode === "2P") {
      navigate("/game/pong", { state: { mode: "2p", p1: declarations.p1, p2: declarations.p2 } });
    } else if (activeMode === "4P") {
      navigate("/game/4p_pong", { state: { mode: "4p", p1: declarations.p1, p2: declarations.p2, p3: declarations.p3, p4: declarations.p4 } });
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-var(--header-height))] w-full overflow-hidden flex flex-col justify-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full hero-orb hero-orb--accent" />
        <div className="absolute -bottom-20 right-[-10%] h-80 w-80 rounded-full hero-orb hero-orb--accent-soft" />
        <div className="absolute inset-y-0 left-0 w-[55%] hero-sheen" />
        <div className="absolute inset-y-0 left-0 w-[50%] hero-blood" />
        <div className="absolute inset-0 fx-veil" />
        <div className="absolute inset-0 fx-noise" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-12 lg:py-16">
        <div className="grid items-center gap-10 lg:gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Primary Zone (Left): Narrative + Identity */}
          <div className="relative lg:-mt-6">
            <div className="absolute -left-8 top-8 hidden h-[70%] w-px hero-line lg:block" />
            <div className="absolute -left-16 top-12 hidden h-16 w-16 rounded-full border border-border-strong hero-node lg:block" />

            <div className="relative rounded-[28px] p-6 sm:p-8 panel-surface">

              <div className="relative">
                {/* Configuration Phase */}
                <div className="space-y-6">
                  {/* Intent Switcher */}
                  <div className="flex gap-4 text-xs tracking-widest uppercase text-slate-500">
                    {["AI", "2P", "4P"].map((m) => (
                      <button
                        key={m}
                        onClick={() => setActiveMode(m as GameType)}
                        className={`transition-all duration-300 ${activeMode === m ? "text-accent font-bold scale-105" : "hover:text-slate-300"}`}
                      >
                        {m} Intent
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    <div
                      className="logo-mark logo-mark--ominous relative h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center overflow-hidden"
                      aria-hidden="true"
                    >
                      <span className="logo-orb" />
                      <span className="logo-scratch" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                        Active Intent
                      </p>
                      <p className="text-sm font-semibold text-accent-soft">
                        {activeMode === "AI" && "Solo Trial"}
                        {activeMode === "2P" && "Duel Protocol"}
                        {activeMode === "4P" && "Squad Chaos"}
                      </p>
                    </div>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.02] text-primary">
                    {activeMode === "AI" && "Survive the Machine"}
                    {activeMode === "2P" && "Face Your Rival"}
                    {activeMode === "4P" && "Team Warfare"}
                  </h1>

                  <div className="h-px w-24 hero-divider" />

                  {/* Participant Slots & Declarations */}
                  <div className="space-y-4 max-w-lg min-h-[120px]">
                    {activeMode === "AI" && (
                      <>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Participant Slot</label>
                          <input
                            value={declarations.p1}
                            onChange={(e) => setDeclarations({ ...declarations, p1: e.target.value })}
                            className="bg-black/30 border border-border-soft rounded px-3 py-2 text-primary focus:border-accent outline-none transition-all focus:bg-accent/5"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Threat Level</label>
                          <select
                            value={declarations.difficulty}
                            onChange={(e) => setDeclarations({ ...declarations, difficulty: e.target.value as Difficulty })}
                            className="bg-black/30 border border-border-soft rounded px-3 py-2 text-primary focus:border-accent outline-none appearance-none transition-all focus:bg-accent/5"
                          >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                        </div>
                      </>
                    )}

                    {activeMode === "2P" && (
                      <>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Participant Slot 1</label>
                          <input
                            value={declarations.p1}
                            onChange={(e) => setDeclarations({ ...declarations, p1: e.target.value })}
                            className="bg-black/30 border border-border-soft rounded px-3 py-2 text-primary focus:border-accent outline-none transition-all focus:bg-accent/5"
                          />
                        </div>
                        <div className="flex items-center justify-center text-xs text-accent-soft uppercase tracking-widest my-2">- VS -</div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Participant Slot 2</label>
                          <input
                            value={declarations.p2}
                            onChange={(e) => setDeclarations({ ...declarations, p2: e.target.value })}
                            className="bg-black/30 border border-border-soft rounded px-3 py-2 text-primary focus:border-accent outline-none transition-all focus:bg-accent/5"
                          />
                        </div>
                      </>
                    )}

                    {activeMode === "4P" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-[10px] uppercase tracking-widest text-accent">Team Alpha</div>
                          <input
                            value={declarations.p1}
                            onChange={(e) => setDeclarations({ ...declarations, p1: e.target.value })}
                            className="w-full bg-black/30 border border-border-soft rounded px-3 py-2 text-primary outline-none transition-all focus:bg-accent/5"
                            placeholder="Slot 1"
                          />
                          <input
                            value={declarations.p2}
                            onChange={(e) => setDeclarations({ ...declarations, p2: e.target.value })}
                            className="w-full bg-black/30 border border-border-soft rounded px-3 py-2 text-primary outline-none transition-all focus:bg-accent/5"
                            placeholder="Slot 2"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="text-[10px] uppercase tracking-widest text-red-400">Team Omega</div>
                          <input
                            value={declarations.p3}
                            onChange={(e) => setDeclarations({ ...declarations, p3: e.target.value })}
                            className="w-full bg-black/30 border border-border-soft rounded px-3 py-2 text-primary outline-none transition-all focus:bg-accent/5"
                            placeholder="Slot 3"
                          />
                          <input
                            value={declarations.p4}
                            onChange={(e) => setDeclarations({ ...declarations, p4: e.target.value })}
                            className="w-full bg-black/30 border border-border-soft rounded px-3 py-2 text-primary outline-none transition-all focus:bg-accent/5"
                            placeholder="Slot 4"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Commit Phase */}
                <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/5 mt-6">
                  <button
                    onClick={commitMatch}
                    className="bleed-btn bleed-btn--hero rounded-lg bg-accent text-primary text-base font-semibold px-6 py-3 transition hover:bg-accent-soft flex items-center gap-2 cursor-pointer w-full sm:w-auto justification-center"
                  >
                    <span
                      className="icon-[mdi--sword-cross] text-lg"
                      aria-hidden="true"
                    />
                    <span>Commit Protocol</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Zone (Right): Live Context / Arena State */}
          <div className="relative w-full max-w-[440px] lg:justify-self-end lg:mt-10">
            <div className="absolute -inset-6 rounded-[32px] panel-halo" />
            <div className="relative rounded-[32px] p-5 sm:p-6 panel-surface panel-surface--heavy">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Arena feed
                  </p>
                  <p className="text-lg font-semibold text-primary">
                    Mina Core Relay
                  </p>
                </div>
                <div className="glass-pill flex items-center gap-2 sm:gap-3 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs">
                  <span
                    className="icon-[mdi--pulse] text-accent text-lg"
                    aria-hidden="true"
                  />
                  <span className="text-xs uppercase tracking-[0.3em] text-slate-300">
                    Signal
                  </span>
                  <span className="text-sm text-primary">Steady</span>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl border border-border-soft bg-black/30 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Arena
                    </span>
                    <span className="text-sm text-accent">
                      Bloodmoon Chapel
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-slate-300">Rally streak</span>
                    <span className="text-base font-semibold text-primary">14</span>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                    <div className="h-2 w-[68%] rounded-full bg-accent" />
                  </div>
                </div>

                <div className="rounded-2xl border border-border-soft bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        Echo feed
                      </p>
                      <p className="text-base font-semibold text-primary">
                        Spectator wardens
                      </p>
                    </div>
                    <span
                      className="icon-[mdi--radio-tower] text-2xl text-accent-soft"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border-soft bg-black/30 p-3">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                        Latency
                      </p>
                      <p className="text-base font-semibold text-primary">12ms</p>
                    </div>
                    <div className="rounded-xl border border-border-soft bg-black/30 p-3">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                        Threat
                      </p>
                      <p className="text-base font-semibold text-accent">
                        Omen 08
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="avatar-shell relative w-9 h-9 sm:w-10 sm:h-10 rounded-full cursor-pointer transition flex items-center justify-center">
                    <span
                      className="icon-[mdi--ghost] text-accent text-lg"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Operator
                    </p>
                    <p className="text-sm font-semibold text-primary">Mina</p>
                  </div>
                </div>
                <a href="/tournament/start" className="bleed-btn rounded-lg bg-accent text-primary text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-3.5 sm:py-2 transition hover:bg-accent-soft">
                  Join queue
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
