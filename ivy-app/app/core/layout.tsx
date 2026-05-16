"use client";

import { useState } from "react";
import Sidebar from "@/components/core/Sidebar";
import Header from "@/components/core/Header";
import { usePathname } from "next/navigation";

function getPageMeta(pathname: string): { title: string; subtitle?: string } {
  const routes: Record<string, { title: string; subtitle?: string }> = {
    "/core": { title: "Dashboard", subtitle: "Welcome back, Alex" },
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
