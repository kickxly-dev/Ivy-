"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserContext } from "@/lib/user-context";
import type { AuthUser } from "@/lib/auth";
import Sidebar from "@/components/core/Sidebar";
import Header from "@/components/core/Header";
import { Loader2 } from "lucide-react";

function getPageMeta(pathname: string): { title: string; subtitle?: string } {
  const routes: Record<string, { title: string; subtitle?: string }> = {
    "/core": { title: "Dashboard", subtitle: "Welcome back" },
    "/core/chat": { title: "AI Chat", subtitle: "Multi-model intelligence" },
    "/core/projects": { title: "Projects", subtitle: "Manage your workspaces" },
    "/core/drive": { title: "Drive", subtitle: "Files & uploads" },
    "/core/agents": { title: "Agents", subtitle: "Autonomous AI workers" },
    "/core/settings": { title: "Settings", subtitle: "Account & preferences" },
  };
  return routes[pathname] || { title: "Ivy Core" };
}

export default function CoreLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const pathname = usePathname();
  const meta = getPageMeta(pathname);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (r.status === 401) { router.push("/sign-in"); return null; }
        return r.json();
      })
      .then((u: AuthUser | null) => {
        if (!u) return;
        if (!u.onboarding_complete) { router.push("/onboarding"); return; }
        setUser(u);
        setLoading(false);
      });
  }, [router]);

  if (loading || !user) {
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
    <UserContext.Provider value={user}>
      <div className="flex h-screen bg-ivy-black overflow-hidden">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header
            title={meta.title}
            subtitle={meta.subtitle}
            sidebarCollapsed={sidebarCollapsed}
            onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </UserContext.Provider>
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
