"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Cpu,
  Palette,
  Shield,
  Check,
  Loader2,
  LogOut,
} from "lucide-react";
import { useUser, isAdmin } from "@/lib/user-context";
import { useRouter } from "next/navigation";

const settingsNav = [
  { id: "profile", icon: User, label: "Profile" },
  { id: "ai", icon: Cpu, label: "AI & Models" },
  { id: "notifications", icon: Bell, label: "Notifications" },
  { id: "appearance", icon: Palette, label: "Appearance" },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="flex h-full">
      {/* Settings sidebar */}
      <div className="w-52 flex-shrink-0 border-r border-ivy-border bg-ivy-dark p-3 space-y-0.5">
        {settingsNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? "bg-ivy-surface border border-ivy-border text-ivy-text"
                  : "text-ivy-text-muted hover:text-ivy-text hover:bg-ivy-surface/50"
              }`}
            >
              <Icon size={13} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Settings content */}
      <div className="flex-1 overflow-y-auto p-8">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="max-w-xl space-y-6"
        >
          {activeSection === "profile" && <ProfileSettings />}
          {activeSection === "ai" && <AISettings />}
          {activeSection === "notifications" && <NotificationSettings />}
          {activeSection === "appearance" && <AppearanceSettings />}
        </motion.div>
      </div>
    </div>
  );
}

function SettingsSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-ivy-text">{title}</h2>
        {description && <p className="text-sm text-ivy-text-muted mt-0.5">{description}</p>}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function SettingsField({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-ivy-border last:border-0">
      <div>
        <div className="text-sm font-medium text-ivy-text">{label}</div>
        {description && <div className="text-xs text-ivy-text-muted mt-0.5">{description}</div>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${on ? "bg-ivy-green" : "bg-ivy-border"}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200 ${on ? "left-4.5 translate-x-0.5" : "left-0.5"}`} />
    </button>
  );
}

function ProfileSettings() {
  const user = useUser();
  const admin = isAdmin(user);
  const router = useRouter();
  const [name, setName] = useState(user?.full_name ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const initial = name.trim() ? name.trim()[0].toUpperCase() : (user?.email?.[0]?.toUpperCase() ?? "?");

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/auth/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: name }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/sign-in");
  };

  return (
    <SettingsSection title="Profile" description="Manage your personal information.">
      {/* Avatar */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-ivy-surface border border-ivy-border">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-ivy-green/30 to-ivy-green/10 border border-ivy-green/20 flex items-center justify-center text-lg font-bold text-ivy-green">
          {initial}
        </div>
        <div>
          <div className="text-sm font-medium text-ivy-text">{name || user?.email}</div>
          <div className="text-xs text-ivy-text-muted">{user?.email}</div>
          {admin && (
            <div className="flex items-center gap-1 mt-1">
              <Shield size={10} className="text-ivy-green" />
              <span className="text-[10px] text-ivy-green font-medium">Admin</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-ivy-text-muted block mb-1.5">Full Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-3 py-2 text-sm bg-ivy-surface border border-ivy-border rounded-lg text-ivy-text placeholder:text-ivy-text-muted outline-none focus:border-ivy-border-light transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-ivy-text-muted block mb-1.5">Email</label>
          <input
            value={user?.email ?? ""}
            disabled
            className="w-full px-3 py-2 text-sm bg-ivy-dark border border-ivy-border rounded-lg text-ivy-text-muted outline-none cursor-not-allowed"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ivy-green text-ivy-black text-sm font-medium hover:bg-ivy-green-dim disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 size={13} className="animate-spin" /> : saved ? <Check size={13} /> : null}
          {saved ? "Saved" : "Save changes"}
        </button>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-ivy-border text-sm text-ivy-text-muted hover:text-red-400 hover:border-red-400/30 transition-colors"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </SettingsSection>
  );
}

function AISettings() {
  const models = [
    { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B", description: "Best for complex reasoning and long context" },
    { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B (Fast)", description: "Fastest responses, great for quick tasks" },
    { id: "llama-3.2-11b-vision-preview", label: "Llama 3.2 11B Vision", description: "Supports image understanding" },
  ];
  const [selectedModel, setSelectedModel] = useState("llama-3.3-70b-versatile");

  return (
    <SettingsSection title="AI & Models" description="Configure your preferred AI model and behavior.">
      <div>
        <div className="text-sm font-medium text-ivy-text mb-3">Default Model</div>
        <div className="space-y-1.5">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-xs transition-colors ${
                selectedModel === model.id
                  ? "bg-ivy-green/10 text-ivy-green border border-ivy-green/20"
                  : "text-ivy-text-muted hover:text-ivy-text hover:bg-ivy-surface border border-transparent"
              }`}
            >
              <div className="text-left">
                <div className="font-medium">{model.label}</div>
                <div className="text-[10px] opacity-70 mt-0.5">{model.description}</div>
              </div>
              {selectedModel === model.id && <Check size={12} className="flex-shrink-0 ml-2" />}
            </button>
          ))}
        </div>
      </div>
      <SettingsField label="Persistent Memory" description="Remember context across sessions">
        <Toggle defaultChecked />
      </SettingsField>
      <SettingsField label="Code Execution" description="Allow agents to run code in sandbox">
        <Toggle defaultChecked />
      </SettingsField>
    </SettingsSection>
  );
}

function NotificationSettings() {
  return (
    <SettingsSection title="Notifications" description="Control how and when you receive notifications.">
      <SettingsField label="Agent Completions" description="Notify when agents finish tasks">
        <Toggle defaultChecked />
      </SettingsField>
      <SettingsField label="Weekly Summary" description="AI-generated weekly digest">
        <Toggle defaultChecked />
      </SettingsField>
      <SettingsField label="System Alerts" description="Critical system notifications">
        <Toggle defaultChecked />
      </SettingsField>
    </SettingsSection>
  );
}

function AppearanceSettings() {
  return (
    <SettingsSection title="Appearance" description="Customize the look and feel of Ivy.">
      <div>
        <div className="text-sm font-medium text-ivy-text mb-3">Theme</div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: "Dark", active: true },
            { name: "Darker", active: false },
            { name: "System", active: false },
          ].map((theme) => (
            <button
              key={theme.name}
              className={`py-3 px-4 rounded-xl text-xs font-medium border transition-all ${
                theme.active
                  ? "border-ivy-green/40 bg-ivy-green/10 text-ivy-green"
                  : "border-ivy-border bg-ivy-surface text-ivy-text-muted hover:border-ivy-border-light"
              }`}
            >
              {theme.name}
              {theme.active && <Check size={10} className="inline ml-1.5" />}
            </button>
          ))}
        </div>
      </div>
      <SettingsField label="Compact Mode" description="Reduce spacing for denser layout">
        <Toggle />
      </SettingsField>
      <SettingsField label="Motion Animations" description="Enable smooth transitions">
        <Toggle defaultChecked />
      </SettingsField>
    </SettingsSection>
  );
}
