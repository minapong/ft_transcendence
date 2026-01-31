import { apiFetch } from "@/core/lib/api";
import { navigate, useEffect, useState } from "Reactor";
import { useAuth } from "@/core/lib/useAuth";
import { vUsername } from "@/core/lib/input/validators";
import { unwrap } from "@/core/lib/input/unwrap";


type OutgoingRow = {
  to: { id: number; username: string; avatarId?: number | null };
  status: "pending" | "accepted" | string;
  created_at: string;
};

type IncomingRow = {
  from: { id: number; username: string; avatarId?: number | null };
  status: "pending" | "accepted" | string;
  created_at: string;
};

export default function FriendsPage() {
  const auth = useAuth();
  const token = auth?.token;

  const [incoming, setIncoming] = useState<IncomingRow[]>([]);
  const [friends, setFriends] = useState<OutgoingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

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
      setMsg("Network error");
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

    try {
      username = unwrap(vUsername(newUsernameRaw));
    } catch (e: any) {
      setMsg(e.message);
      return;
    }

    const res = await apiFetch(`/api/friends/request`, {
      method: "POST",
      body: JSON.stringify({ username }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data.error || "Failed to send request");
      return;
    }
    setNewUsername("");
    setMsg("Request sent ✅");
    reload();
  }

  async function accept(userId: number) {
    setMsg(null);
    const res = await apiFetch(`/api/friends/accept/${userId}`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data.error || "Failed to accept");
      return;
    }
    setMsg("Accepted ✅");
    reload();
  }

  async function remove(userId: number) {
    setMsg(null);
    const res = await apiFetch(`/api/friends/${userId}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data.error || "Failed to remove");
      return;
    }
    setMsg("Removed ✅");
    reload();
  }

  if (!token) return <div>Not logged in</div>;

  return (
    <div className="p-10 text-white max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Friends</h1>
        <button
          type="button"
          onClick={reload}
          className="btn btn-secondary btn-sm"
        >
          Refresh
        </button>
      </div>

      {msg && <p className="mb-4 text-sm text-gray-300">{msg}</p>}

      {/* Add new friend */}
      <div className="bg-gray-900 rounded p-4 mb-8 border border-gray-800">
        <h2 className="text-xl font-bold mb-3">Add friend</h2>
        <div className="flex gap-2">
          <input
            className="bg-gray-800 border border-gray-700 rounded px-3 py-2 w-48"
            placeholder="User name (e.g. fox)"
            value={newUsernameRaw}
            onChange={(e: any) => setNewUsername(e.target.value)}
          />
          <button
            type="button"
            onClick={sendRequest}
            className="btn btn-primary btn-sm"
          >
            Send request
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Tip: open a user profile and use “Add friend” there.
        </p>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* Incoming */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-3">Incoming requests</h2>
            {incoming.length === 0 ? (
              <p className="text-gray-400">No incoming requests.</p>
            ) : (
              <div className="space-y-3">
                {incoming.map((r) => (
                  <div
                    key={r.from.id}
                    className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="font-bold">{r.from.username}</div>
                      <div className="text-xs text-gray-400">#{r.from.id}</div>
                      <div className="text-xs text-gray-400">{r.status}</div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`user/${r.from.id}`)}
                        className="btn btn-secondary btn-sm"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => accept(r.from.id)}
                        className="btn btn-success btn-sm"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(r.from.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Outgoing + accepted */}
          <div>
            <h2 className="text-xl font-bold mb-3">My friends / requests</h2>
            {friends.length === 0 ? (
              <p className="text-gray-400">No friends yet.</p>
            ) : (
              <div className="space-y-3">
                {friends.map((r) => (
                  <div
                    key={r.to.id}
                    className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="font-bold">{r.to.username}</div>
                      <div className="text-xs text-gray-400">#{r.to.id}</div>
                      <div className="text-xs text-gray-400">{r.status}</div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`user/${r.to.id}`)}
                        className="btn btn-secondary btn-sm"
                      >
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() => remove(r.to.id)}
                        className="btn btn-danger btn-sm"
                      >
                        {r.status === "pending" ? "Cancel" : "Remove"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
