"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  Cpu,
  Palette,
  Key,
  ChevronRight,
  Check,
} from "lucide-react";

const settingsNav = [
  { id: "profile", icon: User, label: "Profile" },
  { id: "ai", icon: Cpu, label: "AI & Models" },
  { id: "notifications", icon: Bell, label: "Notifications" },
  { id: "appearance", icon: Palette, label: "Appearance" },
  { id: "security", icon: Shield, label: "Security" },
  { id: "api", icon: Key, label: "API Keys" },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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
          {activeSection === "profile" && <ProfileSettings onSave={handleSave} />}
          {activeSection === "ai" && <AISettings onSave={handleSave} />}
          {activeSection === "notifications" && <NotificationSettings onSave={handleSave} />}
          {activeSection === "appearance" && <AppearanceSettings onSave={handleSave} />}
          {activeSection === "security" && <SecuritySettings onSave={handleSave} />}
          {activeSection === "api" && <APISettings onSave={handleSave} />}
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

function ProfileSettings({ onSave }: { onSave: () => void }) {
  return (
    <SettingsSection title="Profile" description="Manage your personal information and preferences.">
      {/* Avatar */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-ivy-surface border border-ivy-border">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-ivy-green/30 to-ivy-green/10 border border-ivy-green/20 flex items-center justify-center text-lg font-bold text-ivy-green">
          A
        </div>
        <div>
          <div className="text-sm font-medium text-ivy-text">Alex Chen</div>
          <div className="text-xs text-ivy-text-muted">alex@example.com</div>
          <button className="text-xs text-ivy-green hover:text-ivy-green-dim transition-colors mt-1">
            Change avatar
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { label: "Full Name", value: "Alex Chen" },
          { label: "Email", value: "alex@example.com" },
          { label: "Username", value: "@alexchen" },
        ].map((field) => (
          <div key={field.label}>
            <label className="text-xs font-medium text-ivy-text-muted block mb-1.5">{field.label}</label>
            <input
              defaultValue={field.value}
              className="w-full px-3 py-2 text-sm bg-ivy-surface border border-ivy-border rounded-lg text-ivy-text outline-none focus:border-ivy-border-light transition-colors"
            />
          </div>
        ))}
      </div>

      <button
        onClick={onSave}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ivy-green text-ivy-black text-sm font-medium hover:bg-ivy-green-dim transition-colors"
      >
        Save changes
      </button>
    </SettingsSection>
  );
}

