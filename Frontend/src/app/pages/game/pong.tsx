import { pongLogic } from "@/core/engine/pong_logic";
import { navigate, useEffect, useRef, useLocation } from "Reactor";
import { apiFetch } from "@/core/lib/api";

// Define types for navigation state
type TournamentMode = {
    mode: "tournament";
    p1: { id: number; name: string };
    p2: { id: number; name: string };
    matchId: number;
};

type AIMode = {
    mode: "ai";
    p1: string;
    difficulty: "easy" | "medium" | "hard";
};

type TwoPlayerMode = {
    mode: "2p";
    p1: string;
    p2: string;
};

type NavigationState = TournamentMode | AIMode | TwoPlayerMode;

export default function PongGame() {
    // useLocation ensures component re-renders on navigation changes
    useLocation();

    // Read navigation state (tournament or free play)
    const navState = history.state as NavigationState | undefined;

    // Create refs for all DOM elements
    const ballRef = useRef<HTMLDivElement>(null);
    const leftPaddleRef = useRef<HTMLDivElement>(null);
    const rightPaddleRef = useRef<HTMLDivElement>(null);
    const pauseBtnRef = useRef<HTMLButtonElement>(null);
    const leftUpBtnRef = useRef<HTMLButtonElement>(null);
    const leftDownBtnRef = useRef<HTMLButtonElement>(null);
    const rightUpBtnRef = useRef<HTMLButtonElement>(null);
    const rightDownBtnRef = useRef<HTMLButtonElement>(null);
    const scoreLeftRef = useRef<HTMLSpanElement>(null);
    const scoreRightRef = useRef<HTMLSpanElement>(null);
    const winnerOverlayRef = useRef<HTMLDivElement>(null);
    const winnerTextRef = useRef<HTMLDivElement>(null);

    let p1Name: string;
    let p2Name: string;
    let useAI = false;
    let aiDifficulty: "easy" | "medium" | "hard" = "medium";
    let matchId: number | null = null;
    let p1Id: number | null = null;
    let p2Id: number | null = null;

    if (navState?.mode === "tournament") {
        // Tournament mode
        p1Name = navState.p1.name;
        p2Name = navState.p2.name;
        p1Id = navState.p1.id;
        p2Id = navState.p2.id;
        matchId = navState.matchId;
    } else if (navState?.mode === "ai") {
        // Free play vs AI
        p1Name = navState.p1;
        p2Name = "AI";
        useAI = true;
        aiDifficulty = navState.difficulty;
    } else if (navState?.mode === "2p") {
        // Free play 2P
        p1Name = navState.p1;
        p2Name = navState.p2;
    } else {
        // Invalid entry
        navigate("/game/single_game", { replace: true });
        return null;
    }

    useEffect(() => {
        // Ensure all refs are populated
        if (!ballRef.current || !leftPaddleRef.current || !rightPaddleRef.current ||
            !pauseBtnRef.current || !leftUpBtnRef.current || !leftDownBtnRef.current ||
            !rightUpBtnRef.current || !rightDownBtnRef.current || !scoreLeftRef.current ||
            !scoreRightRef.current || !winnerOverlayRef.current || !winnerTextRef.current) {
            return;
        }

        const overlay = winnerOverlayRef.current;
        const text = winnerTextRef.current;
        let winTimeout: number | null = null;

        const cleanup = pongLogic(
            {
                ball: ballRef.current,
                leftPaddle: leftPaddleRef.current,
                rightPaddle: rightPaddleRef.current,
                pauseBtn: pauseBtnRef.current,
                leftUpBtn: leftUpBtnRef.current,
                leftDownBtn: leftDownBtnRef.current,
                rightUpBtn: rightUpBtnRef.current,
                rightDownBtn: rightDownBtnRef.current,
                scoreLeft: scoreLeftRef.current,
                scoreRight: scoreRightRef.current,
            },
            p1Name,
            p2Name,
            (winner: string, scoreP1: number, scoreP2: number) => {
                text.textContent = `${winner} Wins! 🏆 ${scoreP1} - ${scoreP2}`;
                overlay.classList.remove("hidden");

                // If this was a tournament match, report result directly
                if (matchId !== null && p1Id !== null && p2Id !== null) {
                    const winnerId = winner === p1Name ? p1Id : p2Id;

                    apiFetch("/api/tournament/result", {
                        method: "POST",
                        body: JSON.stringify({ matchId, winnerId, scoreP1, scoreP2 }),
                        keepalive: true, // Survives page unload
                    })
                        .then(res => {
                            if (!res.ok) {
                                console.warn("[Pong] Tournament result report failed:", res.status);
                                return;
                            }
                            // console.log("[Pong] Tournament result reported successfully");
                        })
                        .catch(err => {
                            console.warn("[Pong] Failed to report tournament result:", err);
                        });
                }

                // Navigate back after 2 seconds
                winTimeout = window.setTimeout(() => {
                    if (matchId !== null) {
                        navigate("/tournament/active", { replace: true });
                    } else {
                        navigate("/game/single_game", { replace: true });
                    }
                }, 2000);
            },
            useAI,
            aiDifficulty
        );

        overlay.classList.add("hidden");

        // Cleanup function runs on unmount
        return () => {
            if (winTimeout !== null) {
                clearTimeout(winTimeout);
            }
            cleanup();
        };
    });

    return (
        <div className="bg-gray-900 flex flex-col items-center justify-center min-h-screen px-2">

            {/* Scoreboard */}
            <div className="
				flex justify-between 
				w-full max-w-[320px] sm:max-w-[500px] lg:max-w-[800px] 
				text-white 
				text-lg sm:text-xl lg:text-2xl 
				font-bold mb-2
				">
                <span ref={scoreLeftRef} id="scoreLeft">{p1Name}: 0</span>
                <span ref={scoreRightRef} id="scoreRight">{p2Name}: 0</span>
            </div>

            {/* LEFT TOUCH CONTROLS */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 sm:gap-3 lg:gap-4 ml-1 sm:ml-2">
                <button
                    ref={leftUpBtnRef}
                    id="left-up"
                    className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/80 text-black text-xl sm:text-2xl font-bold rounded-lg active:bg-white"
                >
                    ▲
                </button>
                <button
                    ref={leftDownBtnRef}
                    id="left-down"
                    className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/80 text-black text-xl sm:text-2xl font-bold rounded-lg active:bg-white"
                >
                    ▼
                </button>
            </div>

            {/* Game board */}
            <div
                id="game_board"
                className="
					bg-gray-800 border-4 sm:border-6 lg:border-8 border-white rounded-lg relative
					w-[320px] h-[200px]
					sm:w-[400px] sm:h-[280px]
					lg:w-[600px] lg:h-[380px]
					xl:w-[800px] xl:h-[500px]
				"
            >
                {/* Left paddle */}
                <div
                    ref={leftPaddleRef}
                    id="left_p"
                    className="absolute left-2 sm:left-3 lg:left-4 top-1/2 
							w-2 sm:w-3 h-16 sm:h-20 xl:h-24 bg-white"
                />

                {/* Right paddle */}
                <div
                    ref={rightPaddleRef}
                    id="right_p"
                    className="absolute right-2 sm:right-3 lg:right-4 top-1/2 
							w-2 sm:w-3 h-16 sm:h-20 xl:h-24 bg-white"
                />

                {/* Ball */}
                <div
                    ref={ballRef}
                    id="ball"
                    className="absolute 
							w-3 h-3 sm:w-4 sm:h-4 
							bg-white rounded-full 
							top-1/2 left-1/2"
                    style={{
                        boxShadow: `
							0 0 10px 2px rgba(0, 255, 255, 0.8),
							0 0 20px 4px rgba(0, 255, 255, 0.5),
							0 0 30px 6px rgba(0, 255, 255, 0.3),
							0 0 40px 8px rgba(0, 255, 255, 0.15),
							inset 0 0 5px rgba(0, 255, 255, 0.6)
						`,
                        filter: 'brightness(1.2) blur(0.3px)',
                        transition: 'transform 0.05s linear'
                    }}
                />
            </div>

            {/* RIGHT TOUCH CONTROLS */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 sm:gap-3 lg:gap-4 mr-1 sm:mr-2">
                <button
                    ref={rightUpBtnRef}
                    id="right-up"
                    className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/80 text-black text-xl sm:text-2xl font-bold rounded-lg active:bg-white"
                >
                    ▲
                </button>
                <button
                    ref={rightDownBtnRef}
                    id="right-down"
                    className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/80 text-black text-xl sm:text-2xl font-bold rounded-lg active:bg-white"
                >
                    ▼
                </button>
            </div>

            {/* Pause button */}
            <button
                ref={pauseBtnRef}
                id="pauseBtn"
                className="
					mt-3 sm:mt-4 
					px-3 sm:px-4 py-1.5 sm:py-2 
					bg-yellow-500 text-black font-bold rounded 
					hover:bg-yellow-400 text-sm sm:text-base
				"
            >
                ⏸️ Pause
            </button>

            {/* Winner overlay */}
            <div
                ref={winnerOverlayRef}
                id="winnerOverlay"
                className="hidden absolute inset-0 flex bg-black/70 items-center justify-center 
							text-white text-2xl sm:text-3xl lg:text-4xl font-bold z-50"
            >
                <div ref={winnerTextRef} id="winnerText"></div>
            </div>
        </div>
    );
}
