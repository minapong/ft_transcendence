import { useState } from "react";

interface Match {
  p1: string;
  p2: string;
  winner: string | null;
  status: "pending" | "finished";
}

interface Tournament {
  id: number;
  round: number;
  matches: Match[];
  isOver: boolean;
}

export default function TournamentPage() {
  const [players, setPlayers] = useState<string[]>(["", "", "", ""]);
  const [tournament, setTournament] = useState<Tournament | null>(null);

  // Update a player name
  const updatePlayer = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  // Start tournament
  const startTournament = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tournament/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ players: players.filter(p => p) }), // remove empty names
    });
    const data = await res.json();
    setTournament(data);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Tournament Setup</h1>

      {!tournament && (
        <div className="space-y-2">
          {players.map((p, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Player ${i + 1}`}
              value={p}
              onChange={(e) => updatePlayer(i, e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
          ))}

          <button
            onClick={startTournament}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Start Tournament
          </button>
        </div>
      )}

      {tournament && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Round {tournament.round}</h2>
          <ul className="space-y-2">
            {tournament.matches.map((m, i) => (
              <li key={i} className="border p-2 rounded">
                {m.p1} vs {m.p2} — Status: {m.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
