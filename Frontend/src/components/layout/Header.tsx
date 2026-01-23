import { useLayoutState } from "../../hooks/useLayoutState";

export default function Header({ screen }: { screen: "mobile" | "tablet" | "desktop" }) {
  // Mobile & Tablet: Button is fixed top-left, so we need left padding
  // Desktop: Button is in the sidebar (below header), so standard padding
  const headerPadding = screen !== "desktop" ? "pl-14 pr-4 sm:pl-16 sm:pr-6" : "px-6";

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
    <header className={`sticky top-0 z-50 relative min-h-[var(--header-height)] ${headerPadding} flex flex-wrap items-center justify-between gap-3 sm:gap-4 overflow-hidden header-surface`}>

      <div className="flex items-center gap-4 z-10">
        <div className="flex items-center gap-3">
          <div
            className="logo-mark logo-mark--ominous relative h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center overflow-hidden"
            aria-hidden="true"
          >
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
          <div
            key={card.title}
            className="glass-pill flex items-center gap-2 sm:gap-3 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg"
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
        <button className="bleed-btn rounded-lg bg-accent text-primary text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-3.5 sm:py-2 transition hover:bg-accent-soft flex items-center gap-2">
          <span
            className="icon-[mdi--sword-cross] text-base sm:text-lg"
            aria-hidden="true"
          />
          <span>Enter Arena</span>
        </button>
        <div className="avatar-shell relative w-9 h-9 sm:w-10 sm:h-10 rounded-full cursor-pointer transition flex items-center justify-center">
          <span
            className="icon-[mdi--moon-waning-crescent] text-accent text-base sm:text-lg"
            aria-hidden="true"
          />
        </div>
      </div>
    </header>
  );
}
