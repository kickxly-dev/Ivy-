"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-auth";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

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
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-ivy-green/10 border border-ivy-green/20 flex items-center justify-center">
            <IvyLogo />
          </div>
          <span className="text-ivy-text font-semibold text-lg">Ivy</span>
        </div>

        <div className="rounded-2xl border border-ivy-border bg-ivy-surface p-6 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <CheckCircle size={32} className="text-ivy-green mx-auto mb-4" />
              <h2 className="text-base font-semibold text-ivy-text mb-2">Check your email</h2>
              <p className="text-sm text-ivy-text-muted leading-relaxed">
                We sent a sign-in link to<br />
                <span className="text-ivy-text font-medium">{email}</span>
              </p>
              <p className="text-xs text-ivy-text-muted mt-4">
                Click the link in the email to sign in. You can close this tab.
              </p>
              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="mt-4 text-xs text-ivy-green hover:text-ivy-green-dim transition-colors"
              >
                Use a different email
              </button>
            </motion.div>
          ) : (
            <>
              <h2 className="text-base font-semibold text-ivy-text mb-1">Sign in to Ivy</h2>
              <p className="text-sm text-ivy-text-muted mb-5">
                Enter your email — we&apos;ll send you a magic link.
              </p>

              <form onSubmit={handleSignIn} className="space-y-3">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoFocus
                    className="w-full px-3 py-2.5 text-sm bg-ivy-dark border border-ivy-border rounded-xl text-ivy-text placeholder:text-ivy-text-muted outline-none focus:border-ivy-border-light transition-colors"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-400">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-ivy-green text-ivy-black font-semibold text-sm hover:bg-ivy-green-dim disabled:opacity-50 transition-all duration-200"
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  {loading ? "Sending..." : "Send magic link"}
                </button>
              </form>

              <p className="text-xs text-ivy-text-muted text-center mt-4">
                No password needed. No spam.
              </p>
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
