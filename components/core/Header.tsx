"use client";

import { Bell, PanelLeftClose, PanelLeftOpen, Plus, Command } from "lucide-react";
import { motion } from "framer-motion";

interface HeaderProps {
  title: string;
  subtitle?: string;
  sidebarCollapsed: boolean;
  onSidebarToggle: () => void;
}

export default function Header({ title, subtitle, sidebarCollapsed, onSidebarToggle }: HeaderProps) {
  return (
    <header className="h-14 border-b border-ivy-border bg-ivy-dark/80 backdrop-blur-sm flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onSidebarToggle}
          className="p-1.5 rounded-lg text-ivy-text-muted hover:text-ivy-text hover:bg-ivy-surface transition-colors"
        >
          {sidebarCollapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
        </button>
        <div className="h-4 w-px bg-ivy-border" />
        <div>
          <h1 className="text-sm font-semibold text-ivy-text">{title}</h1>
          {subtitle && <p className="text-[10px] text-ivy-text-muted">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Quick action */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ivy-green/10 hover:bg-ivy-green/15 text-ivy-green text-xs font-medium transition-colors border border-ivy-green/20">
          <Plus size={12} />
          New
        </button>

        {/* Notifications */}
        <button className="relative p-1.5 rounded-lg text-ivy-text-muted hover:text-ivy-text hover:bg-ivy-surface transition-colors">
          <Bell size={15} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-ivy-green" />
        </button>

        {/* Command palette hint */}
        <button className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-ivy-border text-ivy-text-muted text-[11px] hover:border-ivy-border-light transition-colors">
          <Command size={11} />
          <span>K</span>
        </button>
      </div>
    </header>
  );
}
