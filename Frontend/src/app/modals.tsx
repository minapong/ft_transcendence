import { registerModal, closeModal } from "Reactor";

export type AlertPayload = {
    title: string;
    message: string;
    type?: "info" | "error" | "success";
};

registerModal<AlertPayload>("alert", (payload) => (
    <div className="p-2">
        <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-xl ${payload.type === 'error' ? 'bg-red-500/10 text-red-500' :
                payload.type === 'success' ? 'bg-green-500/10 text-green-500' :
                    'bg-blue-500/10 text-blue-500'
                }`}>
                {payload.type === 'error' && <span className="icon-[solar--danger-linear] text-2xl" />}
                {payload.type === 'success' && <span className="icon-[solar--check-circle-linear] text-2xl" />}
                {(payload.type === 'info' || !payload.type) && <span className="icon-[solar--info-circle-linear] text-2xl" />}
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-100">{payload.title}</h2>
                <p className="text-slate-400 text-sm mt-1">{payload.message}</p>
            </div>
        </div>
        <div className="flex justify-end mt-6">
            <button
                onClick={closeModal}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-all active:scale-95 border border-slate-700"
            >
                Dismiss
            </button>
        </div>
    </div>
));

export type PongWinnerPayload = {
    winner: string;
    scoreP1: number;
    scoreP2: number;
    isTournament: boolean;
    onNavigate: (destination: "tournament" | "home") => void;
};

registerModal<PongWinnerPayload>("pong-winner", (payload) => {
    const handleClick = (destination: "tournament" | "home") => {
        if (typeof payload.onNavigate === "function") {
            payload.onNavigate(destination);
        } else {
            console.error("[Pong Modal] onNavigate is not a function. Please refresh the page.");
            // Fallback navigation
            closeModal();
            if (destination === "tournament") {
                window.location.href = "/tournament/active";
            } else {
                window.location.href = "/game/pre_match_scene";
            }
        }
    };

    return (
        <div className="text-center p-6">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-white mb-2">{payload.winner} Wins!</h2>
            <p className="text-xl text-slate-300 mb-6">{payload.scoreP1} - {payload.scoreP2}</p>

            <div className="flex gap-3 justify-center">
                {payload.isTournament ? (
                    <button
                        onClick={() => handleClick("tournament")}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all active:scale-95 flex items-center gap-2"
                    >
                        <span className="icon-[solar--cup-star-bold] text-xl" />
                        Back to Tournament
                    </button>
                ) : (
                    <button
                        onClick={() => handleClick("home")}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all active:scale-95 flex items-center gap-2"
                    >
                        <span className="icon-[solar--home-2-bold] text-xl" />
                        Back to Home
                    </button>
                )}
            </div>
        </div>
    );
});
