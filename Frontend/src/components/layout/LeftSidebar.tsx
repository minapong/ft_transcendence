import { useRef, useEffect, useState } from "@/Reactor";
import { animate, hover } from "motion";

const links = [
  { label: "Home", href: "/", icon: "icon-[solar--home-smile-bold-duotone]", iconActive: "icon-[solar--home-smile-linear]" },
  { label: "Tournament", href: "/tournament/start", icon: "icon-[solar--cup-star-bold-duotone]", iconActive: "icon-[solar--cup-star-linear]" },
  { label: "Pong", href: "/single_game", icon: "icon-[solar--gameboy-bold-duotone]", iconActive: "icon-[solar--gameboy-linear]" },
  { label: "Connect4", href: "/connect4_single", icon: "icon-[solar--widget-5-bold-duotone]", iconActive: "icon-[solar--widget-5-linear]" },
  { label: "Contact", href: "/contact", icon: "icon-[solar--chat-round-call-bold-duotone]", iconActive: "icon-[solar--chat-round-call-linear]" },
];

interface SidebarProps {
  screen: "mobile" | "tablet" | "desktop";
  open: boolean;
  setOpen: (v: boolean | ((p: boolean) => boolean)) => void;
}

export default function Sidebar({ screen, open, setOpen }: SidebarProps) {
  const [activePath, setActivePath] = useState(normalizePath(window.location.pathname));
  const sidebarRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onPop = () =>
      setActivePath(() => normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);



  // Lock body scroll on mobile/tablet when open
  useEffect(() => {
    if (open && (screen === "mobile" || screen === "tablet")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, screen]);

  // Auto-close on link click for non-desktop
  const handleLinkClick = (path: string) => {
    setActivePath(normalizePath(path));
    if (screen !== "desktop") {
      setOpen(false);
    }
  };

  // Determine sidebar classes based on explicit state
  // Determine sidebar classes based on explicit state
  const sidebarClass = (() => {
    if (screen === "mobile") {
      return `
        fixed inset-y-0 left-0 z-50
        w-full
        ${open ? "translate-x-0" : "-translate-x-full"}
      `;
    }

    if (screen === "tablet") {
      return `
        fixed inset-y-0 left-0 z-50
        w-64
        ${open ? "translate-x-0" : "-translate-x-full"}
      `;
    }

    // desktop
    return `
      relative h-full translate-x-0
      ${open ? "w-72 px-6" : "w-16 px-2"}
    `;
  })();

  const toggleClass = screen === "desktop"
    ? "absolute top-3 right-3 left-auto"
    : "fixed top-3 left-4";

  return (
    <>
      <div className="lg:sticky lg:top-[var(--header-height)] lg:h-[calc(100vh-var(--header-height))] z-50">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle sidebar"
          className={`
            z-[70] flex items-center justify-center
            h-8 w-8 rounded-md
            border sidebar-toggle
            active:scale-95
            ${toggleClass}
          `}
        >
          <span
            className={`
              icon-[solar--sidebar-minimalistic-bold-duotone]
              text-xl transition-transform duration-300
              ${open ? "rotate-180" : "rotate-0"}
            `}
          />
        </button>

        {/* Backdrop for Mobile & Tablet when open */}
        <div
          className={`
            fixed inset-0 bg-black/60 z-40 transition-opacity duration-500
            ${screen !== "desktop" && open ? "opacity-100" : "opacity-0 pointer-events-none"}
            ${screen === "desktop" ? "hidden" : ""}
          `}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />

        <aside
          role="navigation"
          aria-label="Main navigation"
          className={`
            sidebar-shell
            overflow-visible
            pt-16
            transition-[transform,width,padding] duration-500 cubic-bezier(0.4, 0, 0.2, 1)
            ${sidebarClass}
          `}
          ref={sidebarRef}
        >
          {/* Wrapper to handle content layout */}
          <div className="flex flex-col h-full bg-inherit">
            {/* Links */}
            <nav
              className={`flex flex-col ${open ? "mt-6 gap-3.5 px-4" : "lg:mt-10 lg:gap-5 lg:items-center w-full"
                }`}
            >
              {links.map((link, index) => (
                <SidebarLink
                  link={link}
                  activePath={activePath}
                  open={open}
                  onLinkClick={handleLinkClick}
                  index={index}
                />
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </>
  );
}

interface SidebarLinkProps {
  link: (typeof links)[0];
  activePath: string;
  open: boolean;
  onLinkClick: (path: string) => void;
  index: number;
}

function SidebarLink({
  link,
  activePath,
  open,
  onLinkClick,
  index,
}: SidebarLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const isActive = activePath === link.href;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Hover animation
    const unsubscribe = hover(el, () => {
      animate(el, { scale: 1.1 }, { duration: 0.1, ease: "easeOut" });
      return () => {
        animate(el, { scale: 1 }, { duration: 0.6, ease: "easeInOut" });
      };
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handlePointerDown = () => {
    if (ref.current) animate(ref.current, { scale: 0.96 }, { duration: 0.06 });
  };

  return (
    <a
      ref={ref}
      href={link.href}
      onClick={() => onLinkClick(link.href)}
      onPointerDown={handlePointerDown}
      title={!open ? link.label : undefined}
      style={{
        transitionDelay: open ? `${index * 40}ms` : "0ms",
      }}
      className={`
        sidebar-link group rounded-lg flex items-center transition-all
        duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        ${open ? "px-3 py-2.5 justify-between w-full opacity-100 translate-x-0" : "p-1.5 justify-center"}
        ${!open && "lg:opacity-100 lg:translate-x-0"}
        ${!open && "opacity-0 -translate-x-4"}
        ${isActive ? "sidebar-link--active" : ""}
      `}
    >
      <span
        className={`sidebar-link__content flex items-center ${open ? "gap-4" : ""
          }`}
      >
        <span
          className={`sidebar-icon-shell ${isActive ? "sidebar-icon-shell--active" : ""
            }`}
        >
          <span
            className={`
              ${isActive ? link.iconActive : link.icon}
              ${isActive ? "sidebar-icon--active" : ""}
              text-xl transition-transform duration-200
              group-hover:scale-110
            `}
          />
        </span>
        <span className={open ? "font-medium" : "sr-only"}>{link.label}</span>
      </span>
      {open && (
        <span className="sidebar-link__icon icon-[solar--arrow-right-bold] text-xl opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </a>
  );
}

function normalizePath(raw: string) {
  return raw.toLowerCase().replace(/\/+$/, "") || "/";
}
