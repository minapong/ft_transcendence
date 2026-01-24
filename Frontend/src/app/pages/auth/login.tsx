import { useRef, navigate, useEffect } from "Reactor";
import { setAuth } from "@/core/lib/auth";
import { apiFetch } from "@/core/lib/api";

import { connectPresenceWS } from "@/core/lib/presence";
import { useAuth } from "@/core/lib/useAuth";

export default function LoginPage() {
  const auth = useAuth();
  useEffect(() => {
    if (auth?.token) navigate("/user/me");
  }, [auth?.token]);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleLogin = async () => {
    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    if (!email || !password) {
      alert("Missing email or password");
      return;
    }

    const res = await apiFetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    setAuth(data);
    connectPresenceWS();  
    navigate("/user/me");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Welcome back to Mina</h1>

      <input
        ref={emailRef}
        className="px-4 py-2 rounded text-gray"
        placeholder="Email" 
      />

      <input
        ref={passwordRef}
        type="password"
        className="px-4 py-2 rounded text-gray"
        placeholder="Password"
      />

      <button
        onClick={handleLogin}
        className="bg-blue-600 px-4 py-2 rounded font-bold hover:bg-blue-500"
      >
        Login
      </button>
      <p className="text-sm text-gray-400"></p>
        Don`t have an account?{" "}
        <span
         className="text-blue-400 cursor-pointer hover:underline"
         onClick={() => (navigate("/auth/signup"))}
        >
        Register
        </span>
    </div>
  );
}
