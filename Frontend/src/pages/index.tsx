// export default () => {
// 	return(
// 		<div className="w-screen h-screen flex justify-center items-center text-3xl bg-linear-to-br from-blue-950 via-blue-900 to-cyan-900  relative overflow-hidden">
// 			<div className="absolute top-0 right-0 left-0 bottom-0 bg-cyan-500 rounded-lg blur-3xl opacity-40 animate-pulse"></div>
// 			<div onClick={() => alert("Test alert!")} className="relative bg-cyan-300 text-white border-8 border-cyan-500 text-5xl font-bold px-8 py-6 rounded-xl shadow-2xl hover:scale-110 transition-all duration-100 cursor-pointer hover:shadow-cyan-500/50 hover:shadow-2xl">Home Home</div>
// 		</div>
// 	);
// }

export default function Home() {
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
