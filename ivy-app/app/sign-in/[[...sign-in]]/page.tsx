import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-ivy-black ivy-grid flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-ivy-green/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-ivy-green/10 border border-ivy-green/20 flex items-center justify-center">
            <IvyLogo />
          </div>
          <span className="text-ivy-text font-semibold text-lg">Ivy</span>
        </div>

        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-ivy-surface border border-ivy-border rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.5)] p-0",
              headerTitle: "text-ivy-text text-lg font-semibold",
              headerSubtitle: "text-ivy-text-muted text-sm",
              socialButtonsBlockButton: "bg-ivy-dark border border-ivy-border text-ivy-text hover:bg-ivy-surface-2 hover:border-ivy-border-light transition-colors rounded-xl",
              socialButtonsBlockButtonText: "text-ivy-text text-sm font-medium",
              dividerLine: "bg-ivy-border",
              dividerText: "text-ivy-text-muted text-xs",
              formFieldLabel: "text-ivy-text-subtle text-sm font-medium",
              formFieldInput: "bg-ivy-dark border border-ivy-border text-ivy-text rounded-xl px-3 py-2 text-sm outline-none focus:border-ivy-border-light transition-colors placeholder:text-ivy-text-muted",
              formButtonPrimary: "bg-ivy-green text-ivy-black font-semibold rounded-xl hover:bg-ivy-green-dim transition-colors text-sm",
              footerActionText: "text-ivy-text-muted text-sm",
              footerActionLink: "text-ivy-green hover:text-ivy-green-dim transition-colors text-sm font-medium",
              identityPreviewText: "text-ivy-text text-sm",
              identityPreviewEditButton: "text-ivy-green hover:text-ivy-green-dim",
              formFieldErrorText: "text-red-400 text-xs",
              alertText: "text-ivy-text-muted text-sm",
              otpCodeFieldInput: "bg-ivy-dark border border-ivy-border text-ivy-text rounded-lg",
            },
            layout: {
              socialButtonsPlacement: "top",
            },
          }}
        />
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
