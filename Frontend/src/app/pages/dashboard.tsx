import { useState, useEffect, navigate } from 'Reactor';
import { apiFetch } from "@/core/lib/api";


// const API_BASE = "http://localhost:3000";

export default function Dashboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchLeaderboard();
    fetchHistory(1);
  }, []);

  useEffect(() => {
    if (page > 1) fetchHistory(page);
  }, [page]);

  const fetchLeaderboard = async () => {
    try {
      setError(null);
      const res = await apiFetch(`/api/stats/leaderboard?limit=50`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 100)}`);
      }
      const json = await res.json();
      if (json.success) {
        setLeaderboard(json.data || []);
      } else {
        setError(json.error || "API error");
      }
    } catch (err: any) {
      setError("Failed to load leaderboard");
    }
  };

  const fetchHistory = async (p: number) => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch(`/api/stats/history/global?page=${p}&limit=10`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 100)}`);
      }
      const json = await res.json();
      if (json.success) {
        const newMatches = json.data || [];
        setHistory(prev => p === 1 ? newMatches : [...prev, ...newMatches]);
      } else {
        setError(json.error || "API error");
      }
    } catch (err: any) {
      setError("Failed to load match history");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">Global Dashboard</h1>

      {error && (
        <div className="bg-red-600 text-white p-4 rounded mb-6 text-center">
          {error}
        </div>
      )}

      {/* Leaderboard */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Leaderboard (Top 50)</h2>
        {leaderboard.length === 0 && !loading && (
          <p className="text-gray-400 text-center">No players ranked yet. Play some games!</p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-gray-800 rounded-lg shadow-lg">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-4 text-left">Rank</th>
                <th className="p-4 text-left">Player</th>
                <th className="p-4 text-center">Wins</th>
                <th className="p-4 text-center">Win Rate</th>
                <th className="p-4 text-center">Championships</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, idx) => {
                const user = entry.user || {};
                const totalGames = (entry.wins || 0) + (entry.losses || 0);
                const winRate = totalGames > 0 ? Math.round((entry.wins / totalGames) * 100) : 0;

                return (
                  <tr key={user.id || idx} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-4 text-center font-bold">#{idx + 1}</td>
                    <td className="p-4 flex items-center gap-3">
                      {/* <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-lg font-bold">
                        {user.username?.[0]?.toUpperCase() || "?"}
                      </div> 
                       {/* Avatar with Glow */}
                      <div className="relative group self-center md:self-auto">
                        <div className={`absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full blur opacity-50 transition duration-500`}></div>
                          <div
                            className={`relative w-10 h-10 md:w-15 md:h-15 rounded-full border-4 border-gray-950 overflow-hidden bg-gray-900 flex items-center justify-center z-10 ring-2 ring-white/10 ${user.avatarUrl ? 'cursor-pointer' : ''}`}
                            >
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl} className="w-full h-full object-cover" alt="avatar" />
                              ) : (
                              <span className="icon-[solar--user-bold] text-4xl text-gray-500" />
                              )}
                            </div>
                          </div>
                     
                      <span className="font-medium">{user.username || "Unknown"}</span>
                        <button
                          onClick={() => navigate(`/user/${user.id}`)}
                          className="p-2 rounded-lg bg-gray-800 text-cyan-400 hover:bg-cyan-900/50 transition-colors"
                          title="View Profile"
                        >
                          <span className="icon-[solar--user-id-bold]" />
                        </button>
                    </td>
                    
                    <td className="p-4 text-center">{entry.wins || 0}</td>
                    <td className="p-4 text-center">{winRate}%</td>
                    <td className="p-4 text-center">{entry.tournament_championships || 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Matches */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Recent Matches</h2>
        {history.length === 0 && !loading && (
          <p className="text-gray-400 text-center">No matches played yet. Start playing!</p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-gray-800 rounded-lg shadow-lg">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-center">Game</th>
                <th className="p-4 text-center">Players</th>
                <th className="p-4 text-center">Winner</th>
                <th className="p-4 text-center">Score</th>
              </tr>
            </thead>
            <tbody>
              {history.map((match: any) => {
                const winnerPlayer = match.matchPlayers?.find((mp: any) => mp.is_winner);
                const p1 = match.matchPlayers?.[0]?.user;
                const p2 = match.matchPlayers?.[1]?.user;

                return (
                  <tr key={match.id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-4">
                      {match.finished_at
                        ? new Date(match.finished_at).toLocaleString()
                        : "Ongoing"}
                    </td>
                    <td className="p-4 text-center">
                      {match.game_name === "connect4" ? "🔴 Connect4" : "🏓 Pong"}
                    </td>
                    <td className="p-4 text-center">
                      {p1?.username || "Unknown"} vs {p2?.username || "Unknown"}
                    </td>
                    <td className="p-4 text-center font-bold text-green-400">
                      {winnerPlayer?.user?.username || "Draw / Ongoing"}
                    </td>
                    <td className="p-4 text-center">
                      {(match.matchPlayers?.[0]?.score ?? "?")} - {(match.matchPlayers?.[1]?.score ?? "?")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More Matches"}
          </button>
        </div>
      </div>
    </div>
  );
}