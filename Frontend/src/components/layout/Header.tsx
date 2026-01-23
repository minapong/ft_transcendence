import { navigate, useState, useEffect, useRef } from "@/Reactor";
import { getAuth, logout } from "../../lib/auth";
import { animate } from "motion";

export default function Header({ screen }: { screen: "mobile" | "tablet" | "desktop" }) {
  // Mobile & Tablet: Button is fixed top-left, so we need left padding
  // Desktop: Button is in the sidebar (below header), so standard padding
  const headerPadding = screen !== "desktop" ? "pl-14 pr-4 sm:pl-16 sm:pr-6" : "px-6";
  const [user, setUser] = useState<any>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const auth = getAuth();
    if (auth && auth.user) {
      setUser(auth.user);
    }
  }, []);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    };
    if (panelOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [panelOpen]);

  // Panel entrance animation
  useEffect(() => {
    if (!panelContentRef.current) return;
    if (panelOpen) {
      animate(
        panelContentRef.current,
        { opacity: [0, 1], y: [-4, 0] },
        { duration: 0.16, ease: [0.2, 0.8, 0.2, 1] }
      );
    }
  }, [panelOpen]);

  const handleLogout = () => {
    logout();
    setUser(null);
    setPanelOpen(false);
    navigate("/login");
  };

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
    <header className={`sticky top-0 z-50 relative min-h-[var(--header-height)] ${headerPadding} flex flex-wrap items-center justify-between gap-3 sm:gap-4 header-surface`}>

      <div className="flex items-center gap-4 z-10">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/")}
          role="button"
          tabIndex={0}
        >
          <div
            className="logo-mark logo-mark--ominous relative h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 duration-300"
            aria-hidden="true"
          >
            <span className="logo-orb" />
            <span className="logo-scratch" />
          </div>
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold tracking-[0.06em] text-primary transition-colors group-hover:text-accent">
                MINA&nbsp;PONG    
              </span>
            </div>
            <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
              <span className="text-sm sm:text-base font-medium text-accent-soft">
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

        {!user ? (
          <button
            onClick={() => navigate("/login")}
            className="bleed-btn rounded-lg bg-accent text-primary text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-3.5 sm:py-2 transition hover:bg-accent-soft flex items-center gap-2"
          >
            <span className="icon-[mdi--login] text-base sm:text-lg" aria-hidden="true" />
            <span>Login / Signup</span>
          </button>
        ) : (
          <div ref={panelRef} className="relative">
            {/* Operator Pill Trigger */}
            <div
              onClick={() => setPanelOpen(v => !v)}
              className="avatar-shell relative flex items-center gap-3 cursor-pointer group bg-black/20 hover:bg-black/40 pl-2 pr-3 py-1.5 rounded-full transition border border-white/5"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--color-surface-strong)] flex items-center justify-center overflow-hidden border border-[var(--color-border-strong)]">
                <span className="icon-[mdi--account] text-[var(--color-accent-soft)] text-lg" aria-hidden="true" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[10px] text-[var(--color-primary)] opacity-50 font-medium uppercase tracking-[0.2em]">Operator</span>
                <span className="text-sm font-semibold text-[var(--color-primary)] group-hover:text-white transition">{user.username}</span>
              </div>
              <span className={`icon-[mdi--chevron-down] text-base text-[var(--color-primary)] opacity-40 transition-transform duration-150 ${panelOpen ? "rotate-180" : ""}`} />
            </div>

            {/* Operator Panel */}
            {panelOpen && (
              <div
                ref={panelContentRef}
                className="absolute right-0 top-full mt-2 w-52 rounded-lg bg-[var(--color-panel)] border border-[var(--color-panel-border)] shadow-md shadow-black/30 overflow-hidden z-[100]"
              >
                {/* Identity Section */}
                <div className="px-4 py-3 border-b border-[var(--color-border-soft)]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[var(--color-surface)] flex items-center justify-center">
                      <span className="icon-[mdi--account] text-[var(--color-primary)] opacity-40 text-lg" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-primary)]">{user.username}</p>
                      <p className="text-[9px] text-[var(--color-primary)] opacity-25 uppercase tracking-[0.12em]">Operator</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="py-1">
                  <button
                    onClick={() => { setPanelOpen(false); navigate("/me"); }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-left text-sm text-[var(--color-primary)] opacity-80 hover:opacity-100 hover:bg-[var(--color-surface)] transition"
                  >
                    <span className="icon-[mdi--badge-account-outline] text-base opacity-50" />
                    Operator File
                  </button>
                  <button
                    onClick={() => { setPanelOpen(false); navigate("/settings"); }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-left text-sm text-[var(--color-primary)] opacity-80 hover:opacity-100 hover:bg-[var(--color-surface)] transition"
                  >
                    <span className="icon-[mdi--tune-variant] text-base opacity-50" />
                    System Prefs
                  </button>
                </div>

                {/* Terminate Session */}
                <div className="mt-1 pt-1 border-t border-[var(--color-border-soft)]">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-left text-sm text-[var(--color-primary)] opacity-40 hover:opacity-100 hover:text-[var(--sidebar-active-hot)] transition"
                  >
                    <span className="icon-[mdi--power-standby] text-base" />
                    Terminate Session
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
