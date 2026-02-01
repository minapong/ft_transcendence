import { apiFetch } from "@/core/lib/api";
import { navigate, useEffect, useState } from "Reactor";
import { useAuth } from "@/core/lib/useAuth";
import { vUsername } from "@/core/lib/input/validators";
import { unwrap } from "@/core/lib/input/unwrap";
import Button, { SecondaryButton, SuccessButton, DangerButton } from "@/app/components/ui/Button";

type OutgoingRow = {
  to: { id: number; username: string; avatarId?: number | null; avatarUrl?: string };
  status: "pending" | "accepted" | string;
  created_at: string;
};

type IncomingRow = {
  from: { id: number; username: string; avatarId?: number | null; avatarUrl?: string };
  status: "pending" | "accepted" | string;
  created_at: string;
};

export default function FriendsPage() {
  const auth = useAuth();
  const token = auth?.token;

  const [incoming, setIncoming] = useState<IncomingRow[]>([]);
  const [friends, setFriends] = useState<OutgoingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [newUsernameRaw, setNewUsername] = useState("");

  useEffect(() => {
    if (!token) navigate("/auth/login");
  }, [token]);

  async function reload() {
    setLoading(true);
    setMsg(null);

    try {
      const [inRes, outRes] = await Promise.all([
        apiFetch("/api/friends/incoming"),
        apiFetch("/api/friends"),
      ]);

      const inData = await inRes.json().catch(() => ({}));
      const outData = await outRes.json().catch(() => ({}));

      if (inRes.ok) setIncoming(inData.incoming ?? []);
      if (outRes.ok) setFriends(outData.friends ?? []);
    } catch {
      setMsg({ type: 'error', text: "Network error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) return;
    reload();
  }, [token]);

  async function sendRequest() {
    let username: string;
    setMsg(null);

    try {
      username = unwrap(vUsername(newUsernameRaw));
    } catch (e: any) {
      setMsg({ type: 'error', text: e.message });
      return;
    }

    const res = await apiFetch(`/api/friends/request`, {
      method: "POST",
      body: JSON.stringify({ username }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) {
      setMsg({ type: 'error', text: data.error || "Failed to send request" });
      return;
    }
    setNewUsername("");
    setMsg({ type: 'success', text: "Request sent successfully!" });
    reload();
  }

  async function accept(userId: number) {
    setMsg(null);
    const res = await apiFetch(`/api/friends/accept/${userId}`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) {
      setMsg({ type: 'error', text: data.error || "Failed to accept" });
      return;
    }
    setMsg({ type: 'success', text: "Friend request accepted!" });
    reload();
  }

  async function remove(userId: number) {
    if (!confirm("Are you sure?")) return;

    setMsg(null);
    const res = await apiFetch(`/api/friends/${userId}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) {
      setMsg({ type: 'error', text: data.error || "Failed to remove" });
      return;
    }
    setMsg({ type: 'success', text: "Removed successfully." });
    reload();
  }

  if (!token) return <div>Not logged in</div>;

  return (
    <div className="min-h-screen text-white pb-20 relative overflow-hidden">
      {/* 0. SCANLINE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_1px]"></div>

      {/* BACKGROUND */}
      <div className="fixed inset-0 bg-gray-950 z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 mix-blend-overlay"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[100px] animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => navigate('/user/me')}
                className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
              >
                <span className="icon-[solar--arrow-left-linear] text-2xl" />
              </button>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">FRIENDS</span>
              </h1>
            </div>
            <p className="text-gray-400 pl-14">Connect and play with other players.</p>
          </div>

          <SecondaryButton
            onClick={reload}
            loading={loading}
            iconBefore={<span className="icon-[solar--refresh-bold]" />}
          >
            Refresh List
          </SecondaryButton>
        </div>

        {/* FEEDBACK MSG */}
        {msg && (
          <div className={`mb-8 p-4 rounded-xl border backdrop-blur-md flex items-center gap-3 animation-slide-in ${msg.type === 'error'
              ? 'bg-red-500/10 border-red-500/30 text-red-200'
              : 'bg-green-500/10 border-green-500/30 text-green-200'
            }`}>
            <span className={`text-xl icon-[solar--${msg.type === 'error' ? 'danger-circle-bold' : 'check-circle-bold'}]`} />
            {msg.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN: ADD FRIEND & REQUESTS */}
          <div className="space-y-8">

            {/* ADD FRIEND CARD */}
            <div className="bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="icon-[solar--user-plus-bold-duotone] text-cyan-400" />
                Add Friend
              </h2>

              <div className="flex flex-col gap-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 icon-[solar--user-linear]"></span>
                  <input
                    className="w-full bg-gray-950/50 border border-gray-700/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    placeholder="Username"
                    value={newUsernameRaw}
                    onChange={(e: any) => setNewUsername(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendRequest()}
                  />
                </div>
                <Button onClick={sendRequest} fullWidth iconAfter={<span className="icon-[solar--plain-3-bold]" />}>
                  Send Request
                </Button>
              </div>
            </div>

            {/* INCOMING REQUESTS */}
            <div className="bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>

              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="icon-[solar--inbox-archive-bold-duotone] text-purple-400" />
                Incoming Requests
                {incoming.length > 0 && (
                  <span className="bg-purple-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-auto">
                    {incoming.length}
                  </span>
                )}
              </h2>

              {incoming.length === 0 ? (
                <div className="text-center py-8 text-gray-500 border border-dashed border-gray-800 rounded-xl bg-gray-950/20">
                  <p>No pending requests</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {incoming.map((r) => (
                    <div key={r.from.id} className="bg-gray-950/40 border border-gray-800 rounded-xl p-3 hover:border-gray-700 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700">
                          <span className="icon-[solar--user-bold] text-gray-600 text-xl" />
                        </div>
                        <div>
                          <div className="font-bold text-white">{r.from.username}</div>
                          <div className="text-xs text-gray-400">Sent you a request</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <SuccessButton size="sm" onClick={() => accept(r.from.id)}>Accept</SuccessButton>
                        <DangerButton size="sm" onClick={() => remove(r.from.id)}>Decline</DangerButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: FRIENDS LIST */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl relative min-h-[500px]">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="icon-[solar--users-group-rounded-bold-duotone] text-green-400" />
                My Friends
                <span className="text-base font-normal text-gray-500 ml-2">({friends.length})</span>
              </h2>

              {friends.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <span className="icon-[solar--confounded-square-linear] text-5xl mb-4 opacity-50" />
                  <p className="text-lg">No friends added yet.</p>
                  <p className="text-sm opacity-70">Search for users to add them!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {friends.map((friend) => (
                    <div key={friend.to.id} className="group bg-gray-950/40 border border-gray-800 rounded-xl p-4 flex items-center justify-between hover:bg-gray-900/60 hover:border-cyan-500/30 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700 group-hover:border-cyan-500/50 transition-colors">
                            {/* If we had avatars, we'd use them here. For now, Placeholder */}
                            <span className="icon-[solar--user-bold] text-gray-500 text-2xl group-hover:text-cyan-400 transition-colors" />
                          </div>
                          {/* Online indicator spot (mocked for now) */}
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-500 rounded-full border-2 border-gray-900" title="Offline"></div>
                        </div>

                        <div>
                          <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">{friend.to.username}</div>
                          <div className="text-xs text-gray-500 capitalize">{friend.status === 'pending' ? 'Request Sent' : 'Friend'}</div>
                        </div>
                      </div>

                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => navigate(`/user/${friend.to.id}`)}
                          className="p-2 rounded-lg bg-gray-800 text-cyan-400 hover:bg-cyan-900/50 transition-colors"
                          title="View Profile"
                        >
                          <span className="icon-[solar--user-id-bold]" />
                        </button>
                        <button
                          onClick={() => remove(friend.to.id)}
                          className="p-2 rounded-lg bg-gray-800 text-red-400 hover:bg-red-900/50 transition-colors"
                          title={friend.status === 'pending' ? 'Cancel Request' : 'Remove Friend'}
                        >
                          <span className={`icon-[solar--${friend.status === 'pending' ? 'close-circle-bold' : 'trash-bin-trash-bold'}]`} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
