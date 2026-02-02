import { pong4PLogic } from "@/core/engine/4p_pong_logic";
import { navigate, useEffect, useRef, useLocation, openModal, closeModal } from "Reactor";
import { GAME_PAUSE_EVENT } from "@/core/engine/pong_logic";
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
		navigate("/game/pre_match_scene", { replace: true });
		return null;
	}

	// Refs for game elements
	const ballRef = useRef<HTMLDivElement>(null);
	const leftPaddleRef = useRef<HTMLDivElement>(null);
	const rightPaddleRef = useRef<HTMLDivElement>(null);
	const upperPaddleRef = useRef<HTMLDivElement>(null);
	const lowerPaddleRef = useRef<HTMLDivElement>(null);
	const pauseBtnRef = useRef<HTMLButtonElement>(null);
	const scoreRedRef = useRef<HTMLSpanElement>(null);
	const scoreBlueRef = useRef<HTMLSpanElement>(null);

	// Input Ref
	const inputRef = useRef({
		w: false, s: false,
		num6: false, num3: false,
		v: false, b: false,
		left: false, right: false
	});

	// Native Keyboard Listeners
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
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
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			const k = e.key;
			if (k === 'w') inputRef.current.w = false;
			if (k === 's') inputRef.current.s = false;
			if (k === '6') inputRef.current.num6 = false;
			if (k === '3') inputRef.current.num3 = false;
			if (k === 'ArrowLeft') inputRef.current.left = false;
			if (k === 'ArrowRight') inputRef.current.right = false;
			if (k === 'v') inputRef.current.v = false;
			if (k === 'b') inputRef.current.b = false;
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, []);

	const gameInitialized = useRef(false);

	useEffect(() => {
		if (gameInitialized.current) return;

		// Ensure all refs are defined
		if (!ballRef.current || !leftPaddleRef.current || !rightPaddleRef.current ||
			!upperPaddleRef.current || !lowerPaddleRef.current || !pauseBtnRef.current ||
			!scoreRedRef.current || !scoreBlueRef.current) {
			return;
		}

		gameInitialized.current = true;

		// Start the game with refs
		const cleanup = pong4PLogic(
			{
				ball: ballRef.current,
				leftPaddle: leftPaddleRef.current,
				rightPaddle: rightPaddleRef.current,
				upperPaddle: upperPaddleRef.current,
				lowerPaddle: lowerPaddleRef.current,
				pauseBtn: pauseBtnRef.current,
				// Pass dummy elements as they are not used for listeners anymore
				// Logic file expects them but we handle inputs via ref now
				// We'll just pass the paddle refs again or mocks to satisfy the type signature
				// Actually, the logic file sets listeners on them. Wait.
				// The logic file WAS modified to NOT set listeners on buttons. 
				// It still retains them in the signature though.
				// We should pass null or dummy elements? 
				// The Type definition in logic file demands HTMLButtonElement.
				// Let's create dummy elements to satisfy the strict type if needed,
				// or better, just pass "pauseBtnRef.current" repetitively as placeholders since they aren't used.
				// WAIT: The previous step removed the listeners but KEPT the destructured arguments.
				// This implies I need to pass *something*.
				leftUpBtn: pauseBtnRef.current,
				leftDownBtn: pauseBtnRef.current,
				rightUpBtn: pauseBtnRef.current,
				rightDownBtn: pauseBtnRef.current,
				topLeftBtn: pauseBtnRef.current,
				topRightBtn: pauseBtnRef.current,
				bottomLeftBtn: pauseBtnRef.current,
				bottomRightBtn: pauseBtnRef.current,
				scoreRedDisplay: scoreRedRef.current,
				scoreBlueDisplay: scoreBlueRef.current
			},
			inputRef,
			(winner) => {
				const teamName = winner === "red" ? "Red Team" : "Blue Team";

				// Dispatch pause
				window.dispatchEvent(new Event(GAME_PAUSE_EVENT));

				openModal({
					type: "pong-winner",
					payload: {
						winner: teamName,
						scoreP1: Number(scoreRedRef.current?.textContent || 0),
						scoreP2: Number(scoreBlueRef.current?.textContent || 0),
						isTournament: false,
						onNavigate: (dest) => {
							closeModal();
							navigate("/game/pre_match_scene", { replace: true });
						},
						preventClose: true
					}
				});
			}
		);

		// Cleanup function runs on unmount
		return () => {
			cleanup();
			gameInitialized.current = false;
		};
	});

	// Helper for pointer handlers
	const handlePointerInfo = (field: keyof typeof inputRef.current, val: boolean) => {
		inputRef.current[field] = val;
	};

	return (
		<div id="p4_game" className="bg-gray-900 flex flex-col items-center justify-center h-full">
			<div id="players_names" className="
				flex justify-between 
				w-full text-white 
				text-lg
				font-bold mb-2
                max-w-[500px]
				">
				<div className="text-left">
					<div className="text-red-400">Red Team</div>
					<div id="redNames" className="text-sm text-gray-300">{navState.p1} & {navState.p2}</div>
					<div>Score: <span ref={scoreRedRef} id="scoreRed">0</span></div>
				</div>

				<div className="text-right">
					<div className="text-blue-400">Blue Team</div>
					<div id="blueNames" className="text-sm text-gray-300">{navState.p3} & {navState.p4}</div>
					<div>Score: <span ref={scoreBlueRef} id="scoreBlue">0</span></div>
				</div>
			</div>

			<div className="relative flex items-center justify-center overflow-visible">

				{/* LEFT CONTROLS */}
				<div id="left_btns" className="absolute -left-20 top-1/2 -translate-y-1/2 flex flex-col gap-2">
					<button
						onPointerDown={() => handlePointerInfo("w", true)}
						onPointerUp={() => handlePointerInfo("w", false)}
						onPointerLeave={() => handlePointerInfo("w", false)}
						className="btn btn-game"
					>⬆</button>
					<button
						onPointerDown={() => handlePointerInfo("s", true)}
						onPointerUp={() => handlePointerInfo("s", false)}
						onPointerLeave={() => handlePointerInfo("s", false)}
						className="btn btn-game"
					>⬇</button>
				</div>

				{/* RIGHT CONTROLS */}
				<div id="right_btns" className="absolute -right-20 top-1/2 -translate-y-1/2 flex flex-col gap-2">
					<button
						onPointerDown={() => handlePointerInfo("num6", true)}
						onPointerUp={() => handlePointerInfo("num6", false)}
						onPointerLeave={() => handlePointerInfo("num6", false)}
						className="btn btn-game"
					>⬆</button>
					<button
						onPointerDown={() => handlePointerInfo("num3", true)}
						onPointerUp={() => handlePointerInfo("num3", false)}
						onPointerLeave={() => handlePointerInfo("num3", false)}
						className="btn btn-game"
					>⬇</button>
				</div>

				{/* TOP CONTROLS */}
				<div id="top_btns" className="absolute -top-20 left-1/2 -translate-x-1/2 flex gap-2">
					<button
						onPointerDown={() => handlePointerInfo("v", true)}
						onPointerUp={() => handlePointerInfo("v", false)}
						onPointerLeave={() => handlePointerInfo("v", false)}
						className="btn btn-game"
					>⬅</button>
					<button
						onPointerDown={() => handlePointerInfo("b", true)}
						onPointerUp={() => handlePointerInfo("b", false)}
						onPointerLeave={() => handlePointerInfo("b", false)}
						className="btn btn-game"
					>➡</button>
				</div>

				{/* BOTTOM CONTROLS */}
				<div id="bottom_btns" className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
					<button
						onPointerDown={() => handlePointerInfo("left", true)}
						onPointerUp={() => handlePointerInfo("left", false)}
						onPointerLeave={() => handlePointerInfo("left", false)}
						className="btn btn-game"
					>⬅</button>
					<button
						onPointerDown={() => handlePointerInfo("right", true)}
						onPointerUp={() => handlePointerInfo("right", false)}
						onPointerLeave={() => handlePointerInfo("right", false)}
						className="btn btn-game"
					>➡</button>
				</div>
				<div
					id="game_board"
					className="bg-gray-800 border-4
					border-l-red-500 border-b-red-500 
					border-t-blue-500 border-r-blue-500 
					rounded-lg w-[200px] h-[200px] relative shadow-2xl"
					style={{
						boxShadow: `
                        inset 0 0 0 1px rgba(255, 255, 255, 0.06),
                        0 8px 30px rgba(0, 0, 0, 0.6)
                        `,
					}}
				>
					<div
						ref={leftPaddleRef}
						id="left_p"
						className="absolute left-2 top-1/2 w-2 h-16 bg-white"
						style={{ boxShadow: `0 0 8px rgba(239, 68, 68, 0.6)` }} // Red glow
					></div>
					<div
						ref={rightPaddleRef}
						id="right_p"
						className="absolute right-2 top-1/2 w-2 h-16 bg-white"
						style={{ boxShadow: `0 0 8px rgba(59, 130, 246, 0.6)` }} // Blue glow
					></div>
					<div
						ref={upperPaddleRef}
						id="upper_p"
						className="absolute top-2 left-1/2 h-2 w-16 bg-white"
						style={{ boxShadow: `0 0 8px rgba(59, 130, 246, 0.6)` }}
					></div>
					<div
						ref={lowerPaddleRef}
						id="lower_p"
						className="absolute bottom-2 left-1/2 h-2 w-16 bg-white"
						style={{ boxShadow: `0 0 8px rgba(239, 68, 68, 0.6)` }}
					></div>

					<div
						ref={ballRef}
						id="ball"
						className="absolute w-3 h-3 bg-white rounded-full top-1/2 left-1/2"
						style={{
							boxShadow: `
                            0 0 10px 2px rgba(0, 255, 255, 0.8),
                            0 0 20px 4px rgba(0, 255, 255, 0.5),
                            inset 0 0 5px rgba(0, 255, 255, 0.6)
                        `,
							filter: 'brightness(1.2)',
							transition: 'transform 0.05s linear'
						}}
					></div>

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
				onClick={() => { navigate("/game/pre_match_scene"); }}
				className="mt-6 text-cyan-400 underline hover:text-cyan-200"
			>
				← Back to menu
			</button>

		</div>
	);
}