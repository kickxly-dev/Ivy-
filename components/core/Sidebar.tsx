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
  Settings,
  Search,
  ChevronRight,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, displayName, userInitial, isAdmin } from "@/lib/user-context";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/core", exact: true },
  { icon: MessageSquare, label: "Chat", href: "/core/chat" },
  { icon: FolderOpen, label: "Projects", href: "/core/projects" },
  { icon: Bot, label: "Agents", href: "/core/agents" },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const user = useUser();
  const name = displayName(user);
  const initial = userInitial(user);
  const admin = isAdmin(user);

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
            {initial}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-ivy-text truncate">{name}</div>
              <div className="flex items-center gap-1 text-[10px] text-ivy-text-muted truncate">
                {admin && <Shield size={9} className="text-ivy-green" />}
                <span className={admin ? "text-ivy-green" : ""}>{admin ? "Admin" : "Member"}</span>
              </div>
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
