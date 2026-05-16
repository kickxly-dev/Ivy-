"use client";

import { motion } from "framer-motion";
import { Bot, Plus, Activity, Zap, Clock, ChevronRight, Sparkles } from "lucide-react";

export default function AgentsPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { label: "Active Agents", value: "0", icon: Activity, color: "#4afa98" },
          { label: "Total Runs", value: "—", icon: Zap, color: "#60a5fa" },
          { label: "Avg. Runtime", value: "—", icon: Clock, color: "#c084fc" },
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

      {/* Empty state */}
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

        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-ivy-dark border border-ivy-border flex items-center justify-center mb-4">
            <Bot size={22} className="text-ivy-text-muted" />
          </div>
          <div className="text-sm font-semibold text-ivy-text mb-1.5">No agents deployed yet</div>
          <p className="text-xs text-ivy-text-muted max-w-xs leading-relaxed">
            Agents run autonomously in the background — monitoring sources, processing data, and completing tasks on a schedule.
          </p>
        </div>
      </motion.div>

      {/* Deploy CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
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

      {/* Coming soon hint */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex items-center gap-3 p-4 rounded-xl bg-ivy-green/5 border border-ivy-green/10"
      >
        <Sparkles size={14} className="text-ivy-green flex-shrink-0" />
        <p className="text-xs text-ivy-text-muted">
          <span className="text-ivy-green font-medium">Agent builder coming soon.</span>{" "}
          Create custom agents that monitor sources, trigger on events, and integrate with your workspace.
        </p>
      </motion.div>
    </div>
  );
}
