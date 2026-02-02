import { pongLogic, GAME_PAUSE_EVENT } from "@/core/engine/pong_logic";
import { navigate, useEffect, useRef, useLocation, openModal, closeModal } from "Reactor";
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
    // Native Event Listeners for Keyboard
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (useAI && (e.key === "ArrowUp" || e.key === "ArrowDown") && e.isTrusted) return;

            if (e.key === "w") inputRef.current.w = true;
            if (e.key === "s") inputRef.current.s = true;
            if (e.key === "ArrowUp") inputRef.current.up = true;
            if (e.key === "ArrowDown") inputRef.current.down = true;

            // Prevent scrolling
            if (["ArrowUp", "ArrowDown", " "].includes(e.key)) {
                e.preventDefault();
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (useAI && (e.key === "ArrowUp" || e.key === "ArrowDown") && e.isTrusted) return;

            if (e.key === "w") inputRef.current.w = false;
            if (e.key === "s") inputRef.current.s = false;
            if (e.key === "ArrowUp") inputRef.current.up = false;
            if (e.key === "ArrowDown") inputRef.current.down = false;
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [useAI]);



    // --- INPUT HANDLING for Touch Controls ---
    // Handled via onPointerDown/Up props on buttons


    const gameInitialized = useRef(false);

    useEffect(() => {
        // Guard: Prevent double-initialization
        if (gameInitialized.current) {
            return;
        }

        // Ensure all refs are populated
        if (!ballRef.current || !leftPaddleRef.current || !rightPaddleRef.current ||
            !pauseBtnRef.current || !scoreLeftRef.current || !scoreRightRef.current) {
            return;
        }

        gameInitialized.current = true;

        const cleanup = pongLogic(
            {
                ball: ballRef.current,
                leftPaddle: leftPaddleRef.current,
                rightPaddle: rightPaddleRef.current,
                pauseBtn: pauseBtnRef.current,
                scoreLeft: scoreLeftRef.current,
                scoreRight: scoreRightRef.current,
            },
            p1Name,
            p2Name,
            (winner: string, scoreP1: number, scoreP2: number) => {
                // Navigation handler for modal buttons
                const handleNavigate = (destination: "tournament" | "home" | "retry") => {
                    closeModal();
                    if (destination === "tournament") {
                        navigate("/tournament/active", { replace: true });
                    } else {
                        navigate("/game/pre_match_scene", { replace: true });
                    }
                };

                // Dispatch global pause event to ensure game stops
                window.dispatchEvent(new Event(GAME_PAUSE_EVENT));

                // Show winner modal
                openModal({
                    type: "game-winner",
                    payload: {
                        type: "win",
                        winnerName: winner,
                        winnerColor: "text-yellow-400",
                        scoreLeft: scoreP1,
                        scoreRight: scoreP2,
                        isTournament: matchId !== null,
                        onNavigate: handleNavigate,
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
                            // 
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
            gameInitialized.current = false;
        };
    });

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden relative">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--color-accent)]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[var(--color-accent-soft)]/5 rounded-full blur-[120px]" />
            </div>

            {/* Scoreboard */}
            <div className="
            flex items-center justify-between
            w-full max-w-[320px] sm:max-w-[500px] lg:max-w-[800px]
            px-6 py-3
            rounded-2xl
            panel-surface
            backdrop-blur-md
            border border-[var(--color-border-soft)]
            text-[var(--color-primary)]
            max-sm:text-sm text-base lg:text-xl
            font-mono tracking-widest font-bold
            mb-6
            relative z-10
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
                <div className="absolute -left-16 sm:-left-24 top-1/2 -translate-y-1/2 flex flex-col gap-3 lg:gap-4 z-20">
                    <button
                        onPointerDown={() => { inputRef.current.w = true; }}
                        onPointerUp={() => { inputRef.current.w = false; }}
                        onPointerLeave={() => { inputRef.current.w = false; }}
                        id="left-up"
                        className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center glass-pill border border-[var(--color-border-soft)] text-[var(--color-primary)] text-xl sm:text-2xl hover:bg-white/10 active:scale-95 transition-all rounded-full relative"
                    >
                        <span className="icon-[solar--arrow-up-linear]" />
                        <span className="absolute bottom-1 right-2 text-[10px] font-mono opacity-50 font-bold">W</span>
                    </button>
                    <button
                        onPointerDown={() => { inputRef.current.s = true; }}
                        onPointerUp={() => { inputRef.current.s = false; }}
                        onPointerLeave={() => { inputRef.current.s = false; }}
                        id="left-down"
                        className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center glass-pill border border-[var(--color-border-soft)] text-[var(--color-primary)] text-xl sm:text-2xl hover:bg-white/10 active:scale-95 transition-all rounded-full relative"
                    >
                        <span className="icon-[solar--arrow-down-linear]" />
                        <span className="absolute bottom-1 right-2 text-[10px] font-mono opacity-50 font-bold">S</span>
                    </button>
                </div>

                {/* RIGHT TOUCH CONTROLS */}
                <div className={`absolute -right-16 sm:-right-24 top-1/2 -translate-y-1/2 flex flex-col gap-3 lg:gap-4 z-20 ${useAI ? 'hidden' : ''}`}>
                    <button
                        onPointerDown={() => { inputRef.current.up = true; }}
                        onPointerUp={() => { inputRef.current.up = false; }}
                        onPointerLeave={() => { inputRef.current.up = false; }}
                        id="right-up"
                        className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center glass-pill border border-[var(--color-border-soft)] text-[var(--color-primary)] text-xl sm:text-2xl hover:bg-white/10 active:scale-95 transition-all rounded-full relative"
                    >
                        <span className="icon-[solar--arrow-up-linear]" />
                        <span className="absolute bottom-1 right-2 text-[10px] sm:text-lg font-mono opacity-50 font-bold scale-75">↑</span>
                    </button>
                    <button
                        onPointerDown={() => { inputRef.current.down = true; }}
                        onPointerUp={() => { inputRef.current.down = false; }}
                        onPointerLeave={() => { inputRef.current.down = false; }}
                        id="right-down"
                        className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center glass-pill border border-[var(--color-border-soft)] text-[var(--color-primary)] text-xl sm:text-2xl hover:bg-white/10 active:scale-95 transition-all rounded-full relative"
                    >
                        <span className="icon-[solar--arrow-down-linear]" />
                        <span className="absolute bottom-1 right-2 text-[10px] sm:text-lg font-mono opacity-50 font-bold scale-75">↓</span>
                    </button>
                </div>


                {/* Game board */}
                <div
                    id="game_board"
                    className="
                    bg-black/40
                    border-4 border-[var(--color-border-strong)]
                    rounded-xl relative
                    w-[320px] h-[200px]
                    sm:w-[400px] sm:h-[280px]
                    lg:w-[600px] lg:h-[380px]
                    xl:w-[800px] xl:h-[500px]
                    backdrop-blur-sm
                    z-10
                "

                    style={{
                        boxShadow: `
                    0 0 40px -10px var(--color-accent-soft),
                    inset 0 0 20px rgba(0,0,0,0.5)
                    `,
                    }}
                >



                    {/* Left paddle */}
                    <div
                        ref={leftPaddleRef}
                        id="left_p"
                        className="absolute left-2 sm:left-3 lg:left-4 top-0 
                            w-2 sm:w-3 h-16 sm:h-20 xl:h-24 bg-[var(--color-primary)] rounded-full"
                        style={{
                            boxShadow: `
                    0 0 15px var(--color-accent),
                    0 0 5px var(--color-primary)
                    `,
                            willChange: "transform",
                        }}
                    />



                    {/* Right paddle */}
                    <div
                        ref={rightPaddleRef}
                        id="right_p"
                        className="absolute right-2 sm:right-3 lg:right-4 top-0 
                            w-2 sm:w-3 h-16 sm:h-20 xl:h-24 bg-[var(--color-primary)] rounded-full"
                        style={{
                            boxShadow: `
                    0 0 15px var(--color-accent),
                    0 0 5px var(--color-primary)
                    `,
                            willChange: "transform",
                        }}
                    />


                    {/* Ball */}
                    <div
                        ref={ballRef}
                        id="ball"
                        className="absolute 
							w-3 h-3 sm:w-4 sm:h-4 
							bg-white rounded-full 
							top-0 left-0"
                        style={{
                            boxShadow: `
							0 0 10px 2px var(--color-accent),
							0 0 20px 4px var(--color-accent),
                             inset 0 0 4px var(--color-primary)
						`,
                            filter: 'brightness(1.5)',
                            transition: "none",
                            willChange: "transform",
                        }}
                    />
                </div>

            </div>

            {/* Pause button */}
            <button
                ref={pauseBtnRef}
                id="pauseBtn"
                className="
					mt-6
					btn btn-secondary
                    glass-pill
                    border border-[var(--color-border-soft)]
                    hover:border-[var(--color-accent)]
				"
            >
                <span className="icon-[solar--pause-bold]" />
                <span className="tracking-wider">PAUSE GAME</span>
            </button>
        </div>
    );
}
