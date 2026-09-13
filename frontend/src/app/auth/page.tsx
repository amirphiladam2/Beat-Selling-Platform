"use client";

import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    AudioLines,
    Check,
    Eye,
    EyeOff,
} from "lucide-react";
import { FormEvent, useState } from "react";

export default function AuthPage() {
    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [showPassword, setShowPassword] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formError, setFormError] = useState("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!email.trim() || !email.includes("@")) {
            setFormError("Enter a valid email address.");
            return;
        }

        if (password.length < 8) {
            setFormError("Your password must be at least 8 characters.");
            return;
        }

        if (mode === "signup" && password !== confirmPassword) {
            setFormError("Your passwords do not match.");
            return;
        }

        setFormError("");
        setSubmitted(true);
    };

    const switchMode = (nextMode: "signin" | "signup") => {
        setMode(nextMode);
        setSubmitted(false);
        setFormError("");
        setConfirmPassword("");
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-5 py-10 text-primary sm:px-8">
            <div className="pointer-events-none absolute -right-40 -top-40 size-128 rounded-full border border-accent/20" />
            <div className="pointer-events-none absolute -bottom-48 -left-32 size-112 rounded-full border border-gradient-teal/20" />
            <div className="relative w-full max-w-md">
                <Link
                    href="/"
                    className="mb-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
                >
                    <ArrowLeft className="size-4" /> Back home
                </Link>
                <div className="mb-8 flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-button bg-accent text-bg">
                        <AudioLines className="size-5" />
                    </div>
                    <div>
                        <p className="font-semibold">Ruman Production</p>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted">
                            Sound Lab
                        </p>
                    </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-surface p-6 shadow-2xl shadow-black/20 sm:p-8">
                    <div className="mb-8 flex border-b border-white/10">
                        <button
                            type="button"
                            onClick={() => switchMode("signin")}
                            className={`border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${mode === "signin" ? "border-accent text-primary" : "border-transparent text-muted hover:text-primary"}`}
                        >
                            Sign in
                        </button>
                        <button
                            type="button"
                            onClick={() => switchMode("signup")}
                            className={`ml-6 border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${mode === "signup" ? "border-accent text-primary" : "border-transparent text-muted hover:text-primary"}`}
                        >
                            Create account
                        </button>
                    </div>
                    <h1 className="text-3xl font-semibold tracking-tight">
                        {mode === "signin" ? "Welcome back." : "Make some noise."}
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-muted">
                        {mode === "signin"
                            ? "Sign in to manage your beats and releases."
                            : "Create an account to save beats and build your collection."}
                    </p>
                    {submitted ? (
                        <div className="mt-8 rounded-lg border border-success/30 bg-success/10 p-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-success">
                                <Check className="size-4" /> You&apos;re all set to connect.
                            </div>
                            <p className="mt-2 text-xs leading-5 text-muted">
                                Authentication will connect to your backend once the API is
                                ready.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                            <label className="block text-sm font-medium">
                                Email address
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                        setFormError("");
                                    }}
                                    placeholder="you@example.com"
                                    className="mt-2 h-11 w-full rounded-md border border-white/10 bg-bg px-3 text-sm text-primary outline-none placeholder:text-muted focus:border-accent"
                                />
                            </label>
                            {mode === "signup" && (
                                <label className="block text-sm font-medium">
                                    Display name
                                    <input
                                        required
                                        type="text"
                                        placeholder="Your artist name"
                                        className="mt-2 h-11 w-full rounded-md border border-white/10 bg-bg px-3 text-sm text-primary outline-none placeholder:text-muted focus:border-accent"
                                    />
                                </label>
                            )}
                            <label className="block text-sm font-medium">
                                Password
                                <div className="relative mt-2">
                                    <input
                                        required
                                        minLength={8}
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(event) => {
                                            setPassword(event.target.value);
                                            setFormError("");
                                        }}
                                        placeholder="At least 8 characters"
                                        className="h-11 w-full rounded-md border border-white/10 bg-bg px-3 pr-11 text-sm text-primary outline-none placeholder:text-muted focus:border-accent"
                                    />
                                    <button
                                        type="button"
                                        aria-label={
                                            showPassword ? "Hide password" : "Show password"
                                        }
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="size-4" />
                                        ) : (
                                            <Eye className="size-4" />
                                        )}
                                    </button>
                                </div>
                            </label>
                            {mode === "signup" && (
                                <label className="block text-sm font-medium">
                                    Confirm password
                                    <input
                                        required
                                        minLength={8}
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(event) => {
                                            setConfirmPassword(event.target.value);
                                            setFormError("");
                                        }}
                                        placeholder="Repeat your password"
                                        className="mt-2 h-11 w-full rounded-md border border-white/10 bg-bg px-3 text-sm text-primary outline-none placeholder:text-muted focus:border-accent"
                                    />
                                </label>
                            )}
                            {formError && (
                                <p role="alert" className="text-sm text-red-400">
                                    {formError}
                                </p>
                            )}
                            {mode === "signin" && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="text-xs text-muted hover:text-accent"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            )}
                            <button
                                type="submit"
                                className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-accent text-sm font-semibold text-bg transition-transform hover:-translate-y-0.5"
                            >
                                {mode === "signin" ? "Sign in" : "Create account"}
                                <ArrowRight className="size-4" />
                            </button>
                        </form>
                    )}
                    <p className="mt-7 text-center text-xs text-muted">
                        By continuing, you agree to our terms and privacy policy.
                    </p>
                </div>
            </div>
        </main>
    );
}
