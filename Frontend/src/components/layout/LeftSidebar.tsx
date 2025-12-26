import { useEffect, useState,useRef } from "Reactor";
import { animate ,hover} from "motion";

const links = [
  { label: "Home", href: "/", icon: "icon-[solar--home-smile-bold-duotone]", iconActive: "icon-[solar--home-smile-linear]" },
  { label: "Login", href: "/login", icon: "icon-[solar--login-3-bold-duotone]", iconActive: "icon-[solar--login-3-linear]" },
  { label: "Tournament", href: "/tournament/start", icon: "icon-[solar--cup-star-bold-duotone]", iconActive: "icon-[solar--cup-star-linear]" },
  { label: "Pong", href: "/single_game", icon: "icon-[solar--gameboy-bold-duotone]", iconActive: "icon-[solar--gameboy-linear]" },
  { label: "Connect4", href: "/connect4_single", icon: "icon-[solar--widget-5-bold-duotone]", iconActive: "icon-[solar--widget-5-linear]" },
  { label: "Contact", href: "/contact", icon: "icon-[solar--chat-round-call-bold-duotone]", iconActive: "icon-[solar--chat-round-call-linear]" },
  { label: "Timer", href: "/timer", icon: "icon-[solar--clock-circle-bold-duotone]", iconActive: "icon-[solar--clock-circle-linear]" },
  { label: "Counter Page", href: "/counterPage", icon: "icon-[solar--chart-square-bold-duotone]", iconActive: "icon-[solar--chart-square-linear]" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [activePath, setActivePath] = useState(normalizePath(window.location.pathname));
  const sidebarRef = useRef<HTMLElement | null>(null);
  const baseLinkClasses = "group rounded-lg flex items-center relative z-0 isolate overflow-visible transition-colors active:scale-[0.98]";
  const inactiveLinkClasses = "bg-[var(--sidebar-link-bg)] border border-[var(--sidebar-link-border)] text-[var(--sidebar-link-text)] hover:bg-[var(--sidebar-link-hover-bg)] hover:text-[var(--sidebar-link-hover-text)]";
  const activeLinkClasses = "text-[var(--sidebar-active-text)] bg-[color-mix(in_srgb,var(--sidebar-active-glow)_12%,transparent)] border border-[color-mix(in_srgb,var(--sidebar-active-glow)_50%,transparent)] shadow-[0_10px_22px_rgba(0,0,0,0.35),0_0_18px_color-mix(in_srgb,var(--sidebar-active-glow)_35%,transparent)] before:content-[''] before:absolute before:-inset-2 before:rounded-[inherit] before:bg-[radial-gradient(60%_60%_at_25%_50%,color-mix(in_srgb,var(--sidebar-active-glow)_60%,transparent),transparent_70%),radial-gradient(80%_80%_at_70%_50%,color-mix(in_srgb,var(--sidebar-active-hot)_35%,transparent),transparent_75%)] before:blur-[16px] before:opacity-[0.85] before:-z-10 before:pointer-events-none after:content-[''] after:absolute after:inset-0 after:rounded-[inherit] after:bg-[linear-gradient(120deg,color-mix(in_srgb,var(--sidebar-active-glow)_18%,transparent),transparent_45%,color-mix(in_srgb,var(--sidebar-active-sheen)_22%,transparent))] after:opacity-70 after:pointer-events-none after:-z-10";

  useEffect(() => {
    const onPop = () =>
      setActivePath(()=>normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (!sidebarRef.current) return;
    animate(
      sidebarRef.current,
      { scale: [0.4, 1] },
      // { ease: "circInOut", duration: 1.2 }
    );
  }, [open]);
  
  return (
    <aside
      className={`
        sticky left-0 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)]
        top-[var(--header-height)]
        h-[calc(100vh-var(--header-height))]
        overflow-hidden relative
        pt-12 sm:pt-14
        transition-[width,padding] duration-300 ease-out
        ${open ? "w-56 sm:w-64 lg:w-72 px-4 sm:px-6" : "w-12 sm:w-14 px-2 sm:px-3"}
      `}
      ref={sidebarRef}
    >
      <button
        onClick={() => setOpen(v => !v)}
        className={`
          absolute top-3 sm:top-4 z-20
          h-8 w-8 rounded-md
          border border-[var(--sidebar-toggle-border)] bg-[var(--sidebar-toggle-bg)]
          text-[var(--sidebar-toggle-text)]
          flex items-center justify-center
          transition-all duration-300
          hover:bg-[var(--sidebar-toggle-hover-bg)] hover:text-[var(--sidebar-toggle-hover-text)]
          active:scale-95
          ${open ? "right-4" : "right-2"}
        `}
      >
        <span
          className={`
            icon-[carbon--side-panel-close]
            text-xl transition-transform duration-300
            ${open ? "rotate-0" : "rotate-180"}
          `}
        />
      </button>

      {/* Header */}
      <div
        className={`
          mt-2 sm:mt-4 space-y-4 transition-all duration-200
          ${open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"}
        `}
      >

      </div>
      {/* Links */}
      <nav className={`mt-6 flex flex-col gap-3.5 ${open ? "" : "items-center"}`}>
        {links.map(link => {
          const isActive = activePath === link.href;
          return (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setActivePath(() => normalizePath(link.href))}
              title={!open ? link.label : undefined}
              ref={(el) => {
                el.addEventListener("pointerdown", () => {
                  animate(el, { scale: 0.96 }, { duration: 0.06 });
                });
                if (!el) return;
                hover(el, () => {
                  const anim = animate(el, { scale: 1.1 },
                    { duration: 0.1, ease: "easeOut" }
                    );
                  return () => {
                    animate(el, { scale: 1 },
                      { duration: 0.6, ease: "easeInOut" }
                      );
                  };
                });                
              }}
              
              className={`
                ${baseLinkClasses}
                ${open ? "px-3 py-2.5 justify-between w-full" : "p-2.5 justify-center"}
                ${isActive ? activeLinkClasses : inactiveLinkClasses}
              `}
            >
              <span className={`relative z-10 flex items-center ${open ? "gap-4" : ""}`}>
                <span
                  className={`
                    ${isActive ? link.iconActive : link.icon}
                    ${isActive ? "text-[var(--sidebar-active-glow)] drop-shadow-[0_0_10px_color-mix(in_srgb,var(--sidebar-active-glow)_60%,transparent)] drop-shadow-[0_0_16px_color-mix(in_srgb,var(--sidebar-active-hot)_30%,transparent)]" : ""}
                    text-xl transition-transform duration-200
                    group-hover:scale-110
                  `}
                />
                <span className={open ? "font-medium" : "sr-only"}>
                  {link.label}
                </span>
              </span>

              {open && (
                <span className="relative z-10 icon-[solar--arrow-right-bold] text-xl opacity-50 group-hover:opacity-100" />
              )}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

function normalizePath(raw: string) {
  return raw.toLowerCase().replace(/\/+$/, "") || "/";
}
