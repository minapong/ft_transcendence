import { navigate, useEffect, useState } from "Reactor";

const mockUser = { id: 1, name: "Player1" };  // Example mock user
type Match = {
  id: string;
  p1: { id: number; name: string };
  p2: { id: number; name: string };
  status: string;
};

export default function Connect4Single() {
  const [status, setStatus] = useState<"idle" | "waiting" | "matched">("idle");
  const [match, setMatch] = useState<Match | null>(null);

  // ─────────────────────────────────────────────
  // Auto-resume
  // ─────────────────────────────────────────────

  useEffect(() => {
    let mounted = true;

    // Check if the user already has an active match
    fetch(`http://localhost:3000/api/matchmaking/active/${mockUser.id}`)
      .then(r => r.json())
      .then(m => {
        if (!mounted || !m) return;
        navigate("/connect4", {
          state: { matchId: m.id, user: mockUser },
        });
      });

    return () => { mounted = false; };
  }, []);

  // ─────────────────────────────────────────────
  // Join queue
  // ─────────────────────────────────────────────

  function join() {
    fetch("http://localhost:3000/api/matchmaking/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockUser),
    })
      .then(r => r.json())
      .then(res => {
        if (res.status === "waiting") setStatus("waiting");
        if (res.status === "matched") {
          setMatch(res.match);
          setStatus("matched");
        }
      });
  }

  // ─────────────────────────────────────────────
  // Start game
  // ─────────────────────────────────────────────

  function startGame() {
    if (!match) return;

    fetch("http://localhost:3000/api/matchmaking/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId: match.id }),
    }).then(() => {
      navigate("/connect4", {
        state: {
          matchId: match.id,
          user: mockUser,
          onFinish: onFinish,
        },
      });
    });
  }

  // ─────────────────────────────────────────────
  // Finish callback
  // ─────────────────────────────────────────────

  function onFinish(winnerId: number) {
    if (!match) return;

    fetch("http://localhost:3000/api/matchmaking/finish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId: match.id, winnerId }),
    }).finally(() => {
      navigate("/connect4_single", { replace: true });
    });
  }

  // ─────────────────────────────────────────────

  const opponent =
    match &&
    (match.p1.id === mockUser.id ? match.p2.name : match.p1.name);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold mb-6">Connect 4</h1>

      {status === "idle" && (
        <button
          onClick={join}
          className="bg-blue-500 px-6 py-3 rounded text-xl"
        >
          Join Queue
        </button>
      )}

      {status === "waiting" && (
        <p className="text-xl">Status: waiting for match…</p>
      )}

      {status === "matched" && match && (
        <div className="text-center">
          <p className="mb-4">
            Matched with <strong>{opponent}</strong>
          </p>
          <button
            onClick={startGame}
            className="bg-green-500 px-6 py-3 rounded text-xl"
          >
            Start Game
          </button>
        </div>
      )}
    </div>
  );
}
