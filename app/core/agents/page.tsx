"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Plus, Play, Pause, Settings2, Activity, Clock, Zap, ChevronRight } from "lucide-react";

const AGENTS = [
  {
    id: "1",
    name: "Research Agent",
    description: "Monitors 12 curated sources and generates daily intelligence briefings.",
    status: "active",
    runs: 847,
    lastRun: "2m ago",
    tags: ["monitoring", "research"],
    color: "#4afa98",
  },
  {
    id: "2",
    name: "Code Reviewer",
    description: "Analyzes pull requests and provides structured feedback on code quality.",
    status: "active",
    runs: 234,
    lastRun: "1h ago",
    tags: ["engineering", "code"],
    color: "#60a5fa",
  },
  {
    id: "3",
    name: "Email Triage",
    description: "Classifies, prioritizes, and drafts responses to incoming emails automatically.",
    status: "idle",
    runs: 1204,
    lastRun: "6h ago",
    tags: ["communication", "automation"],
    color: "#f472b6",
  },
  {
    id: "4",
    name: "Data Pipeline",
    description: "Extracts, transforms, and loads data from connected sources on a schedule.",
    status: "paused",
    runs: 56,
    lastRun: "2d ago",
    tags: ["data", "automation"],
    color: "#fb923c",
  },
  {
    id: "5",
    name: "Meeting Summarizer",
    description: "Transcribes meetings, extracts action items, and distributes summaries.",
    status: "idle",
    runs: 312,
    lastRun: "1d ago",
    tags: ["productivity", "meetings"],
    color: "#c084fc",
  },
];

const STATUS_CONFIG = {
  active: { label: "Active", dot: "bg-ivy-green shadow-[0_0_6px_rgba(74,250,152,0.6)]", badge: "bg-ivy-green/10 text-ivy-green border-ivy-green/20" },
  idle: { label: "Idle", dot: "bg-ivy-text-muted", badge: "bg-ivy-surface text-ivy-text-muted border-ivy-border" },
  paused: { label: "Paused", dot: "bg-yellow-500", badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
};

export default function AgentsPage() {
  const [agents, setAgents] = useState(AGENTS);

  const toggleAgent = (id: string) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "active" ? "idle" : "active" }
          : a
      )
    );
  };

  const activeCount = agents.filter((a) => a.status === "active").length;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { label: "Active Agents", value: activeCount, icon: Activity, color: "#4afa98" },
          { label: "Total Runs", value: "2,653", icon: Zap, color: "#60a5fa" },
          { label: "Avg. Runtime", value: "4.2s", icon: Clock, color: "#c084fc" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex items-center gap-3 p-4 rounded-xl bg-ivy-surface border border-ivy-border">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${stat.color}15` }}>
                <Icon size={16} style={{ color: stat.color }} />
              </div>
              <div>
                <div className="text-xl font-bold text-ivy-text">{stat.value}</div>
                <div className="text-xs text-ivy-text-muted">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Agents list */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-xl border border-ivy-border bg-ivy-surface overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-ivy-border">
          <div className="text-sm font-semibold text-ivy-text">Your Agents</div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ivy-green/10 hover:bg-ivy-green/15 text-ivy-green text-xs font-medium border border-ivy-green/20 transition-colors">
            <Plus size={12} />
            New Agent
          </button>
        </div>

        <div className="divide-y divide-ivy-border">
          {agents.map((agent, i) => {
            const config = STATUS_CONFIG[agent.status as keyof typeof STATUS_CONFIG];
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-ivy-dark/40 transition-colors group"
              >
                {/* Status dot */}
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${config.dot}`} />

                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${agent.color}15` }}
                >
                  <Bot size={15} style={{ color: agent.color }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-ivy-text">{agent.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${config.badge}`}>
                      {config.label}
                    </span>
                    <div className="hidden md:flex gap-1 ml-1">
                      {agent.tags.map((tag) => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-ivy-dark text-ivy-text-muted">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-ivy-text-muted truncate">{agent.description}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-ivy-text-muted">{agent.runs} runs</span>
                    <span className="text-[10px] text-ivy-text-muted">Last: {agent.lastRun}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => toggleAgent(agent.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      agent.status === "active"
                        ? "text-ivy-green hover:bg-ivy-green/10"
                        : "text-ivy-text-muted hover:text-ivy-green hover:bg-ivy-green/10"
                    }`}
                  >
                    {agent.status === "active" ? <Pause size={13} /> : <Play size={13} />}
                  </button>
                  <button className="p-1.5 rounded-lg text-ivy-text-muted hover:text-ivy-text hover:bg-ivy-surface-2 transition-colors">
                    <Settings2 size={13} />
                  </button>
                  <button className="p-1.5 rounded-lg text-ivy-text-muted hover:text-ivy-text hover:bg-ivy-surface-2 transition-colors opacity-0 group-hover:opacity-100 transition-all">
                    <ChevronRight size={13} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Empty state / deploy new */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex items-center gap-4 p-5 rounded-xl border border-dashed border-ivy-border hover:border-ivy-border-light transition-colors cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-ivy-surface group-hover:bg-ivy-surface-2 flex items-center justify-center transition-colors">
          <Plus size={16} className="text-ivy-text-muted" />
        </div>
        <div>
          <div className="text-sm font-medium text-ivy-text">Deploy a new agent</div>
          <div className="text-xs text-ivy-text-muted">Use a template or build from scratch</div>
        </div>
        <ChevronRight size={14} className="text-ivy-text-muted ml-auto" />
      </motion.div>
    </div>
  );
}
