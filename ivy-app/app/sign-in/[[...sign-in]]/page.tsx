"use client";

import { useEffect } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SignInPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { openSignIn } = useClerk();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      router.push("/core");
      return;
    }
    // Open Clerk's hosted sign-in modal — works on any domain with dev keys
    openSignIn({});
  }, [isLoaded, isSignedIn, router, openSignIn]);

  return (
    <div className="min-h-screen bg-ivy-black ivy-grid flex items-center justify-center">
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-ivy-green/[0.04] rounded-full blur-[120px]" />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-ivy-green/10 border border-ivy-green/20 flex items-center justify-center">
          <IvyLogo />
        </div>
        <Loader2 size={16} className="text-ivy-text-muted animate-spin" />
        <p className="text-xs text-ivy-text-muted">Opening sign in...</p>
      </div>
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
