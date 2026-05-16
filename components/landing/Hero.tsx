"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const HEADLINES = [
  "The AI-native workspace.",
  "Intelligence, integrated.",
  "The operating layer for AI.",
  "Your digital infrastructure.",
];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIndex((i) => (i + 1) % HEADLINES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden ivy-grid"
    >
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-ivy-green/[0.04] blur-[120px] pulse-glow" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-ivy-green/[0.03] blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-ivy-green/[0.02] blur-[80px]" />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto pt-28"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-ivy-green/20 bg-ivy-green/5 text-ivy-green text-xs font-medium tracking-wide">
            <Sparkles size={11} />
            Now in private beta
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]">
            <span className="text-ivy-text block mb-2">Built for the</span>
            <span className="ivy-gradient-green block">next generation</span>
            <span className="text-ivy-text block mt-1">of computing.</span>
          </h1>
        </motion.div>

        {/* Rotating subheadline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="h-8 mb-6 overflow-hidden relative"
        >
          <AnimatedHeadline text={HEADLINES[headlineIndex]} />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-ivy-text-muted text-lg md:text-xl max-w-2xl leading-relaxed mb-10"
        >
          Ivy unifies AI, cloud infrastructure, and intelligent workflows into
          one cohesive ecosystem. Organize, automate, and build — all from a
          single, intelligent workspace.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 items-center"
        >
          <Link
            href="/core"
            className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-ivy-green text-ivy-black font-semibold text-sm hover:bg-ivy-green-dim transition-all duration-300 hover:shadow-[0_0_30px_rgba(74,250,152,0.3)] hover:-translate-y-0.5"
          >
            Start for free
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
          <Link
            href="#product"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-ivy-border text-ivy-text-subtle text-sm hover:border-ivy-border-light hover:text-ivy-text transition-all duration-300 hover:-translate-y-0.5"
          >
            See how it works
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-8 text-xs text-ivy-text-muted"
        >
          Trusted by teams at leading AI companies
        </motion.p>

        {/* Hero preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 w-full max-w-5xl"
        >
          <HeroPreview />
        </motion.div>
      </motion.div>
    </section>
  );
}

function AnimatedHeadline({ text }: { text: string }) {
  return (
    <motion.p
      key={text}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="text-ivy-green font-mono text-sm tracking-widest uppercase absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
    >
      {text}
    </motion.p>
  );
}

function HeroPreview() {
  return (
    <div className="relative ivy-border-glow rounded-2xl overflow-hidden border border-ivy-border ivy-glass shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-ivy-border bg-ivy-surface">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-8 py-1 rounded-md bg-ivy-dark border border-ivy-border text-xs text-ivy-text-muted font-mono">
            app.ivy.ai/core
          </div>
        </div>
      </div>

      {/* App content */}
      <div className="flex h-[420px] md:h-[520px]">
        {/* Sidebar */}
        <div className="w-52 border-r border-ivy-border bg-ivy-dark flex-shrink-0 hidden md:flex flex-col">
          <div className="px-3 pt-4 pb-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ivy-surface">
              <div className="w-4 h-4 rounded bg-ivy-green/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-sm bg-ivy-green" />
              </div>
              <span className="text-xs text-ivy-text font-medium">Ivy Core</span>
            </div>
          </div>

          <div className="px-3 space-y-0.5">
            {[
              { label: "Dashboard", active: false },
              { label: "Chat", active: true },
              { label: "Projects", active: false },
              { label: "Files", active: false },
              { label: "Agents", active: false },
            ].map((item) => (
              <div
                key={item.label}
                className={`px-3 py-1.5 rounded-md text-xs cursor-pointer ${
                  item.active
                    ? "bg-ivy-green/10 text-ivy-green"
                    : "text-ivy-text-muted hover:text-ivy-text hover:bg-ivy-surface"
                }`}
              >
                {item.label}
              </div>
            ))}
          </div>

          <div className="mt-auto px-3 pb-4 space-y-1">
            <div className="text-[10px] text-ivy-text-muted uppercase tracking-wider px-3 mb-2">Workspaces</div>
            {["Research", "Dev", "Design"].map((ws) => (
              <div key={ws} className="px-3 py-1.5 rounded-md text-xs text-ivy-text-muted hover:text-ivy-text cursor-pointer flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-ivy-border-light" />
                {ws}
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden p-6 space-y-4">
            <ChatMessage
              role="user"
              content="Analyze the Q3 performance data and create a summary with key insights."
              delay={0}
            />
            <ChatMessage
              role="ai"
              content="I've analyzed your Q3 data. Here are the key insights: Revenue grew 34% YoY with the strongest performance in enterprise. Retention improved to 94.2%. Three critical optimization opportunities identified in the onboarding funnel."
              delay={0.1}
            />
            <ChatMessage
              role="user"
              content="Generate a visual report and schedule a team review."
              delay={0.2}
            />
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-ivy-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-ivy-green" />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ivy-surface border border-ivy-border text-xs text-ivy-text-subtle">
                  <span className="w-1.5 h-1.5 rounded-full bg-ivy-green animate-pulse" />
                  Generating report · Scheduling · Notifying team
                </div>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-ivy-border p-4">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-ivy-dark border border-ivy-border">
              <span className="text-xs text-ivy-text-muted flex-1">Ask anything or give Ivy a task...</span>
              <div className="px-2.5 py-1 rounded-md bg-ivy-green/10 text-ivy-green text-[10px] font-mono">⌘↵</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({
  role,
  content,
  delay,
}: {
  role: "user" | "ai";
  content: string;
  delay: number;
}) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-medium mt-0.5 ${
          isUser
            ? "bg-ivy-border-light text-ivy-text-subtle"
            : "bg-ivy-green/20 text-ivy-green"
        }`}
      >
        {isUser ? "U" : "I"}
      </div>
      <div
        className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
          isUser
            ? "bg-ivy-surface-2 text-ivy-text-subtle ml-auto"
            : "bg-ivy-surface border border-ivy-border text-ivy-text"
        }`}
      >
        {content}
      </div>
    </motion.div>
  );
}
