"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  FolderOpen,
  Users,
  Bot,
  ChevronRight,
} from "lucide-react";

const tabs = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    description: "Your command center. Recent activity, quick actions, AI summaries — all at a glance.",
    preview: <DashboardPreview />,
  },
  {
    id: "chat",
    icon: MessageSquare,
    label: "AI Chat",
    description: "Fluent conversations with multi-model support. Ivy routes to the best model for each task.",
    preview: <ChatPreview />,
  },
  {
    id: "projects",
    icon: FolderOpen,
    label: "Projects",
    description: "Organized workspaces with shared context, files, and team memory. Scale effortlessly.",
    preview: <ProjectsPreview />,
  },
  {
    id: "agents",
    icon: Bot,
    label: "Agents",
    description: "Autonomous AI agents that monitor, execute, and report. Set goals, not scripts.",
    preview: <AgentsPreview />,
  },
  {
    id: "teams",
    icon: Users,
    label: "Teams",
    description: "Collaborate with your team on shared AI workspaces, agents, and knowledge bases.",
    preview: <TeamsPreview />,
  },
];

export default function ProductShowcase() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const active = tabs.find((t) => t.id === activeTab)!;
  const Icon = active.icon;

  return (
    <section id="product" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-ivy-green/[0.025] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-ivy-green text-xs font-mono uppercase tracking-[0.2em] mb-4 block">
            Ivy Core
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-ivy-text tracking-tight mb-4">
            One workspace.
            <br />
            <span className="ivy-gradient-green">Infinite intelligence.</span>
          </h2>
          <p className="text-ivy-text-muted text-lg max-w-xl mx-auto">
            Ivy Core brings AI, files, projects, and automation together in one
            fluid, connected environment.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex flex-col lg:flex-row gap-6"
        >
          {/* Tab list */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 flex-shrink-0 lg:flex-shrink w-full ${
                      isActive
                        ? "bg-ivy-surface border border-ivy-border-light text-ivy-text"
                        : "text-ivy-text-muted hover:text-ivy-text hover:bg-ivy-surface/50"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        isActive ? "bg-ivy-green/15" : "bg-ivy-surface group-hover:bg-ivy-surface-2"
                      }`}
                    >
                      <TabIcon size={14} className={isActive ? "text-ivy-green" : "text-ivy-text-muted"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{tab.label}</div>
                      {isActive && (
                        <p className="text-xs text-ivy-text-muted mt-0.5 leading-relaxed hidden lg:block">
                          {tab.description}
                        </p>
                      )}
                    </div>
                    {isActive && <ChevronRight size={14} className="text-ivy-text-muted flex-shrink-0 hidden lg:block" />}
                  </button>
                );
              })}
            </div>

            {/* Active description on mobile */}
            <p className="text-sm text-ivy-text-muted mt-4 lg:hidden leading-relaxed">
              {active.description}
            </p>
          </div>

          {/* Preview pane */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 rounded-2xl border border-ivy-border bg-ivy-surface overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.5)] min-h-[400px] md:min-h-[480px]"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-ivy-border bg-ivy-dark">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-ivy-border-light" />
                <div className="w-2.5 h-2.5 rounded-full bg-ivy-border-light" />
                <div className="w-2.5 h-2.5 rounded-full bg-ivy-border-light" />
              </div>
              <div className="flex-1 flex items-center justify-center gap-2">
                <Icon size={11} className="text-ivy-green" />
                <span className="text-[11px] text-ivy-text-muted font-mono">Ivy Core / {active.label}</span>
              </div>
            </div>
            <div className="p-6 h-full">
              {active.preview}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  const stats = [
    { label: "AI Queries", value: "2,847", change: "+12%" },
    { label: "Workflows Run", value: "143", change: "+28%" },
    { label: "Files Indexed", value: "1,204", change: "+6%" },
    { label: "Time Saved", value: "34h", change: "+19%" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="p-3 rounded-lg bg-ivy-dark border border-ivy-border">
            <div className="text-xl font-bold text-ivy-text">{stat.value}</div>
            <div className="text-[10px] text-ivy-text-muted mt-0.5">{stat.label}</div>
            <div className="text-[10px] text-ivy-green mt-1">{stat.change}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-4 rounded-lg bg-ivy-dark border border-ivy-border">
          <div className="text-xs font-medium text-ivy-text mb-3">Recent Activity</div>
          {["Analyzed Q3 report", "Generated design brief", "Scheduled 3 tasks", "Indexed new docs"].map((item, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 border-b border-ivy-border last:border-0">
              <div className="w-1 h-1 rounded-full bg-ivy-green" />
              <span className="text-xs text-ivy-text-muted">{item}</span>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-lg bg-ivy-dark border border-ivy-border">
          <div className="text-xs font-medium text-ivy-text mb-3">Active Agents</div>
          {[
            { name: "Research Agent", status: "Running" },
            { name: "Data Monitor", status: "Idle" },
            { name: "Email Classifier", status: "Running" },
          ].map((agent) => (
            <div key={agent.name} className="flex items-center justify-between py-1.5 border-b border-ivy-border last:border-0">
              <span className="text-xs text-ivy-text-muted">{agent.name}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                agent.status === "Running"
                  ? "bg-ivy-green/10 text-ivy-green"
                  : "bg-ivy-border text-ivy-text-muted"
              }`}>
                {agent.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatPreview() {
  return (
    <div className="space-y-4 max-w-lg">
      {[
        { role: "user", text: "Summarize the attached research paper and extract the key findings." },
        { role: "ai", text: "I've analyzed the paper. Key findings: (1) 23% efficiency gain using the proposed architecture, (2) Significant improvements in low-resource settings, (3) New benchmark results on 4 datasets. Want me to generate a structured report?" },
        { role: "user", text: "Yes, and compare with our previous findings." },
      ].map((msg, i) => (
        <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
          <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold ${
            msg.role === "ai" ? "bg-ivy-green/20 text-ivy-green" : "bg-ivy-surface-2 text-ivy-text-muted"
          }`}>
            {msg.role === "ai" ? "I" : "U"}
          </div>
          <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
            msg.role === "user"
              ? "bg-ivy-surface-2 text-ivy-text-subtle"
              : "bg-ivy-dark border border-ivy-border text-ivy-text"
          }`}>
            {msg.text}
          </div>
        </div>
      ))}
      <div className="flex gap-3">
        <div className="w-6 h-6 rounded-full flex-shrink-0 bg-ivy-green/20 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-ivy-green animate-pulse" />
        </div>
        <div className="px-3 py-2 rounded-xl bg-ivy-dark border border-ivy-border text-xs text-ivy-text-muted">
          Comparing with previous findings<span className="cursor-blink">_</span>
        </div>
      </div>
    </div>
  );
}

function ProjectsPreview() {
  const projects = [
    { name: "Product Roadmap", files: 24, updated: "2m ago", color: "#4afa98" },
    { name: "Research Base", files: 87, updated: "1h ago", color: "#60a5fa" },
    { name: "Marketing Assets", files: 43, updated: "3h ago", color: "#f472b6" },
    { name: "Engineering Docs", files: 156, updated: "1d ago", color: "#fb923c" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {projects.map((project) => (
        <div key={project.name} className="p-4 rounded-lg bg-ivy-dark border border-ivy-border hover:border-ivy-border-light cursor-pointer transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${project.color}15` }}>
              <FolderOpen size={14} style={{ color: project.color }} />
            </div>
            <span className="text-[10px] text-ivy-text-muted">{project.updated}</span>
          </div>
          <div className="text-sm font-medium text-ivy-text mb-1">{project.name}</div>
          <div className="text-[10px] text-ivy-text-muted">{project.files} files</div>
        </div>
      ))}
    </div>
  );
}

function AgentsPreview() {
  const agents = [
    { name: "Research Agent", desc: "Monitors sources and summarizes daily", status: "active" },
    { name: "Code Reviewer", desc: "Reviews PRs and suggests improvements", status: "active" },
    { name: "Data Pipeline", desc: "Transforms and loads data on schedule", status: "paused" },
    { name: "Email Triage", desc: "Classifies and prioritizes incoming mail", status: "active" },
  ];

  return (
    <div className="space-y-3">
      {agents.map((agent) => (
        <div key={agent.name} className="flex items-center gap-4 p-3 rounded-lg bg-ivy-dark border border-ivy-border">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
            agent.status === "active" ? "bg-ivy-green" : "bg-ivy-text-muted"
          } ${agent.status === "active" ? "shadow-[0_0_6px_rgba(74,250,152,0.6)]" : ""}`} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-ivy-text">{agent.name}</div>
            <div className="text-[10px] text-ivy-text-muted truncate">{agent.desc}</div>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${
            agent.status === "active"
              ? "bg-ivy-green/10 text-ivy-green"
              : "bg-ivy-surface text-ivy-text-muted"
          }`}>
            {agent.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function TeamsPreview() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 rounded-lg bg-ivy-dark border border-ivy-border">
        <div className="flex -space-x-2">
          {["E", "M", "A", "J"].map((letter, i) => (
            <div key={i} className="w-7 h-7 rounded-full bg-ivy-surface-2 border-2 border-ivy-dark flex items-center justify-center text-[10px] font-medium text-ivy-text">
              {letter}
            </div>
          ))}
        </div>
        <div>
          <div className="text-xs font-medium text-ivy-text">Engineering Team</div>
          <div className="text-[10px] text-ivy-text-muted">4 members · 3 active agents</div>
        </div>
      </div>
      {["Product Team", "Design Team", "Research Team"].map((team, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-ivy-dark border border-ivy-border">
          <div className="flex -space-x-2">
            {["A", "B", "C"].slice(0, 3 - i).map((letter, j) => (
              <div key={j} className="w-7 h-7 rounded-full bg-ivy-surface-2 border-2 border-ivy-dark flex items-center justify-center text-[10px] font-medium text-ivy-text">
                {letter}
              </div>
            ))}
          </div>
          <div>
            <div className="text-xs font-medium text-ivy-text">{team}</div>
            <div className="text-[10px] text-ivy-text-muted">{3 - i} members</div>
          </div>
        </div>
      ))}
    </div>
  );
}
