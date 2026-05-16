"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-auth";
import { motion } from "framer-motion";
import { Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords don't match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }

    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    await supabase.auth.signOut();
    setDone(true);
    setTimeout(() => router.push("/sign-in"), 2000);
  };

  return (
    <div className="min-h-screen bg-ivy-black ivy-grid flex items-center justify-center px-4">
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-ivy-green/[0.04] rounded-full blur-[120px]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-ivy-green/10 border border-ivy-green/20 flex items-center justify-center">
            <IvyLogo />
          </div>
          <span className="text-ivy-text font-semibold text-lg">Ivy</span>
        </div>
        <div className="rounded-2xl border border-ivy-border bg-ivy-surface p-6 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
          {done ? (
            <div className="text-center py-4">
              <CheckCircle size={32} className="text-ivy-green mx-auto mb-4" />
              <h2 className="text-base font-semibold text-ivy-text mb-2">Password set!</h2>
              <p className="text-sm text-ivy-text-muted">Redirecting you to sign in…</p>
            </div>
          ) : (
            <>
              <h2 className="text-base font-semibold text-ivy-text mb-1">Set a new password</h2>
              <p className="text-sm text-ivy-text-muted mb-5">Choose a strong password for your account.</p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password"
                    required
                    autoFocus
                    className="w-full px-3 py-2.5 pr-10 text-sm bg-ivy-dark border border-ivy-border rounded-xl text-ivy-text placeholder:text-ivy-text-muted outline-none focus:border-ivy-border-light transition-colors"
                  />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ivy-text-muted hover:text-ivy-text transition-colors">
                    {show ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <input
                  type={show ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm password"
                  required
                  className="w-full px-3 py-2.5 text-sm bg-ivy-dark border border-ivy-border rounded-xl text-ivy-text placeholder:text-ivy-text-muted outline-none focus:border-ivy-border-light transition-colors"
                />
                {error && <p className="text-xs text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={loading || !password || !confirm}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-ivy-green text-ivy-black font-semibold text-sm hover:bg-ivy-green-dim disabled:opacity-50 transition-all duration-200"
                >
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  {loading ? "Saving..." : "Set password"}
                </button>
              </form>
            </>
          )}
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
