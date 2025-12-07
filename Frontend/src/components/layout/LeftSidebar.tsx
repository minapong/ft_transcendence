import { useEffect, useRef, useState } from "Reactor";
import { animate } from "motion";

const links = [
  { label: "Home", href: "/" },
  { label: "Login", href: "/login" },
  { label: "Tournament", href: "/tournament/start" },
  { label: "Pong", href: "/single_game" },
  { label: "Connect4", href: "/connect4_single"},
  { label: "Contact", href: "/contact" },
  { label: "Timer", href: "/timer" },
  { label: "Counter Page", href: "/counterPage" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const panelLabel = `${open ? "Close" : "Open"} panel`;
  const sidebarRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    const content = contentRef.current;
    if (!sidebar) return;

    animate(
      sidebar,
      {
        width: open ? 240 : 60,
        paddingLeft: open ? 24 : 16,
        paddingRight: open ? 24 : 16,
      },
      { duration: 0.18, easing: "easeInOut" }
    );

    if (content) {
      if (open) {
        animate(content, { opacity: 1, x: 0 }, { duration: 0.2, easing: "easeOut" });
      } else {
        content.style.opacity = "0";
        content.style.transform = "translateX(-12px)";
      }
    }
  }, [open]);

  return (
    <aside
      id="sidebar"
      ref={sidebarRef}
      className={`
      bg-navpanel border-r border-border-soft sticky
        top-[var(--header-height)]
        h-[calc(100vh-var(--header-height))]
        overflow-hidden relative
      `}
      style={{
        width: 240,
        padding: "1.5rem",
      }}
    >
      {/* Collapse button aligned RIGHT */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={panelLabel}
        title={panelLabel}
        className="
        absolute top-4 right-4
        flex items-center justify-center
        h-8 w-8 rounded-md
        bg-white/5 border border-border-strong
        text-accent-soft transition-all duration-200
        hover:bg-accent-soft hover:text-black
        hover:shadow-[0_0_12px_var(--color-accent-soft)]
        active:scale-95
    "
      >
        <span
          className={`icon-[carbon--side-panel-close] text-xl inline-block transition-transform duration-300 ${
            open ? "rotate-0" : "rotate-180"
          }`}
        />
      </button>
      <div
        ref={contentRef}
        className="mt-6 space-y-4"
        aria-hidden={!open}
      >
        <div>
          <p className="text-xs uppercase tracking-[0.3em] color-accent">
            Navigation
          </p>
          <p className="text-xl font-semibold text-primary">Quick Access</p>
        </div>

        <nav className="flex flex-col gap-1.5">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:bg-accent-soft hover:text-black
                           text-accent bg-white/5 nav-link border px-3 py-2
                           rounded-lg flex justify-between"
            >
              <span className="flex items-center gap-2">
                <span className="bg-accent h-2 w-2 rounded-full" />
                {link.label}
              </span>
              <span className="text-xs">→</span>
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
