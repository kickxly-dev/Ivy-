"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  FolderOpen,
  Bot,
  FileText,
  Search,
  Settings,
  ChevronDown,
  Plus,
  Users,
  HardDrive,
  Zap,
  Star,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/core", exact: true },
  { icon: MessageSquare, label: "Chat", href: "/core/chat" },
  { icon: FolderOpen, label: "Projects", href: "/core/projects" },
  { icon: Bot, label: "Agents", href: "/core/agents" },
  { icon: FileText, label: "Notes", href: "/core/notes" },
  { icon: HardDrive, label: "Files", href: "/core/files" },
  { icon: Zap, label: "Workflows", href: "/core/workflows" },
];

const workspaces = [
  { name: "Product", color: "#4afa98" },
  { name: "Research", color: "#60a5fa" },
  { name: "Engineering", color: "#f472b6" },
  { name: "Marketing", color: "#fb923c" },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [workspacesOpen, setWorkspacesOpen] = useState(true);

  return (
    <motion.aside
      animate={{ width: collapsed ? 60 : 220 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col h-full bg-ivy-dark border-r border-ivy-border flex-shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-ivy-border flex-shrink-0">
        <div className="relative w-7 h-7 rounded-lg bg-ivy-green/10 flex items-center justify-center flex-shrink-0">
          <IvyLogoMark />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="text-ivy-text font-semibold text-[15px] whitespace-nowrap overflow-hidden"
            >
              Ivy Core
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 py-3 border-b border-ivy-border">
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-ivy-surface border border-ivy-border hover:border-ivy-border-light transition-colors text-ivy-text-muted text-xs">
            <Search size={12} />
            <span>Search...</span>
            <span className="ml-auto font-mono text-[10px] bg-ivy-border px-1.5 py-0.5 rounded">⌘K</span>
          </button>
        </div>
      )}

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 group",
                isActive
                  ? "bg-ivy-green/10 text-ivy-green"
                  : "text-ivy-text-muted hover:text-ivy-text hover:bg-ivy-surface"
              )}
            >
              <Icon
                size={15}
                className={cn(
                  "flex-shrink-0",
                  isActive ? "text-ivy-green" : "text-ivy-text-muted group-hover:text-ivy-text"
                )}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}

        {/* Workspaces section */}
        {!collapsed && (
          <div className="pt-4">
            <button
              onClick={() => setWorkspacesOpen(!workspacesOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 w-full text-[10px] text-ivy-text-muted uppercase tracking-wider font-semibold hover:text-ivy-text-subtle transition-colors"
            >
              <ChevronDown
                size={10}
                className={cn("transition-transform duration-200", !workspacesOpen && "-rotate-90")}
              />
              Workspaces
              <button
                className="ml-auto hover:text-ivy-text"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Plus size={12} />
              </button>
            </button>

            <AnimatePresence>
              {workspacesOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {workspaces.map((ws) => (
                    <button
                      key={ws.name}
                      className="flex items-center gap-2.5 px-2.5 py-1.5 w-full text-xs text-ivy-text-muted hover:text-ivy-text hover:bg-ivy-surface rounded-lg transition-colors"
                    >
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: ws.color }}
                      />
                      {ws.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="border-t border-ivy-border p-2 space-y-0.5 flex-shrink-0">
        <Link
          href="/core/settings"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-ivy-text-muted hover:text-ivy-text hover:bg-ivy-surface transition-colors"
        >
          <Settings size={15} className="flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>

        {/* User avatar */}
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-ivy-surface transition-colors">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-ivy-green/30 to-ivy-green/10 border border-ivy-green/20 flex items-center justify-center text-[10px] font-semibold text-ivy-green flex-shrink-0">
            A
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-ivy-text truncate">Alex Chen</div>
              <div className="text-[10px] text-ivy-text-muted truncate">Pro Plan</div>
            </div>
          )}
          {!collapsed && <ChevronRight size={12} className="text-ivy-text-muted flex-shrink-0" />}
        </div>
      </div>
    </motion.aside>
  );
}

function IvyLogoMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z"
        stroke="#4afa98"
        strokeWidth="1.2"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z" fill="#4afa98" fillOpacity="0.3" />
    </svg>
  );
}
