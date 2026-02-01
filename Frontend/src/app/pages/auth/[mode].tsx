import { useRef, navigate, useEffect, useLocation, useState } from "Reactor";
import { setAuth } from "@/core/lib/auth";
import { apiFetch } from "@/core/lib/api";
import { connectPresenceWS } from "@/core/lib/presence";
import { useAuth } from "@/core/lib/useAuth";
import Input from "@/app/components/ui/Input";

import {
    vEmail,
    vPasswordLogin,
    vPassword,
    vUsername,
} from "@/core/lib/input/validators";
import { unwrap } from "@/core/lib/input/unwrap";

type AuthMode = "login" | "signup";

type AuthForm = {
    email: string;
    password: string;
    username?: string;
};

type ValidationError = {
    field: "email" | "password" | "username" | "general" | "terms";
    message: string;
};

type Result<T, E> =
    | { ok: true; data: T }
    | { ok: false; error: E };

function sanitizeAuth(mode: AuthMode, raw: AuthForm): Result<AuthForm, ValidationError> {
    const emailRaw = (raw.email ?? "").trim();
    const usernameRaw = (raw.username ?? "").trim();
    const passwordRaw = raw.password ?? "";

    let email: string;
    let password: string;
    let username: string | undefined;

    try {
        email = unwrap(vEmail(emailRaw));
    } catch (e: any) {
        return { ok: false, error: { field: "email", message: e?.message || "Invalid email" } };
    }

    if (mode === "signup") {
        try {
            username = unwrap(vUsername(usernameRaw));
        } catch (e: any) {
            return { ok: false, error: { field: "username", message: e?.message || "Invalid username" } };
        }
    }

    try {
        password =
            mode === "login"
                ? unwrap(vPasswordLogin(passwordRaw))
                : unwrap(vPassword(passwordRaw));
    } catch (e: any) {
        return { ok: false, error: { field: "password", message: e?.message || "Invalid password" } };
    }

    // Extra guard: signup must have username after sanitization
    if (mode === "signup" && !username) {
        return {
            ok: false,
            error: { field: "username", message: "Network handle required" },
        };
    }

    return {
        ok: true,
        data: mode === "login"
            ? { email, password }
            : { email, password, username },
    };
}

export default function AuthPage() {
    const auth = useAuth();
    const location = useLocation();
    const [uiError, setUiError] = useState<ValidationError | null>(null);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);


    // Derive mode from routing (URL segments are the source of truth)
    const mode: AuthMode = location.split("/").filter(Boolean)[1] === "signup" ? "signup" : "login";

    useEffect(() => {
        if (auth?.token) {
            console.log("[AuthPage] Auth token detected, redirecting to /user/me");
            navigate("/user/me", { replace: true });
        }
    }, [auth?.token]);

    useEffect(() => {
        setUiError(null);
        setAcceptedTerms(false);

        setEmail("");
        setUsername("");
        setPassword("");

        // Defer focus until DOM + layout are settled
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                emailRef.current?.focus();
            });
        });
    }, [mode]);

    // Superset refs
    const emailRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    // Single submit pipeline
    const handleSubmit = async (e: any) => {
        e?.preventDefault?.();
        if (loading) return;

        //capture data immediately BEFORE any state-triggered re-renders
        const raw: AuthForm = {
                email,
                password,
                username,
        };

        // Now clear errors and proceed
        setUiError(null);
        setLoading(true);
        if (mode === "signup" && !acceptedTerms) {
            setUiError({ field: "terms", message: "You must accept the Terms of Service to continue." });
            setLoading(false);
            return;
        }
        const sanitized = sanitizeAuth(mode, raw);
        if ("error" in sanitized) {
            setUiError(sanitized.error);
            setLoading(false);
            return;
        }

        const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
        try {
            const res = await apiFetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sanitized.data),
            });

            const resData = await res.json();

            if (!res.ok || resData.ok === false) {
                setUiError({ field: "general", message: resData.error || `${mode} failed` });
                return;
            }

            setAuth(resData);
            connectPresenceWS();
            console.log("[AuthPage] Login successful, waiting for useEffect redirect...");
            // navigate("/user/me", { replace: true }); <--- REMOVED: Redundant, handled by useEffect
        } catch (err) {
            setUiError({ field: "general", message: "System connection failure. Retry authentication." });
        } finally {
            setLoading(false);
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
                                id="auth-email"
                                name="email"
                                ref={emailRef}
                                label="Email Address"
                                placeholder="name@example.com"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onInput={(e: any) => setEmail(e?.target?.value ?? "")}
                                error={uiError?.field === "email" ? uiError.message : undefined}
                                autoFocus
                                disabled={loading}
                            />

                            {mode === "signup" && (
                                <Input
                                    id="auth-username"
                                    name="username"
                                    ref={usernameRef}
                                    label="Username (minimum 3 symbols)"
                                    placeholder="Choose a username"
                                    autoComplete="username"
                                    value={username}
                                    onInput={(e: any) => setUsername(e?.target?.value ?? "")}
                                    error={uiError?.field === "username" ? uiError.message : undefined}
                                    disabled={loading}
                                />
                            )}

                            <Input
                                id="auth-password"
                                name="password"
                                ref={passwordRef}
                                label="Password (8-20 symbols)"
                                type="password"
                                placeholder="••••••••"
                                autoComplete={mode === "login" ? "current-password" : "new-password"}
                                value={password}
                                onInput={(e: any) => setPassword(e?.target?.value ?? "")}
                                error={uiError?.field === "password" ? uiError.message : undefined}
                                disabled={loading}
                            />
                            {mode === "signup" && (
                            <div className="flex flex-col gap-2">
                                <label className="flex items-start gap-3 text-xs text-white/60 select-none">
                                <input
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    disabled={loading}
                                    onChange={(e: any) => {
                                    setAcceptedTerms(!!e?.target?.checked);
                                    if (uiError?.field === "terms") setUiError(null);
                                    }}
                                    className="mt-1 h-4 w-4 rounded border border-white/20 bg-white/5"
                                />

                                <span className="leading-5">
                                    I agree to the{" "}
                                    <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() => navigate("/terms_of_service")}
                                    className="underline underline-offset-2 text-white/80 hover:text-white"
                                    >
                                    Terms of Service
                                    </button>
                                </span>
                                </label>

                                {uiError?.field === "terms" && (
                                <div className="text-[10px] uppercase tracking-wider text-red-400">
                                    {uiError.message}
                                </div>
                                )}
                            </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || (mode === "signup" && !acceptedTerms)}
                            className="w-full py-3 px-6 rounded-xl bg-accent text-gray-950 font-bold tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "INITIALIZING..." : (mode === "login" ? "AUTHENTICATE" : "REGISTER")}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
}
