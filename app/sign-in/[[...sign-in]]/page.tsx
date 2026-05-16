"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase-auth";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle, Eye, EyeOff } from "lucide-react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified") === "1";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [signedUp, setSignedUp] = useState(false);

  useEffect(() => {
    setError("");
    setPassword("");
    setConfirmPassword("");
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setError(error.message);
      } else if (data.session) {
        // Email confirmation is disabled — user is already signed in
        router.push("/core");
      } else {
        setSignedUp(true);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        if (error.message.toLowerCase().includes("confirm")) {
          setError("Please verify your email before signing in. Check your inbox.");
        } else if (error.message.toLowerCase().includes("invalid")) {
          setError("Incorrect email or password.");
        } else {
          setError(error.message);
        }
      } else {
        router.push("/core");
      }
    }

    setLoading(false);
  };

  if (signedUp) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-4"
      >
        <CheckCircle size={32} className="text-ivy-green mx-auto mb-4" />
        <h2 className="text-base font-semibold text-ivy-text mb-2">Check your email</h2>
        <p className="text-sm text-ivy-text-muted leading-relaxed">
          We sent a verification link to<br />
          <span className="text-ivy-text font-medium">{email}</span>
        </p>
        <p className="text-xs text-ivy-text-muted mt-4 leading-relaxed">
          Click the link to verify your account, then come back here to sign in.
        </p>
        <button
          onClick={() => { setSignedUp(false); setMode("signin"); }}
          className="mt-5 text-xs text-ivy-green hover:text-ivy-green-dim transition-colors"
        >
          Back to sign in
        </button>
      </motion.div>
    );
  }

  return (
    <>
      {verified && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-xl bg-ivy-green/10 border border-ivy-green/20"
        >
          <CheckCircle size={14} className="text-ivy-green shrink-0" />
          <p className="text-xs text-ivy-green font-medium">Email verified! Sign in below.</p>
        </motion.div>
      )}

      {/* Tab toggle */}
      <div className="flex gap-1 mb-5 p-1 rounded-xl bg-ivy-dark border border-ivy-border">
        {(["signin", "signup"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-1.5 text-sm rounded-lg font-medium transition-all duration-200 ${
              mode === m
                ? "bg-ivy-surface text-ivy-text shadow-sm"
                : "text-ivy-text-muted hover:text-ivy-text"
            }`}
          >
            {m === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          autoFocus
          className="w-full px-3 py-2.5 text-sm bg-ivy-dark border border-ivy-border rounded-xl text-ivy-text placeholder:text-ivy-text-muted outline-none focus:border-ivy-border-light transition-colors"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            minLength={8}
            className="w-full px-3 py-2.5 pr-10 text-sm bg-ivy-dark border border-ivy-border rounded-xl text-ivy-text placeholder:text-ivy-text-muted outline-none focus:border-ivy-border-light transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ivy-text-muted hover:text-ivy-text transition-colors"
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>

        <AnimatePresence>
          {mode === "signup" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required={mode === "signup"}
                className="w-full px-3 py-2.5 text-sm bg-ivy-dark border border-ivy-border rounded-xl text-ivy-text placeholder:text-ivy-text-muted outline-none focus:border-ivy-border-light transition-colors"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !email.trim() || !password}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-ivy-green text-ivy-black font-semibold text-sm hover:bg-ivy-green-dim disabled:opacity-50 transition-all duration-200"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

    </>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-ivy-black ivy-grid flex items-center justify-center px-4">
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-ivy-green/[0.04] rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-ivy-green/10 border border-ivy-green/20 flex items-center justify-center">
            <IvyLogo />
          </div>
          <span className="text-ivy-text font-semibold text-lg">Ivy</span>
        </div>

        <div className="rounded-2xl border border-ivy-border bg-ivy-surface p-6 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
          <Suspense fallback={null}>
            <SignInForm />
          </Suspense>
        </div>
      </motion.div>
    </div>
  );
}

function IvyLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
      <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="#4afa98" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
      <path d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z" fill="#4afa98" fillOpacity="0.3" />
    </svg>
  );
}
