import { useEffect, useState, useRef } from "Reactor";
import { animate, hover } from "motion";

const links = [
  { label: "Home", href: "/", icon: "icon-[solar--home-smile-bold-duotone]", iconActive: "icon-[solar--home-smile-linear]" },
  { label: "Login", href: "/login", icon: "icon-[solar--login-3-bold-duotone]", iconActive: "icon-[solar--login-3-linear]" },
  { label: "Tournament", href: "/tournament/start", icon: "icon-[solar--cup-star-bold-duotone]", iconActive: "icon-[solar--cup-star-linear]" },
  { label: "Pong", href: "/single_game", icon: "icon-[solar--gameboy-bold-duotone]", iconActive: "icon-[solar--gameboy-linear]" },
  { label: "Connect4", href: "/connect4_single", icon: "icon-[solar--widget-5-bold-duotone]", iconActive: "icon-[solar--widget-5-linear]" },
  { label: "Contact", href: "/contact", icon: "icon-[solar--chat-round-call-bold-duotone]", iconActive: "icon-[solar--chat-round-call-linear]" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [activePath, setActivePath] = useState(normalizePath(window.location.pathname));
  const sidebarRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onPop = () =>
      setActivePath(() => normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Removed mount animation to prevent visual "beyond 100%" overflow issues
  useEffect(() => {
    // No-op for now to keep the structure stable
  }, []);

  // Lock body scroll on mobile only ( < 640px ) when open
  useEffect(() => {
    const checkScrollLock = () => {
      const isMobile = window.innerWidth < 640;
      if (open && isMobile) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    };

    checkScrollLock();
    window.addEventListener('resize', checkScrollLock);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener('resize', checkScrollLock);
    };
  }, [open]);

  // Auto-close on link click for mobile/tablet
  const handleLinkClick = (path: string) => {
    setActivePath(normalizePath(path));
    if (window.innerWidth < 1024) {
      setOpen(false);
    }
  };

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
            transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
            active:scale-95
            
            ${/* Mobile & Tablet (< 1024px): Fixed at top-left, independent of sidebar transform */ ""}
            fixed top-3 left-4
            
            ${/* Desktop (>= 1024px): Absolute inside the sticky container */ ""}
            lg:absolute lg:top-3 lg:right-3 lg:left-auto
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

        {/* Backdrop for Mobile & Tablet (< 1024px) when open */}
        <div
          className={`
            fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-500
            ${open ? "opacity-100" : "opacity-0 pointer-events-none"}
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
            pt-16 sm:pt-14
            transition-[transform,width,padding] duration-500 cubic-bezier(0.4, 0, 0.2, 1)
            
            ${/* 1. Mobile (< 640px): Fixed Full Overlay */ ""}
            fixed inset-y-0 left-0 z-50
            w-full
            ${open ? "translate-x-0" : "-translate-x-full"}

            ${/* 2. Tablet (640px - 1024px): Fixed Partial Overlay */ ""}
            sm:w-64
            sm:${open ? "translate-x-0" : "-translate-x-full"}

            ${/* 3. Desktop (>= 1024px): Natural height/width in sticky wrapper */ ""}
            lg:static lg:h-full lg:translate-x-0
            lg:${open ? "w-72 px-6" : "w-16 px-2"}
          `}
          ref={sidebarRef}
        >
          {/* Wrapper to handle content layout */}
          <div className="flex flex-col h-full bg-inherit">
            {/* Links */}
            <nav
              className={`flex flex-col ${open ? "mt-6 gap-3.5" : "lg:mt-10 lg:gap-5 lg:items-center"
                }`}
            >
              {links.map((link, index) => (
                <SidebarLink
                  key={link.href}
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

function SidebarLink({
  link,
  activePath,
  open,
  onLinkClick,
  index,
}: {
  link: (typeof links)[0];
  activePath: string;
  open: boolean;
  onLinkClick: (path: string) => void;
  index: number;
}) {
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
        sidebar-link group rounded-lg flex items-center transition-all active:scale-[0.98]
        duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        ${open ? "px-3 py-2.5 justify-between w-full opacity-100 translate-x-0" : "p-2.5 justify-center"}
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
