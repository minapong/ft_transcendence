import { apiFetch } from "@/core/lib/api";
import { useEffect, useState, navigate, openModal } from "Reactor";
import { useAuth } from "@/core/lib/useAuth";
import Button, { SecondaryButton, DangerButton, SuccessButton } from "@/app/components/ui/Button";
import { useScreen } from "@/app/hooks/useScreen";

export default function ProfilePage(props?: { id?: string }) {
  const id = props?.id;
  const auth = useAuth();
  const meId = auth?.user?.id;
  const screen = useScreen();

  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [online, setOnline] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Friend logic
  const [friendStatus, setFriendStatus] = useState<string | null>(null);
  const [friendBusy, setFriendBusy] = useState(false);
  const [friendMsg, setFriendMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (friendMsg) {
      const timer = setTimeout(() => setFriendMsg(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [friendMsg]);

  useEffect(() => {
    if (!id) return;

    // Load User Basic Info
    apiFetch(`/api/users/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then(setUser)
      .catch(err => setError(err.message));

    // Load Stats (Public)
    apiFetch(`/api/stats/user/${id}`)
      .then(async res => {
        if (res.ok) {
          const data = await res.json();
          if (data.success) setStats(data.data);
        }
      }).catch(() => { });

    // Load Achievements (Public)
    apiFetch(`/api/stats/achievements/${id}`)
      .then(async res => {
        if (res.ok) {
          const data = await res.json();
          if (data.success) setAchievements(data.data || []);
        }
      }).catch(() => { });

  }, [id]);

  useEffect(() => {
    if (!id) return;
    setOnline(null);

    let alive = true;
    let seq = 0;

    const fetchStatus = async () => {
      const mySeq = ++seq;
      try {
        const res = await apiFetch(`/api/presence/status/${id}`);
        if (!res.ok) return;
        const data = await res.json();
        if (alive && mySeq === seq) setOnline(!!data.online);
      } catch {
        if (alive && mySeq === seq) setOnline(null);
      }
    };

    fetchStatus();
    const t = setInterval(fetchStatus, 2000);

    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [id]);

  useEffect(() => {
    if (!id || !meId) return;

    let cancelled = false;
    setFriendStatus(null);
    setFriendMsg(null);

    Promise.all([
      apiFetch("/api/friends").then(r => r.ok ? r.json() : { friends: [] }),
      apiFetch("/api/friends/incoming").then(r => r.ok ? r.json() : { incoming: [] })
    ]).then(([friendsData, incomingData]) => {
      if (cancelled) return;

      const friendMatch = (friendsData.friends ?? []).find((r: any) => String(r.to?.id) === String(id));
      if (friendMatch) {
        setFriendStatus(friendMatch.status);
        return;
      }

      const incomingMatch = (incomingData.incoming ?? []).find((r: any) => String(r.from?.id) === String(id));
      if (incomingMatch) {
        setFriendStatus("incoming_request");
        return;
      }

      setFriendStatus("none");
    }).catch(() => {
      if (!cancelled) setFriendStatus("none");
    });

    return () => {
      cancelled = true;
    };
  }, [id, meId]);

  async function addFriend() {
    if (!user?.username) return;

    setFriendBusy(true);
    setFriendMsg(null);

    try {
      const res = await apiFetch(`/api/friends/request`, {
        method: "POST",
        body: JSON.stringify({ username: user.username }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.ok === false) {
        setFriendMsg({ type: 'error', text: data.error || "Failed to send request" });
        return;
      }

      setFriendStatus("pending");
      setFriendMsg({ type: 'success', text: "Friend request sent!" });
    } catch {
      setFriendMsg({ type: 'error', text: "Network error" });
    } finally {
      setFriendBusy(false);
    }
  }

  // 1. SPLIT LOGIC: Actual removal function
  async function executeRemove() {
    if (!id) return;

    setFriendBusy(true);
    setFriendMsg(null);

    try {
      const res = await apiFetch(`/api/friends/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.ok === false) {
        setFriendMsg({ type: 'error', text: data.error || "Failed to remove" });
        return;
      }

      setFriendStatus("none");
      setFriendMsg({ type: 'success', text: "Removed successfully" });
    } catch {
      setFriendMsg({ type: 'error', text: "Network error" });
    } finally {
      setFriendBusy(false);
    }
  }

  // 2. TRIGGER: Open generic modal
  function removeFriendOrCancel() {
    openModal({
      type: "CONFIRM_ACTION",
      className: "max-w-md w-full !bg-transparent p-0 shadow-none border-none",
      payload: {},
      render: ({ close }: any) => (
        <div className="bg-gray-950/90 backdrop-blur-2xl border border-white/10 p-0 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.2)] relative overflow-hidden animate-in zoom-in-95 fade-in duration-300">
          {/* Cyberpunk Noise & Glow */}
          {/* Header / Top Bar */}
          <div className="p-6 pb-2 flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                <span className="icon-[solar--danger-triangle-bold] text-red-500 text-xl"></span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight leading-none mb-1">Confirm Action</h3>
                <p className="text-xs text-red-400 font-mono uppercase tracking-wider opacity-70">irrevocable action</p>
              </div>
            </div>

            {/* Custom X Button removed - handled by ModalRoot */}
          </div>

          {/* Body */}
          <div className="px-6 py-4 relative z-10">
            <p className="text-gray-300 leading-relaxed text-sm">
              Are you sure you want to <span className="text-white font-bold">{friendStatus === 'accepted' ? 'remove this friend' : 'cancel this request'}</span>?
              <br />This action cannot be undone and you may lose access to private data.
            </p>
          </div>

          {/* Footer / Actions */}
          <div className="p-6 pt-2 flex items-center justify-end gap-3 relative z-10 bg-gradient-to-t from-black/20 to-transparent">
            <button
              onClick={close}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                executeRemove();
                close();
              }}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-0.5 transition-all border border-red-400/20 flex items-center gap-2"
            >
              <span className="icon-[solar--trash-bin-trash-bold]"></span>
              <span>{friendStatus === 'accepted' ? 'Remove Friend' : 'Cancel Request'}</span>
            </button>
          </div>
        </div>
      )
    });
  }

  async function acceptRequest() {
    if (!id) return;
    setFriendBusy(true);
    setFriendMsg(null);

    try {
      const res = await apiFetch(`/api/friends/accept/${id}`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        setFriendMsg({ type: 'error', text: data.error || "Failed to accept" });
        return;
      }
      setFriendStatus("accepted");
      setFriendMsg({ type: 'success', text: "Friend request accepted!" });
    } catch {
      setFriendMsg({ type: 'error', text: "Network error" });
    } finally {
      setFriendBusy(false);
    }
  }

  if (!id) return <div>Invalid profile</div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="text-red-400 text-xl font-bold mb-4">{error}</div>
      <Button onClick={() => navigate('/user/me')}>Go Back Home</Button>
    </div>
  );

  if (!user) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
    </div>
  );

  const isMe = meId != null && String(meId) === String(id);
  const privacyUnlocked = user.canSeePrivate || isMe; // If backend says canSeePrivate (is Friend) or if it's me.

  return (
    <div className="min-h-screen text-white pb-20">
      {/* 0. SCANLINE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_1px]"></div>

      {/* FEEDBACK TOAST */}
      {friendMsg && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl border backdrop-blur-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 ${friendMsg.type === 'error'
          ? 'bg-red-500/20 border-red-500/30 text-red-200'
          : 'bg-green-500/20 border-green-500/30 text-green-200'
          }`}>
          <span className={`text-xl icon-[solar--${friendMsg.type === 'error' ? 'danger-circle-bold' : 'check-circle-bold'}]`} />
          <span className="font-medium pr-2">{friendMsg.text}</span>
          <button onClick={() => setFriendMsg(null)} className="ml-2 hover:bg-white/10 rounded-full p-1 transition-colors">
            <span className="icon-[solar--close-circle-bold] text-lg opacity-60 hover:opacity-100" />
          </button>
        </div>
      )}

      {/* 1. HERO SECTION */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden mb-12">
        {/* Background Gradient/Mesh */}
        <div className="absolute inset-0 bg-gray-950 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-950/90 z-10"></div>
          <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0 mix-blend-overlay"></div>
          {/* DIFFERENT HUE FOR PUBLIC PROFILES: Violet/Pink bias */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-violet-900/40 via-fuchsia-900/20 to-cyan-900/20 animate-pulse"></div>
        </div>

        {/* Back Button */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-30">
          <button
            onClick={() => window.history.back()}
            className="p-3 rounded-full bg-gray-900/40 border border-white/10 text-white hover:bg-white/10 backdrop-blur-md transition-all"
          >
            <span className="icon-[solar--arrow-left-linear] text-xl" />
          </button>
        </div>

        {/* Friend Actions - Absolute Top Right */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-30">
          {!isMe && meId && (
            <div className="flex items-center gap-2">
              {friendStatus === "accepted" ? (
                <DangerButton
                  size={screen === 'mobile' ? 'sm' : 'md'}
                  disabled={friendBusy}
                  onClick={removeFriendOrCancel}
                  iconBefore={<span className="icon-[solar--user-minus-bold]" />}
                >
                  {screen === 'mobile' ? '' : 'Remove Friend'}
                </DangerButton>
              ) : friendStatus === "pending" ? (
                <SecondaryButton
                  size={screen === 'mobile' ? 'sm' : 'md'}
                  disabled={friendBusy}
                  onClick={removeFriendOrCancel}
                  iconBefore={<span className="icon-[solar--close-circle-linear]" />}
                >
                  {screen === 'mobile' ? '' : 'Cancel Request'}
                </SecondaryButton>
              ) : friendStatus === "incoming_request" ? (
                <SuccessButton
                  size={screen === 'mobile' ? 'sm' : 'md'}
                  disabled={friendBusy}
                  onClick={acceptRequest}
                  iconBefore={<span className="icon-[solar--user-check-bold]" />}
                >
                  {screen === 'mobile' ? 'Accept' : 'Accept Request'}
                </SuccessButton>
              ) : (
                <Button
                  size={screen === 'mobile' ? 'sm' : 'md'}
                  disabled={friendBusy}
                  onClick={addFriend}
                  iconBefore={<span className="icon-[solar--user-plus-bold]" />}
                >
                  {screen === 'mobile' ? 'Add Friend' : 'Add Friend'}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-20 flex flex-col md:flex-row items-start md:items-end justify-start gap-4 md:gap-8">
          {/* Avatar with Glow */}
          <div className="relative group self-center md:self-auto">
            <div className={`absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full blur opacity-50 transition duration-500`}></div>
            <div
              className={`relative w-28 h-28 md:w-40 md:h-40 rounded-full border-4 border-gray-950 overflow-hidden bg-gray-900 flex items-center justify-center z-10 ring-2 ring-white/10 ${user.avatarUrl ? 'cursor-pointer' : ''}`}
              onClick={() => {
                if (!user.avatarUrl) return;
                openModal({
                  type: "IMAGE_ZOOM",
                  payload: { url: user.avatarUrl },
                  className: "!bg-transparent !p-0 !border-none !shadow-none !w-auto !max-w-none !max-h-none !overflow-visible",
                  render: ({ url }: any) => (
                    <div className="flex flex-col items-center justify-center outline-none" tabIndex={0} data-modal-autofocus>
                      <img
                        src={url}
                        className="max-h-[60vh] max-w-[80vw] object-contain rounded-xl shadow-2xl border border-white/10"
                        alt="Zoomed avatar"
                      />
                    </div>
                  )
                });
              }}
            >
              {user.avatarUrl ? (
                <img src={user.avatarUrl} className="w-full h-full object-cover" alt="avatar" />
              ) : (
                <span className="icon-[solar--user-bold] text-4xl text-gray-500" />
              )}
            </div>
          </div>

          {/* Identity */}
          <div className="mb-1 md:mb-3 flex-1 flex flex-col items-center md:items-start text-center md:text-left self-center md:self-auto">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-xl relative">
                {user.username}
              </h1>

              {/* Level Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 bg-violet-950/40 border border-violet-500/30 rounded-br-xl rounded-tl-xl backdrop-blur-sm font-mono">
                <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">LVL</span>
                <span className="text-lg font-bold text-violet-300 leading-none">{stats?.level || 1}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-400 font-mono text-sm">
              <span className="flex items-center gap-1.5">
                {online === null ? (
                  <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                ) : online ? (
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                )}
                {online === null ? "..." : online ? "ONLINE" : "OFFLINE"}
              </span>
              <span className="opacity-50">|</span>
              <span className="text-gray-500">Joined {new Date(user.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 space-y-12">

        {/* 2. STATS GRID (PUBLIC) */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-6">
          <StatCard
            label="Wins"
            value={stats?.wins ?? 0}
            icon={<span className="icon-[solar--cup-first-bold-duotone]" />}
            color="text-yellow-400"
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

          <StatCard
            label="XP"
            value={stats?.totalScore ?? 0}
            icon={<span className="icon-[solar--star-bold-duotone]" />}
            color="text-purple-400"
          />
        </div>

        {/* 3. ACHIEVEMENTS (FRIENDS ONLY) */}
        {privacyUnlocked && (
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
                <p className="text-gray-400">Locked or no data available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {achievements.map((ach: any) => (
                  <AchievementCard key={ach.id} data={ach} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* 4. PUBLIC/PRIVATE INFO SECTION */}
        <section className="border-t border-white/5 pt-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="text-cyan-400 icon-[solar--user-id-bold-duotone]"></span>
            User Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. AGE CARD */}
            <PrivacyCard
              label="AGE"
              value={user.age}
              unlocked={privacyUnlocked}
              iconUnlocked="icon-[solar--calendar-date-bold-duotone]"
              iconLocked="icon-[solar--lock-keyhole-minimalistic-bold-duotone]"
            />

            {/* 2. LOCATION CARD */}
            <PrivacyCard
              label="LOCATION"
              value={user.location}
              unlocked={privacyUnlocked}
              iconUnlocked="icon-[solar--map-point-bold-duotone]"
              iconLocked="icon-[solar--lock-keyhole-minimalistic-bold-duotone]"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

// Sub-component for Privacy Cards
function PrivacyCard({ label, value, unlocked, iconUnlocked, iconLocked }) {
  if (unlocked) {
    // UNLOCKED STATE (FRIEND/ME)
    return (
      <div className="group relative overflow-hidden bg-gray-900/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl transition-all hover:bg-gray-800/60 hover:border-cyan-500/30">
        <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/50"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-cyan-500 tracking-wider font-mono">{label}</span>
          <span className={`${iconUnlocked} text-xl text-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity`}></span>
        </div>
        <div className="text-2xl font-bold text-white">
          {value || <span className="text-gray-600 text-lg italic">Not set</span>}
        </div>
        <div className="mt-2 text-[10px] text-gray-500 flex items-center gap-1">
          <span className="icon-[solar--eye-bold] text-cyan-500/70" />
          Visible to Friends
        </div>
      </div>
    );
  } else {
    // LOCKED STATE (NON-FRIEND)
    return (
      <div className="group relative overflow-hidden bg-gray-950/60 border border-red-500/10 p-6 rounded-2xl transition-all">
        {/* Diagonal stripes pattern for locked feel */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(45deg,rgba(255,255,255,.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.1)_50%,rgba(255,255,255,.1)_75%,transparent_75%,transparent)] bg-[length:10px_10px]"></div>

        <div className="absolute top-0 left-0 w-1 h-full bg-red-500/30"></div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-red-500/70 tracking-wider font-mono">{label}</span>
          <span className={`${iconLocked} text-xl text-red-500/50`}></span>
        </div>

        <div className="flex items-center gap-2 py-1">
          <span className="text-lg font-bold text-gray-500 blur-[4px] select-none">HIDDEN DATA</span>
        </div>

        <div className="mt-2 text-[10px] text-red-400/60 flex items-center gap-1 font-mono uppercase">
          <span className="icon-[solar--lock-keyhole-bold]" />
          Locked • Friends Only
        </div>
      </div>
    );
  }
}

// Sub-components (Reused from MePage to strictly match styling)
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
  const unlocked = !!data.unlocked;

  const { current, target } = normalizeProgress(data);

  const percent =
    unlocked ? 100 :
    target > 0 ? Math.max(0, Math.min(100, (current / target) * 100)) : 0;

  return (
    <div
      className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 group ${
        unlocked
          ? "bg-gray-900/60 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
          : "bg-gray-900/40 border-white/5 opacity-75 hover:opacity-100"
      }`}
    >
      {unlocked && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-50"></div>
      )}

      <div className="relative z-10 flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-inner ${
            unlocked
              ? "bg-cyan-950/50 text-cyan-400 ring-1 ring-cyan-500/50"
              : "bg-gray-800/50 text-gray-500 ring-1 ring-gray-700"
          }`}
        >
          {unlocked ? (
            <span className="icon-[solar--cup-star-bold]" />
          ) : (
            <span className="icon-[solar--lock-keyhole-minimalistic-bold]" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className={`font-bold text-lg leading-tight mb-1 ${unlocked ? "text-cyan-50" : "text-gray-400"}`}>
              {data.name}
            </h3>
            {unlocked && <span className="icon-[solar--check-circle-bold] text-cyan-400 text-lg" />}
          </div>

          <p className="text-xs text-gray-400 leading-relaxed mb-3">{data.description}</p>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                unlocked ? "bg-cyan-400 shadow-[0_0_8px_cyan]" : "bg-gray-600"
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* Stable progress text */}
          {!unlocked && (
            <div className="text-[10px] text-right text-gray-500 mt-1 font-mono">
              {current} / {target}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function normalizeProgress(data: any): { current: number; target: number } {
  // Preferred: backend sends numeric fields
  if (typeof data.current === "number" && typeof data.target === "number") {
    return { current: data.current, target: data.target };
  }

  // Common: backend sends "1/10"
  if (typeof data.progress === "string") {
    const m = data.progress.match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
    if (m) return { current: Number(m[1]), target: Number(m[2]) };
  }

  // If backend sends progress number only, we need a target. Fallback to 10.
  if (typeof data.progress === "number") {
    const target = typeof data.max === "number" ? data.max : 10;
    return { current: data.progress, target };
  }

  return { current: 0, target: 10 };
}

