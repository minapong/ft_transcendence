import { navigate, useEffect, useState } from "Reactor";
import { useScreen } from "@/app/hooks/useScreen";
import { logout } from "@/core/lib/auth";
import { useAuth } from "@/core/lib/useAuth";
import { apiFetch } from "@/core/lib/api";

// PanelButton extracted for clarity and reusability
function PanelButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full px-3 py-2 flex items-center gap-3 text-left text-sm text-[var(--color-primary)]/70 hover:text-[var(--color-primary)] hover:bg-white/5 rounded-md transition-all duration-150 group"
    >
      <span className={`${icon} text-lg opacity-40 group-hover:opacity-100 transition-opacity`} />
      <span className="font-medium">{label}</span>
    </button>
  );
}


export default function Header({ onMenuToggle, isSpecialPage }) {
  const screen = useScreen();
  const auth = useAuth();
  const user = auth?.user || null;
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    if (!user) {
      setAvatarUrl(null);
      return;
    }

    // Fetch latest profile to get avatar
    const loadProfile = async () => {
      try {
        const res = await apiFetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          if (data.avatarUrl) {
            setAvatarUrl(data.avatarUrl);
          }
        }
      } catch (e) {
        console.warn("Failed to load header avatar", e);
      }
    };

    loadProfile();

    const handleAvatarUpdate = () => loadProfile();
    window.addEventListener("user:avatar-update", handleAvatarUpdate);
    return () => window.removeEventListener("user:avatar-update", handleAvatarUpdate);
  }, [user]);

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
    <header
      className={`
    flex-shrink-0
    min-h-[var(--header-height)]
    px-[clamp(1rem,3vw,1.5rem)]
    flex flex-nowrap items-center justify-between
    gap-[clamp(0.5rem,2vw,1rem)]
    header-surface
    relative z-[100]
  `}
    >

      <div className="flex items-center gap-[clamp(0.4rem,2vw,0.75rem)] z-10 flex-shrink-0 flex-nowrap">
        <button
          className="flex items-center justify-center w-10 h-10 rounded-md bg-[var(--color-surface)] text-xl flex-shrink-0 transition-colors hover:bg-[var(--color-surface-strong)]"
          aria-label={isSpecialPage ? "Go Home" : "Open sidebar menu"}
          onClick={() => {
            if (isSpecialPage) {
              navigate("/");
            } else {
              // 

              onMenuToggle();
            }
          }}
        >
          <span className={isSpecialPage ? "icon-[solar--home-smile-bold-duotone]" : "icon-[solar--sidebar-minimalistic-bold-duotone]"} />
        </button>

        <div
          className="flex items-center gap-[clamp(0.4rem,1.5vw,0.75rem)] cursor-pointer group flex-shrink-0"
          onClick={() => navigate("/")}
          role="button"
          tabIndex={0}
        >
          <div
            className="logo-mark logo-mark--ominous relative h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center overflow-hidden transition-transform duration-300 flex-shrink-0"
            aria-hidden="true"
          >
            <span className="logo-orb" />
            <span className="logo-scratch" />
          </div>
          <div className="flex flex-col leading-tight whitespace-nowrap">
            <div className="flex items-center gap-2">
              <span className="text-[clamp(1rem,4vw,1.5rem)] font-bold tracking-[0.06em] text-primary transition-colors group-hover:text-accent">
                MINA&nbsp;GAMES
              </span>
            </div>
            <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
              <span className="text-[clamp(0.7rem,2.5vw,1rem)] font-medium text-accent-soft hidden sm:inline">
                Arena Command Hub
              </span>
              <span
                className="icon-[mdi--sparkles] text-accent-soft text-base sm:text-lg hidden sm:inline"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-3 sm:gap-4 flex-shrink-0">
        {statusCards.map((card) => {
          return (
            <div key={card.title} className="glass-pill flex items-center gap-2 sm:gap-3 px-2.5 py-1.5 sm:px-3 sm:py-2 whitespace-nowrap">
              <span className={`icon-[${card.icon}] ${card.tone} text-xl`} />
              <div className="leading-none">
                <span className="text-xs uppercase tracking-[0.25em] text-slate-300">
                  {card.title}
                </span>
                <span className="text-sm text-primary block">{card.detail}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-[clamp(0.5rem,2vw,1rem)] flex-shrink-0 flex-nowrap">
        {!user ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/auth/login")}
              className="rounded-lg border border-white/10 bg-white/5 text-[clamp(0.75rem,1.8vw,0.875rem)] font-medium text-primary/80 hover:text-primary hover:bg-white/12 hover:border-white/25 hover:shadow-lg hover:shadow-white/5 transition-all px-[clamp(0.8rem,2.5vw,1.1rem)] py-[0.625rem] sm:py-[0.875rem] whitespace-nowrap"
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/auth/signup")}
              className="fx-energy energy-medium hover:energy-high rounded-lg bg-accent text-black text-[clamp(0.75rem,1.8vw,0.875rem)] font-bold px-[clamp(0.8rem,2.5vw,1.1rem)] py-[0.625rem] sm:py-[0.875rem] transition-all hover:scale-[1.02] active:scale-98 whitespace-nowrap"
            >
              Signup
            </button>
          </div>
        ) : (
          <details className="relative group">
            <summary
              className="flex items-center gap-[clamp(0.25rem,1vw,0.5rem)] cursor-pointer rounded-lg px-2 py-1.5 transition-colors duration-120 hover:bg-[var(--color-surface-strong)] whitespace-nowrap flex-shrink-0 list-none [&::-webkit-details-marker]:hidden"
            >
              <div className="w-8 h-8 rounded-md bg-[var(--color-surface)] flex items-center justify-center overflow-hidden border border-white/10 relative">
                {avatarUrl ? (
                  <img src={avatarUrl} className="w-full h-full object-cover" alt="User avatar" />
                ) : (
                  <span className="text-lg">👤</span>
                )}
              </div>
              <span className="text-sm text-[var(--color-primary)] opacity-85 ml-1">{user.username}</span>
              <span className="icon-[mdi--chevron-down] text-sm text-[var(--color-primary)] opacity-30 transition-transform duration-150 group-open:rotate-180" />
            </summary>

            <div
              className="absolute right-0 top-[calc(100%+8px)] w-60 rounded-xl bg-[var(--color-panel)] border border-[var(--color-panel-border)] shadow-2xl shadow-black/50 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-100"
            >
              {/* Header Section: More "Command Center" feel */}
              <div className="px-4 py-4 bg-white/[0.02] border-b border-[var(--color-border-soft)]">
                <div className="flex items-center gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-[var(--color-surface)] border border-white/5 flex items-center justify-center shadow-inner overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} className="w-full h-full object-cover" alt="User avatar" />
                    ) : (
                      <span className="text-xl">👤</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[var(--color-primary)] leading-none mb-1">
                      {user.username}
                    </span>
                    <span className="text-[10px] text-[var(--color-primary)] opacity-40 uppercase tracking-widest font-bold">
                      Operator
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-1.5 space-y-0.5">
                <PanelButton
                  icon="icon-[mdi--badge-account-outline]"
                  label="Operator File"
                  onClick={() => navigate("/user/me")}
                />
                <PanelButton
                  icon="icon-[mdi--tune-variant]"
                  label="System Prefs"
                  onClick={() => navigate("/user/settings")}
                />
              </div>

              {/* Footer: Dangerous action separation */}
              <div className="p-1.5 border-t border-[var(--color-border-soft)] bg-black/10">
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 flex items-center gap-3 text-left text-xs font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all duration-200"
                >
                  <span className="icon-[mdi--power-standby] text-base" />
                  Terminate Session
                </button>
              </div>
            </div>
          </details>
        )}
      </div>
    </header >
  );
}