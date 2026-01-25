import { useRef, navigate, useState, useEffect } from "Reactor";
import { setAuth } from "@/core/lib/auth";
import { apiFetch } from "@/core/lib/api";
import { connectPresenceWS } from "@/core/lib/presence";
import { useAuth } from "@/core/lib/useAuth";

export default function AuthPage() {
    const auth = useAuth();
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (auth?.token) {
            navigate("/user/me");
        }
    }, [auth?.token]);

    const emailRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setLoading(true);

        const email = emailRef.current?.value.trim() || "";
        const password = passwordRef.current?.value || "";
        const username = usernameRef.current?.value.trim() || "";

        if (mode === "login") {
            if (!email || !password) {
                alert("Missing email or password");
                setLoading(false);
                return;
            }
        } else {
            if (!email || !username || !password) {
                alert("Missing email, username or password");
                setLoading(false);
                return;
            }
        }

        try {
            const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
            const body = mode === "login"
                ? JSON.stringify({ email, password })
                : JSON.stringify({ email, username, password });

            const res = await apiFetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || `${mode === "login" ? "Login" : "Signup"} failed`);
                setLoading(false);
                return;
            }

            setAuth(data);
            connectPresenceWS();
            navigate("/user/me");
        } catch (err) {
            console.error(err);
            alert("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-slate-100 p-4">
            <div className="w-full max-w-md bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-800 p-8 space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        {mode === "login" ? "Welcome Back" : "Create Account"}
                    </h1>
                    <p className="text-slate-400">
                        {mode === "login"
                            ? "Enter your credentials to access your account"
                            : "Join the Mina Pong community today"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                            <input
                                ref={emailRef}
                                type="email"
                                required
                                className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-200 placeholder-slate-500"
                                placeholder="name@example.com"
                            />
                        </div>

                        {mode === "signup" && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Username</label>
                                <input
                                    ref={usernameRef}
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-200 placeholder-slate-500"
                                    placeholder="johndoe"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                            <input
                                ref={passwordRef}
                                type="password"
                                required
                                className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-200 placeholder-slate-500"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            mode === "login" ? "Sign In" : "Sign Up"
                        )}
                    </button>
                </form>

                <div className="text-center pt-4">
                    <p className="text-slate-400">
                        {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                        <button
                            onClick={() => setMode(mode === "login" ? "signup" : "login")}
                            className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
                        >
                            {mode === "login" ? "Create one" : "Sign in instead"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
