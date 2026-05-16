"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Bot,
  FolderOpen,
  TrendingUp,
  ArrowRight,
  Clock,
  Zap,
  Brain,
  FileText,
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "AI Queries", value: "2,847", change: "+12%", positive: true },
  { label: "Workflows", value: "143", change: "+28%", positive: true },
  { label: "Files Indexed", value: "1,204", change: "+6%", positive: true },
  { label: "Time Saved", value: "34h", change: "this week", positive: true },
];

const recentActivity = [
  { icon: MessageSquare, text: "Analyzed Q3 performance report", time: "2m ago", type: "chat" },
  { icon: Bot, text: "Research Agent completed daily summary", time: "15m ago", type: "agent" },
  { icon: FileText, text: "Generated product roadmap document", time: "1h ago", type: "note" },
  { icon: Zap, text: "Email triage workflow triggered", time: "2h ago", type: "workflow" },
  { icon: Brain, text: "Memory context updated for Project Alpha", time: "3h ago", type: "memory" },
  { icon: FolderOpen, text: "Indexed 23 new files in Research Base", time: "5h ago", type: "files" },
];

const quickActions = [
  { icon: MessageSquare, label: "New Chat", href: "/core/chat", color: "#4afa98" },
  { icon: FolderOpen, label: "New Project", href: "/core/projects", color: "#60a5fa" },
  { icon: Bot, label: "Deploy Agent", href: "/core/agents", color: "#c084fc" },
  { icon: FileText, label: "New Note", href: "/core/notes", color: "#fb923c" },
];

const activeAgents = [
  { name: "Research Agent", task: "Monitoring 12 sources", status: "active" },
  { name: "Code Reviewer", task: "Reviewing PR #247", status: "active" },
  { name: "Email Triage", task: "Classified 34 emails", status: "idle" },
];

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-bold text-ivy-text">Good morning, Alex.</h2>
          <p className="text-sm text-ivy-text-muted mt-0.5">
            You have 3 active agents and 2 pending workflows.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-ivy-text-muted">
          <Clock size={12} />
          <span>Friday, May 16</span>
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
          <div
            key={stat.label}
            className="p-4 rounded-xl bg-ivy-surface border border-ivy-border hover:border-ivy-border-light transition-colors"
          >
            <div className="text-2xl font-bold text-ivy-text">{stat.value}</div>
            <div className="text-xs text-ivy-text-muted mt-1">{stat.label}</div>
            <div className={`text-xs mt-2 font-medium ${stat.positive ? "text-ivy-green" : "text-red-400"}`}>
              {stat.change}
            </div>
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
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${action.color}15` }}
                >
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
        {/* Activity feed */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="lg:col-span-2 rounded-xl bg-ivy-surface border border-ivy-border"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-ivy-border">
            <div className="text-sm font-semibold text-ivy-text">Recent Activity</div>
            <button className="text-xs text-ivy-text-muted hover:text-ivy-text transition-colors flex items-center gap-1">
              View all <ArrowRight size={11} />
            </button>
          </div>
          <div className="p-3 space-y-1">
            {recentActivity.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-ivy-surface-2 transition-colors cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-ivy-dark flex items-center justify-center flex-shrink-0">
                    <Icon size={13} className="text-ivy-text-muted group-hover:text-ivy-text transition-colors" />
                  </div>
                  <span className="flex-1 text-xs text-ivy-text-subtle">{item.text}</span>
                  <span className="text-[10px] text-ivy-text-muted whitespace-nowrap">{item.time}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Active agents */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-xl bg-ivy-surface border border-ivy-border"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-ivy-border">
            <div className="text-sm font-semibold text-ivy-text">Active Agents</div>
            <Link href="/core/agents" className="text-xs text-ivy-green hover:text-ivy-green-dim transition-colors">
              Manage
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {activeAgents.map((agent) => (
              <div key={agent.name} className="p-3 rounded-lg bg-ivy-dark border border-ivy-border">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      agent.status === "active"
                        ? "bg-ivy-green shadow-[0_0_6px_rgba(74,250,152,0.6)]"
                        : "bg-ivy-text-muted"
                    }`}
                  />
                  <span className="text-xs font-medium text-ivy-text">{agent.name}</span>
                  <span
                    className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full ${
                      agent.status === "active"
                        ? "bg-ivy-green/10 text-ivy-green"
                        : "bg-ivy-surface text-ivy-text-muted"
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>
                <p className="text-[11px] text-ivy-text-muted">{agent.task}</p>
              </div>
            ))}

            <Link
              href="/core/agents"
              className="flex items-center justify-center gap-1.5 w-full p-2.5 rounded-lg border border-dashed border-ivy-border text-xs text-ivy-text-muted hover:border-ivy-border-light hover:text-ivy-text transition-colors"
            >
              <Bot size={12} />
              Deploy new agent
            </Link>
          </div>
        </motion.div>
      </div>

      {/* AI memory context hint */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="flex items-center gap-3 p-4 rounded-xl border border-ivy-green/20 bg-ivy-green/5"
      >
        <div className="w-8 h-8 rounded-lg bg-ivy-green/15 flex items-center justify-center flex-shrink-0">
          <Brain size={15} className="text-ivy-green" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-medium text-ivy-green">Memory updated</div>
          <div className="text-xs text-ivy-text-muted mt-0.5">
            Ivy has processed 847 context tokens from your recent activity and updated your workspace memory.
          </div>
        </div>
        <button className="text-xs text-ivy-green hover:text-ivy-green-dim transition-colors whitespace-nowrap">
          View memory →
        </button>
      </motion.div>
    </div>
  );
}
