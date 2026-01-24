import { useEffect, useState, navigate} from "Reactor"
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import { logout } from "@/lib/auth";

export default function MePage() {
  const auth = useAuth();
  const token = auth?.token;

  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Profile (/api/me)
        const profileRes = await apiFetch("/api/me");
        if (!profileRes.ok) throw new Error("Failed to load profile");
        const profileData = await profileRes.json();
        setProfile(profileData);

        const userId = profileData.id; // from /api/me response

        // 2. Personal stats (/api/stats/user/:id)
        const statsRes = await apiFetch(`/api/stats/user/${userId}`);
        if (!statsRes.ok) throw new Error("Failed to load stats");
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.data);

        // 3. Achievements (/api/stats/achievements/:id)
        const achRes = await apiFetch(`/api/stats/achievements/${userId}`);
        if (!achRes.ok) throw new Error("Failed to load achievements");
        const achData = await achRes.json();
        if (achData.success) setAchievements(achData.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, navigate]);

  if (!token) return <div>Not logged in</div>;
  if (loading) return <div className="p-10">Loading profile...</div>;
  if (error) return <div className="p-10 text-red-500">{error}</div>;
  if (!profile) return <div>No profile data</div>;

  return (
    <div className="p-10 text-white max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-4xl font-bold">
            {profile.username[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-4xl font-bold">{profile.username}</h1>
            <p className="text-gray-400">{profile.email}</p>
            <p className="text-sm text-gray-500 mt-1">
              Joined {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="bg-red-600 px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Wins" value={stats?.wins ?? 0} color="text-green-400" />
        <StatCard title="Losses" value={stats?.losses ?? 0} color="text-red-400" />
        <StatCard
          title="Win Rate"
          value={`${stats?.winRate ?? 0}%`}
          color="text-blue-400"
        />
        <StatCard
          title="Tournaments Won"
          value={stats?.tournamentWins ?? 0}
          color="text-purple-300"
        />
      </div>

      {/* Achievements */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Achievements</h2>
        {achievements.length === 0 ? (
          <p className="text-gray-400">No achievements yet. Keep playing!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((ach: any) => (
              <div
                key={ach.id}
                className={`p-6 rounded-lg border ${
                  ach.unlocked ? "bg-green-900/30 border-green-500" : "bg-gray-800 border-gray-700"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      ach.unlocked ? "bg-green-500" : "bg-gray-600"
                    }`}
                  >
                    {ach.unlocked ? "🏆" : "🔒"}
                  </div>
                  <div>
                    <h3 className="font-bold">{ach.name}</h3>
                    <p className="text-sm text-gray-300">{ach.description}</p>
                    <p className="text-xs mt-1 text-gray-400">
                      Progress: {ach.progress}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable stat card
function StatCard({ title, value, color }: { title: string; value: string | number; color?: string }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg text-center border border-gray-700">
      <h3 className="text-lg text-gray-400">{title}</h3>
      <p className={`text-4xl font-bold mt-2 ${color || "text-white"}`}>{value}</p>
    </div>
  );
}