import { useEffect, useState, useRef } from "Reactor";
import { navigate } from "Reactor";
import { getAuth } from "@/core/lib/auth";
import { apiFetch } from "@/core/lib/api";


type Player = {
  id: number;
  name: string
};

type Match = {
  id: string;
  p1: Player;
  p2: Player;
  status: "matched" | "started" | "finished"
};

export default function Connect4Single() {

  const auth = getAuth();
  const user = auth?.user;
  const token = auth?.token;

  if (!user) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Please login to play matchmaking.</p>
          <button onClick={() => (navigate("/auth/login"))} className="btn btn-primary btn-lg">
            Go to Login
          </button>
        </div>
      </div>
    );
  }


  const [status, setStatus] = useState<"loading" | "idle" | "waiting" | "matched">("loading");
  const [match, setMatch] = useState<Match | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ──────────────── Polling effect ────────────────
  useEffect(() => {
    const pollMatch = async () => {
      // console.log("[poll] fetching match state for user", user.id);
      try {
        const res = await apiFetch(`/api/matchmaking/state/${user.id}`);
        if (!res.ok) return;

        const data = await res.json();
        // console.log("[poll] server response:", data);

        if (data.state === "active") {
          setMatch(data.match);
          setStatus("matched");

          // Stop polling if match already started
          if (data.match.status === "started" && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            // console.log("[poll] cleared interval, match already started");
          }
        } else if (data.state === "queued") {
          setMatch(null);
          setStatus("waiting");
        } else {
          setMatch(null);
          setStatus("idle");
        }
      } catch (err) {
        console.error("[poll] error:", err);
        setMatch(null);
        setStatus("idle");
      }
    };

    // Initial poll immediately
    pollMatch();

    // Only create interval once
    if (!intervalRef.current) {
      intervalRef.current = setInterval(pollMatch, 2000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []); // Empty dependency

  // ──────────────── Join Queue ────────────────
  async function join() {
    // console.log("[join] user joining queue", user.id);
    try {
      const res = await apiFetch("/api/matchmaking/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, username: user.username }),
      });
      const data = await res.json();
      // console.log("[join] server response:", data);

      if (data.status === "waiting") setStatus("waiting");
      else if (data.status === "matched") {
        setMatch(data.match);
        setStatus("matched");
      } else if (data.status === "already_active") {
        setMatch(data.match || null);
        setStatus("matched");
      }
    } catch (err) {
      // console.error("[join] error:", err);
    }
  }

  // ──────────────── Start Game ────────────────
  async function startGame() {
    if (!match || match.p1.id !== user.id) return;

    // Stop polling before navigating
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      // console.log("[startGame] cleared polling interval");
    }

    try {
      // console.log("[startGame] sending request to start match", match.id);
      const res = await apiFetch("/api/matchmaking/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: match.id }),
      });

      if (!res.ok) {
        console.warn("[startGame] failed to start match", res.status);
        return;
      }

      // console.log("[startGame] navigating to /connect4");
      navigate("/game/connect4", {
        state: {
          matchId: match.id,
          p1: match.p1, // { id: number; name: string }
          p2: match.p2, // { id: number; name: string }
        },
      });
    } catch (err) {
      console.error("[startGame] fetch error:", err);
    }
  }

  const opponent_name = match && (match.p1.id === user.id ? match.p2.name : match.p1.name);
  const opponent_id = match && (match.p1.id === user.id ? match.p2.id : match.p1.id);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold mb-6">Connect 4</h1>

      {status === "loading" && <p className="text-xl">Checking match status…</p>}

      {status === "idle" && (
        <button onClick={join} className="btn btn-primary btn-lg">
          Join Queue
        </button>
      )}

      {status === "waiting" && <p className="text-xl">Waiting for match…</p>}

      {status === "matched" && match && (
        <div className="text-center">
          <p className="mb-4">
            Matched with <strong>{opponent_name}</strong>
            {match.p1.id !== user.id && " — Only host can start the game"}
          </p>
          {match.status === "matched" && match.p1.id === user.id && (
            <button onClick={startGame} className="btn btn-success btn-lg">
              Start Game
            </button>
          )}
          {match.status === "started" && match.p1.id === user.id &&
            <p className="text-xl">Game started! You can play now.</p> && (
              <button onClick={startGame} className="btn btn-success btn-lg">
                Re-Start Game
              </button>
            )}
          {match.status === "started" && match.p1.id !== user.id &&
            <p className="text-xl">Game started! You can play now on Host Session.</p>
          }
        </div>
      )}
    </div>
  );
}
