import { useEffect, useRef, useState } from "Reactor";
import { animate } from "motion";

const links = [
  { 
    label: "Home", 
    href: "/", 
    icon: "icon-[solar--home-smile-bold-duotone]",
    iconActive: "icon-[solar--home-smile-linear]"
  },
  { 
    label: "Login", 
    href: "/login", 
    icon: "icon-[solar--login-3-bold-duotone]",
    iconActive: "icon-[solar--login-3-linear]"
  },
  { 
    label: "Tournament", 
    href: "/tournament/start", 
    icon: "icon-[solar--cup-star-bold-duotone]",
    iconActive: "icon-[solar--cup-star-linear]"
  },
  { 
    label: "Pong", 
    href: "/single_game", 
    icon: "icon-[solar--gameboy-bold-duotone]",
    iconActive: "icon-[solar--gameboy-linear]"
  },
  { 
    label: "Connect4", 
    href: "/connect4_single", 
    icon: "icon-[solar--widget-5-bold-duotone]",
    iconActive: "icon-[solar--widget-5-linear]"
  },
  { 
    label: "Contact", 
    href: "/contact", 
    icon: "icon-[solar--chat-round-call-bold-duotone]",
    iconActive: "icon-[solar--chat-round-call-linear]"
  },
  { 
    label: "Timer", 
    href: "/timer", 
    icon: "icon-[solar--clock-circle-bold-duotone]",
    iconActive: "icon-[solar--clock-circle-linear]"
  },
  { 
    label: "Counter Page", 
    href: "/counterPage", 
    icon: "icon-[solar--chart-square-bold-duotone]",
    iconActive: "icon-[solar--chart-square-linear]"
  },
];


export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [activePath, setActivePath] = useState(() =>
    normalizePath(window.location.pathname)
  );
  const sidebarAnim = useRef(null);
  const contentAnim = useRef(null);
  const sidebarRef = useRef(null);
  const contentRef = useRef(null);

  const widthTarget = open ? 240 : 60;
  const paddingLeft = open ? 24 : 12;
  const paddingRight = open ? 24 : 12;
  const widthDuration = 0.3;
  const contentDuration = 0.2;
  const contentDelay = open ? widthDuration * 0.6 : 0;

  useEffect(() => {
    const sidebar = sidebarRef.current;
    const content = contentRef.current;
    if (!sidebar) return;

    sidebarAnim.current?.cancel?.();
    contentAnim.current?.cancel?.();

    // WIDTH + PADDING animation
    sidebarAnim.current = animate(
      sidebar,
      { width: widthTarget, paddingLeft, paddingRight },
      { duration: widthDuration, ease: [0.25, 0.1, 0.25, 1] }
    );

    // CONTENT fade + slide
    if (content) {
      contentAnim.current = animate(
        content,
        {
          opacity: open ? 1 : 0,
          x: open ? 0 : -12,
        },
        {
          duration: contentDuration,
          ease: [0.25, 0.1, 0.25, 1],
          delay: contentDelay,
        }
      ).finished.then(() => {
        // Toggle pointer events AFTER animation completes
        if (content) {
          content.style.pointerEvents = open ? "auto" : "none";
        }
      });
    }

    return () => {
      sidebarAnim.current?.cancel?.();
      contentAnim.current?.cancel?.();
    };
  }, [open]);

  useEffect(() => {
    const handlePathChange = () =>
      setActivePath(normalizePath(window.location.pathname));
    handlePathChange();
    window.addEventListener("popstate", handlePathChange);
    
    return () => {
      window.removeEventListener("popstate", handlePathChange);
    };
  }, []);

  return (
    <aside
      id="sidebar"
      ref={sidebarRef}
      style={{
        width: `${widthTarget}px`,
        paddingLeft: `${paddingLeft}px`,
        paddingRight: `${paddingRight}px`,
      }}
      className="
        bg-navpanel border-r border-border-soft sticky left-0
        top-[var(--header-height)]
        h-[calc(100vh-var(--header-height))]
        overflow-hidden relative
      "
    >
      {/* Collapse button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`
          absolute top-4 z-20 pointer-events-auto
          flex items-center justify-center
          h-8 w-8 rounded-md
          bg-white/5 border border-border-strong
          text-accent-soft transition-all duration-300
          hover:bg-accent-soft hover:text-black
          hover:shadow-[0_0_12px_var(--color-accent-soft)]
          active:scale-95
          ${open ? "right-4" : "right-2"}
        `}
      >
        <span
          className={`
            icon-[carbon--side-panel-close]
            text-xl inline-block transition-transform duration-300
            ${open ? "rotate-0" : "rotate-180"}
          `}
        />
      </button>

      {/* HEADER CONTENT */}
      <div
        ref={contentRef}
        className="mt-6 space-y-4 will-change-[transform,opacity]"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateX(0px)" : "translateX(-12px)",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div>
          <p className="text-xs uppercase tracking-[0.3em] color-accent">
            Navigation
          </p>
          <p className="text-xl font-semibold text-primary">Quick Access</p>
        </div>
      </div>

      <nav className={`mt-6 flex flex-col gap-1.5 ${open ? "" : "items-center"}`}>
        {links.map((link) => {
          const isActive = activePath === link.href;
          return (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setActivePath(normalizePath(link.href))}
              title={open ? undefined : link.label}
              className={`
                group relative overflow-hidden
                ${open ? "px-3" : "px-2"} py-2.5 rounded-lg
                flex items-center
                transition-all duration-300
                active:scale-[0.98]
                ${open ? "justify-between w-full" : "justify-center w-auto"}
                ${isActive
                  ? 'bg-accent/10 border border-accent/40 text-accent shadow-[0_0_12px_rgba(var(--color-accent-soft-rgb),0.25)] ring-1 ring-accent/30'
                  : 'text-accent bg-white/5 border border-border-soft hover:bg-accent-soft hover:text-black hover:border-accent-soft hover:shadow-[0_0_8px_rgba(var(--color-accent-soft-rgb),0.3)]'
                }
              `}
            >
              <span className={`flex items-center ${open ? "gap-4" : "gap-0"} relative z-10`}>
                <span
                  className={`
                    ${isActive ? link.iconActive : link.icon}
                    text-xl
                    transition-all duration-200
                    group-hover:scale-110
                    ${isActive ? "translate-y-[2px]" : "translate-y-[1px]"}
                  `}
                />
                <span className={open ? "font-medium" : "sr-only"}>
                  {link.label}
                </span>
              </span>
              {open && (
                <span
                  className={`
                    icon-[solar--arrow-right-bold]
                    text-xl
                    transition-all duration-200
                    ${isActive ? "opacity-80" : "opacity-50 group-hover:opacity-100"}
                    group-hover:translate-x-0.5
                  `}
                />
              )}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

function normalizePath(rawPath: string) {
  let path =
    rawPath.toLowerCase().replace(/\/{2,}/g, "/").replace(/\/+$/, "") || "/";
  return path.split(/[?#]/)[0];
}
