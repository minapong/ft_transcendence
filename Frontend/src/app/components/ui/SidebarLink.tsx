import { useRef } from "Reactor";
import { animate } from "motion";

interface SidebarLinkProps {
	label: string;
	href: string;
	icon: string;
	iconActive: string;
	active: boolean;
	onClick: () => void;
}

export default function SidebarLink({ label, href, icon, iconActive, active, onClick }: SidebarLinkProps) {
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
			onClick={(e: any) => {
				e?.preventDefault?.();
				onClick();
			}}
			onPointerEnter={handlePointerEnter}
			onPointerLeave={handlePointerLeave}
			onPointerDown={handlePointerDown}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerLeave}
			className={`sidebar-link fx-energy group rounded-lg flex items-center px-3 py-2.5 justify-between w-full ${active ? "sidebar-link--active energy-focus" : "energy-none"} hover:energy-low`}
		>
			<span className="flex items-center gap-4">
				<span className={`sidebar-icon-shell ${active ? "sidebar-icon-shell--active" : ""}`}>
					<span className={`${active ? iconActive : icon} ${active ? "sidebar-icon--active" : ""} text-xl`} />
				</span>
				<span className="font-medium">{label}</span>
			</span>

			<span className="icon-[solar--arrow-right-bold] text-xl opacity-50" />
		</a>
	);
}