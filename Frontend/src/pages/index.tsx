export default function Home() {
  return (
    <section className="relative min-h-[calc(100vh-var(--header-height))] w-full overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-20 right-[-10%] h-80 w-80 rounded-full bg-accent-soft/20 blur-3xl" />
        <div className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-white/5 via-transparent to-transparent opacity-70" />
        <div className="absolute inset-y-0 left-0 w-[50%] bg-[radial-gradient(circle_at_20%_20%,rgba(255,31,75,0.2),transparent_55%)] opacity-70" />
        <div className="absolute inset-0 veil" />
        <div className="absolute inset-0 noise" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-12 lg:py-16">
        <div className="grid items-center gap-10 lg:gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative lg:-mt-6">
            <div className="absolute -left-8 top-8 hidden h-[70%] w-px bg-gradient-to-b from-accent via-accent-soft to-transparent lg:block" />
            <div className="absolute -left-16 top-12 hidden h-16 w-16 rounded-full border border-border-strong bg-black/30 blur-[1px] lg:block" />

            <div className="relative rounded-[28px] border border-border-soft bg-white/5 p-6 sm:p-8 backdrop-blur-sm shadow-[0_16px_45px_rgba(0,0,0,0.35)]">
              <div className="absolute inset-0 rounded-[28px] bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_55%)] opacity-60" />
              <div className="absolute -top-3 right-12 h-1 w-32 rotate-[-8deg] bg-gradient-to-r from-transparent via-[#ff1f4b] to-transparent opacity-70" />

              <div className="relative space-y-6">
                <div className="flex items-center gap-4">
                  <div className="logo-mark logo-mark--ominous" aria-hidden="true">
                    <span className="logo-orb" />
                    <span className="logo-scratch" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                      Root access
                    </p>
                    <p className="text-sm font-semibold text-accent-soft">
                      Mina Pong Horror
                    </p>
                  </div>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.02] text-primary">
                  Mina Pong Horror
                  <span className="block text-accent">
                    The haunted rally begins now
                  </span>
                </h1>

                <div className="h-px w-24 bg-gradient-to-r from-accent via-accent-soft to-transparent" />

                <p className="text-base sm:text-lg text-slate-300 max-w-xl">
                  Step into Mina's court, where every volley echoes through a
                  spectral arena. Claim the root console, tune your paddle, and
                  survive the bloodmoon cycles.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="/single_game"
                    className="primary-btn bleed-btn flex items-center gap-2 px-6 py-3 text-base shadow-[0_0_24px_rgba(34,211,238,0.35)]"
                  >
                    <span
                      className="icon-[mdi--sword-cross] text-lg"
                      aria-hidden="true"
                    />
                    <span>Enter arena</span>
                  </a>
                  <button className="flex items-center gap-2 rounded-lg border border-border-soft bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 transition hover:bg-white/10">
                    <span
                      className="icon-[mdi--play-circle] text-lg text-accent"
                      aria-hidden="true"
                    />
                    <span>Watch trailer</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="glass-pill text-xs opacity-80">
                    <span className="live-dot" />
                    <span className="text-xs uppercase tracking-[0.3em] text-slate-300">
                      Live
                    </span>
                    <span className="text-sm text-primary">Spectral queue</span>
                  </div>
                  <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Bloodmoon cycle active
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-border-soft bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-accent-soft text-sm">
                      <span className="icon-[mdi--swords] text-lg" aria-hidden="true" />
                      <span className="uppercase tracking-[0.25em]">Mode</span>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-primary">
                      2v2 Bloodmoon
                    </p>
                    <p className="text-xs text-slate-400">Rotating hazard lanes</p>
                  </div>

                  <div className="rounded-2xl border border-border-soft bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-accent-soft text-sm">
                      <span className="icon-[mdi--eye-outline] text-lg" aria-hidden="true" />
                      <span className="uppercase tracking-[0.25em]">Witnesses</span>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-primary">4.2k</p>
                    <p className="text-xs text-slate-400">Spectators online</p>
                  </div>

                  <div className="rounded-2xl border border-border-soft bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-accent-soft text-sm">
                      <span className="icon-[mdi--shield-sun] text-lg" aria-hidden="true" />
                      <span className="uppercase tracking-[0.25em]">Relics</span>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-primary">
                      Omen Gear
                    </p>
                    <p className="text-xs text-slate-400">Unlockable effects</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative w-full max-w-[440px] lg:justify-self-end lg:mt-10">
            <div className="absolute -inset-6 rounded-[32px] border border-border-soft bg-white/10 opacity-35 blur-xl" />
            <div className="relative rounded-[32px] border border-border-soft bg-white/5 p-5 sm:p-6 backdrop-blur-xl shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Arena feed
                  </p>
                  <p className="text-lg font-semibold text-primary">
                    Mina Core Relay
                  </p>
                </div>
                <div className="glass-pill text-xs">
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
                  <div className="avatar-shell blood-ring flex items-center justify-center">
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
                <a href="/tournament/start" className="primary-btn compact-cta">
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
