function Greeting() {

	let offsetHashir = 0, offsetNatalia = 0, offsetAb = 0, offsetSantiago = 0;
	let hashirBox: HTMLElement | null = null, nataliaBox: HTMLElement | null = null, abBox: HTMLElement | null = null, santiagoBox: HTMLElement | null = null;

	queueMicrotask(() => {
		window.addEventListener("keydown", e => {
			if (e.key === "ArrowUp") offsetHashir -= 100;
			else if (e.key === "ArrowDown") offsetHashir += 100;
			if (hashirBox) hashirBox.style.transform = `translateY(${offsetHashir}px)`;
			if (e.key === "Escape") {
				offsetHashir = offsetNatalia = offsetAb = offsetSantiago = 0;
				[hashirBox, nataliaBox, abBox, santiagoBox].forEach(el => el && (el.style.transform = "translateY(0)"));
			}
		});
	});

	return (
		<div
			//inline style
			style={{
				height: "100vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				gap: "2rem",
				background: "radial-gradient(circle at 50% 50%, #0f0f1a 0%, #050509 100%)",
				overflow: "hidden",
				position: "relative",
				backgroundSize: "auto"
			}}
		>
			<div ref={el => (hashirBox = el)} style={cardStyle("linear-gradient(135deg, #00e0ff, #0078ff)")}>Tournament</div>

			{/* Ambient neon lights */}
			<div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#000000] via-[#0a0022] to-[#000000] opacity-80 blur-[120px]"></div>

			{/* Glow pulse */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,150,255,0.15)_0%,transparent_70%)] animate-pulse"></div>

			{/* HUD Info */}
			<div className="absolute bottom-10 text-center text-gray-300">
				<h1 className="text-5xl font-extrabold tracking-wide drop-shadow-[0_0_10px_#00ffff] mb-3">
					Team Reactor ⚡
				</h1>
				<p className="text-lg text-gray-400 font-mono">
					↑↓ = Hashir | N/T = Natalia | A/L = Ab Rehman | S/O = Santiago | ESC = Reset
				</p>
			</div>
		</div>
	);
}

const cardStyle = (gradient: string) => ({
	background: gradient,
	width: "14vw",
	height: "14vw",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	fontWeight: "bold",
	fontSize: "1.3rem",
	color: "white",
	borderRadius: "1.2rem",
	boxShadow: `0 0 25px ${gradient.split(",")[1].replace(")", ", 0.6)")}`,
	transition: "transform 0.2s ease, box-shadow 0.3s ease",
	cursor: "pointer",
	userSelect: "none",
	border: "2px solid rgba(255,255,255,0.15)",
	textTransform: "uppercase",
	letterSpacing: "1.5px",
});

export default Greeting;
