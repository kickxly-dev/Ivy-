"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Plus, Play, Pause, Settings2, Activity, Clock, Zap,
  X, Loader2, Check, Trash2, ChevronRight, Sparkles, Copy, RefreshCw,
} from "lucide-react";

const COLORS = ["#4afa98", "#60a5fa", "#f472b6", "#fb923c", "#c084fc", "#facc15", "#34d399"];

const MODELS = [
  { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B", key: "balanced" },
  { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B (Fast)", key: "fast" },
  { id: "llama-3.2-11b-vision-preview", label: "Llama 3.2 Vision", key: "vision" },
];

const TEMPLATES = [
  {
    id: "research",
    label: "Research",
    color: "#4afa98",
    instructions: "You are a research intelligence agent. Analyze trends, synthesize information from multiple perspectives, and produce structured briefings. When given a topic, provide: a concise summary, key insights, emerging trends, and actionable recommendations. Format your output in clear sections with headers.",
  },
  {
    id: "writer",
    label: "Writer",
    color: "#60a5fa",
    instructions: "You are a professional content writer and editor. Your role is to create clear, engaging, and well-structured content. When given a task, produce polished writing that matches the requested tone and format. Focus on clarity, flow, and impact. Always deliver complete, publication-ready output.",
  },
  {
    id: "analyst",
    label: "Analyst",
    color: "#c084fc",
    instructions: "You are a strategic analyst. Break down complex problems, identify patterns, evaluate options, and provide data-driven recommendations. Structure your analysis with: situation overview, key findings, risk assessment, and recommended actions. Be precise, objective, and thorough.",
  },
  {
    id: "coder",
    label: "Code Review",
    color: "#fb923c",
    instructions: "You are a senior software engineer specializing in code quality. When given code or a technical task, provide: a quality assessment, specific improvement suggestions, potential bugs or vulnerabilities, and refactored examples where helpful. Follow best practices for readability, performance, and security.",
  },
  {
    id: "custom",
    label: "Custom",
    color: "#facc15",
    instructions: "",
  },
];

const STATUS_CONFIG = {
  active: { label: "Active", dot: "bg-ivy-green shadow-[0_0_6px_rgba(74,250,152,0.6)]", badge: "bg-ivy-green/10 text-ivy-green border-ivy-green/20" },
  idle: { label: "Idle", dot: "bg-ivy-text-muted", badge: "bg-ivy-surface text-ivy-text-muted border-ivy-border" },
  paused: { label: "Paused", dot: "bg-yellow-500", badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
};

type Agent = {
  id: string;
  name: string;
  description: string | null;
  instructions: string;
  model: string;
  status: "active" | "idle" | "paused";
  color: string;
  run_count: number;
  last_run: string | null;
  created_at: string;
};

type AgentRun = {
  id: string;
  status: "running" | "success" | "failed";
  output: string | null;
  error: string | null;
  started_at: string;
  completed_at: string | null;
};

function timeAgo(dateStr: string | null) {
  if (!dateStr) return "Never";
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [runOutput, setRunOutput] = useState<{ agent: Agent; content: string; done: boolean } | null>(null);
  const [editAgent, setEditAgent] = useState<Agent | null>(null);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agents");
      if (res.ok) setAgents(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const deleteAgent = async (id: string) => {
    await fetch(`/api/agents?id=${id}`, { method: "DELETE" });
    setAgents((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleStatus = async (agent: Agent) => {
    const newStatus = agent.status === "paused" ? "idle" : "paused";
    const res = await fetch(`/api/agents?id=${agent.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setAgents((prev) => prev.map((a) => (a.id === agent.id ? { ...a, status: newStatus } : a)));
    }
  };

  const runAgent = async (agent: Agent) => {
    if (runningId) return;
    setRunningId(agent.id);
    setRunOutput({ agent, content: "", done: false });

    try {
      const res = await fetch(`/api/agents/run?id=${agent.id}`, { method: "POST" });
      if (!res.ok || !res.body) throw new Error("Run failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setRunOutput({ agent, content: accumulated, done: false });
      }

      setRunOutput({ agent, content: accumulated, done: true });
      // Refresh agent list to update run count/last run
      loadAgents();
    } catch {
      setRunOutput((prev) => prev ? { ...prev, content: prev.content || "Run failed. Please try again.", done: true } : null);
    } finally {
      setRunningId(null);
    }
  };

  const activeCount = agents.filter((a) => a.status === "active").length;
  const totalRuns = agents.reduce((sum, a) => sum + (a.run_count ?? 0), 0);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-3">
        {[
          { label: "Active Agents", value: loading ? "—" : String(activeCount), icon: Activity, color: "#4afa98" },
          { label: "Total Runs", value: loading ? "—" : totalRuns > 999 ? `${(totalRuns / 1000).toFixed(1)}k` : String(totalRuns), icon: Zap, color: "#60a5fa" },
          { label: "Agents Built", value: loading ? "—" : String(agents.length), icon: Clock, color: "#c084fc" },
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

      {/* Agent list */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-xl border border-ivy-border bg-ivy-surface overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-ivy-border">
          <div className="text-sm font-semibold text-ivy-text">Your Agents</div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ivy-green/10 hover:bg-ivy-green/15 text-ivy-green text-xs font-medium border border-ivy-green/20 transition-colors"
          >
            <Plus size={12} />
            New Agent
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={18} className="text-ivy-text-muted animate-spin" />
          </div>
        )}

        {!loading && agents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-ivy-dark border border-ivy-border flex items-center justify-center mb-4">
              <Bot size={22} className="text-ivy-text-muted" />
            </div>
            <div className="text-sm font-semibold text-ivy-text mb-1.5">No agents deployed yet</div>
            <p className="text-xs text-ivy-text-muted max-w-xs leading-relaxed mb-5">
              Build an agent with custom instructions, then run it with one click. Agents use Llama models via Groq.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ivy-green/10 hover:bg-ivy-green/15 text-ivy-green text-sm font-medium border border-ivy-green/20 transition-colors"
            >
              <Plus size={14} />
              Build your first agent
            </button>
          </div>
        )}

        {!loading && agents.length > 0 && (
          <div className="divide-y divide-ivy-border">
            {agents.map((agent, i) => {
              const config = STATUS_CONFIG[agent.status] ?? STATUS_CONFIG.idle;
              const isRunning = runningId === agent.id;
              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-ivy-dark/40 transition-colors group"
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${config.dot}`} />

                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${agent.color}15` }}>
                    <Bot size={15} style={{ color: agent.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-ivy-text">{agent.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${config.badge}`}>{config.label}</span>
                    </div>
                    {agent.description && (
                      <p className="text-xs text-ivy-text-muted truncate">{agent.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] text-ivy-text-muted">{agent.run_count ?? 0} runs</span>
                      <span className="text-[10px] text-ivy-text-muted">Last: {timeAgo(agent.last_run)}</span>
                      <span className="text-[10px] text-ivy-text-muted truncate max-w-[140px]">
                        {MODELS.find((m) => m.id === agent.model)?.label ?? agent.model}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Run */}
                    <button
                      onClick={() => runAgent(agent)}
                      disabled={isRunning || !!runningId}
                      title="Run now"
                      className="p-1.5 rounded-lg text-ivy-green hover:bg-ivy-green/10 disabled:opacity-40 transition-colors"
                    >
                      {isRunning ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
                    </button>

                    {/* Pause/Resume */}
                    <button
                      onClick={() => toggleStatus(agent)}
                      title={agent.status === "paused" ? "Resume" : "Pause"}
                      className="p-1.5 rounded-lg text-ivy-text-muted hover:text-ivy-text hover:bg-ivy-surface-2 transition-colors"
                    >
                      {agent.status === "paused" ? <Play size={13} /> : <Pause size={13} />}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => setEditAgent(agent)}
                      title="Edit"
                      className="p-1.5 rounded-lg text-ivy-text-muted hover:text-ivy-text hover:bg-ivy-surface-2 transition-colors"
                    >
                      <Settings2 size={13} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteAgent(agent.id)}
                      title="Delete"
                      className="p-1.5 rounded-lg text-ivy-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>

                    <ChevronRight size={13} className="text-ivy-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Deploy CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onClick={() => setShowCreate(true)}
        className="flex items-center gap-4 p-5 rounded-xl border border-dashed border-ivy-border hover:border-ivy-green/30 transition-colors cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-ivy-surface group-hover:bg-ivy-green/5 flex items-center justify-center transition-colors">
          <Plus size={16} className="text-ivy-text-muted group-hover:text-ivy-green transition-colors" />
        </div>
        <div>
          <div className="text-sm font-medium text-ivy-text">Deploy a new agent</div>
          <div className="text-xs text-ivy-text-muted">Use a template or build from scratch</div>
        </div>
        <ChevronRight size={14} className="text-ivy-text-muted ml-auto" />
      </motion.div>

      {/* Create / Edit modal */}
      <AnimatePresence>
        {(showCreate || editAgent) && (
          <AgentFormModal
            agent={editAgent}
            onClose={() => { setShowCreate(false); setEditAgent(null); }}
            onSave={(agent) => {
              if (editAgent) {
                setAgents((prev) => prev.map((a) => (a.id === agent.id ? { ...a, ...agent } : a)));
              } else {
                setAgents((prev) => [agent, ...prev]);
              }
              setShowCreate(false);
              setEditAgent(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Run output modal */}
      <AnimatePresence>
        {runOutput && (
          <RunOutputModal
            agent={runOutput.agent}
            content={runOutput.content}
            done={runOutput.done}
            onClose={() => setRunOutput(null)}
            onRerun={() => { setRunOutput(null); runAgent(runOutput.agent); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AgentFormModal({
  agent,
  onClose,
  onSave,
}: {
  agent: Agent | null;
  onClose: () => void;
  onSave: (a: Agent) => void;
}) {
  const isEdit = !!agent;
  const [name, setName] = useState(agent?.name ?? "");
  const [description, setDescription] = useState(agent?.description ?? "");
  const [instructions, setInstructions] = useState(agent?.instructions ?? "");
  const [model, setModel] = useState(agent?.model ?? "llama-3.3-70b-versatile");
  const [color, setColor] = useState(agent?.color ?? "#4afa98");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const applyTemplate = (t: typeof TEMPLATES[0]) => {
    setSelectedTemplate(t.id);
    setInstructions(t.instructions);
    setColor(t.color);
    if (!name && t.id !== "custom") setName(t.label + " Agent");
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const body = { name: name.trim(), description: description.trim(), instructions, model, color };
      const res = isEdit
        ? await fetch(`/api/agents?id=${agent!.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        : await fetch("/api/agents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) {
        const data = await res.json();
        onSave(data);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl rounded-2xl bg-ivy-surface border border-ivy-border shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ivy-border">
          <h2 className="text-base font-semibold text-ivy-text">{isEdit ? "Edit Agent" : "New Agent"}</h2>
          <button onClick={onClose} className="p-1 text-ivy-text-muted hover:text-ivy-text transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Templates (only on create) */}
          {!isEdit && (
            <div>
              <label className="text-xs font-medium text-ivy-text-muted block mb-2">Start from a template</label>
              <div className="grid grid-cols-5 gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => applyTemplate(t)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                      selectedTemplate === t.id
                        ? "border-current text-current bg-current/10"
                        : "border-ivy-border text-ivy-text-muted hover:border-ivy-border-light"
                    }`}
                    style={selectedTemplate === t.id ? { color: t.color, borderColor: `${t.color}40`, backgroundColor: `${t.color}10` } : {}}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="text-xs font-medium text-ivy-text-muted block mb-1.5">Agent Name *</label>
            <input
              autoFocus={!isEdit}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Daily Research Briefing"
              className="w-full px-3 py-2 text-sm bg-ivy-dark border border-ivy-border rounded-xl text-ivy-text placeholder:text-ivy-text-muted outline-none focus:border-ivy-border-light transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-ivy-text-muted block mb-1.5">Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this agent do?"
              className="w-full px-3 py-2 text-sm bg-ivy-dark border border-ivy-border rounded-xl text-ivy-text placeholder:text-ivy-text-muted outline-none focus:border-ivy-border-light transition-colors"
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="text-xs font-medium text-ivy-text-muted block mb-1.5">
              Instructions
              <span className="ml-1.5 text-ivy-text-muted font-normal">(the agent&apos;s system prompt)</span>
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Describe exactly what this agent should do when run. Be specific about its role, format of output, and what it should focus on..."
              rows={6}
              className="w-full px-3 py-2.5 text-sm bg-ivy-dark border border-ivy-border rounded-xl text-ivy-text placeholder:text-ivy-text-muted outline-none focus:border-ivy-border-light transition-colors resize-none font-mono leading-relaxed"
            />
          </div>

          {/* Model + Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-ivy-text-muted block mb-1.5">Model</label>
              <div className="space-y-1">
                {MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setModel(m.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                      model === m.id ? "bg-ivy-green/10 text-ivy-green border border-ivy-green/20" : "text-ivy-text-muted hover:text-ivy-text border border-transparent hover:bg-ivy-dark"
                    }`}
                  >
                    <span>{m.label}</span>
                    {model === m.id && <Check size={11} />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-ivy-text-muted block mb-1.5">Color</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-full transition-all ${color === c ? "ring-2 ring-offset-2 ring-offset-ivy-surface scale-110" : ""}`}
                    style={{ backgroundColor: c, ringColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-ivy-border">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-ivy-border text-sm text-ivy-text-muted hover:text-ivy-text transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || saving}
            className="flex-1 py-2 rounded-xl bg-ivy-green text-ivy-black text-sm font-semibold hover:bg-ivy-green-dim disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {saving && <Loader2 size={13} className="animate-spin" />}
            {isEdit ? "Save changes" : "Create Agent"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function RunOutputModal({
  agent,
  content,
  done,
  onClose,
  onRerun,
}: {
  agent: Agent;
  content: string;
  done: boolean;
  onClose: () => void;
  onRerun: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={done ? onClose : undefined} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl rounded-2xl bg-ivy-surface border border-ivy-border shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-ivy-border">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${agent.color}15` }}>
            <Bot size={14} style={{ color: agent.color }} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-ivy-text">{agent.name}</div>
            <div className="text-[10px] text-ivy-text-muted flex items-center gap-1.5">
              {!done ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-ivy-green animate-pulse" />
                  Running...
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-ivy-green" />
                  Complete
                </>
              )}
            </div>
          </div>
          {done && (
            <button onClick={onClose} className="p-1 text-ivy-text-muted hover:text-ivy-text transition-colors">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Output */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {content ? (
            <div className="text-sm text-ivy-text leading-relaxed whitespace-pre-wrap font-mono">
              {content}
              {!done && <span className="inline-block w-0.5 h-4 bg-ivy-green ml-0.5 animate-pulse align-middle" />}
            </div>
          ) : (
            <div className="flex items-center gap-3 text-ivy-text-muted">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Agent is thinking...</span>
            </div>
          )}
        </div>

        {/* Footer */}
        {done && (
          <div className="flex items-center gap-2 px-6 py-4 border-t border-ivy-border">
            <button
              onClick={copy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-ivy-border text-xs text-ivy-text-muted hover:text-ivy-text transition-colors"
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? "Copied" : "Copy output"}
            </button>
            <button
              onClick={onRerun}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-ivy-border text-xs text-ivy-text-muted hover:text-ivy-green transition-colors"
            >
              <RefreshCw size={11} />
              Run again
            </button>
            <div className="ml-auto flex items-center gap-1.5">
              <Sparkles size={11} className="text-ivy-green" />
              <span className="text-[10px] text-ivy-text-muted">Powered by Groq</span>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
