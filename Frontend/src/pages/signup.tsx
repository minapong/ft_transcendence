import { useRef } from "Reactor";

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

    try {
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Signup failed");
        return;
      }

      // Optional: auto-login after signup (recommended UX)
      localStorage.setItem("auth", JSON.stringify(data));
      window.location.href = "/";
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
          onClick={() => (window.location.href = "/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
}
