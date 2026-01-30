import { useEffect, useState, navigate } from "Reactor";
import { apiFetch } from "@/core/lib/api";
import { useAuth } from "@/core/lib/useAuth";
import { logout } from "@/core/lib/auth";

export default function MePage() {
  const auth = useAuth();
  const token = auth?.token;

  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null); // only real errors

  useEffect(() => {
    if (!token) {
      navigate("/auth/login");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setFetchError(null);

      try {
        // 1. Profile (/api/me)
        const profileRes = await apiFetch("/api/me");
        if (!profileRes.ok) throw new Error("Failed to load profile");
        const profileData = await profileRes.json();
        // console.log("[ME] /api/me JSON =", profileData);
       

        setProfile(profileData);
        // console.log("[ME] profileData.username =", profileData?.username);
        // console.log("[ME] profileData.email =", profileData?.email);
        // console.log("[ME] profileData.created_at =", profileData?.created_at);


        const userId = profileData.id;

        // Stats
        const statsRes = await apiFetch(`/api/stats/user/${userId}`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData.success) setStats(statsData.data);
        }

        // Achievements
        const achRes = await apiFetch(`/api/stats/achievements/${userId}`);
        if (achRes.ok) {
          const achData = await achRes.json();
          if (achData.success) setAchievements(achData.data || []);
        }
      } catch (err: any) {
        setFetchError(err.message || "Failed to load your profile");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, navigate]);

  if (!token) return <div>Not logged in</div>;

  if (loading) {
    return (
      <div className="p-10">
        <div className="animate-pulse space-y-8">
          <div className="h-12 w-48 bg-gray-700 rounded"></div>
          <div className="grid grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // console.log("avatarUrl:", profile?.avatarUrl);
  
  if (fetchError) {
    return (
      <div className="p-10 text-center">
        <div className="text-red-400 mb-4">⚠️ {fetchError}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-10 text-white max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
       <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center text-4xl font-bold">
        {profile?.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            className="w-full h-full object-cover"
            alt="avatar"
            onError={(e) => {
              console.warn("avatar failed to load:", profile?.avatarUrl);
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <span>{profile?.username?.[0]?.toUpperCase() || "?"}</span>
        )}
      </div>

          <div>
            <h1 className="text-4xl font-bold">{profile?.username || "Player"}</h1>
            <p className="text-gray-400">{profile?.email || "No email"}</p>
            <p className="text-sm text-gray-500 mt-1">
              Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "—"}
            </p>
          </div>
        </div>
         
        <button onClick={() => navigate("/user/friends")} className="bg-gray-700 px-4 py-2 rounded font-bold hover:bg-gray-600">
          Friends
        </button>

        <button
          onClick={logout}
          className="bg-red-600 px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Wins" value={stats?.wins ?? 0} color="text-green-400" />
        <StatCard title="Losses" value={stats?.losses ?? 0} color="text-red-400" />
        <StatCard title="Win Rate" value={`${stats?.winRate ?? 0}%`} color="text-blue-400" />
        <StatCard title="Tournaments Won" value={stats?.tournamentWins ?? 0} color="text-purple-300" />
      </div>

      {/* Achievements */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Achievements</h2>

        {achievements.length === 0 ? (
          <div className="bg-gray-800 p-8 rounded-lg text-center border border-gray-700">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold mb-2">No Achievements Yet</h3>
            <p className="text-gray-400 mb-6">
              Play some games and win tournaments to unlock your first badges!
            </p>
            <button
              onClick={() => navigate("/single_game")}
              className="bg-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Start Playing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((ach: any) => (
              <div
                key={ach.id}
                className={`p-6 rounded-lg border ${
                  ach.unlocked ? "bg-green-900/30 border-green-500" : "bg-gray-800 border-gray-700 opacity-70"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      ach.unlocked ? "bg-green-500 text-black" : "bg-gray-600 text-gray-300"
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

function StatCard({ title, value, color }: { title: string; value: string | number; color?: string }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg text-center border border-gray-700">
      <h3 className="text-lg text-gray-400">{title}</h3>
      <p className={`text-4xl font-bold mt-2 ${color || "text-white"}`}>{value}</p>
    </div>
  );
}