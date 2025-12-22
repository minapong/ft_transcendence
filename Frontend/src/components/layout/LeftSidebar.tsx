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
        bg-navpanel border-r border-border-soft sticky left-0
        top-[var(--header-height)]
        h-[calc(100vh-var(--header-height))]
        overflow-hidden relative
        transition-[width,padding] duration-300 ease-out
        ${open ? "w-[12vw] px-6" : "w-[3vw] px-10"}
      `}
      ref={sidebarRef}
    >
      {/* Toggle */}
      <button
        onClick={() => setOpen(v => !v)}
        className={`
          absolute top-4 z-20
          h-8 w-8 rounded-md
          bg-white/5 border border-border-strong
          text-accent-soft
          flex items-center justify-center
          transition-all duration-300
          hover:bg-accent-soft hover:text-black
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
          mt-6 space-y-4 transition-all duration-200
          ${open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"}
        `}
      >
        <p className="text-xs uppercase tracking-[0.3em] color-accent">
          Navigation
        </p>
        <p className="text-xl font-semibold text-primary">
          Quick Access
        </p>
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
                group rounded-lg
                flex items-center

                active:scale-[0.98]
                ${open ? "px-3 py-2.5 justify-between w-full" : "p-2.5 justify-center"}
                ${isActive
                  ? "bg-accent/10 border border-accent/40 text-accent"
                  : "bg-white/5 border border-border-soft text-accent hover:bg-accent-soft hover:text-black"}
              `}
            >
              <span className={`flex items-center ${open ? "gap-4" : ""}`}>
                <span
                  className={`
                    ${isActive ? link.iconActive : link.icon}
                    text-xl transition-transform duration-200
                    group-hover:scale-110
                  `}
                />
                <span className={open ? "font-medium" : "sr-only"}>
                  {link.label}
                </span>
              </span>

              {open && (
                <span className="icon-[solar--arrow-right-bold] text-xl opacity-50 group-hover:opacity-100" />
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
