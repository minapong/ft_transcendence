import { pongLogic } from "@/core/engine/pong_logic";
import { navigate, useEffect, useRef, useLocation, openModal, closeModal, useEventListener } from "Reactor";
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

    // Input state ref - Source of Truth for game, updated via hooks
    const inputRef = useRef({
        w: false,
        s: false,
        up: false,
        down: false
    });

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
        navigate("/game/pre_match_scene", { replace: true });
        return null;
    }

    // --- INPUT HANDLING ---
    // Update ref directly. No re-renders needed for input updates (Game Loop reads ref).

    // KeyDown Handler
    useEventListener("keydown", (e: KeyboardEvent) => {
        if (useAI && (e.key === "ArrowUp" || e.key === "ArrowDown") && e.isTrusted) return;

        if (e.key === "w") inputRef.current.w = true;
        if (e.key === "s") inputRef.current.s = true;
        if (e.key === "ArrowUp") inputRef.current.up = true;
        if (e.key === "ArrowDown") inputRef.current.down = true;

        // Prevent scrolling with arrows
        if (["ArrowUp", "ArrowDown", " "].includes(e.key)) {
            e.preventDefault();
        }
    });

    // KeyUp Handler
    useEventListener("keyup", (e: KeyboardEvent) => {
        if (useAI && (e.key === "ArrowUp" || e.key === "ArrowDown") && e.isTrusted) return;

        if (e.key === "w") inputRef.current.w = false;
        if (e.key === "s") inputRef.current.s = false;
        if (e.key === "ArrowUp") inputRef.current.up = false;
        if (e.key === "ArrowDown") inputRef.current.down = false;
    });


    useEffect(() => {
        // Ensure all refs are populated
        if (!ballRef.current || !leftPaddleRef.current || !rightPaddleRef.current ||
            !pauseBtnRef.current || !leftUpBtnRef.current || !leftDownBtnRef.current ||
            !rightUpBtnRef.current || !rightDownBtnRef.current || !scoreLeftRef.current ||
            !scoreRightRef.current) {
            return;
        }

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
                // Navigation handler for modal buttons
                const handleNavigate = (destination: "tournament" | "home") => {
                    closeModal();
                    if (destination === "tournament") {
                        navigate("/tournament/active", { replace: true });
                    } else {
                        navigate("/game/pre_match_scene", { replace: true });
                    }
                };

                // Show winner modal
                openModal({
                    type: "pong-winner",
                    payload: {
                        winner,
                        scoreP1,
                        scoreP2,
                        isTournament: matchId !== null,
                        onNavigate: handleNavigate
                    }
                });

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
            },
            inputRef, // <--- Pass the live input ref to the engine
            useAI,
            aiDifficulty
        );

        // Cleanup function runs on unmount
        // Note: useEventListener cleans itself up! We only need to clean up the game loop here.
        return () => {
            cleanup();
        };
    });

    return (
        <div className="bg-gray-900 flex flex-col items-center justify-center min-h-screen px-2">

            {/* Scoreboard */}
            <div className="
            flex items-center justify-between
            w-full max-w-[320px] sm:max-w-[500px] lg:max-w-[800px]
            px-4 py-2
            rounded-full
            bg-gradient-to-b from-white/10 to-white/5
            backdrop-blur-sm
            shadow-md shadow-black/40
            text-slate-100
            text-sm sm:text-base lg:text-lg
            font-semibold
            mb-4
            ">

                <span ref={scoreLeftRef} className="flex-1 text-left">
                    {p1Name}: 0
                </span>

                <span className="text-slate-400 px-3">—</span>

                <span ref={scoreRightRef} className="flex-1 text-right">
                    {p2Name}: 0
                </span>

            </div>

            <div className="relative flex items-center justify-center overflow-visible">

            {/* LEFT TOUCH CONTROLS */}
            <div className="absolute -left-15 sm:-left-20 top-1/2 -translate-y-1/2 flex flex-col gap-2 sm:gap-3 lg:gap-4 ml-1 sm:ml-2">
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

            {/* RIGHT TOUCH CONTROLS */}
            <div className="absolute -right-15 sm:-right-20 top-1/2 -translate-y-1/2 flex flex-col gap-2 sm:gap-3 lg:gap-4 mr-1 sm:mr-2">
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

                {/* Game board */}
                <div
                id="game_board"
                className="
                    bg-[#1e293b]
                    border-4 sm:border-6 lg:border-8 border-[#475569]
                    rounded-lg relative
                    w-[320px] h-[200px]
                    sm:w-[400px] sm:h-[280px]
                    lg:w-[600px] lg:h-[380px]
                    xl:w-[800px] xl:h-[500px]
                "
                style={{
                    boxShadow: `
                    inset 0 0 0 1px rgba(255, 255, 255, 0.06),
                    0 8px 30px rgba(0, 0, 0, 0.6)
                    `,
                }}
            >



                {/* Left paddle */}
                <div
                    ref={leftPaddleRef}
                    id="left_p"
                    className="absolute left-2 sm:left-3 lg:left-4 top-1/2 
                            w-2 sm:w-3 h-16 sm:h-20 xl:h-24 bg-[#f8fafc]"
                    style={{
                        boxShadow: `
                    inset 0 0 0 1px rgba(0, 0, 0, 0.12),
                    0 0 8px rgba(56, 189, 248, 0.25)
                    `,
                    }}
                />



                {/* Right paddle */}
                <div
                    ref={rightPaddleRef}
                    id="right_p"
                    className="absolute right-2 sm:right-3 lg:right-4 top-1/2 
                            w-2 sm:w-3 h-16 sm:h-20 xl:h-24 bg-white"
                    style={{
                        boxShadow: `
                    inset 0 0 0 1px rgba(0, 0, 0, 0.12),
                    0 0 8px rgba(56, 189, 248, 0.25)
                    `,
                    }}
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
        </div>
    );
}
