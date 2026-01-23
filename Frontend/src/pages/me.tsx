import { useEffect, useState, navigate } from "Reactor";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/useAuth.js";
import { logout } from "@/lib/auth";

export default function MePage() {
  const auth = useAuth();
  const token = auth?.token;

  const [me, setMe] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      if (!token) {
        navigate("/login");
      }
    }, [token]);

  useEffect(() => {
    
    if (!token) return;

    setError(null);
    setMe(null);

    apiFetch(`http://localhost:3000/api/me`)
      .then(res => {
        if (res.status === 401) throw new Error("Not logged in");
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then(setMe)
      .catch(err => setError(err.message));
  }, [token]);

  if (!token) return <div>Not logged in</div>;
  if (error) return <div>{error}</div>;
  if (!me) return <div>Loading profile...</div>;

  return (
    <div className="p-10 text-white">
       <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{me.username}</h1>

        <button
          type="button"
          onClick={logout}
          className="bg-red-600 px-4 py-2 rounded font-bold hover:bg-red-500"
        >
          Logout
        </button>
      </div>
      <p className="text-gray-400">{me.email}</p>
      <p className="text-sm mt-4">
        Joined: {new Date(me.created_at).toLocaleDateString()}
      </p>
    </div>
  );
}
