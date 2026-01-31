import SidebarLink from "@/app/components/ui/SidebarLink"
import { navigate, useEffect, useRef, useState, useCallback, useEventListener } from "Reactor"
import { useLocation } from "Reactor/router/useLocation"
import { animate, stagger } from "motion"

const links = [
	{ label: "Home", href: "/", icon: "icon-[solar--home-smile-bold-duotone]", iconActive: "icon-[solar--home-smile-linear]" },
	{ label: "Tournament", href: "/tournament/start", icon: "icon-[solar--cup-star-bold-duotone]", iconActive: "icon-[solar--cup-star-linear]" },
	{ label: "Pong", href: "/game/legacy_form_setup", icon: "icon-[solar--gameboy-bold-duotone]", iconActive: "icon-[solar--gameboy-linear]" },
	{ label: "Connect4", href: "/game/connect4_single", icon: "icon-[solar--widget-5-bold-duotone]", iconActive: "icon-[solar--widget-5-linear]" },
	{ label: "Contact", href: "/contact", icon: "icon-[solar--chat-round-call-bold-duotone]", iconActive: "icon-[solar--chat-round-call-linear]" },
	{ label: "Dashboard", href: "/dashboard", icon: "icon-[solar--chart-square-bold-duotone]", iconActive: "icon-[solar--chart-square-linear]" },
];

