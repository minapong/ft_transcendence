import { useEffect, useState, navigate, openModal } from "Reactor";
import { apiFetch } from "@/core/lib/api";
import { useAuth } from "@/core/lib/useAuth";
import Button, { SecondaryButton } from "@/app/components/ui/Button";
import { useScreen } from "@/app/hooks/useScreen";

export default function MePage() {
  const auth = useAuth();
  const token = auth?.token;
  const screen = useScreen();

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
      {/* 0. SCANLINE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_1px]"></div>

      {/* 1. HERO SECTION */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden mb-12">
        {/* Background Gradient/Mesh */}
        <div className="absolute inset-0 bg-gray-950 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-950/90 z-10"></div>
          <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0 mix-blend-overlay"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-cyan-900/20 animate-pulse"></div>
        </div>

        {/* Settings - Absolute Top Right */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-30">
          {screen === "desktop" ? (
            <button
              onClick={() => navigate("/user/settings")}
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-cyan-950/40 border border-cyan-500/50 text-cyan-400 font-bold hover:bg-cyan-900/60 hover:text-cyan-300 hover:border-cyan-400 transition-all duration-300 backdrop-blur-md group shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
            >
              <span className="icon-[solar--settings-bold-duotone] text-2xl group-hover:rotate-90 transition-transform duration-500" />
              <span className="tracking-wide">SETTINGS</span>
            </button>
          ) : (
            <button
              onClick={() => navigate("/user/settings")}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/40 border border-cyan-500/50 text-cyan-400 font-bold hover:bg-cyan-900/60 hover:text-cyan-300 hover:border-cyan-400 transition-all duration-300 backdrop-blur-md group shadow-[0_0_15px_rgba(6,182,212,0.15)]"
            >
              <span className="icon-[solar--settings-bold-duotone] text-xl group-hover:rotate-90 transition-transform duration-500" />
              <span className="tracking-wide text-xs">SETTINGS</span>
            </button>
          )}
        </div>

        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-20 flex flex-col md:flex-row items-start md:items-end justify-start gap-4 md:gap-8">
          {/* Avatar with Glow */}
          <div className="relative group self-center md:self-auto">
            <div className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full blur opacity-50 ${avatarUrl ? 'group-hover:opacity-100' : ''} transition duration-500`}></div>
            <div
              className={`relative w-28 h-28 md:w-40 md:h-40 rounded-full border-4 border-gray-950 overflow-hidden bg-gray-900 flex items-center justify-center z-10 ring-2 ring-white/10 transition-all ${avatarUrl ? 'cursor-pointer group-hover:ring-cyan-400/50' : ''}`}
              onClick={() => {
                if (!avatarUrl) return;
                openModal({
                  type: "IMAGE_ZOOM",
                  payload: { url: avatarUrl },
                  className: "!bg-transparent !p-0 !border-none !shadow-none !w-auto !max-w-none !max-h-none !overflow-visible",
                  render: ({ url }: any) => (
                    <div className="flex flex-col items-center justify-center outline-none" tabIndex={0} data-modal-autofocus>
                      <img
                        src={url}
                        className="max-h-[60vh] max-w-[80vw] object-contain rounded-xl shadow-2xl border border-white/10"
                        alt="Zoomed avatar"
                      />
                      <div className="mt-6">
                        <SecondaryButton onClick={() => window.open(url, '_blank')} iconBefore={<span className="icon-[heroicons--arrow-down-tray]" />}>
                          Open Original
                        </SecondaryButton>
                      </div>
                    </div>
                  )
                });
              }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} className="w-full h-full object-cover" alt="avatar" />
              ) : (
                <span className="icon-[solar--user-bold] text-4xl text-gray-500" />
              )}

              {/* Search overlay icon on hover - only show if avatar exists */}
              {avatarUrl && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="icon-[solar--magnifer-zoom-in-bold] text-white text-3xl drop-shadow-lg" />
                </div>
              )}
            </div>
          </div>

          {/* Identity */}
          <div className="mb-1 md:mb-3 flex-1 flex flex-col items-center md:items-start text-center md:text-left self-center md:self-auto">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-xl relative">
                {profile?.username}
                {/* Glitch effect deco */}
                <span className="absolute -left-[2px] -top-[2px] w-full h-full text-red-500 opacity-0 group-hover:opacity-30 mix-blend-screen animate-pulse pointer-events-none" aria-hidden="true">{profile?.username}</span>
              </h1>

              {/* Level Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-950/40 border border-cyan-500/30 rounded-br-xl rounded-tl-xl backdrop-blur-sm font-mono">
                <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-wider">LVL</span>
                <span className="text-lg font-bold text-cyan-400 leading-none">{stats?.level || 1}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-400 font-mono text-sm">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                ONLINE
              </span>
              <span className="opacity-50">|</span>
              <span className="text-gray-500">{profile?.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 space-y-12">
        {/* 2. STATS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <StatCard
            label="Wins"
            value={stats?.wins ?? 0}
            icon={<span className="icon-[solar--cup-first-bold-duotone]" />}
            color="text-yellow-400"
            trend="+2 this week"
          />
          <StatCard
            label="Win Rate"
            value={`${stats?.winRate ?? 0}%`}
            icon={<span className="icon-[solar--chart-bold-duotone]" />}
            color="text-cyan-400"
            isPercentage
          />
          <StatCard
            label="Matches"
            value={(stats?.wins ?? 0) + (stats?.losses ?? 0)}
            icon={<span className="icon-[solar--gamepad-bold-duotone]" />}
            color="text-purple-400"
          />
          <StatCard
            label="Tournaments"
            value={stats?.tournamentWins ?? 0}
            icon={<span className="icon-[solar--crown-star-bold-duotone]" />}
            color="text-amber-400"
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

function StatCard({ label, value, icon, color, trend, isPercentage }: any) {
  const isPositive = trend?.includes("+");

  return (
    <div className="relative overflow-hidden bg-gray-900/40 backdrop-blur-md border border-white/5 p-3 md:p-6 rounded-xl md:rounded-2xl group transition-all duration-300 hover:bg-gray-800/60 hover:-translate-y-1">
      {/* Cyan Accent Border - Always visible */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400/50 via-cyan-400 to-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,0.3)] opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 md:p-3 rounded-lg bg-gray-800/50 text-lg md:text-2xl group-hover:scale-110 transition duration-300 ${color}`}>
          {/* Icon wrapper to ensure color application */}
          {icon}
        </div>

        {/* Visual Trend or Mini Chart can go here. For now, trend text */}
        {trend && (
          <span className={`text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full border ${isPositive ? "text-cyan-400 border-cyan-500/30 bg-cyan-950/30" : "text-gray-400 border-gray-700 bg-gray-800"}`}>
            {trend}
          </span>
        )}

        {/* Circular Progress for Percentage */}
        {isPercentage && (
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-800" />
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-cyan-400" strokeDasharray="125.6" strokeDashoffset={125.6 - (125.6 * (parseInt(value) || 0) / 100)} strokeLinecap="round" />
            </svg>
          </div>
        )}
      </div>

      <div>
        <div className={`text-xl md:text-3xl font-bold text-white tracking-tight`}>{value}</div>
        <div className="text-gray-400 text-[10px] md:text-sm font-medium mt-0.5 md:mt-1">{label}</div>
      </div>
    </div>
  );
}

