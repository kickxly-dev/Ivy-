"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Bot, FolderOpen, ArrowRight, Clock, Plus } from "lucide-react";
import Link from "next/link";
import { useUser, displayName } from "@/lib/user-context";

type Conversation = { id: string; title: string; updated_at: string; model: string };
type Project = { id: string; name: string; color: string; updated_at: string };

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function DashboardPage() {
  const user = useUser();
  const name = displayName(user);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/conversations").then((r) => r.json()),
      fetch("/api/projects").then((r) => r.json()),
    ]).then(([convs, projs]) => {
      setConversations(Array.isArray(convs) ? convs : []);
      setProjects(Array.isArray(projs) ? projs : []);
      setLoading(false);
    });
  }, []);

  const stats = [
    { label: "Conversations", value: loading ? "—" : String(conversations.length) },
    { label: "Projects", value: loading ? "—" : String(projects.length) },
    { label: "AI Models", value: "3" },
    { label: "Member since", value: user ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—" },
  ];

  const quickActions = [
    { icon: MessageSquare, label: "New Chat", href: "/core/chat", color: "#4afa98" },
    { icon: FolderOpen, label: "New Project", href: "/core/projects", color: "#60a5fa" },
    { icon: Bot, label: "Deploy Agent", href: "/core/agents", color: "#c084fc" },
    { icon: Plus, label: "Invite Member", href: "/core/settings", color: "#fb923c" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-bold text-ivy-text">{greeting()}, {name}.</h2>
          <p className="text-sm text-ivy-text-muted mt-0.5">
            {conversations.length > 0
              ? `You have ${conversations.length} conversation${conversations.length !== 1 ? "s" : ""} and ${projects.length} project${projects.length !== 1 ? "s" : ""}.`
              : "Welcome to your Ivy workspace."}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-ivy-text-muted">
          <Clock size={12} />
          <span>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {stats.map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl bg-ivy-surface border border-ivy-border hover:border-ivy-border-light transition-colors">
            <div className="text-2xl font-bold text-ivy-text">{stat.value}</div>
            <div className="text-xs text-ivy-text-muted mt-1">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="text-xs font-semibold text-ivy-text-muted uppercase tracking-wider mb-3">Quick Actions</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="group flex items-center gap-3 p-4 rounded-xl bg-ivy-surface border border-ivy-border hover:border-ivy-border-light transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110" style={{ backgroundColor: `${action.color}15` }}>
                  <Icon size={15} style={{ color: action.color }} />
                </div>
                <span className="text-sm font-medium text-ivy-text">{action.label}</span>
                <ArrowRight size={12} className="text-ivy-text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent conversations */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="lg:col-span-2 rounded-xl bg-ivy-surface border border-ivy-border"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-ivy-border">
            <div className="text-sm font-semibold text-ivy-text">Recent Conversations</div>
            <Link href="/core/chat" className="text-xs text-ivy-text-muted hover:text-ivy-text transition-colors flex items-center gap-1">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="p-3 space-y-1">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
                  <div className="w-7 h-7 rounded-lg bg-ivy-dark animate-pulse" />
                  <div className="flex-1 h-3 bg-ivy-dark rounded animate-pulse" />
                  <div className="w-10 h-2 bg-ivy-dark rounded animate-pulse" />
                </div>
              ))
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <MessageSquare size={24} className="text-ivy-text-muted" />
                <p className="text-xs text-ivy-text-muted">No conversations yet</p>
                <Link href="/core/chat" className="text-xs text-ivy-green hover:text-ivy-green-dim transition-colors">
                  Start your first chat →
                </Link>
              </div>
            ) : (
              conversations.slice(0, 6).map((conv) => (
                <Link
                  key={conv.id}
                  href={`/core/chat?id=${conv.id}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-ivy-surface-2 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-ivy-dark flex items-center justify-center flex-shrink-0">
                    <MessageSquare size={13} className="text-ivy-text-muted group-hover:text-ivy-text transition-colors" />
                  </div>
                  <span className="flex-1 text-xs text-ivy-text-subtle truncate">{conv.title}</span>
                  <span className="text-[10px] text-ivy-text-muted whitespace-nowrap">{timeAgo(conv.updated_at)}</span>
                </Link>
              ))
            )}
          </div>
        </motion.div>

        {/* Projects */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-xl bg-ivy-surface border border-ivy-border"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-ivy-border">
            <div className="text-sm font-semibold text-ivy-text">Projects</div>
            <Link href="/core/projects" className="text-xs text-ivy-green hover:text-ivy-green-dim transition-colors">
              Manage
            </Link>
          </div>
          <div className="p-4 space-y-2">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-3 rounded-lg bg-ivy-dark border border-ivy-border animate-pulse h-14" />
              ))
            ) : projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <FolderOpen size={24} className="text-ivy-text-muted" />
                <p className="text-xs text-ivy-text-muted">No projects yet</p>
              </div>
            ) : (
              projects.slice(0, 4).map((proj) => (
                <Link
                  key={proj.id}
                  href={`/core/projects?id=${proj.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-ivy-dark border border-ivy-border hover:border-ivy-border-light transition-colors"
                >
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: proj.color }} />
                  <span className="text-xs font-medium text-ivy-text truncate">{proj.name}</span>
                  <span className="ml-auto text-[10px] text-ivy-text-muted whitespace-nowrap">{timeAgo(proj.updated_at)}</span>
                </Link>
              ))
            )}

            <Link
              href="/core/projects"
              className="flex items-center justify-center gap-1.5 w-full p-2.5 rounded-lg border border-dashed border-ivy-border text-xs text-ivy-text-muted hover:border-ivy-border-light hover:text-ivy-text transition-colors mt-2"
            >
              <Plus size={12} />
              New project
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