function AISettings({ onSave }: { onSave: () => void }) {
  const models = ["Claude 3.5 Sonnet", "GPT-4o", "Gemini Pro", "Auto (Smart Routing)"];
  const [selectedModel, setSelectedModel] = useState("Claude 3.5 Sonnet");

  return (
    <SettingsSection title="AI & Models" description="Configure AI model preferences and behavior.">
      <SettingsField label="Default Model" description="Used for new chat sessions">
        <div className="space-y-1">
          {models.map((model) => (
            <button
              key={model}
              onClick={() => setSelectedModel(model)}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs transition-colors ${
                selectedModel === model
                  ? "bg-ivy-green/10 text-ivy-green border border-ivy-green/20"
                  : "text-ivy-text-muted hover:text-ivy-text hover:bg-ivy-surface border border-transparent"
              }`}
            >
              <span>{model}</span>
              {selectedModel === model && <Check size={12} />}
            </button>
          ))}
        </div>
      </SettingsField>
      <SettingsField label="Persistent Memory" description="Remember context across sessions">
        <Toggle defaultChecked />
      </SettingsField>
      <SettingsField label="Smart Model Routing" description="Automatically select best model for each task">
        <Toggle />
      </SettingsField>
      <SettingsField label="Code Execution" description="Allow agents to run code in sandbox">
        <Toggle defaultChecked />
      </SettingsField>
    </SettingsSection>
  );
}

function NotificationSettings({ onSave }: { onSave: () => void }) {
  return (
    <SettingsSection title="Notifications" description="Control how and when you receive notifications.">
      <SettingsField label="Agent Completions" description="Notify when agents finish tasks">
        <Toggle defaultChecked />
      </SettingsField>
      <SettingsField label="Weekly Summary" description="AI-generated weekly digest">
        <Toggle defaultChecked />
      </SettingsField>
      <SettingsField label="Team Activity" description="Updates from shared workspaces">
        <Toggle />
      </SettingsField>
      <SettingsField label="System Alerts" description="Critical system notifications">
        <Toggle defaultChecked />
      </SettingsField>
    </SettingsSection>
  );
}

function AppearanceSettings({ onSave }: { onSave: () => void }) {
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

function SecuritySettings({ onSave }: { onSave: () => void }) {
  return (
    <SettingsSection title="Security" description="Manage your account security settings.">
      <div className="p-4 rounded-xl bg-ivy-surface border border-ivy-border space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-ivy-text">Two-Factor Authentication</div>
            <div className="text-xs text-ivy-text-muted mt-0.5">Add an extra layer of security</div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            Not enabled
          </span>
        </div>
        <button className="text-sm text-ivy-green hover:text-ivy-green-dim transition-colors flex items-center gap-1">
          Enable 2FA <ChevronRight size={13} />
        </button>
      </div>

      <div className="p-4 rounded-xl bg-ivy-surface border border-ivy-border">
        <div className="text-sm font-medium text-ivy-text mb-3">Active Sessions</div>
        {[
          { device: "MacBook Pro 16\"", location: "San Francisco, CA", current: true },
          { device: "iPhone 15 Pro", location: "San Francisco, CA", current: false },
        ].map((session, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-ivy-border last:border-0">
            <div>
              <div className="text-xs text-ivy-text">{session.device}</div>
              <div className="text-[10px] text-ivy-text-muted">{session.location}</div>
            </div>
            {session.current ? (
              <span className="text-[10px] text-ivy-green">Current</span>
            ) : (
              <button className="text-[10px] text-red-400 hover:text-red-300 transition-colors">Revoke</button>
            )}
          </div>
        ))}
      </div>
    </SettingsSection>
  );
}

function APISettings({ onSave }: { onSave: () => void }) {
  return (
    <SettingsSection title="API Keys" description="Manage API keys for external integrations.">
      <div className="p-4 rounded-xl bg-ivy-surface border border-ivy-border space-y-3">
        <div className="text-xs font-semibold text-ivy-text uppercase tracking-wider">Your API Key</div>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-3 py-2 rounded-lg bg-ivy-dark border border-ivy-border text-xs text-ivy-text-muted font-mono">
            ivy_sk_••••••••••••••••••••••••••••••••
          </code>
          <button className="px-3 py-2 rounded-lg border border-ivy-border text-xs text-ivy-text-muted hover:text-ivy-text transition-colors">
            Reveal
          </button>
        </div>
        <button className="text-xs text-ivy-green hover:text-ivy-green-dim transition-colors">
          Regenerate key
        </button>
      </div>

      <div className="p-4 rounded-xl bg-ivy-surface border border-ivy-border">
        <div className="text-xs font-semibold text-ivy-text uppercase tracking-wider mb-3">Connected Providers</div>
        {[
          { name: "Anthropic", status: "connected" },
          { name: "OpenAI", status: "connected" },
          { name: "Google AI", status: "not connected" },
        ].map((provider) => (
          <div key={provider.name} className="flex items-center justify-between py-2 border-b border-ivy-border last:border-0">
            <span className="text-sm text-ivy-text">{provider.name}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
              provider.status === "connected"
                ? "bg-ivy-green/10 text-ivy-green border-ivy-green/20"
                : "bg-ivy-surface text-ivy-text-muted border-ivy-border"
            }`}>
              {provider.status}
            </span>
          </div>
        ))}
      </div>
    </SettingsSection>
  );
}
