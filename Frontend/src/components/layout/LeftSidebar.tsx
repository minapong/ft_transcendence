import { useState } from "Reactor";

const links = [
  { label: "Home", href: "/" },
  { label: "Login", href: "/login" },
  { label: "Tournament", href: "/tournament/start" },
  { label: "Pong", href: "/single_game" },
  { label: "Contact", href: "/contact" },
  { label: "Timer", href: "/timer" },
  { label: "Counter Page", href: "/counterPage" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`
        bg-navpanel border-r border-border-soft
        h-body-screenHeight transition-all duration-300
        overflow-hidden
        ${open ? "min-w-[240px] p-6" : "min-w-[60px] p-4"}
      `}
    >
      {/* Collapse button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="icon-[solar--hamburger-menu-line-duotone] 
                   text-2xl cursor-pointer"
      />

      {/* Hide content when collapsed */}
      {open && (
        <div className="mt-6 space-y-4">
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
      )}
    </aside>
  );
}
