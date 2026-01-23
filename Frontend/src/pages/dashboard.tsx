import { useState, useEffect } from 'Reactor';

export default function Dashboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
    fetchHistory(1); // Always reset to page 1 on mount
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchHistory(page);
    }
  }, [page]);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/stats/leaderboard?limit=50');
      const json = await res.json();
      if (json.success) {
        // json.data is array of { user: { id, username }, wins, ... }
        setLeaderboard(json.data);
      }
    } catch (err) {
      console.error("Failed to load leaderboard", err);
    }
  };

  const fetchHistory = async (p: number) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/stats/history/global?page=${p}&limit=10`);
      const json = await res.json();
      if (json.success) {
        const newMatches = json.data;
        setHistory(prev => p === 1 ? newMatches : [...prev, ...newMatches]);
      }
    } catch (err) {
      console.error("Failed to load match history", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">Global Dashboard</h1>

      {/* Leaderboard */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Leaderboard (Top 50)</h2>
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
                const user = entry.user;
                const totalGames = entry.wins + entry.losses;
                const winRate = totalGames > 0 ? Math.round((entry.wins / totalGames) * 100) : 0;

                return (
                  <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-4 text-center font-bold">#{idx + 1}</td>
                    <td className="p-4 flex items-center gap-3">
                      {/* Placeholder avatar - replace when avatar ready */}
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-lg font-bold">
                        {user.username[0].toUpperCase()}
                      </div>
                      <span className="font-medium">{user.username}</span>
                    </td>
                    <td className="p-4 text-center">{entry.wins}</td>
                    <td className="p-4 text-center">{winRate}%</td>
                    <td className="p-4 text-center">{entry.tournamentChampionships || 0}</td>
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
                // matchPlayers is ordered: winner first (if any), then loser
                const winnerPlayer = match.matchPlayers.find((mp: any) => mp.isWinner);
                const loserPlayer = match.matchPlayers.find((mp: any) => !mp.isWinner);

                const p1 = match.matchPlayers[0]?.user;
                const p2 = match.matchPlayers[1]?.user;

                return (
                  <tr key={match.id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-4">
                      {new Date(match.finishedAt).toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      {match.gameName === "connect4" ? "🔴 Connect4" : "🏓 Pong"}
                    </td>
                    <td className="p-4 text-center">
                      {p1?.username || "Unknown"} vs {p2?.username || "Unknown"}
                    </td>
                    <td className="p-4 text-center font-bold text-green-400">
                      {winnerPlayer?.user?.username || "Draw"}
                    </td>
                    <td className="p-4 text-center">
                      {match.matchPlayers[0]?.score || 0} - {match.matchPlayers[1]?.score || 0}
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