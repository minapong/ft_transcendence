import { useRef, useEffect, useState } from "Reactor";
import { animate } from "motion";

const links = [
  { label: "Home", href: "/", icon: "icon-[solar--home-smile-bold-duotone]", iconActive: "icon-[solar--home-smile-linear]" },
  { label: "Tournament", href: "/tournament/start", icon: "icon-[solar--cup-star-bold-duotone]", iconActive: "icon-[solar--cup-star-linear]" },
  { label: "Pong", href: "/game/single_game", icon: "icon-[solar--gameboy-bold-duotone]", iconActive: "icon-[solar--gameboy-linear]" },
  { label: "Connect4", href: "/game/connect4_single", icon: "icon-[solar--widget-5-bold-duotone]", iconActive: "icon-[solar--widget-5-linear]" },
  { label: "Contact", href: "/contact", icon: "icon-[solar--chat-round-call-bold-duotone]", iconActive: "icon-[solar--chat-round-call-linear]" },
  { label: "Dashboard", href: "/dashboard", icon: "icon-[solar--chart-square-bold-duotone]", iconActive: "icon-[solar--chart-square-linear]" },

];

interface SidebarProps {
  screen: "mobile" | "tablet" | "desktop";
  open: boolean;
  setOpen: (v: boolean | ((p: boolean) => boolean)) => void;
}

export default function Sidebar({ screen, open, setOpen }: SidebarProps) {
  const [activePath, setActivePath] = useState(normalizePath(window.location.pathname));

  const sidebarRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const toggleIconRef = useRef<HTMLSpanElement>(null);

  /* ---------------- routing ---------------- */

  useEffect(() => {
    const onPop = () => setActivePath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  /* ---------------- scroll lock ---------------- */

  useEffect(() => {
    if (open && screen !== "desktop") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, screen]);

  /* ---------------- sidebar motion ---------------- */

  useEffect(() => {
    if (!sidebarRef.current) return;

    // On mobile/tablet: slide in/out based on open state
    // On desktop: always visible (no x transform needed)
    const targetX = screen === "desktop" ? 0 : (open ? 0 : "-100%");

    animate(
      sidebarRef.current,
      { x: targetX },
      { duration: 0.45, ease: [0.4, 0, 0.2, 1] }
    );
  }, [open, screen]);

  /* ---------------- backdrop motion ---------------- */

  useEffect(() => {
    if (!backdropRef.current) return;

    animate(
      backdropRef.current,
      { opacity: open && screen !== "desktop" ? 1 : 0 },
      { duration: 0.25, ease: "easeOut" }
    );
  }, [open, screen]);

  /* ---------------- toggle icon motion ---------------- */

  useEffect(() => {
    if (!toggleIconRef.current) return;

    animate(
      toggleIconRef.current,
      { rotate: open ? 180 : 0 },
      { duration: 0.25, ease: "easeInOut" }
    );
  }, [open]);

  const handleLinkClick = (path: string) => {
    setActivePath(normalizePath(path));
    if (screen !== "desktop") setOpen(false);
  };

  return (
    <>
      <div className="lg:sticky lg:top-[var(--header-height)] lg:h-[calc(100vh-var(--header-height))] z-50">

        {/* Toggle button */}
        <button
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-label="Toggle sidebar"
          className="z-[70] flex items-center justify-center h-8 w-8 rounded-md border sidebar-toggle fixed top-3 left-4 lg:absolute lg:top-3 lg:right-3 lg:left-auto"
        >
          <span
            ref={toggleIconRef}
            className="icon-[solar--sidebar-minimalistic-bold-duotone] text-xl"
          />
        </button>

        {/* Backdrop */}
        <div
          ref={backdropRef}
          className={`fixed inset-0 bg-black/60 z-40 ${screen === "desktop" || !open ? "pointer-events-none" : ""} ${screen === "desktop" ? "hidden" : ""}`}
          style={{ opacity: open && screen !== "desktop" ? 1 : 0 }}
          onClick={() => setOpen(false)}
        />

        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          role="navigation"
          aria-label="Main navigation"
          style={{
            transform: screen !== "desktop" && !open ? "translateX(-100%)" : "translateX(0)"
          }}
          className={`
            sidebar-shell fixed inset-y-0 left-0 z-50
            w-full md:w-64
            lg:relative lg:h-full lg:inset-auto lg:z-auto
            ${open ? "lg:w-72 lg:px-6" : "lg:w-16 lg:px-2"}
            pt-16 overflow-visible
            ${screen !== "desktop" && !open ? "pointer-events-none" : ""}
          `}
        >
          <nav className={`flex flex-col ${open ? "mt-6 gap-3.5 px-4" : "lg:mt-10 lg:gap-5 lg:items-center w-full"}`}>
            {links.map(link => (
              <SidebarLink
                link={link}
                activePath={activePath}
                open={open}
                onLinkClick={handleLinkClick}
              />
            ))}
          </nav>
        </aside>
      </div>
    </>
  );
}

/* ---------------- SidebarLink ---------------- */

interface SidebarLinkProps {
  link: (typeof links)[0];
  activePath: string;
  open: boolean;
  onLinkClick: (path: string) => void;
}

function SidebarLink({ link, activePath, open, onLinkClick }: SidebarLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const isActive = activePath === link.href;

  // Direct event handlers - re-attached on every render (Reactor-compatible)
  const handlePointerEnter = () => {
    if (!ref.current) return;
    animate(ref.current, { scale: 1.05 }, { duration: 0.15, ease: "easeOut" });
  };

  const handlePointerLeave = () => {
    if (!ref.current) return;
    animate(ref.current, { scale: 1 }, { duration: 0.2, ease: "easeInOut" });
  };

  const handlePointerDown = () => {
    if (!ref.current) return;
    animate(ref.current, { scale: 0.96 }, { duration: 0.08 });
  };

  const handlePointerUp = () => {
    if (!ref.current) return;
    // Check if still hovering to decide which scale to return to
    const isHovering = ref.current.matches(":hover");
    animate(
      ref.current,
      { scale: isHovering ? 1.05 : 1 },
      { duration: 0.2, ease: "easeInOut" }
    );
  };

  return (
    <a
      ref={ref}
      href={link.href}
      onClick={() => onLinkClick(link.href)}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerLeave}
      title={!open ? link.label : undefined}
      className={`sidebar-link group rounded-lg flex items-center ${open ? "px-3 py-2.5 justify-between w-full" : "p-1.5 justify-center"} ${isActive ? "sidebar-link--active" : ""}`}
    >
      <span className={`flex items-center ${open ? "gap-4" : ""}`}>
        <span className={`sidebar-icon-shell ${isActive ? "sidebar-icon-shell--active" : ""}`}>
          <span className={`${isActive ? link.iconActive : link.icon} ${isActive ? "sidebar-icon--active" : ""} text-xl`} />
        </span>
        <span className={open ? "font-medium" : "sr-only"}>{link.label}</span>
      </span>

      {open && <span className="icon-[solar--arrow-right-bold] text-xl opacity-50" />}
    </a>
  );
}

/* ---------------- utils ---------------- */

function normalizePath(raw: string) {
  return raw.toLowerCase().replace(/\/+$/, "") || "/";
}
