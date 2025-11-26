const links = [
	{ label: "Home", href: "/" },
	{ label: "Login", href: "/login" },
	{ label: "Tournament", href: "/tournament/start" },
	{ label: "Pong", href: "/pong" },
	{ label: "Contact", href: "/contact" },
  ];
  
  export default function Sidebar() {
	return (
	  <aside className="bg-navpanel min-w-width-offset h-body-screenHeight p-6 space-y-6 border-r border-border-soft shadow-lg ">
		<div className="px-1 space-y-0.5">
		  <p className="text-xs uppercase tracking-[0.3em] color-accent">Navigation</p>
		  <p className="text-xl font-semibold text-primary">Quick Access</p>
		</div>
		<div className="h-px bg-white/5 my-2" />
		<nav className="flex flex-col gap-1.5 mt-2">
		  {links.map((link) => (
			<a key={link.href} href={link.href} className="hover:bg-accent-soft hover:text-black text-accent bg-white/5 nav-link border">
			  <span className="flex items-center gap-2">
				<span className="bg-accent h-2 w-2 rounded-full transition" />
				{link.label}
			  </span>
			  <span className="text-xs transition text-accent">→</span>
			</a>
		  ))}
		</nav>
	  </aside>
	);
  }
  