export default function Home() {
  return (
    <section className="relative min-h-[calc(100vh-var(--header-height))] w-full overflow-hidden">
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
          <div className="relative lg:-mt-6">
            <div className="absolute -left-8 top-8 hidden h-[70%] w-px hero-line lg:block" />
            <div className="absolute -left-16 top-12 hidden h-16 w-16 rounded-full border border-border-strong hero-node lg:block" />

            <div className="relative rounded-[28px] p-6 sm:p-8 panel-surface">
              <div className="absolute inset-0 rounded-[28px] panel-sheen" />
              <div className="absolute -top-3 right-12 h-1 w-32 rotate-[-8deg] panel-streak" />

              <div className="relative space-y-6">
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

                <div className="h-px w-24 hero-divider" />

                <p className="text-base sm:text-lg text-slate-300 max-w-xl">
                  Step into Mina's court, where every volley echoes through a
                  spectral arena. Claim the root console, tune your paddle, and
                  survive the bloodmoon cycles.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="/game/single_game"
                    className="bleed-btn bleed-btn--hero rounded-lg bg-accent text-primary text-base font-semibold px-6 py-3 transition hover:bg-accent-soft flex items-center gap-2"
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
                  <div className="glass-pill flex items-center gap-2 sm:gap-3 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs opacity-80">
                    <span className="live-dot inline-block rounded-full w-[7px] h-[7px]" />
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