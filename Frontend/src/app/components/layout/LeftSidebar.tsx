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
					className="fixed inset-0 bg-black/60 z-40"
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
				className={`sidebar-shell fixed inset-y-0 left-0 z-50 w-[80vw] max-w-88 pt-16 transition-transform duration-300 bg-red-200 border-4 border-red-500 ${isOverlayOpen ? 'translate-x-0' : '-translate-x-full'
					}`}
			>
				{/* Close (X) button for mobile overlay */}
				<button
					className="absolute top-4 right-4 p-2 rounded-md bg-white text-xl z-50 lg:hidden"
					aria-label="Close sidebar menu"
					onClick={() => {
						console.log("[Sidebar] Overlay close: false (X button)");
						setIsOverlayOpen(false);
					}}
				>
					<span className="icon-[mdi--close]">×</span>
				</button>
				<nav className="flex flex-col gap-3.5 px-4">
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
