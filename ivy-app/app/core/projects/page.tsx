"use client";

import { motion } from "framer-motion";
import { FolderOpen, Plus, Users, FileText, Bot, Clock, Star, ChevronRight, Search } from "lucide-react";
import Link from "next/link";

const PROJECTS = [
  {
    id: "1",
    name: "Product Roadmap Q3",
    description: "Strategic planning and feature prioritization for Q3 launch cycle.",
    files: 24,
    members: 4,
    agents: 2,
    updated: "2m ago",
    starred: true,
    color: "#4afa98",
    tags: ["strategy", "product"],
  },
  {
    id: "2",
    name: "ML Research Base",
    description: "Curated research papers, experiments, and insights for the ML team.",
    files: 87,
    members: 6,
    agents: 3,
    updated: "1h ago",
    starred: true,
    color: "#60a5fa",
    tags: ["research", "ML"],
  },
  {
    id: "3",
    name: "Brand & Marketing",
    description: "Creative assets, campaign briefs, and brand guidelines repository.",
    files: 43,
    members: 3,
    agents: 1,
    updated: "3h ago",
    starred: false,
    color: "#f472b6",
    tags: ["marketing", "brand"],
  },
  {
    id: "4",
    name: "Engineering Docs",
    description: "Technical documentation, architecture decisions, and runbooks.",
    files: 156,
    members: 8,
    agents: 4,
    updated: "1d ago",
    starred: false,
    color: "#fb923c",
    tags: ["engineering", "docs"],
  },
  {
    id: "5",
    name: "Customer Success",
    description: "Support playbooks, customer data analysis, and success metrics.",
    files: 31,
    members: 5,
    agents: 2,
    updated: "2d ago",
    starred: false,
    color: "#c084fc",
    tags: ["support", "customer"],
  },
  {
    id: "6",
    name: "Legal & Compliance",
    description: "Contracts, compliance checklists, and regulatory documentation.",
    files: 67,
    members: 2,
    agents: 0,
    updated: "1w ago",
    starred: false,
    color: "#facc15",
    tags: ["legal", "compliance"],
  },
];

export default function ProjectsPage() {
  const starred = PROJECTS.filter((p) => p.starred);
  const all = PROJECTS.filter((p) => !p.starred);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivy-text-muted" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-8 pr-4 py-2 text-sm bg-ivy-surface border border-ivy-border rounded-xl text-ivy-text placeholder:text-ivy-text-muted outline-none focus:border-ivy-border-light transition-colors"
          />
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ivy-green/10 hover:bg-ivy-green/15 text-ivy-green text-sm font-medium border border-ivy-green/20 transition-colors">
          <Plus size={14} />
          New Project
        </button>
      </motion.div>

      {/* Starred */}
      {starred.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Star size={12} className="text-ivy-text-muted" />
            <span className="text-xs font-semibold text-ivy-text-muted uppercase tracking-wider">Starred</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {starred.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </motion.div>
      )}

      {/* All projects */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <FolderOpen size={12} className="text-ivy-text-muted" />
          <span className="text-xs font-semibold text-ivy-text-muted uppercase tracking-wider">All Projects</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {all.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i + starred.length} />
          ))}

          {/* New project card */}
          <button className="group flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-ivy-border hover:border-ivy-border-light transition-colors min-h-[160px]">
            <div className="w-10 h-10 rounded-xl bg-ivy-surface group-hover:bg-ivy-surface-2 flex items-center justify-center mb-3 transition-colors">
              <Plus size={16} className="text-ivy-text-muted" />
            </div>
            <span className="text-sm font-medium text-ivy-text-muted group-hover:text-ivy-text transition-colors">
              New Project
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: (typeof PROJECTS)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group relative p-5 rounded-xl bg-ivy-surface border border-ivy-border hover:border-ivy-border-light transition-all duration-200 hover:-translate-y-0.5 cursor-pointer overflow-hidden"
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: project.color }}
      />

      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${project.color}15` }}
        >
          <FolderOpen size={15} style={{ color: project.color }} />
        </div>
        <div className="flex items-center gap-1">
          {project.starred && <Star size={12} className="text-yellow-400 fill-yellow-400" />}
          <ChevronRight size={13} className="text-ivy-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <h3 className="text-sm font-semibold text-ivy-text mb-1.5">{project.name}</h3>
      <p className="text-xs text-ivy-text-muted leading-relaxed mb-4 line-clamp-2">{project.description}</p>

      <div className="flex items-center gap-1 mb-3">
        {project.tags.map((tag) => (
          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-ivy-dark text-ivy-text-muted">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4 text-[10px] text-ivy-text-muted border-t border-ivy-border pt-3">
        <span className="flex items-center gap-1">
          <FileText size={10} />
          {project.files} files
        </span>
        <span className="flex items-center gap-1">
          <Users size={10} />
          {project.members} members
        </span>
        {project.agents > 0 && (
          <span className="flex items-center gap-1">
            <Bot size={10} />
            {project.agents} agents
          </span>
        )}
        <span className="ml-auto flex items-center gap-1">
          <Clock size={10} />
          {project.updated}
        </span>
      </div>
    </motion.div>
  );
}
