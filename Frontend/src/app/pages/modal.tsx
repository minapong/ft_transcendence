import { registerModal, openModal, closeModal } from "Reactor";

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

type PongWinnerPayload = {
  winner: string;
  scoreP1: number;
  scoreP2: number;
  isTournament: boolean;
  onNavigate: (destination: "tournament" | "home") => void;
  preventClose?: boolean;
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
        <button
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors w-full"
          onClick={() => payload.onNavigate("tournament")}
        >
          Next Match
        </button>
      ) : (
        <button
          className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold transition-colors w-full"
          onClick={() => payload.onNavigate("home")}
        >
          Play Again
        </button>
      )}

      <button
        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-colors w-full"
        onClick={() => payload.onNavigate("home")}
      >
        Main Menu
      </button>
    </div>
  </div>
));

export default function PageButton() {
  const payload: DemoPayload = {
    title: "Hello",
    body: "This lives in the global slot.",
  };

  return (
    <button
      className="bleed-btn px-3 py-2 rounded-md"
      onClick={() => openModal<DemoPayload>({ type: "demo", payload, label: payload.title })}
    >
      Open demo modal
    </button>
  );
}
