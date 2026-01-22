import { useEffect, useState } from "Reactor";
import { apiFetch } from "@/lib/api";

export default function MePage() {

  const [me, setMe] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch(`http://localhost:3000/api/me`)
      .then(res => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then(setMe)
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div>{error}</div>;
  if (!me) return <div>Loading profile...</div>;

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-bold">{me.username}</h1>
      <p className="text-gray-400">{me.email}</p>
      <p className="text-sm mt-4">
        Joined: {new Date(me.created_at).toLocaleDateString()}
      </p>
    </div>
  );
}
