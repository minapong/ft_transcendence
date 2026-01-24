import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "Reactor";

export default function ProfilePage(props?: { id?: string }) {
  const id = props?.id;

  const [user, setUser] = useState<any>(null);
  const [online, setOnline] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  if (!id) return <div>Invalid profile</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>Loading profile...</div>;

  return (
    <div className="p-10 text-white">
       <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold">{user.username}</h1>
        {online === null ? (
            <span className="text-gray-400 text-sm">…</span>
          ) : online ? (
            <span className="text-green-400 text-sm font-bold">● Online</span>
          ) : (
            <span className="text-gray-400 text-sm">● Offline</span>
          )}
        </div>

      <p className="text-sm mt-4">
        Joined: {new Date(user.created_at).toLocaleDateString()}
      </p>
      {user.avatarId != null && <p>Avatar: {user.avatarId}</p>}
    </div>
  );
}
