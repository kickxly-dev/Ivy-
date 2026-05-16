"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/core/Sidebar";
import Header from "@/components/core/Header";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

function getPageMeta(pathname: string): { title: string; subtitle?: string } {
  const routes: Record<string, { title: string; subtitle?: string }> = {
    "/core": { title: "Dashboard", subtitle: "Welcome back" },
    "/core/chat": { title: "AI Chat", subtitle: "Multi-model intelligence" },
    "/core/projects": { title: "Projects", subtitle: "Manage your workspaces" },
    "/core/agents": { title: "Agents", subtitle: "Autonomous AI workers" },
    "/core/notes": { title: "Notes", subtitle: "Markdown-powered notes" },
    "/core/files": { title: "Files", subtitle: "Intelligent file storage" },
    "/core/workflows": { title: "Workflows", subtitle: "Automated pipelines" },
    "/core/settings": { title: "Settings", subtitle: "Account & preferences" },
  };
  return routes[pathname] || { title: "Ivy Core" };
}

export default function CoreLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const meta = getPageMeta(pathname);
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading spinner while Clerk checks auth
  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex h-screen items-center justify-center bg-ivy-black">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-ivy-green/10 border border-ivy-green/20 flex items-center justify-center">
            <IvyLogo />
          </div>
          <Loader2 size={16} className="text-ivy-text-muted animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-ivy-black overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          sidebarCollapsed={sidebarCollapsed}
          onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
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
