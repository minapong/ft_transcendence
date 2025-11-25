const links = [
	{ label: "Home", href: "/" },
	{ label: "Login", href: "/login" },
	{ label: "Tournament", href: "/tournament/start" },
	{ label: "Pong", href: "/pong" },
	{ label: "Contact", href: "/contact" },
  ];
  
  export default function Sidebar() {
	return (
	  <aside className="nav-panel">
		<div className="px-1 space-y-0.5">
		  <p className="nav-title">Navigation</p>
		  <p className="nav-subtitle">Quick Access</p>
		</div>
		<div className="h-px bg-white/5 my-2" />
		<nav className="flex flex-col gap-1.5 mt-2">
		  {links.map((link) => (
			<a key={link.href} href={link.href} className="nav-link px-3 py-1.5">
			  <span className="flex items-center gap-2">
				<span className="nav-dot" />
				{link.label}
			  </span>
			  <span className="nav-arrow">→</span>
			</a>
		  ))}
		</nav>
		<div className="help-card mt-6 bg-[rgba(255,255,255,0.03)]! shadow-[0_0_6px_color-mix(in_srgb,var(--color-accent)_15%,transparent)]!">
		  <p className="font-semibold">Need help?</p>
		  <p className="opacity-80">Check docs or ping a teammate.</p>
		</div>
	  </aside>
	);
  }
  