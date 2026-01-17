import { useState, useEffect } from "Reactor";
import {navigate} from "Reactor";

type UserProfile = {
  id: number;
  username: string;
  email: string;
  created_at: string;
};

export default function ProfilePage() {
  const id = location.pathname.split("/").pop();
  const userId = Number(id);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authRaw = localStorage.getItem("auth");
    if (!authRaw) {
      navigate("/login");
      return;
    }

    const auth = JSON.parse(authRaw);

    if (auth.id !== userId) {
      navigate(`/profile/${auth.id}`);
      return;
    }

    fetch(`http://localhost:3000/api/users/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then(setProfile)
      .catch(err => setError(err.message));
  }, []);

  function logout() {
    localStorage.removeItem("auth");
    navigate("/login");
  }

  if (error) {
    return (
      <div className="text-red-400 text-center mt-20">
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-gray-400 text-center mt-20">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold mb-6">Profile</h1>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-96">
        <p className="mb-2">
          <span className="text-gray-400">Username:</span>{" "}
          <span className="font-bold">{profile.username}</span>
        </p>

        <p className="mb-2">
          <span className="text-gray-400">Email:</span>{" "}
          {profile.email}
        </p>

        <p className="mb-6 text-sm text-gray-400">
          Joined: {new Date(profile.created_at).toLocaleDateString()}
        </p>

        <button
          onClick={logout}
          className="w-full bg-red-600 py-2 rounded font-bold hover:bg-red-500"
        >
          Logout
        </button>
      </div>

      <button
        className="mt-6 text-cyan-400 underline"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>
    </div>
  );
}
