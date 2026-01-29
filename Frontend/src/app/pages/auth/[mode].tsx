import { useRef, navigate, useEffect, useLocation, useState } from "Reactor";
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

type ValidationError = {
    field: "email" | "password" | "username" | "general";
    message: string;
};

/**
 * Pure, classified validation logic.
 */
function validateAuth(mode: AuthMode, data: AuthForm): ValidationError | null {
    if (!data.email) return { field: "email", message: "Endpoint address required" };
    if (!data.password) return { field: "password", message: "Security key required" };
    if (mode === "signup" && !data.username) {
        return { field: "username", message: "Network handle required" };
    }
    return null;
}

export default function AuthPage() {
    const auth = useAuth();
    const location = useLocation();
    const [uiError, setUiError] = useState<ValidationError | null>(null);

    // Derive mode from routing (URL segments are the source of truth)
    const mode: AuthMode = location.split("/").filter(Boolean)[1] === "signup" ? "signup" : "login";

    useEffect(() => {
        if (auth?.token) navigate("/user/me", { replace: true });
    }, [auth?.token]);

    // Superset refs
    const emailRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    // Single submit pipeline
    const handleSubmit = async (e: any) => {
        e?.preventDefault?.();

        //Capture data immediately BEFORE any state-triggered re-renders
        const data: AuthForm = {
            email: emailRef.current?.value || "",
            password: passwordRef.current?.value || "",
            username: usernameRef.current?.value || ""
        };

        // Now clear errors and proceed
        setUiError(null);

        // Use classified validation
        const validationError = validateAuth(mode, data);
        if (validationError) {
            setUiError(validationError);
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
                setUiError({ field: "general", message: resData.error || `${mode} failed` });
                return;
            }

            setAuth(resData);
            connectPresenceWS();
            navigate("/user/me", { replace: true });
        } catch (err) {
            console.error("Auth failed:", err);
            setUiError({ field: "general", message: "System connection failure. Retry authentication." });
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
                    {/* State Switch */}
                    <div className="relative p-1 bg-white/5 rounded-2xl flex items-center self-center w-full max-w-[280px]">
                        {/* Selector/Pill */}
                        <div
                            className={`absolute inset-y-1 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] bg-accent/10 rounded-xl pointer-events-none shadow-sm border border-accent/20 ${mode === "login" ? "left-1 right-1/2" : "left-1/2 right-1"
                                }`}
                        />

                        <button
                            onClick={() => {
                                setUiError(null);
                                navigate("/auth/login");
                            }}
                            className={`relative flex-1 py-1.5 text-xs font-bold tracking-widest transition-all duration-300 cursor-pointer ${mode === "login" ? "text-white" : "text-white/40 hover:text-white/60"
                                }`}
                        >
                            LOGIN
                        </button>
                        <button
                            onClick={() => {
                                setUiError(null);
                                navigate("/auth/signup");
                            }}
                            className={`relative flex-1 py-1.5 text-xs font-bold tracking-widest transition-all duration-300 cursor-pointer ${mode === "signup" ? "text-white" : "text-white/40 hover:text-white/60"
                                }`}
                        >
                            SIGNUP
                        </button>
                    </div>

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
                            {uiError?.field === "general" && (
                                <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium uppercase tracking-wider animate-in fade-in slide-in-from-top-1">
                                    {uiError.message}
                                </div>
                            )}

                            <Input
                                ref={emailRef}
                                label="Endpoint Address"
                                placeholder="name@example.com"
                                type="email"
                                error={uiError?.field === "email" ? uiError.message : undefined}
                            />

                            {mode === "signup" && (
                                <Input
                                    ref={usernameRef}
                                    label="Network handle"
                                    placeholder="Choose a username"
                                    error={uiError?.field === "username" ? uiError.message : undefined}
                                />
                            )}

                            <Input
                                ref={passwordRef}
                                label="Security Key"
                                type="password"
                                placeholder="••••••••"
                                error={uiError?.field === "password" ? uiError.message : undefined}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-6 rounded-xl bg-accent text-gray-950 font-bold tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] cursor-pointer"
                        >
                            {mode === "login" ? "AUTHENTICATE" : "REGISTER"}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
}
