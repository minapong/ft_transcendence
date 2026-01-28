
import SidebarLink from "@/app/components/ui/SidebarLink"
import { navigate, useEffect, useRef, useState } from "Reactor"
import { useLocation } from "Reactor/router/useLocation"
import { animate, stagger } from "motion"

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
	const backdropRef = useRef<HTMLDivElement | null>(null);
	const navRef = useRef<HTMLElement | null>(null);

	// Centralized closing logic
	function closeAndNavigate(href?: string) {
		const aside = asideRef.current;
		const backdrop = backdropRef.current;
		if (!aside) return;

		// Play exit animation
		animate(
			aside,
			{ x: "-100%" },
			{
				duration: 0.3,
				ease: [0.22, 1, 0.36, 1],
				onComplete: () => {
					setIsOverlayOpen(false);
					if (href) navigate(href);
					console.log("[LeftSidebar] Closing complete - dispatching sidebar:resume");
					window.dispatchEvent(new Event("sidebar:resume"));
				}
			}
		);

		if (backdrop) {
			animate(backdrop, { opacity: 0 }, { duration: 0.2 });
			backdrop.style.pointerEvents = "none";
		}
	}

	// Handle Opening / Entrance
	useEffect(() => {
		if (mode !== "overlay" || !isOverlayOpen) return;
		const aside = asideRef.current;
		const backdrop = backdropRef.current;
		const nav = navRef.current;
		if (!aside) return;

		// Entrance (Decisive: 0.3s)
		animate(aside, { x: 0 }, { duration: 0.3, ease: [0.22, 1, 0.36, 1] });
		if (backdrop) {
			animate(backdrop, { opacity: 1 }, { duration: 0.25 });
			backdrop.style.pointerEvents = "auto";
		}
		// Stagger links
		if (nav) {
			animate(
				Array.from(nav.children),
				{ opacity: [0, 1], x: [-24, 0] },
				{ delay: stagger(0.04), duration: 0.35, ease: [0.22, 1, 0.36, 1] }
			);
		}

		console.log("[LeftSidebar] Opening - dispatching sidebar:pause");
		window.dispatchEvent(new Event("sidebar:pause"));
	}, [mode, isOverlayOpen]);

	// Initial Position Authority
	useEffect(() => {
		if (mode !== "overlay") return;
		const aside = asideRef.current;
		if (aside) animate(aside, { x: "-100%" }, { duration: 0 });
	}, [mode]);

	function isActive(current: string, target: string) {
		return current === target || current.startsWith(target + "/");
	}

	// Body lock & Inert
	useEffect(() => {
		if (mode !== "overlay") return;
		const root = document.getElementById("spa-root");
		if (isOverlayOpen) {
			document.body.style.overflow = "hidden";
			root?.setAttribute("inert", "");
		} else {
			document.body.style.overflow = "";
			root?.removeAttribute("inert");
		}
		return () => {
			document.body.style.overflow = "";
			root?.removeAttribute("inert");
		}
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
							key={link.label}
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



	// Overlay mode: Only render when open
	if (mode === "overlay" && isOverlayOpen) {
		return (
			<div className="z-50">
				<div
					ref={backdropRef}
					className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
					style={{ opacity: 0, pointerEvents: "none" }}
					onClick={() => closeAndNavigate()}
				/>

				<aside
					ref={asideRef}
					role="navigation"
					aria-label="Main navigation"
					className="sidebar-shell fixed inset-y-0 left-0 z-50 w-[80vw] max-w-88 pt-6 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] shadow-2xl"
					style={{ transform: "translateX(-100%)" }}
				>
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
							onClick={() => closeAndNavigate()}
							className="w-10 h-10 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-soft)] text-accent flex items-center justify-center hover:bg-[var(--color-surface-strong)] transition-all active:scale-95 group shadow-lg shadow-black/20"
							aria-label="Close sidebar"
						>
							<span className="icon-[solar--close-circle-bold-duotone] text-2xl group-hover:rotate-90 transition-transform duration-300" />
						</button>
					</div>

					<nav ref={navRef} className="flex flex-col gap-3 px-4">
						{links.map(link => (
							<SidebarLink

								label={link.label}
								href={mode === "overlay" ? undefined : link.href}
								icon={link.icon}
								iconActive={link.iconActive}
								active={isActive(activePath, link.href)}
								collapsed={false}
								onClick={() => closeAndNavigate(link.href)}
							/>
						))}
					</nav>
				</aside>
			</div>
		);
	}

	return null;
}

/* ---------------- utils ---------------- */

function normalizePath(raw: string) {
	return raw.toLowerCase().replace(/\/+$/, "") || "/";
}
