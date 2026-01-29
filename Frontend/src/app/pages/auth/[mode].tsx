import { useRef, navigate, useEffect, useLocation } from "Reactor";
import { setAuth } from "@/core/lib/auth";
import { apiFetch } from "@/core/lib/api";
import { connectPresenceWS } from "@/core/lib/presence";
import { useAuth } from "@/core/lib/useAuth";
import Input from "@/app/components/ui/Input";

type AuthMode = "login" | "signup";

type AuthForm = {
    email: string;
    password: string;
    username?: string;
};

/**
 * Pure validation logic.
 * Returns error string if invalid, null if valid.
 */
function validateAuth(mode: AuthMode, data: AuthForm): string | null {
    if (!data.email || !data.password) {
        return "Missing email or password";
    }
    if (mode === "signup" && !data.username) {
        return "Username is required for signup";
    }
    return null;
}

export default function AuthPage() {
    const auth = useAuth();
    const location = useLocation();

    // Step 1: Derive mode from routing (URL is the source of truth)
    const mode: AuthMode = location.includes("signup") ? "signup" : "login";

    useEffect(() => {
        if (auth?.token) navigate("/user/me", { replace: true });
    }, [auth?.token]);

    // Step 3: Superset refs
    const emailRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    // Step 4: Single submit pipeline
    const handleSubmit = async (e: any) => {
        e?.preventDefault?.();

        const data: AuthForm = {
            email: emailRef.current?.value || "",
            password: passwordRef.current?.value || "",
            username: usernameRef.current?.value || ""
        };

        // Step 8: Use pure validation
        const validationError = validateAuth(mode, data);
        if (validationError) {
            alert(validationError); // Still using alert for now, but logic is decoupled
            return;
        }

        const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
        const body = mode === "login"
            ? { email: data.email, password: data.password }
            : { email: data.email, password: data.password, username: data.username };

        try {
            const res = await apiFetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const resData = await res.json();

            if (!res.ok) {
                alert(resData.error || `${mode} failed`);
                return;
            }

            setAuth(resData);
            connectPresenceWS();
            navigate("/user/me", { replace: true });
        } catch (err) {
            console.error("Auth failed:", err);
            alert("Connection error. Is the backend running?");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {/* Background Orbs for 'Energy' Feel */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full hero-orb hero-orb--accent opacity-20" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full hero-orb hero-orb--accent-soft opacity-10" />
            </div>

            <div className="relative w-full max-w-sm">
                {/* Decorative Elements */}
                <div className="absolute -top-12 -left-12 w-24 h-24 border-t-2 border-l-2 border-accent/20 rounded-tl-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -right-12 w-24 h-24 border-b-2 border-r-2 border-accent/20 rounded-br-3xl pointer-events-none" />

                <div className="panel-surface--heavy rounded-3xl p-8 flex flex-col gap-8 fx-energy energy-low">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                            {mode === "login" ? "Welcome back" : "Create account"}
                        </h1>
                        <p className="text-sm text-white/40 font-medium uppercase tracking-[0.2em]">
                            {mode === "login" ? "Identity Verification Required" : "Initialize New User Identity"}
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-6"
                        noValidate
                    >
                        <div className="flex flex-col gap-4">
                            <Input
                                ref={emailRef}
                                label="Endpoint Address"
                                placeholder="name@example.com"
                                type="email"
                            />

                            {mode === "signup" && (
                                <Input
                                    ref={usernameRef}
                                    label="Network handle"
                                    placeholder="Choose a username"
                                />
                            )}

                            <Input
                                ref={passwordRef}
                                label="Security Key"
                                type="password"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-6 rounded-xl bg-accent text-gray-950 font-bold tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] cursor-pointer"
                        >
                            {mode === "login" ? "AUTHENTICATE" : "REGISTER"}
                        </button>
                    </form>

                    <div className="flex items-center justify-center gap-2 pt-4 border-t border-white/5">
                        <span className="text-sm text-white/30">
                            {mode === "login" ? "New operative?" : "Already verified?"}
                        </span>
                        <button
                            onClick={() => navigate(mode === "login" ? "/auth/signup" : "/auth/login")}
                            className="text-sm font-bold text-accent hover:underline decoration-accent/30 underline-offset-4 cursor-pointer"
                        >
                            {mode === "login" ? "Create Account" : "Login"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
