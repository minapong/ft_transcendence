export default function Header() {
  const statusCards = [
    {
      icon: "mdi--ghost",
      tone: "text-accent",
      title: "Vigil",
      detail: "Mina online",
    },
    {
      icon: "mdi--pulse",
      tone: "text-accent-soft",
      title: "Signal",
      detail: "Heartbeat steady",
    },
  ];

  return (
    <header className="sticky top-0 z-50 relative min-h-[var(--header-height)] px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 sm:gap-4 shadow-lg backdrop-blur bg-gradient-to-r from-[var(--color-start)] via-[var(--color-mid)] to-[var(--color-end)] border-b border-border-soft overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(120deg,color-mix(in_srgb,var(--color-accent)_18%,transparent)_0%,transparent_30%,color-mix(in_srgb,var(--color-accent-soft)_20%,transparent)_60%,transparent_100%)] blur-[24px] opacity-[0.55]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.04)_0,transparent_35%),radial-gradient(circle_at_80%_10%,rgba(0,0,0,0.3)_0,transparent_40%),repeating-linear-gradient(0deg,rgba(255,255,255,0.04),rgba(255,255,255,0.04)_1px,transparent_1px,transparent_2px)] mix-blend-soft-light opacity-50" />

      <div className="flex items-center gap-4 z-10">
        <div className="flex items-center gap-3">
          <div
            className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-xl border border-border-strong flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_30%_30%,color-mix(in_srgb,var(--color-accent)_40%,transparent),transparent_55%),conic-gradient(from_160deg,color-mix(in_srgb,#ff1f4b_25%,transparent),color-mix(in_srgb,var(--color-mid)_70%,transparent)_60%,color-mix(in_srgb,var(--color-start)_55%,transparent))] shadow-[0_10px_25px_color-mix(in_srgb,var(--color-accent)_18%,transparent),inset_0_0_12px_color-mix(in_srgb,var(--color-accent-soft)_35%,transparent)] after:content-[''] after:absolute after:-inset-2.5 after:rounded-[inherit] after:bg-[radial-gradient(circle_at_70%_20%,color-mix(in_srgb,var(--color-accent-soft)_40%,transparent),transparent_40%)] after:blur-[18px] after:opacity-[0.65]"
            aria-hidden="true"
          >
            <span className="absolute inset-[28%] rounded-full bg-[radial-gradient(circle_at_30%_30%,var(--color-accent),color-mix(in_srgb,var(--color-accent-soft)_45%,transparent))] shadow-[0_0_16px_color-mix(in_srgb,var(--color-accent)_55%,transparent)]" />
            <span className="absolute w-[90%] h-[2px] bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,#ff1f4b_55%,transparent),transparent)] rotate-[-12deg] opacity-90 drop-shadow-[0_0_8px_rgba(255,31,75,0.4)]" />
          </div>
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold tracking-[0.06em] text-primary">
                MINA&nbsp;PONG
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-semibold text-accent-soft">
                Arena Command Hub
              </span>
              <span
                className="icon-[mdi--sparkles] text-accent-soft text-base sm:text-lg"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 z-10 flex-wrap justify-end">
        {statusCards.map((card) => (
          <div
            key={card.title}
            className="flex items-center gap-2 sm:gap-3 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg border border-border-soft backdrop-blur-sm bg-white/5 shadow-[0_12px_25px_rgba(0,0,0,0.28),inset_0_0_10px_color-mix(in_srgb,var(--color-accent)_25%,transparent)]"
          >
            <span
              className={`icon-[${card.icon}] ${card.tone} text-xl`}
              aria-hidden="true"
            />
            <div className="leading-none">
              <span className="text-xs uppercase tracking-[0.25em] text-slate-300">
                {card.title}
              </span>
              <span className="text-sm text-primary block">{card.detail}</span>
            </div>
          </div>
        ))}
        <button className="relative isolate overflow-hidden rounded-lg bg-accent text-primary text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-3.5 sm:py-2 border border-border-strong shadow-[0_0_14px_color-mix(in_srgb,var(--color-accent)_25%,transparent)] transition hover:bg-accent-soft after:content-[''] after:absolute after:inset-[-40%] after:bg-[radial-gradient(circle_at_20%_20%,rgba(255,31,75,0.15),transparent_45%),radial-gradient(circle_at_80%_40%,color-mix(in_srgb,var(--color-accent)_25%,transparent),transparent_45%)] after:rotate-[8deg] after:opacity-75 after:-z-10 flex items-center gap-2">
          <span
            className="icon-[mdi--sword-cross] text-base sm:text-lg"
            aria-hidden="true"
          />
          <span>Enter Arena</span>
        </button>
        <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full cursor-pointer transition bg-white/10 border border-border-soft shadow-[inset_0_0_8px_rgba(255,255,255,0.15),0_0_10px_color-mix(in_srgb,#ff1f4b_22%,transparent)] after:content-[''] after:absolute after:-inset-[3px] after:rounded-full after:border after:border-[color-mix(in_srgb,#ff1f4b_30%,transparent)] after:opacity-80 after:pointer-events-none flex items-center justify-center">
          <span
            className="icon-[mdi--moon-waning-crescent] text-accent text-base sm:text-lg"
            aria-hidden="true"
          />
        </div>
      </div>
    </header>
  );
}
