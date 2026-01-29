import { useRef, navigate, useEffect, useLocation } from "Reactor";
import { setAuth } from "@/core/lib/auth";
import { apiFetch } from "@/core/lib/api";
import { connectPresenceWS } from "@/core/lib/presence";
import { useAuth } from "@/core/lib/useAuth";

type AuthMode = "login" | "signup";

export default function AuthPage() {
    const auth = useAuth();
    const location = useLocation();

    // Step 1: Derive mode from routing (URL is the source of truth)
    const mode: AuthMode = location.includes("signup") ? "signup" : "login";

    useEffect(() => {
        if (auth?.token) navigate("/user/me");
    }, [auth?.token]);

    // Step 3: Superset refs
    const emailRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    // Step 4: Single submit pipeline
    const handleSubmit = async (e: any) => {
        e?.preventDefault?.();

        const email = emailRef.current?.value || "";
        const password = passwordRef.current?.value || "";
        const username = usernameRef.current?.value || "";

        // Validation
        if (!email || !password) {
            alert("Missing email or password");
            return;
        }
        if (mode === "signup" && !username) {
            alert("Username is required for signup");
            return;
        }

        const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
        const body = mode === "login"
            ? { email, password }
            : { email, password, username };

        try {
            const res = await apiFetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || `${mode} failed`);
                return;
            }

            setAuth(data);
            connectPresenceWS();
            navigate("/user/me");
        } catch (err) {
            console.error("Auth failed:", err);
            alert("Connection error. Is the backend running?");
        }
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center gap-4 bg-gray-900 text-white">
            <h1 className="text-3xl font-bold">
                {mode === "login" ? "Welcome back" : "Create an account"}
            </h1>

            {/* Step 5: One form, conditional fields inside */}
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 w-80"
            >
                <input
                    ref={emailRef}
                    className="px-4 py-2 rounded text-gray-900"
                    placeholder="Email"
                    type="email"
                    required
                />

                {mode === "signup" && (
                    <input
                        ref={usernameRef}
                        className="px-4 py-2 rounded text-gray-900"
                        placeholder="Username"
                        required
                    />
                )}

                <input
                    ref={passwordRef}
                    type="password"
                    className="px-4 py-2 rounded text-gray-900"
                    placeholder="Password"
                    required
                />

                <button
                    type="submit"
                    className="bg-blue-600 px-4 py-2 rounded font-bold hover:bg-blue-500"
                >
                    {mode === "login" ? "Login" : "Sign up"}
                </button>
            </form>

            <p className="text-sm text-gray-400">
                {/* Step 6: Navigation switches mode, not local state */}
                {mode === "login" ? (
                    <>
                        Don't have an account?{" "}
                        <span
                            className="text-blue-400 cursor-pointer hover:underline"
                            onClick={() => navigate("/auth/signup")}
                        >
                            Register
                        </span>
                    </>
                ) : (
                    <>
                        Already have an account?{" "}
                        <span
                            className="text-blue-400 cursor-pointer hover:underline"
                            onClick={() => navigate("/auth/login")}
                        >
                            Login
                        </span>
                    </>
                )}
            </p>
        </div>
    );
}
