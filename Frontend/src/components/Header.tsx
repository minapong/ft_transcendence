// src/components/Header.tsx
export function Header() {

	return (
		<div className="bg-black text-white text-3xl h-[7vh] flex items-center">
			<nav className="flex justify-around items-center w-full">
				<ls><a href="/login">Login</a></ls>
				<ls><a href="/contact">Contact</a></ls>
				<ls><a href="/game/matchmaking/tournament">Tournament</a></ls>
			</nav>
		</div>
	);
}
