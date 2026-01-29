import { useRef } from "Reactor";
import { animate } from "motion";

interface SidebarLinkProps {
	label: string;
	href: string;
	icon: string;
	iconActive: string;
	active: boolean;
	collapsed: boolean;
	onClick: () => void;
}

export default function SidebarLink({ label, href, icon, iconActive, active, collapsed, onClick }: SidebarLinkProps) {
	const ref = useRef<HTMLAnchorElement>(null);

	// Direct event handlers - re-attached on every render (Reactor-compatible)
	const handlePointerEnter = () => {
		if (!ref.current) return;
		animate(ref.current, { scale: 1.05 }, { duration: 0.15, ease: "easeOut" });
	};

	const handlePointerLeave = () => {
		if (!ref.current) return;
		animate(ref.current, { scale: 1 }, { duration: 0.2, ease: "easeInOut" });
	};

	const handlePointerDown = () => {
		if (!ref.current) return;
		animate(ref.current, { scale: 0.96 }, { duration: 0.08 });
	};

	const handlePointerUp = () => {
		if (!ref.current) return;
		animate(ref.current, { scale: 1 }, { duration: 0.2, ease: "easeInOut" });
	};

	return (
		<a
			ref={ref}
			href={href}
			onClick={onClick}
			onPointerEnter={handlePointerEnter}
			onPointerLeave={handlePointerLeave}
			onPointerDown={handlePointerDown}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerLeave}
			title={collapsed ? label : undefined}
			className={`sidebar-link fx-energy group rounded-lg flex items-center ${!collapsed ? "px-3 py-2.5 justify-between w-full" : "p-1.5 justify-center"} ${active ? "sidebar-link--active energy-focus" : "energy-none"} hover:energy-low`}
		>
			<span className={`flex items-center ${!collapsed ? "gap-4" : ""}`}>
				<span className={`sidebar-icon-shell ${active ? "sidebar-icon-shell--active" : ""}`}>
					<span className={`${active ? iconActive : icon} ${active ? "sidebar-icon--active" : ""} text-xl`} />
				</span>
				<span className={!collapsed ? "font-medium" : "sr-only"}>{label}</span>
			</span>

			{!collapsed && <span className="icon-[solar--arrow-right-bold] text-xl opacity-50" />}
		</a>
	);
}