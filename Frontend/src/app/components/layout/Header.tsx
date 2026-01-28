import { navigate, useState, useEffect, useRef } from "Reactor";
import { logout } from "@/core/lib/auth";
import { useAuth } from "@/core/lib/useAuth";
import { animate } from "motion";

export default function Header({ onMenuToggle, showMenuButton }) {
  // Mobile & Tablet: Fixed top-left button needs padding
  // Desktop: Sidebar handles it
  const auth = useAuth();

  const user = auth?.user || null;
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelContentRef = useRef<HTMLDivElement>(null);

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
    setPanelOpen(false);
    navigate("/auth/login");
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
    <header className={`sticky top-0 z-50 relative min-h-[var(--header-height)] pl-14 pr-4 sm:pl-16 sm:pr-6 lg:px-6 flex flex-wrap items-center justify-between gap-3 sm:gap-4 header-surface`}>

      <div className="flex items-center gap-4 z-10">
        {showMenuButton && (
          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-md bg-[var(--color-surface)] text-xl mr-2"
            aria-label="Open sidebar menu"
            onClick={() => {
              console.log("[Header] Menu toggle: overlay open");
              onMenuToggle();
            }}
          >
            <span className="icon-[solar--sidebar-minimalistic-bold-duotone]" />
          </button>
        )}
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
            onClick={() => navigate("/auth/login", { triggerLayout: true })}
            className="bleed-btn rounded-lg bg-accent text-primary text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-3.5 sm:py-2 transition hover:bg-accent-soft flex items-center gap-2"
          >
            <span className="icon-[mdi--login] text-base sm:text-lg" aria-hidden="true" />
            <span>Login / Signup</span>
          </button>
        ) : (
          <div ref={panelRef} className="relative">
            {/* Operator Trigger */}
            <button
              onClick={() => setPanelOpen(v => !v)}
              className="flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1.5 transition-colors duration-120 hover:bg-[var(--color-surface-strong)]"
            >
              <div className="w-7 h-7 rounded-md bg-[var(--color-surface)] flex items-center justify-center">
                <span className="icon-[mdi--account] text-[var(--color-primary)] opacity-60 text-base" aria-hidden="true" />
              </div>
              <span className="text-sm text-[var(--color-primary)] opacity-85">{user.username}</span>
              <span className={`icon-[mdi--chevron-down] text-sm text-[var(--color-primary)] opacity-30 transition-transform duration-150 ${panelOpen ? "rotate-180" : ""}`} />
            </button>

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
                    onClick={() => { setPanelOpen(false); navigate("/user/me"); }}
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
