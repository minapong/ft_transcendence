import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "Reactor";

export default function ProfilePage(props?: { id?: string }) {
  const id = props?.id;

  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    apiFetch(`http://localhost:3000/api/users/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then(setUser)
      .catch(err => setError(err.message));
  }, [id]);

  if (!id) return <div>Invalid profile</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>Loading profile...</div>;

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-bold">{user.username}</h1>
      <p className="text-sm mt-4">
        Joined: {new Date(user.created_at).toLocaleDateString()}
      </p>
      {user.avatarId != null && <p>Avatar: {user.avatarId}</p>}
    </div>
  );
}
