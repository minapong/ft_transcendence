import { registerModal, closeModal } from "Reactor";
import Button from "@/app/components/ui/Button";

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

registerModal<PongWinnerPayload>("pong-winner", (payload) => (
    <div className="flex flex-col items-center gap-6 p-4 text-center">
        <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-wider">GAME OVER</h2>
            <p className="text-xl text-slate-300">
                Winner: <span className="text-yellow-400 font-bold">{payload.winner}</span>
            </p>
        </div>

        <div className="flex items-center gap-4 text-2xl font-mono bg-black/30 px-6 py-3 rounded-lg border border-white/10">
            <span className="text-blue-400">{payload.scoreP1}</span>
            <span className="text-slate-500">-</span>
            <span className="text-red-400">{payload.scoreP2}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
            {payload.isTournament ? (
                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => payload.onNavigate("tournament")}
                >
                    Next Match
                </Button>
            ) : (
                <Button
                    variant="success"
                    size="lg"
                    fullWidth
                    onClick={() => payload.onNavigate("home")}
                >
                    Play Again
                </Button>
            )}

            <Button
                variant="secondary"
                size="lg"
                fullWidth
                onClick={() => payload.onNavigate("home")}
            >
                Main Menu
            </Button>
        </div>
    </div>
));

type DemoPayload = {
    title: string;
    body: string;
};

registerModal<DemoPayload>("demo", (payload) => (
    <div className="space-y-3">
        <h2 className="text-xl font-semibold">{payload.title}</h2>
        <p>{payload.body}</p>
        <button className="bleed-btn px-3 py-2 rounded-md" onClick={closeModal}>
            Close
        </button>
    </div>
));
