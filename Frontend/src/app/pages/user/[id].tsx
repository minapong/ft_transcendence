import { apiFetch } from "@/core/lib/api";
import { useEffect, useState } from "Reactor";
import { useAuth } from "@/core/lib/useAuth";

export default function ProfilePage(props?: { id?: string }) {
  const id = props?.id;
  const auth = useAuth();
  const meId = auth?.user?.id;

  const [user, setUser] = useState<any>(null);
  const [online, setOnline] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [friendStatus, setFriendStatus] = useState<string | null>(null);
  const [friendBusy, setFriendBusy] = useState(false);
  const [friendMsg, setFriendMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    apiFetch(`/api/users/${id}`)
    .then(res => {
      if (!res.ok) throw new Error("User not found");
      return res.json();
    })
    .then(setUser)
    .catch(err => setError(err.message));
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

    // We don't have "status endpoint", so we infer from /api/friends list
    apiFetch("/api/friends")
      .then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json();
        if (cancelled) return null;

        const match = (data.friends ?? []).find((r: any) => String(r.to?.id) === String(id));
        if (match) setFriendStatus(match.status); // "pending" or "accepted"
        else setFriendStatus("none");
      })
      .catch(() => {
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
         body: JSON.stringify({ username:user.username }),
    });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFriendMsg(data.error || "Failed to send request");
        return;
      }

      setFriendStatus("pending");
      setFriendMsg("Friend request sent ✅");
    } catch {
      setFriendMsg("Network error");
    } finally {
      setFriendBusy(false);
    }
  }

  async function removeFriendOrCancel() {
    if (!id) return;
    setFriendBusy(true);
    setFriendMsg(null);

    try {
      const res = await apiFetch(`/api/friends/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFriendMsg(data.error || "Failed to remove");
        return;
      }

      setFriendStatus("none");
      setFriendMsg("Removed ✅");
    } catch {
      setFriendMsg("Network error");
    } finally {
      setFriendBusy(false);
    }
  }

  if (!id) return <div>Invalid profile</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>Loading profile...</div>;

  const isMe = meId != null && String(meId) === String(id);

   return (
    <div className="p-10 text-white">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center text-3xl font-bold">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                className="w-full h-full object-cover"
                alt="avatar"
                onError={(e) => {
                  console.warn("profile avatar failed:", user?.avatarUrl);
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <span>{user?.username?.[0]?.toUpperCase() || "?"}</span>
            )}
          </div>

          <h1 className="text-3xl font-bold">{user.username}</h1>
          {online === null ? (
            <span className="text-gray-400 text-sm">…</span>
          ) : online ? (
            <span className="text-green-400 text-sm font-bold">● Online</span>
          ) : (
            <span className="text-gray-400 text-sm">● Offline</span>
          )}
        </div>

        {/* Friend actions */}
        {!isMe && meId && (
          <div className="flex items-center gap-2">
            {friendStatus === "accepted" ? (
              <button
                type="button"
                disabled={friendBusy}
                onClick={removeFriendOrCancel}
                className="bg-red-600 px-4 py-2 rounded font-bold hover:bg-red-500 disabled:opacity-50"
              >
                Remove friend
              </button>
            ) : friendStatus === "pending" ? (
              <button
                type="button"
                disabled={friendBusy}
                onClick={removeFriendOrCancel}
                className="bg-gray-700 px-4 py-2 rounded font-bold hover:bg-gray-600 disabled:opacity-50"
              >
                Cancel request
              </button>
            ) : (
              <button
                type="button"
                disabled={friendBusy}
                onClick={addFriend}
                className="bg-blue-600 px-4 py-2 rounded font-bold hover:bg-blue-500 disabled:opacity-50"
              >
                Add friend
              </button>
            )}
          </div>
        )}
      </div>

      {friendMsg && <p className="mt-3 text-sm text-gray-300">{friendMsg}</p>}

      <p className="text-sm mt-4">
        Joined: {new Date(user.created_at).toLocaleDateString()}
      </p>
      {user.avatarId != null && <p>Avatar: {user.avatarId}</p>}
    </div>
  );
}
