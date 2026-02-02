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

export type ConfirmPayload = {
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: "danger" | "warning" | "info";
};

registerModal<ConfirmPayload>("confirm", (payload) => (
    <div className="p-2">
        <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-xl ${payload.type === 'danger' ? 'bg-red-500/10 text-red-500' :
                payload.type === 'warning' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-blue-500/10 text-blue-500'
                }`}>
                {payload.type === 'danger' && <span className="icon-[solar--danger-triangle-linear] text-2xl" />}
                {payload.type === 'warning' && <span className="icon-[solar--shield-warning-linear] text-2xl" />}
                {(payload.type === 'info' || !payload.type) && <span className="icon-[solar--question-circle-linear] text-2xl" />}
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-100">{payload.title}</h2>
                <p className="text-slate-400 text-sm mt-1">{payload.message}</p>
            </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
            <button
                onClick={closeModal}
                className="px-6 py-2.5 bg-transparent hover:bg-white/5 text-slate-300 font-semibold rounded-xl transition-all border border-transparent hover:border-white/10"
            >
                {payload.cancelText || "Cancel"}
            </button>
            <button
                onClick={() => {
                    payload.onConfirm();
                    closeModal();
                }}
                className={`px-6 py-2.5 font-semibold rounded-xl transition-all active:scale-95 shadow-lg ${payload.type === 'danger'
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
                    : 'bg-slate-100 hover:bg-white text-slate-900 shadow-white/10'
                    }`}
            >
                {payload.confirmText || "Confirm"}
            </button>
        </div>
    </div>
));

import WinnerModal, { type WinnerModalPayload } from "@/app/components/game/WinnerModal";
export type { WinnerModalPayload };

registerModal<WinnerModalPayload>("game-winner", (payload) => (
    <WinnerModal payload={payload} />
));

// Kept for backward compatibility if needed temporarily, but we will remove it as we migrate.
// Actually, let's just remove pong-winner entirely as per plan to force migration.


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
