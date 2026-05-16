"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, Plus, FileText, Clock, Star, ChevronRight, Search, X, Loader2 } from "lucide-react";
import type { Project } from "@/lib/supabase";

const COLORS = ["#4afa98", "#60a5fa", "#f472b6", "#fb923c", "#c084fc", "#facc15", "#34d399", "#38bdf8"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", color: "#4afa98" });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      if (res.ok) setProjects(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!form.name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setProjects((prev) => [data, ...prev]);
        setShowCreate(false);
        setForm({ name: "", description: "", color: "#4afa98" });
      }
    } finally {
      setCreating(false);
    }
  };

  const toggleStar = async (project: Project) => {
    const res = await fetch(`/api/projects?id=${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ starred: !project.starred }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProjects((prev) => prev.map((p) => (p.id === project.id ? updated : p)));
    }
  };

  const deleteProject = async (id: string) => {
    await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const starred = filtered.filter((p) => p.starred);
  const rest = filtered.filter((p) => !p.starred);

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-sm bg-ivy-surface border border-ivy-border rounded-xl text-ivy-text placeholder:text-ivy-text-muted outline-none focus:border-ivy-border-light transition-colors"
          />
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ivy-green/10 hover:bg-ivy-green/15 text-ivy-green text-sm font-medium border border-ivy-green/20 transition-colors"
        >
          <Plus size={14} />
          New Project
        </button>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={20} className="text-ivy-text-muted animate-spin" />
        </div>
      )}

      {!loading && (
        <>
          {/* Starred */}
          {starred.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <div className="flex items-center gap-2 mb-3">
                <Star size={12} className="text-ivy-text-muted" />
                <span className="text-xs font-semibold text-ivy-text-muted uppercase tracking-wider">Starred</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {starred.map((p, i) => (
                  <ProjectCard key={p.id} project={p} index={i} onToggleStar={toggleStar} onDelete={deleteProject} />
                ))}
              </div>
            </motion.div>
          )}

          {/* All */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {starred.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <FolderOpen size={12} className="text-ivy-text-muted" />
                <span className="text-xs font-semibold text-ivy-text-muted uppercase tracking-wider">All Projects</span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {rest.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i + starred.length} onToggleStar={toggleStar} onDelete={deleteProject} />
              ))}

              <button
                onClick={() => setShowCreate(true)}
                className="group flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-ivy-border hover:border-ivy-border-light transition-colors min-h-[160px]"
              >
                <div className="w-10 h-10 rounded-xl bg-ivy-surface group-hover:bg-ivy-surface-2 flex items-center justify-center mb-3 transition-colors">
                  <Plus size={16} className="text-ivy-text-muted" />
                </div>
                <span className="text-sm font-medium text-ivy-text-muted group-hover:text-ivy-text transition-colors">New Project</span>
              </button>
            </div>
          </motion.div>

          {filtered.length === 0 && !loading && (
            <div className="text-center py-16">
              <FolderOpen size={28} className="text-ivy-text-muted mx-auto mb-3" />
              <p className="text-sm text-ivy-text-muted">
                {search ? "No projects match your search" : "No projects yet — create your first one"}
              </p>
            </div>
          )}
        </>
      )}

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md rounded-2xl bg-ivy-surface border border-ivy-border shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-ivy-text">New Project</h2>
                <button onClick={() => setShowCreate(false)} className="p-1 text-ivy-text-muted hover:text-ivy-text">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-ivy-text-muted block mb-1.5">Project Name *</label>
                  <input
                    autoFocus
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && createProject()}
                    placeholder="e.g. Product Roadmap"
                    className="w-full px-3 py-2 text-sm bg-ivy-dark border border-ivy-border rounded-xl text-ivy-text placeholder:text-ivy-text-muted outline-none focus:border-ivy-border-light transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-ivy-text-muted block mb-1.5">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="What is this project about?"
                    rows={2}
                    className="w-full px-3 py-2 text-sm bg-ivy-dark border border-ivy-border rounded-xl text-ivy-text placeholder:text-ivy-text-muted outline-none focus:border-ivy-border-light transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-ivy-text-muted block mb-2">Color</label>
                  <div className="flex gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setForm((f) => ({ ...f, color: c }))}
                        className={`w-6 h-6 rounded-full transition-all ${form.color === c ? "ring-2 ring-offset-2 ring-offset-ivy-surface scale-110" : ""}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-2 rounded-xl border border-ivy-border text-sm text-ivy-text-muted hover:text-ivy-text transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createProject}
                  disabled={!form.name.trim() || creating}
                  className="flex-1 py-2 rounded-xl bg-ivy-green text-ivy-black text-sm font-semibold hover:bg-ivy-green-dim disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {creating && <Loader2 size={13} className="animate-spin" />}
                  Create Project
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectCard({
  project,
  index,
  onToggleStar,
  onDelete,
}: {
  project: Project;
  index: number;
  onToggleStar: (p: Project) => void;
  onDelete: (id: string) => void;
}) {
  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group relative p-5 rounded-xl bg-ivy-surface border border-ivy-border hover:border-ivy-border-light transition-all duration-200 hover:-translate-y-0.5 cursor-pointer overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: project.color }} />

      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${project.color}15` }}>
          <FolderOpen size={15} style={{ color: project.color }} />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleStar(project); }}
            className={`p-1 rounded transition-colors ${project.starred ? "text-yellow-400" : "text-ivy-text-muted hover:text-yellow-400"}`}
          >
            <Star size={12} className={project.starred ? "fill-yellow-400" : ""} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
            className="p-1 rounded text-ivy-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
          >
            <X size={12} />
          </button>
          <ChevronRight size={13} className="text-ivy-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <h3 className="text-sm font-semibold text-ivy-text mb-1.5">{project.name}</h3>
      {project.description && (
        <p className="text-xs text-ivy-text-muted leading-relaxed mb-4 line-clamp-2">{project.description}</p>
      )}

      <div className="flex items-center gap-3 text-[10px] text-ivy-text-muted border-t border-ivy-border pt-3 mt-auto">
        <span className="flex items-center gap-1">
          <FileText size={10} />
          0 files
        </span>
        <span className="ml-auto flex items-center gap-1">
          <Clock size={10} />
          {timeAgo(project.updated_at)}
        </span>
      </div>
    </motion.div>
  );
}
