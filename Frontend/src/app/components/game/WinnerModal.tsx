import Button from "@/app/components/ui/Button";

export type WinnerModalPayload = {
    type: "win" | "draw";
    winnerName?: string; 
    winnerColor?: string;       
    scoreLeft?: number;
    scoreRight?: number;
    isTournament?: boolean;
    onNavigate: (destination: "tournament" | "home" | "retry") => void;
};

export default function WinnerModal({ payload }: { payload: WinnerModalPayload }) {
    const {
        type,
        winnerName,
        winnerColor = "text-yellow-400",
        scoreLeft,
        scoreRight,
        isTournament,
        onNavigate
    } = payload;

    return (
        <div className="flex flex-col items-center gap-6 p-4 text-center min-w-[300px] sm:min-w-[400px]">
            {/* Header Section */}
            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white tracking-wider uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    {type === "draw" ? "Match Draw" : "Game Over"}
                </h2>

                {type === "win" && winnerName && (
                    <div className="flex flex-col items-center gap-2">
                        <span className="icon-[solar--crown-bold] text-5xl text-yellow-500 animate-bounce drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
                        <p className="text-xl text-slate-300">
                            Winner: <span className={`${winnerColor} font-black text-2xl tracking-wide drop-shadow-[0_0_10px_currentColor]`}>{winnerName}</span>
                        </p>
                    </div>
                )}

                {type === "draw" && (
                    <div className="flex flex-col items-center gap-2">
                        <span className="icon-[solar--handshake-linear] text-5xl text-slate-400 drop-shadow-[0_0_10px_rgba(148,163,184,0.5)]" />
                        <p className="text-xl text-slate-400 font-bold tracking-widest">NO WINNER</p>
                    </div>
                )}
            </div>

            {/* Scoreboard Section */}
            {(scoreLeft !== undefined && scoreRight !== undefined) && (
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-red-500/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center gap-6 text-3xl font-mono bg-black/40 backdrop-blur-md px-8 py-4 rounded-xl border border-white/10 shadow-2xl">
                        <span className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]">{scoreLeft}</span>
                        <span className="text-slate-600 text-xl font-bold">VS</span>
                        <span className="text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]">{scoreRight}</span>
                    </div>
                </div>
            )}

            {/* Actions Section */}
            <div className="flex flex-col gap-3 w-full mt-4">
                {isTournament ? (
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={() => onNavigate("tournament")}
                        className="shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <span>Next Match</span>
                            <span className="icon-[solar--arrow-right-linear]" />
                        </div>
                    </Button>
                ) : (
                    <Button
                        variant="success"
                        size="lg"
                        fullWidth
                        onClick={() => onNavigate("retry")}
                        className="shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <span className="icon-[solar--restart-bold]" />
                            <span>Play Again</span>
                        </div>
                    </Button>
                )}

                <Button
                    variant="secondary"
                    size="lg"
                    fullWidth
                    onClick={() => onNavigate("home")}
                >
                    <div className="flex items-center justify-center gap-2">
                        <span className="icon-[solar--home-2-linear]" />
                        <span>Main Menu</span>
                    </div>
                </Button>
            </div>
        </div>
    );
}
