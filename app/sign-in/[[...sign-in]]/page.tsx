"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Eye, EyeOff } from "lucide-react";

type Mode = "signin" | "signup";

function SignInForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "signup") {
      if (password !== confirmPassword) { setError("Passwords don't match."); return; }
      if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    }

    setLoading(true);
    const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/signin";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });

    if (!res.ok) {
      const text = await res.text();
      setError(text || "Something went wrong.");
      setLoading(false);
      return;
    }

    router.push("/core");
  };

  return (
    <>
      <div className="flex gap-1 mb-5 p-1 rounded-xl bg-ivy-dark border border-ivy-border">
        {(["signin", "signup"] as const).map((m) => (
          <button key={m} onClick={() => { setMode(m); setError(""); setPassword(""); setConfirmPassword(""); }}
            className={`flex-1 py-1.5 text-sm rounded-lg font-medium transition-all duration-200 ${
              mode === m ? "bg-ivy-surface text-ivy-text shadow-sm" : "text-ivy-text-muted hover:text-ivy-text"
            }`}>
            {m === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Email" required autoFocus
          className="w-full px-3 py-2.5 text-sm bg-ivy-dark border border-ivy-border rounded-xl text-ivy-text placeholder:text-ivy-text-muted outline-none focus:border-ivy-border-light transition-colors" />

        <div className="relative">
          <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" required
            className="w-full px-3 py-2.5 pr-10 text-sm bg-ivy-dark border border-ivy-border rounded-xl text-ivy-text placeholder:text-ivy-text-muted outline-none focus:border-ivy-border-light transition-colors" />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ivy-text-muted hover:text-ivy-text transition-colors">
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>

        <AnimatePresence>
          {mode === "signup" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password" required
                className="w-full px-3 py-2.5 text-sm bg-ivy-dark border border-ivy-border rounded-xl text-ivy-text placeholder:text-ivy-text-muted outline-none focus:border-ivy-border-light transition-colors" />
            </motion.div>
          )}
        </AnimatePresence>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button type="submit" disabled={loading || !email.trim() || !password}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-ivy-green text-ivy-black font-semibold text-sm hover:bg-ivy-green-dim disabled:opacity-50 transition-all duration-200">
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-ivy-green/10 border border-ivy-green/20 flex items-center justify-center">
            <IvyLogo />
          </div>
          <span className="text-ivy-text font-semibold text-lg">Ivy</span>
        </div>
        <div className="rounded-2xl border border-ivy-border bg-ivy-surface p-6 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
          <Suspense fallback={null}><SignInForm /></Suspense>
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