interface SidebarProps {
	isOverlayOpen: boolean;
	setIsOverlayOpen?: (v: boolean | ((p: boolean) => boolean)) => void;
	isCollapsed?: boolean;
	hidden?: boolean;
}
export default function Sidebar({ isOverlayOpen, setIsOverlayOpen, mode, isCollapsed = false, hidden = false }: SidebarProps & { mode: "overlay" | "static" }) {

	const activePath = normalizePath(useLocation());
	const [pendingPath, setPendingPath] = useState<string | null>(null);
	const resolvedPath = mode === "overlay" ? (pendingPath ?? activePath) : activePath;

	const asideRef = useRef<HTMLDivElement | null>(null);
	const backdropRef = useRef<HTMLDivElement | null>(null);
	const navRef = useRef<HTMLElement | null>(null);
	const isClosingRef = useRef(false);

	useEffect(() => {
		if (hidden || mode !== "overlay") return;
		if (!isOverlayOpen) setPendingPath(null);
	}, [activePath, isOverlayOpen, mode, hidden]);

	const closeAndNavigate = useCallback((href?: string) => {
		if (isClosingRef.current) return;
		if (href && mode === "overlay") setPendingPath(normalizePath(href));

		if (mode === "static") {
			if (href) navigate(href);
			return;
		}

		const aside = asideRef.current;
		const backdrop = backdropRef.current;
		if (!aside) return;

		isClosingRef.current = true;

		const asideAnim = animate(aside, { x: "-100%" }, { duration: 0.3, ease: [0.22, 1, 0.36, 1] });
		const backdropAnim = backdrop ? animate(backdrop, { opacity: 0 }, { duration: 0.25 }) : null;

		Promise.all([asideAnim.finished, backdropAnim?.finished || Promise.resolve()]).then(() => {
			isClosingRef.current = false;
			if (setIsOverlayOpen) {
				// Add a delay before closing overlay to allow animation to finish
				setTimeout(() => {
					setIsOverlayOpen(false);
					window.dispatchEvent(new Event("sidebar:resume"));
				}, 300); // 300ms matches animation duration
			} else {
				window.dispatchEvent(new Event("sidebar:resume"));
			}
			if (href) navigate(href);
		});
	}, [mode, setIsOverlayOpen, setPendingPath]);

	useEffect(() => {
		if (hidden || mode !== "overlay" || !asideRef.current) return;
		if (!isOverlayOpen) {
			asideRef.current.style.transform = "translateX(-100%)";
		}
	}, [mode, hidden]);

	useEffect(() => {
		if (hidden || mode !== "overlay") return;
		const aside = asideRef.current;
		const backdrop = backdropRef.current;
		const nav = navRef.current;
		if (!aside) return;

		if (isOverlayOpen) {
			animate(aside, { x: [-100, 0] }, { duration: 0.3, ease: [0.22, 1, 0.36, 1] });
			if (backdrop) {
				animate(backdrop, { opacity: [0, 1] }, { duration: 0.25 });
				backdrop.style.pointerEvents = "auto";
			}
			if (nav) {
				animate(
					Array.from(nav.children),
					{ opacity: [0, 1], x: [-16, 0] },
					{ delay: stagger(0.04), duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }
				);
			}
		} else {
			animate(aside, { x: "-100%" }, { duration: 0 });
			if (backdrop) {
				animate(backdrop, { opacity: 0 }, { duration: 0 });
				backdrop.style.pointerEvents = "none";
			}
		}
	}, [mode, isOverlayOpen, hidden]);

	useEffect(() => {
		if (hidden || mode !== "overlay") {
			document.body.style.overflow = "";
			document.getElementById("spa-root")?.removeAttribute("inert");
			return;
		}
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
	}, [mode, isOverlayOpen, hidden]);

	useEffect(() => {
		if (hidden || mode !== "static" || !asideRef.current) return;
		animate(
			asideRef.current,
			{
				width: isCollapsed ? "0px" : "18rem",
				opacity: isCollapsed ? 0 : 1,
			},
			{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }
		);

		if (navRef.current) {
			animate(
				Array.from(navRef.current.children),
				{
					opacity: isCollapsed ? 0 : 1,
					x: isCollapsed ? -12 : 0
				},
				{
					delay: stagger(0.03, { from: isCollapsed ? "last" : "first" }),
					duration: 0.2
				}
			);
		}
	}, [mode, isCollapsed, hidden]);

	useEventListener("sidebar:close", () => closeAndNavigate());

	function isActive(current: string, target: string) {
		return current === target || current.startsWith(target + "/");
	}

	// ALWAYS process SidebarLinks to keep hook counts stable
	const sidebarLinks = links.map(link => (
		<SidebarLink
			label={link.label}
			href={link.href}
			icon={link.icon}
			iconActive={link.iconActive}
			active={isActive(resolvedPath, link.href)}
			collapsed={isCollapsed}
			onClick={() => { if (link.href) closeAndNavigate(link.href); }}
		/>
	));

	// Use CSS to hide instead of returning null to maintain consistent hook calls
	if (mode === "static") {
		return (
			<aside
				ref={asideRef}
				role="navigation"
				aria-label="Main navigation"
				className="sidebar-shell bg-(--color-surface) h-full overflow-hidden flex-shrink-0 z-30 border-r border-(--color-border-soft) flex flex-col origin-left will-change-[width,opacity]"
				style={{ display: hidden ? "none" : "flex" }}
			>
				<div className="w-72 flex-shrink-0">
					<nav ref={navRef as any} className="flex flex-col gap-3.5 px-3 pt-6">
						{sidebarLinks}
					</nav>
				</div>
			</aside>
		);
	}

	if (mode === "overlay") {
		return (
			<div
				className="z-[110]"
				style={{
					display: hidden ? "none" : "block",
					opacity: isOverlayOpen ? 1 : 0,
					pointerEvents: isOverlayOpen ? "auto" : "none",
				}}
			>
				<div
					ref={backdropRef}
					className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[111]"
					style={{ opacity: 0 }}
					onClick={() => closeAndNavigate()}
				/>

				<aside
					ref={asideRef}
					role="navigation"
					aria-label="Main navigation"
					className="sidebar-shell fixed inset-y-0 left-0 z-[112] w-[80vw] max-w-88 pt-6 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] shadow-2xl"
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
							className="w-10 h-10 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-soft)] text-accent flex items-center justify-center hover:bg-[var(--color-surface-strong)] transition-all active:scale-95 group shadow-lg shadow-black/20"
							aria-label="Close sidebar"
						>
							<span className="icon-[solar--close-circle-bold-duotone] text-2xl group-hover:rotate-90 transition-transform duration-300" />
						</button>
					</div>

					<nav ref={navRef as any} className="flex flex-col gap-3 px-4">
						{sidebarLinks}
					</nav>
				</aside>
			</div>
		);
	}

	return null;
}

function normalizePath(raw: string) {
	const p = raw.toLowerCase().replace(/\/+$/, "");
	return p === "" ? "/" : p;
}
