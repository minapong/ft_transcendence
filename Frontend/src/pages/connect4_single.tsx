import { useEffect, useState } from "Reactor";
import { navigate } from "Reactor";

const mockUser = { id: 1, name: "Player1" }; // Example mock user

type Player = { id: number; name: string };
type Match = {
  id: string;
  p1: Player;
  p2: Player;
  status: "matched" | "started" | "finished";
};

export default function Connect4Single() {
  const [status, setStatus] = useState<"idle" | "waiting" | "matched">("idle");
  const [match, setMatch] = useState<Match | null>(null);

  // ─────────────────────────────────────────────
  // Poll active match
  // ─────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    let interval: NodeJS.Timeout | null = null;

    const pollActiveMatch = async () => {
      try {
        console.log("[poll] checking active match for user", mockUser.id);

        // 1 Check active match
        const resMatch = await fetch(`http://localhost:3000/api/matchmaking/active/${mockUser.id}`);
        let m: Match | null = null;

        if (resMatch.ok) {
          m = await resMatch.json();
          console.log("[poll] active match found:", m);
          setMatch(m);
          setStatus(m.status === "started" ? "matched" : "matched"); // always matched if in match
          if (m.status === "started") {
            console.log("[poll] match started, navigating");
            navigate("/connect4", {
              state: { matchId: m.id, user: mockUser, onFinish },
            });
          }
          return; // done, user has active match
        }

        // 2 Check queue
        const resQueue = await fetch(`http://localhost:3000/api/matchmaking/isQueued/${mockUser.id}`);
        if (resQueue.ok) {
          const inQueue = await resQueue.json(); // boolean
          if (inQueue) {
            console.log("[poll] user is in queue");
            setMatch(null);
            setStatus("waiting");
            return;
          }
        }

        // 3 Neither match nor queue
        console.log("[poll] user is idle");
        setMatch(null);
        setStatus("idle");

      } catch (err) {
        console.error("[poll] fetch error:", err);
        setMatch(null);
        setStatus("idle");
      }
    };


    // Initial check
    pollActiveMatch();

    // Only poll repeatedly if waiting
    if (status === "waiting") {
      interval = setInterval(pollActiveMatch, 2000);
    }

    return () => {
      mounted = false;
      if (interval) clearInterval(interval);
    };
  }, [status]);

  // ─────────────────────────────────────────────
  // Join queue
  // ─────────────────────────────────────────────
  async function join() {
    console.log("[join] joining queue for user", mockUser.id);
    try {
      const res = await fetch("http://localhost:3000/api/matchmaking/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockUser),
      });

      const data = await res.json();
      console.log("[join] server response:", data);

      if (data.status === "waiting") {
        setStatus("waiting");
      } else if (data.status === "matched") {
        setMatch(data.match);
        setStatus("matched");
      } else if (data.status === "already_active") {
        console.log("[join] user already in active match");
        setMatch(data.match || null);
        setStatus("matched");
      }
    } catch (err) {
      console.error("[join] error joining queue:", err);
    }
  }

  // ─────────────────────────────────────────────
  // Start game (only by initiating player)
  // ─────────────────────────────────────────────
  async function startGame() {
    if (!match || match.p1.id !== mockUser.id) {
      console.warn("[startGame] cannot start: no match or not authorized");
      return;
    }

    console.log("[startGame] starting match", match.id);
    try {
      const res = await fetch("http://localhost:3000/api/matchmaking/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: match.id }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("[startGame] error starting match:", err);
        return;
      }

      navigate("/connect4", {
        state: { matchId: match.id, user: mockUser, onFinish },
      });
    } catch (err) {
      console.error("[startGame] fetch error:", err);
    }
  }

  // ─────────────────────────────────────────────
  // Finish match callback
  // ─────────────────────────────────────────────
  async function onFinish(winnerId: number) {
    if (!match) {
      console.warn("[onFinish] no match to finish");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/matchmaking/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: match.id, winnerId }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("[onFinish] error finishing match:", err);
      }

      navigate("/connect4_single", { replace: true });
    } catch (err) {
      console.error("[onFinish] fetch error:", err);
    }
  }

  const opponent =
    match && (match.p1.id === mockUser.id ? match.p2.name : match.p1.name);

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────
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

      {status === "waiting" && <p className="text-xl">Status: waiting for match…</p>}

      {status === "matched" && match && (
        <div className="text-center">
          <p className="mb-4">
            Matched with <strong>{opponent}</strong>
          </p>

          {match.status === "matched" && match.p1.id === mockUser.id && (
            <button
              onClick={startGame}
              className="bg-green-500 px-6 py-3 rounded text-xl"
            >
              Start Game
            </button>
          )}

          {match.status === "started" && <p className="text-xl">Game started! Redirecting…</p>}
        </div>
      )}
    </div>
  );
}
