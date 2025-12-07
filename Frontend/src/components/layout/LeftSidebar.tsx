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
  const sidebarAnim = useRef(null);
  const contentAnim = useRef(null);
  const sidebarRef = useRef(null);
  const contentRef = useRef(null);

  const widthTarget = open ? 240 : 60;
  const paddingLeft = open ? 24 : 16;
  const paddingRight = open ? 24 : 16;
  const easer = [0.25, 0.1, 0.25, 1]; 
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
        { duration: contentDuration, ease:[0.25, 0.1, 0.25, 1], delay: contentDelay }
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

  return (
    <aside
      id="sidebar"
      ref={sidebarRef}
      className="
        bg-navpanel border-r border-border-soft sticky left-0
        top-[var(--header-height)]
        h-[calc(100vh-var(--header-height))]
        overflow-hidden relative
        w-[240px] pl-6 pr-6
      "
    >
      {/* Collapse button */}
      <button
        onClick={() => setOpen(v => !v)}
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

      {/* CONTENT */}
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

        <nav className="flex flex-col gap-1.5">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="
                hover:bg-accent-soft hover:text-black
                text-accent bg-white/5 nav-link border px-3 py-2
                rounded-lg flex justify-between
              "
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
