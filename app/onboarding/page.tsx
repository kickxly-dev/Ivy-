"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-auth";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, Check } from "lucide-react";

const useCases = [
  { id: "personal", label: "Personal projects", emoji: "⚡" },
  { id: "work", label: "Work & productivity", emoji: "💼" },
  { id: "research", label: "Research & learning", emoji: "🔬" },
  { id: "building", label: "Building products", emoji: "🚀" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [useCase, setUseCase] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFinish = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: name.trim(),
        use_case: useCase || "personal",
        onboarding_complete: true,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/core");
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

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? "w-6 bg-ivy-green" : i < step ? "w-4 bg-ivy-green/50" : "w-4 bg-ivy-border"
              }`}
            />
          ))}
        </div>

        <div className="rounded-2xl border border-ivy-border bg-ivy-surface p-6 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-base font-semibold text-ivy-text mb-1">What should we call you?</h2>
                <p className="text-sm text-ivy-text-muted mb-5">This is how you&apos;ll appear in Ivy.</p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep(1)}
                  placeholder="Your name"
                  autoFocus
                  className="w-full px-3 py-2.5 text-sm bg-ivy-dark border border-ivy-border rounded-xl text-ivy-text placeholder:text-ivy-text-muted outline-none focus:border-ivy-border-light transition-colors mb-4"
                />
                <button
                  onClick={() => name.trim() && setStep(1)}
                  disabled={!name.trim()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-ivy-green text-ivy-black font-semibold text-sm hover:bg-ivy-green-dim disabled:opacity-50 transition-all duration-200"
                >
                  Continue <ArrowRight size={14} />
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-base font-semibold text-ivy-text mb-1">What are you building?</h2>
                <p className="text-sm text-ivy-text-muted mb-4">Helps us tailor your experience.</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {useCases.map((uc) => (
                    <button
                      key={uc.id}
                      onClick={() => setUseCase(uc.id)}
                      className={`flex flex-col items-start gap-1.5 p-3 rounded-xl border text-left transition-all duration-150 ${
                        useCase === uc.id
                          ? "border-ivy-green bg-ivy-green/10 text-ivy-text"
                          : "border-ivy-border bg-ivy-dark text-ivy-text-muted hover:border-ivy-border-light hover:text-ivy-text"
                      }`}
                    >
                      <span className="text-base">{uc.emoji}</span>
                      <span className="text-xs font-medium leading-tight">{uc.label}</span>
                      {useCase === uc.id && <Check size={10} className="text-ivy-green ml-auto" />}
                    </button>
                  ))}
                </div>

                {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

                <button
                  onClick={handleFinish}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-ivy-green text-ivy-black font-semibold text-sm hover:bg-ivy-green-dim disabled:opacity-50 transition-all duration-200"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : null}
                  {loading ? "Setting up..." : "Enter Ivy"}
                </button>

                <button
                  onClick={() => setStep(0)}
                  className="w-full text-xs text-ivy-text-muted hover:text-ivy-text transition-colors mt-3"
                >
                  ← Back
                </button>
              </motion.div>
            )}
          </AnimatePresence>
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
