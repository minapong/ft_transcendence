import SidebarLink from "@/app/components/ui/SidebarLink"
import { useEffect, useRef } from "Reactor"
import { useLocation } from "Reactor/router/useLocation"

const links = [
	{ label: "Home", href: "/", icon: "icon-[solar--home-smile-bold-duotone]", iconActive: "icon-[solar--home-smile-linear]" },
	{ label: "Tournament", href: "/tournament/start", icon: "icon-[solar--cup-star-bold-duotone]", iconActive: "icon-[solar--cup-star-linear]" },
	{ label: "Pong", href: "/game/single_game", icon: "icon-[solar--gameboy-bold-duotone]", iconActive: "icon-[solar--gameboy-linear]" },
	{ label: "Connect4", href: "/game/connect4_single", icon: "icon-[solar--widget-5-bold-duotone]", iconActive: "icon-[solar--widget-5-linear]" },
	{ label: "Contact", href: "/contact", icon: "icon-[solar--chat-round-call-bold-duotone]", iconActive: "icon-[solar--chat-round-call-linear]" },
	{ label: "Dashboard", href: "/dashboard", icon: "icon-[solar--chart-square-bold-duotone]", iconActive: "icon-[solar--chart-square-linear]" },
];

interface SidebarProps {
	isOverlayOpen: boolean;
	setIsOverlayOpen: (v: boolean | ((p: boolean) => boolean)) => void;
	onNavigate: () => void;
}
export default function Sidebar({ isOverlayOpen, setIsOverlayOpen, onNavigate, mode }: SidebarProps & { mode: "overlay" | "static" }) {
	if (mode === "overlay") {
		console.log("[LeftSidebar] overlay render, isOverlayOpen:", isOverlayOpen);
	}

	const activePath = normalizePath(useLocation());
	const asideRef = useRef<HTMLDivElement | null>(null);

	function isActive(current: string, target: string) {
		return current === target || current.startsWith(target + "/");
	}

	// Only lock scroll for overlay mode (mobile/tablet)
	useEffect(() => {
		if (mode === "overlay" && isOverlayOpen) {
			document.body.style.overflow = "hidden";
			return () => {
				document.body.style.overflow = "";
			};
		}
		document.body.style.overflow = "";
	}, [mode, isOverlayOpen]);

	// (No document click-outside listener; backdrop handles close)

	if (mode === "static") {
		// Desktop: persistent sidebar, no overlay, no transitions, no scroll lock
		return (
			<aside
				role="navigation"
				aria-label="Main navigation"
				className="sidebar-shell static left-0 z-30 w-72 max-w-88 pt-16 border-r border-(--color-border-soft) bg-(--color-surface)"
			>
				<nav className="flex flex-col gap-3.5 px-4">
					{links.map(link => (
						<SidebarLink
							label={link.label}
							href={link.href}
							icon={link.icon}
							iconActive={link.iconActive}
							active={isActive(activePath, link.href)}
							collapsed={false}
							onClick={onNavigate}
						/>
					))}
				</nav>
			</aside>
		);
	}
	// Overlay mode (mobile/tablet)
	return (
		<div className="z-50">
			{/* Overlay background for closing sidebar */}
			{mode === "overlay" && isOverlayOpen && (
				<div
					className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
					onClick={() => {
						console.log("[Sidebar] Overlay close: false");
						setIsOverlayOpen(false);
					}}
				/>
			)}
			<aside
				ref={asideRef}
				role="navigation"
				aria-label="Main navigation"
				aria-hidden={!isOverlayOpen}
				className={`sidebar-shell fixed inset-y-0 left-0 z-50 w-[80vw] max-w-88 pt-6 transition-transform duration-300 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] shadow-2xl ${isOverlayOpen ? 'translate-x-0' : '-translate-x-full'
					}`}
			>
				{/* Sidebar Header with Close Button */}
				<div className="flex items-center justify-between px-6 mb-8 mt-2">
					<div className="flex items-center gap-2.5 text-accent">
						<div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
							<span className="icon-[solar--layers-bold-duotone] text-lg" />
						</div>
						<div className="flex flex-col gap-0.5">
							<span className="text-[10px] font-black tracking-[0.25em] text-accent/50 uppercase leading-none">System</span>
							<span className="text-xs font-bold tracking-[0.1em] text-primary/80 uppercase">Navigation</span>
						</div>
					</div>

					<button
						onClick={() => setIsOverlayOpen(false)}
						className="w-10 h-10 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-soft)] text-accent flex items-center justify-center hover:bg-[var(--color-surface-strong)] transition-all active:scale-95 group shadow-lg shadow-black/20"
						aria-label="Close sidebar"
					>
						<span className="icon-[solar--close-circle-bold-duotone] text-2xl group-hover:rotate-90 transition-transform duration-300" />
					</button>
				</div>

				<nav className="flex flex-col gap-3 px-4">
					{links.map(link => (
						<SidebarLink
							label={link.label}
							href={link.href}
							icon={link.icon}
							iconActive={link.iconActive}
							active={isActive(activePath, link.href)}
							collapsed={!isOverlayOpen}
							onClick={() => {
								setIsOverlayOpen(false);
								onNavigate();
							}}
						/>
					))}
				</nav>

				{/* Version footer */}
				<div className="absolute bottom-8 left-0 right-0 px-8 opacity-20 pointer-events-none">
					<div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-4" />
					<div className="flex items-center justify-center gap-2 text-[9px] uppercase tracking-widest font-black">
						Mina Hub v2.0.4
					</div>
				</div>
			</aside>
		</div>
	);
}

/* ---------------- utils ---------------- */

function normalizePath(raw: string) {
	return raw.toLowerCase().replace(/\/+$/, "") || "/";
}

/* ---------------- utils ---------------- */

function normalizePath(raw: string) {
	return raw.toLowerCase().replace(/\/+$/, "") || "/";
}
