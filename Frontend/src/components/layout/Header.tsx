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
    <header className="relative min-h-[68px] sm:min-h-[78px] px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 sm:gap-4 shadow-lg backdrop-blur bg-gradient-to-r from-[var(--color-start)] via-[var(--color-mid)] to-[var(--color-end)] border-b border-border-soft overflow-hidden">
      <div className="absolute inset-0 pointer-events-none veil" />
      <div className="absolute inset-0 pointer-events-none noise" />

      <div className="flex items-center gap-4 z-10">
        <div className="flex items-center gap-3">
          <div className="logo-mark logo-mark--ominous" aria-hidden="true">
            <span className="logo-orb" />
            <span className="logo-scratch" />
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
          <div key={card.title} className="glass-pill">
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
        <button className="primary-btn compact-cta bleed-btn flex items-center gap-2">
          <span
            className="icon-[mdi--sword-cross] text-base sm:text-lg"
            aria-hidden="true"
          />
          <span>Enter Arena</span>
        </button>
        <div className="avatar-shell blood-ring flex items-center justify-center">
          <span
            className="icon-[mdi--moon-waning-crescent] text-accent text-base sm:text-lg"
            aria-hidden="true"
          />
        </div>
      </div>
    </header>
  );
}
