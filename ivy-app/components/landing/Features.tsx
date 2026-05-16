"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Brain,
  Workflow,
  FolderOpen,
  Shield,
  Zap,
  GitBranch,
  MessageSquare,
  Search,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Persistent AI Memory",
    description:
      "Ivy remembers context across sessions, projects, and workspaces. No more re-explaining — your AI understands your work.",
    accent: "green",
  },
  {
    icon: Workflow,
    title: "Intelligent Workflows",
    description:
      "Automate multi-step processes with AI-powered agents. Trigger actions, chain tools, and orchestrate complex pipelines.",
    accent: "green",
  },
  {
    icon: FolderOpen,
    title: "File Intelligence",
    description:
      "Upload documents, code, or data. Ivy reads, analyzes, and surfaces insights from your files with full context.",
    accent: "green",
  },
  {
    icon: MessageSquare,
    title: "Unified Chat",
    description:
      "Switch between AI models seamlessly. GPT-4, Claude, Gemini — all accessible from one clean, unified interface.",
    accent: "green",
  },
  {
    icon: Search,
    title: "Smart Search",
    description:
      "Semantic search across your entire workspace. Find conversations, files, notes, and projects instantly.",
    accent: "green",
  },
  {
    icon: GitBranch,
    title: "Project Branches",
    description:
      "Organize work into focused projects with their own context, memory, and AI agents. Stay structured at scale.",
    accent: "green",
  },
  {
    icon: Zap,
    title: "Real-Time Agents",
    description:
      "Deploy custom agents that monitor, execute, and respond autonomously. Define goals, not instructions.",
    accent: "green",
  },
  {
    icon: Shield,
    title: "End-to-End Security",
    description:
      "Enterprise-grade encryption, granular permissions, and audit logs. Your data stays yours.",
    accent: "green",
  },
];

export default function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-32 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 ivy-grid opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-ivy-border to-transparent" />

      <div className="relative max-w-7xl mx-auto" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-ivy-green text-xs font-mono uppercase tracking-[0.2em] mb-4 block">
            Capabilities
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-ivy-text tracking-tight mb-4">
            Every tool you need,
            <br />
            <span className="ivy-gradient-green">natively connected.</span>
          </h2>
          <p className="text-ivy-text-muted text-lg max-w-xl mx-auto leading-relaxed">
            Ivy isn&apos;t a collection of disconnected tools. It&apos;s a unified platform
            where every feature amplifies the others.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
  inView,
}: {
  feature: (typeof features)[0];
  index: number;
  inView: boolean;
}) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative p-5 rounded-xl border border-ivy-border bg-ivy-surface hover:border-ivy-border-light hover:bg-ivy-surface-2 transition-all duration-300 cursor-default"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-ivy-green/[0.02]" />

      <div className="relative">
        <div className="w-9 h-9 rounded-lg bg-ivy-green/10 flex items-center justify-center mb-4 group-hover:bg-ivy-green/15 transition-colors duration-300">
          <Icon size={17} className="text-ivy-green" />
        </div>
        <h3 className="text-sm font-semibold text-ivy-text mb-2">{feature.title}</h3>
        <p className="text-xs leading-relaxed text-ivy-text-muted">{feature.description}</p>
      </div>
    </motion.div>
  );
}
