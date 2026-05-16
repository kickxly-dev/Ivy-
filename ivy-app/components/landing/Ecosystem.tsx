"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  MessageSquare,
  HardDrive,
  Cloud,
  Lock,
  Code2,
  Zap,
  Monitor,
  RefreshCw,
  Bot,
} from "lucide-react";

const products = [
  {
    name: "Ivy Core",
    tagline: "AI Workspace",
    description: "The central hub for AI-powered productivity.",
    icon: MessageSquare,
    status: "available",
    color: "#4afa98",
  },
  {
    name: "Ivy Drive",
    tagline: "Cloud Storage",
    description: "Intelligent file storage with AI-native search.",
    icon: HardDrive,
    status: "beta",
    color: "#60a5fa",
  },
  {
    name: "Ivy Cloud",
    tagline: "Infrastructure",
    description: "Scalable cloud infrastructure for AI workloads.",
    icon: Cloud,
    status: "coming",
    color: "#a78bfa",
  },
  {
    name: "Ivy Vault",
    tagline: "Secure Storage",
    description: "Encrypted vault for sensitive data and secrets.",
    icon: Lock,
    status: "coming",
    color: "#f472b6",
  },
  {
    name: "Ivy Code",
    tagline: "AI Coding",
    description: "AI-assisted coding with deep context awareness.",
    icon: Code2,
    status: "coming",
    color: "#fb923c",
  },
  {
    name: "Ivy Flow",
    tagline: "Automation",
    description: "Visual workflow builder for AI pipelines.",
    icon: Zap,
    status: "coming",
    color: "#facc15",
  },
  {
    name: "Ivy Studio",
    tagline: "AI Creation",
    description: "Create, generate, and edit with AI creativity tools.",
    icon: Monitor,
    status: "coming",
    color: "#34d399",
  },
  {
    name: "Ivy Sync",
    tagline: "Sync Engine",
    description: "Real-time sync across all devices and platforms.",
    icon: RefreshCw,
    status: "coming",
    color: "#38bdf8",
  },
  {
    name: "Ivy Agents",
    tagline: "Agent Platform",
    description: "Deploy, manage, and monitor autonomous agents.",
    icon: Bot,
    status: "beta",
    color: "#c084fc",
  },
];

const statusConfig = {
  available: { label: "Available", class: "bg-ivy-green/10 text-ivy-green border-ivy-green/20" },
  beta: { label: "Beta", class: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  coming: { label: "Coming soon", class: "bg-ivy-surface text-ivy-text-muted border-ivy-border" },
};

export default function Ecosystem() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="ecosystem" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 ivy-grid opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-ivy-green/[0.025] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-ivy-green text-xs font-mono uppercase tracking-[0.2em] mb-4 block">
            Ecosystem
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-ivy-text tracking-tight mb-4">
            The complete
            <br />
            <span className="ivy-gradient-green">Ivy ecosystem.</span>
          </h2>
          <p className="text-ivy-text-muted text-lg max-w-xl mx-auto leading-relaxed">
            A growing suite of AI-native products, all sharing one identity,
            one account, and one seamless experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, i) => {
            const Icon = product.icon;
            const status = statusConfig[product.status as keyof typeof statusConfig];

            return (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group relative p-5 rounded-xl border border-ivy-border bg-ivy-surface hover:border-ivy-border-light transition-all duration-300 cursor-default overflow-hidden"
              >
                {/* Corner accent */}
                <div
                  className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full blur-2xl"
                  style={{ backgroundColor: `${product.color}10` }}
                />

                <div className="relative flex items-start justify-between mb-4">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${product.color}15` }}
                  >
                    <Icon size={17} style={{ color: product.color }} />
                  </div>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full border font-medium ${status.class}`}
                  >
                    {status.label}
                  </span>
                </div>

                <div className="text-sm font-semibold text-ivy-text mb-0.5">{product.name}</div>
                <div className="text-[11px] text-ivy-green/70 font-mono mb-2">{product.tagline}</div>
                <p className="text-xs text-ivy-text-muted leading-relaxed">{product.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
