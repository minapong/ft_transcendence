import { pong4PLogic } from "@/core/engine/4p_pong_logic";
import { navigate, useEffect, useRef, useEventListener } from "Reactor";
import "@/styles/game/pong-4player.css"

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
		navigate("/game/single_game", { replace: true });
		return null;
	}

	const teamRed = `${navState.p1} & ${navState.p2}`;
	const teamBlue = `${navState.p3} & ${navState.p4}`;

	// Refs for game elements
	const ballRef = useRef<HTMLDivElement>(null);
	const leftPaddleRef = useRef<HTMLDivElement>(null);
	const rightPaddleRef = useRef<HTMLDivElement>(null);
	const upperPaddleRef = useRef<HTMLDivElement>(null);
	const lowerPaddleRef = useRef<HTMLDivElement>(null);
	const pauseBtnRef = useRef<HTMLButtonElement>(null);
	const scoreRedRef = useRef<HTMLSpanElement>(null);
	const scoreBlueRef = useRef<HTMLSpanElement>(null);

	// Refs for control buttons
	const leftUpBtnRef = useRef<HTMLButtonElement>(null);
	const leftDownBtnRef = useRef<HTMLButtonElement>(null);
	const rightUpBtnRef = useRef<HTMLButtonElement>(null);
	const rightDownBtnRef = useRef<HTMLButtonElement>(null);
	const topLeftBtnRef = useRef<HTMLButtonElement>(null);
	const topRightBtnRef = useRef<HTMLButtonElement>(null);
	const bottomLeftBtnRef = useRef<HTMLButtonElement>(null);
	const bottomRightBtnRef = useRef<HTMLButtonElement>(null);

	// Input Ref
	const inputRef = useRef({
		w: false, s: false,
		num6: false, num3: false,
		v: false, b: false,
		left: false, right: false
	});

	// Event Listeners
	useEventListener("keydown", (e: KeyboardEvent) => {
		const k = e.key;
		if (k === 'w') inputRef.current.w = true;
		if (k === 's') inputRef.current.s = true;
		if (k === '6') inputRef.current.num6 = true;
		if (k === '3') inputRef.current.num3 = true;
		if (k === 'ArrowLeft') inputRef.current.left = true;
		if (k === 'ArrowRight') inputRef.current.right = true;
		if (k === 'v') inputRef.current.v = true;
		if (k === 'b') inputRef.current.b = true;

		if (['ArrowLeft', 'ArrowRight', ' '].includes(k)) e.preventDefault();
	});

	useEventListener("keyup", (e: KeyboardEvent) => {
		const k = e.key;
		if (k === 'w') inputRef.current.w = false;
		if (k === 's') inputRef.current.s = false;
		if (k === '6') inputRef.current.num6 = false;
		if (k === '3') inputRef.current.num3 = false;
		if (k === 'ArrowLeft') inputRef.current.left = false;
		if (k === 'ArrowRight') inputRef.current.right = false;
		if (k === 'v') inputRef.current.v = false;
		if (k === 'b') inputRef.current.b = false;
	});

	useEffect(() => {
		const overlay = document.getElementById("winnerOverlay")!;
		const text = document.getElementById("winnerText")!;
		let winTimeout: number | null = null;

		// Ensure all refs are defined
		if (!ballRef.current || !leftPaddleRef.current || !rightPaddleRef.current ||
			!upperPaddleRef.current || !lowerPaddleRef.current || !pauseBtnRef.current ||
			!scoreRedRef.current || !scoreBlueRef.current ||
			!leftUpBtnRef.current || !leftDownBtnRef.current ||
			!rightUpBtnRef.current || !rightDownBtnRef.current ||
			!topLeftBtnRef.current || !topRightBtnRef.current ||
			!bottomLeftBtnRef.current || !bottomRightBtnRef.current) {
			console.error("4P Pong: One or more refs are null");
			return;
		}

		// Start the game with refs
		const cleanup = pong4PLogic(
			{
				ball: ballRef.current,
				leftPaddle: leftPaddleRef.current,
				rightPaddle: rightPaddleRef.current,
				upperPaddle: upperPaddleRef.current,
				lowerPaddle: lowerPaddleRef.current,
				pauseBtn: pauseBtnRef.current,
				leftUpBtn: leftUpBtnRef.current,
				leftDownBtn: leftDownBtnRef.current,
				rightUpBtn: rightUpBtnRef.current,
				rightDownBtn: rightDownBtnRef.current,
				topLeftBtn: topLeftBtnRef.current,
				topRightBtn: topRightBtnRef.current,
				bottomLeftBtn: bottomLeftBtnRef.current,
				bottomRightBtn: bottomRightBtnRef.current,
				scoreRedDisplay: scoreRedRef.current,
				scoreBlueDisplay: scoreBlueRef.current
			},
			inputRef,
			(winner) => {
				text.textContent = winner === "red" ? "Red Team Wins! 🏆" : "Blue Team Wins! 🏆";
				overlay.classList.remove("hidden");

				winTimeout = window.setTimeout(() => {
					navigate("/game/single_game");
				}, 2000);
			}
		);

		// Hide overlay initially
		overlay.classList.add("hidden");

		// Cleanup function runs on unmount
		return () => {
			if (winTimeout !== null) {
				clearTimeout(winTimeout);
				winTimeout = null;
			}
			cleanup();
		};
	});

	return (
		<div id="p4_game" className="bg-gray-900 flex flex-col items-center justify-center h-full">
			<div id="players_names" className="
				flex justify-between 
				w-full text-white 
				text-lg
				font-bold mb-2
				">
				<div className="text-left">
					<div>Red Team</div>
					<div id="redNames">{navState.p1} & {navState.p2}</div>
					<div>Score: <span ref={scoreRedRef} id="scoreRed">0</span></div>
				</div>

				<div className="text-right">
					<div>Blue Team</div>
					<div id="blueNames">{navState.p3} & {navState.p4}</div>
					<div>Score: <span ref={scoreBlueRef} id="scoreBlue">0</span></div>
				</div>
			</div>

			<div className="relative flex items-center justify-center overflow-visible">

				{/* LEFT CONTROLS */}
				<div id="left_btns" className="absolute -left-20 top-1/2 -translate-y-1/2 flex flex-col gap-2">
					<button ref={leftUpBtnRef} id="left-up" className="btn btn-game">⬆</button>
					<button ref={leftDownBtnRef} id="left-down" className="btn btn-game">⬇</button>
				</div>

				{/* RIGHT CONTROLS */}
				<div id="right_btns" className="absolute -right-20 top-1/2 -translate-y-1/2 flex flex-col gap-2">
					<button ref={rightUpBtnRef} id="right-up" className="btn btn-game">⬆</button>
					<button ref={rightDownBtnRef} id="right-down" className="btn btn-game">⬇</button>
				</div>

				{/* TOP CONTROLS */}
				<div id="top_btns" className="absolute -top-20 left-1/2 -translate-x-1/2 flex gap-2">
					<button ref={topLeftBtnRef} id="top-left" className="btn btn-game">⬅</button>
					<button ref={topRightBtnRef} id="top-right" className="btn btn-game">➡</button>
				</div>

				{/* BOTTOM CONTROLS */}
				<div id="bottom_btns" className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
					<button ref={bottomLeftBtnRef} id="bottom-left" className="btn btn-game">⬅</button>
					<button ref={bottomRightBtnRef} id="bottom-right" className="btn btn-game">➡</button>
				</div>
				<div
					id="game_board"
					className="bg-gray-800 border-4
					border-l-red-500 border-b-red-500 
					border-t-blue-500 border-r-blue-500 
					rounded-lg w-[200px] h-[200px] relative"
				>
					<div ref={leftPaddleRef} id="left_p" className="absolute left-2 top-1/2 w-2 h-16 bg-white"></div>
					<div ref={rightPaddleRef} id="right_p" className="absolute right-2 top-1/2 w-2 h-16 bg-white"></div>
					<div ref={upperPaddleRef} id="upper_p" className="absolute top-2 left-1/2 h-2 w-16 bg-white"></div>
					<div ref={lowerPaddleRef} id="lower_p" className="absolute bottom-2 left-1/2 h-2 w-16 bg-white"></div>
					<div ref={ballRef} id="ball" className="absolute w-3 h-3 bg-white rounded-full top-1/2 left-1/2"></div>

				</div>
			</div>
			<br></br>
			<br></br>
			<br></br>
			<button
				ref={pauseBtnRef}
				id="pauseBtn"
				className="mt-3 px-3 py-1.5 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400"
			>
				⏸️ Pause
			</button>

			<button
				onClick={() => { navigate("/game/single_game"); }}
				className="mt-6 text-cyan-400 underline hover:text-cyan-200"
			>
				← Back to menu
			</button>

			<div
				id="winnerOverlay"
				className="hidden absolute inset-0 flex bg-black/70 items-center justify-center text-white text-4xl font-bold z-50"
			>
				<div id="winnerText"></div>
			</div>

		</div>
	);
}