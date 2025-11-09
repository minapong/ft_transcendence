import { Header } from "components/Header";
// import { Side } from "components/Side";

export function MainLayout(Page: () => HTMLElement) {
	return (
		<div className="relative min-h-screen flex flex-col text-thunder font-serif bg-slate-950 overflow-hidden">
			{/* 🪓 Top Header */}
			<Header />
			<div className="relative z-30">
				<Header />
			</div>

			{/* 🌄 Background Image — Misty Mountains */}
			<div className="absolute inset-0 bg-[url('/images/misty_mountains.jpg')] bg-cover bg-center bg-fixed brightness-[0.6] contrast-[1.2]"></div>

			{/* 🌫️ Layered Mist & Glow Effects */}
			<div className="absolute inset-0 bg-gradient-to-b from-black/70 via-slate-900/50 to-stone-900/80 pointer-events-none animate-[mist_10s_ease-in-out_infinite_alternate]"></div>
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] mix-blend-soft-light pointer-events-none"></div>

			{/* ⚔️ Main Content */}
			<main
				id="spa-root"
				className="relative z-10 flex-1 px-8 py-6 backdrop-blur-[2px] text-center"
			>
				{Page()}
			</main>

			{/* 🌫️ Foreground drifting mist layer */}
			<div className="absolute bottom-0 left-0 w-full h-[40vh] bg-[url('/textures/mist.png')] bg-repeat-x opacity-20 animate-[fogMove_60s_linear_infinite] pointer-events-none"></div>

			{/* 🧱 Optional future side panel */}
			{/* <Side /> */}

			{/* ✨ Atmospheric glow overlay */}
			<div className="fixed inset-0 bg-gradient-to-t from-black/60 via-slate-900/10 to-transparent pointer-events-none"></div>
		</div>
	);
}
