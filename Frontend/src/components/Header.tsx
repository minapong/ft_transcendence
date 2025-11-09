export function Header() {
	return (
		<header className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-stone-900 text-rune shadow-md border-b border-slate-700 backdrop-blur-sm h-[9vh] flex items-center overflow-hidden">
			
			{/* 🪨 Optional visual overlay (stone texture / mist) */}
			<div className="absolute inset-0 bg-[url('/textures/stone.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>

			{/* 🌫️ Optional mist/fog gradient on top */}
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/30 to-stone-900/70 pointer-events-none"></div>

			{/* ⚔️ Actual header nav content */}
			<nav className="relative z-10 flex justify-around items-center w-full px-10 gap-6 font-serif uppercase tracking-widest">
				<a href="/" className="text-2xl font-bold text-rune px-3 py-1 rounded-lg transition-all duration-300 hover:text-amber-400 hover:drop-shadow-[0_0_10px_rgba(251,191,36,0.6)] hover:scale-110">Home</a>
				<a href="/login" className="text-2xl font-bold text-thunder px-3 py-1 rounded-lg transition-all duration-300 hover:text-rune hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.7)] hover:scale-110">Login</a>
				<a href="/contact" className="text-2xl font-bold text-thunder px-3 py-1 rounded-lg transition-all duration-300 hover:text-rune hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.7)] hover:scale-110">Contact</a>
				<a href="/game/matchmaking/tournament" className="text-2xl font-bold text-thunder px-3 py-1 rounded-lg transition-all duration-300 hover:text-rune hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.7)] hover:scale-110">Tournament</a>
				<a href="/about" className="text-2xl font-bold text-thunder px-3 py-1 rounded-lg transition-all duration-300 hover:text-rune hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.7)] hover:scale-110">Santiago</a>
			</nav>
		</header>
	);
}