function AchievementCard({ data }: any) {
  const unlocked = data.unlocked;

  // Mock progress for locked items (since backend doesn't provide it yet)
  const progress = unlocked ? 100 : Math.floor(Math.random() * 80) + 10;

  return (
    <div className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 group ${unlocked
      ? "bg-gray-900/60 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
      : "bg-gray-900/40 border-white/5 opacity-75 hover:opacity-100"
      }`}>

      {/* Background glow for unlocked */}
      {unlocked && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-50"></div>
      )}

      <div className="relative z-10 flex items-start gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-inner ${unlocked ? "bg-cyan-950/50 text-cyan-400 ring-1 ring-cyan-500/50" : "bg-gray-800/50 text-gray-500 ring-1 ring-gray-700"}`}>
          {unlocked
            ? <span className="icon-[solar--cup-star-bold]" />
            : <span className="icon-[solar--lock-keyhole-minimalistic-bold]" />
          }
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className={`font-bold text-lg leading-tight mb-1 ${unlocked ? "text-cyan-50" : "text-gray-400"}`}>
              {data.name}
            </h3>
            {unlocked && <span className="icon-[solar--check-circle-bold] text-cyan-400 text-lg" />}
          </div>

          <p className="text-xs text-gray-400 leading-relaxed mb-3">
            {data.description}
          </p>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${unlocked ? 'bg-cyan-400 shadow-[0_0_8px_cyan]' : 'bg-gray-600'}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          {!unlocked && (
            <div className="text-[10px] text-right text-gray-500 mt-1 font-mono">
              {Math.floor(progress / 10)} / 10
            </div>
          )}
        </div>
      </div>
    </div>
  );
}