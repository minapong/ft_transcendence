import { pong4PLogic } from "../engine/4p_pong_logic";
import { navigate } from "Reactor";

type NavState4P = {
	mode: "4p";
	p1: string;
	p2: string;
	p3: string;
	p4: string;
};

export default function Pong4PGame() {
	const navState = history.state as NavState4P | null;

	if (!navState || navState.mode !== "4p") {
		navigate("/single_game", { replace: true });
		return null;
	}

	const teamRed = `${navState.p1} & ${navState.p2}`;
	const teamBlue = `${navState.p3} & ${navState.p4}`;

	let cleanup = () => {};

	setTimeout(() => {
		cleanup = pong4PLogic((winner) => {
			const overlay = document.getElementById("winnerOverlay")!;
			const text = document.getElementById("winnerText")!;
	
			text.textContent =
				winner === "red"
					? "Red Team Wins!"
					: "Blue Team Wins!";
	
			overlay.classList.remove("hidden");
	
			// Auto-navigate after 2 seconds
			setTimeout(() => {
				navigate("/single_game");
			}, 2000);
		});
	}, 0);
	
	
	window.addEventListener("beforeunload", () => cleanup());

	return (
		<div className="bg-gray-900 flex flex-col items-center justify-center h-screen">
			<div className="flex justify-between w-[800px] text-white text-xl font-bold mb-2">
				<div className="text-left">
					<div>Red Team</div>
					<div id="redNames">{navState.p1} & {navState.p2}</div>
					<div>Score: <span id="scoreRed">0</span></div>
				</div>

				<div className="text-right">
					<div>Blue Team</div>
					<div id="blueNames">{navState.p3} & {navState.p4}</div>
					<div>Score: <span id="scoreBlue">0</span></div>
				</div>
			</div>


			<div
				id="game_board"
				className="bg-gray-800 border-8 
					border-l-red-500 border-b-red-500 
					border-t-blue-500 border-r-blue-500 
					rounded-lg w-[500px] h-[500px] relative"
			>
				<div id="left_p" className="absolute left-4 top-1/2 w-3 h-24 bg-white"></div>
				<div id="right_p" className="absolute right-4 top-1/2 w-3 h-24 bg-white"></div>
				<div id="upper_p" className="absolute top-4 left-1/2 w-24 h-3 bg-white"></div>
				<div id="lower_p" className="absolute bottom-4 left-1/2 w-24 h-3 bg-white"></div>
				<div id="ball" className="absolute w-4 h-4 bg-white rounded-full top-1/2 left-1/2"></div>
			</div>

			<button
				id="pauseBtn"
				className="mt-4 px-4 py-2 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400"
			>
				⏸️ Pause
			</button>

			<button
				onClick={() => {
					if (cleanup) cleanup();
					navigate("/single_game");
				}}
				className="mt-6 text-cyan-400 underline hover:text-cyan-200"
			>
				← Back to menu
			</button>

			<div
				id="winnerOverlay"
				className="hidden absolute inset-0 bg-black/70 hidden items-center justify-center text-white text-4xl font-bold z-50"
			>
				<div id="winnerText"></div>
			</div>
		</div>
	);
}