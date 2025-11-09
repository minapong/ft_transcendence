export function Home() {
	return (
		<section className="relative h-[calc(100vh-9vh)] flex flex-col justify-center items-center text-center overflow-hidden font-serif">
			{/* 🏔️ Background image */}
			<div className="absolute inset-0 bg-[url('/images/misty_mountains.jpg')] bg-cover bg-center bg-fixed brightness-[0.7] contrast-[1.1]"></div>

			{/* 🌫️ Mist layers */}
			<div className="absolute inset-0 bg-gradient-to-b from-black/70 via-slate-900/50 to-stone-900/80 pointer-events-none"></div>
			<div className="absolute inset-0 bg-[url('/textures/mist.png')] bg-repeat-x opacity-15 animate-[fogMove_90s_linear_infinite] pointer-events-none"></div>

			{/* ⚔️ Title and Button */}
			<div className="relative z-10 flex flex-col items-center space-y-6">
				<h1 className="text-6xl md:text-7xl text-rune font-bold drop-shadow-[0_0_20px_rgba(212,175,55,0.6)] animate-fadeIn">
					LALALA
				</h1>

				<a
					href="/game/matchmaking/tournament"
					className="mt-4 bg-gradient-to-b from-rune/90 to-rune/70 text-stone-900 font-bold text-2xl px-8 py-3 rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.8)] hover:scale-105 transition-all duration-500"
				>
					Enter the Arena
				</a>
			</div>
		</section>
	);
}
