import { useEffect, useState, navigate } from "Reactor";
import { apiFetch } from "@/core/lib/api";
import { useAuth } from "@/core/lib/useAuth";
import Button, { SecondaryButton } from "@/app/components/ui/Button";

export default function MePage() {
  const auth = useAuth();
  const token = auth?.token;

  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

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
        setProfile(profileData);

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
  }, [token]);

  if (!token) return <div>Not logged in</div>;

  if (loading) {
    return (
      <div className="p-10 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-48 bg-gray-900/50 rounded-2xl"></div>
          <div className="grid grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-900/50 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-red-400 mb-6 text-xl">⚠️ {fetchError}</div>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  const avatarUrl = profile?.avatarUrl;

  return (
    <div className="min-h-screen text-white pb-20">

      {/* 1. HERO SECTION */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        {/* Background Gradient/Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black z-0"></div>
        <div className="absolute inset-0 opacity-30 bg-[url('/assets/grid.png')] bg-repeat z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent z-10"></div>

        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
          <div className="flex items-end gap-6">
            {/* Avatar with Glow */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-gray-950 overflow-hidden bg-gray-800 flex items-center justify-center text-4xl font-bold z-10">
                {avatarUrl ? (
                  <img src={avatarUrl} className="w-full h-full object-cover" alt="avatar" />
                ) : (
                  <span>{profile?.username?.[0]?.toUpperCase()}</span>
                )}
              </div>
            </div>

            {/* Text Info */}
            <div className="mb-2">
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
                {profile?.username}
              </h1>
              <div className="flex items-center gap-3 text-gray-300 mt-1">
                <span className="bg-gray-800/80 px-2 py-0.5 rounded text-sm text-blue-300 border border-blue-500/30">
                  lvl {stats?.level || 1}
                </span>
                <span className="text-sm opacity-80">{profile?.email}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-2">
            <SecondaryButton
              onClick={() => navigate("/user/settings")}
              iconBefore={<span>✎</span>}
            >
              Edit Profile
            </SecondaryButton>
            <Button
              variant="glass"
              onClick={() => navigate("/user/settings")}
            >
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 space-y-12">
        {/* 2. STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Wins"
            value={stats?.wins ?? 0}
            icon="🏆"
            color="text-yellow-400"
            trend="+2 this week" // Mock data for visual
          />
          <StatCard
            label="Win Rate"
            value={`${stats?.winRate ?? 0}%`}
            icon="📈"
            color="text-green-400"
          />
          <StatCard
            label="Matches"
            value={(stats?.wins ?? 0) + (stats?.losses ?? 0)}
            icon="🎮"
            color="text-blue-400"
          />
          <StatCard
            label="Tournaments"
            value={stats?.tournamentWins ?? 0}
            icon="👑"
            color="text-purple-400"
          />
        </div>

        {/* 3. ACHIEVEMENTS */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-yellow-500">🌟</span> Achievements
            </h2>
            <span className="text-sm text-gray-500">
              {achievements.filter((a: any) => a.unlocked).length} / {achievements.length} Unlocked
            </span>
          </div>

          {achievements.length === 0 ? (
            <div className="p-12 rounded-2xl bg-gray-900/30 border border-gray-800 text-center">
              <p className="text-gray-400">Play games to earn achievements!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {achievements.map((ach: any) => (
                <AchievementCard key={ach.id} data={ach} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// Sub-components

function StatCard({ label, value, icon, color, trend }: any) {
  return (
    <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800 p-6 rounded-2xl hover:bg-gray-800/40 transition duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gray-800/50 text-2xl group-hover:scale-110 transition duration-300`}>
          {icon}
        </div>
        {trend && <span className="text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded-full">{trend}</span>}
      </div>
      <div>
        <div className={`text-3xl font-bold ${color}`}>{value}</div>
        <div className="text-gray-400 text-sm font-medium">{label}</div>
      </div>
    </div>
  );
}

function AchievementCard({ data }: any) {
  const unlocked = data.unlocked;
  return (
    <div className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 ${unlocked
        ? "bg-gradient-to-br from-gray-900 to-gray-800 border-yellow-500/20 hover:border-yellow-500/40"
        : "bg-gray-900/20 border-gray-800 opacity-60 grayscale"
      }`}>
      <div className="flex items-center gap-4 relative z-10">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-lg ${unlocked ? "bg-yellow-500/10 text-yellow-400" : "bg-gray-800 text-gray-500"
          }`}>
          {unlocked ? "🏆" : "🔒"}
        </div>
        <div>
          <h3 className={`font-bold text-lg ${unlocked ? "text-white" : "text-gray-400"}`}>
            {data.name}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            {data.description}
          </p>
        </div>
      </div>
      {unlocked && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>
      )}
    </div>
  );
}