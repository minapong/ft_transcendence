import { useRef, navigate } from "Reactor";
import { setAuth } from "@/core/lib/auth";
import { connectPresenceWS } from "@/core/lib/presence";
import { vEmail,vUsername, vPassword } from "@/core/lib/input/validators";
import { apiFetch } from "@/core/lib/api";


export default function SignupPage() {
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSignup = async () => {
    const email = emailRef.current?.value.trim() || "";
    const username = usernameRef.current?.value.trim() || "";
    const password = passwordRef.current?.value || "";

    if (!email || !username || !password) {
      alert("Missing email, username or password");
      return;
    }
    const ve = vEmail(email);
    const vu = vUsername(username);
    const vp = vPassword(password);
    if (!ve.ok) return alert(ve.error);
    if (!vu.ok) return alert(vu.error);
    if (!vp.ok) return alert(vp.error);

    try {
      const res = await apiFetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: ve.value, username: vu.value, password:vp.value })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Signup failed");
        return;
      }

      //auto-login after signup
      setAuth(data);
      connectPresenceWS();
      navigate("/user/me");
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Become a Mina Pong resident</h1>

      <input
        ref={emailRef}
        className="px-4 py-2 rounded text-gray"
        placeholder="Email"
      />

      <input
        ref={usernameRef}
        className="px-4 py-2 rounded text-gray"
        placeholder="Username"
      />

      <input
        ref={passwordRef}
        type="password"
        className="px-4 py-2 rounded text-gray"
        placeholder="Password"
      />

      <button
        onClick={handleSignup}
        className="bg-blue-600 px-4 py-2 rounded font-bold hover:bg-blue-500"
      >
        Sign Up
      </button>

      <p className="text-sm text-gray-400">
        Already have an account?{" "}
        <span
          className="text-blue-400 cursor-pointer hover:underline"
          onClick={() => (navigate("/auth/login"))}
        >
          Login
        </span>
      </p>
    </div>
  );
}
