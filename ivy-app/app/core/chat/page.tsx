"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Mic,
  ChevronDown,
  Copy,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Globe,
} from "lucide-react";

const MODELS = [
  { id: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet", provider: "Anthropic" },
  { id: "gpt-4o", label: "GPT-4o", provider: "OpenAI" },
  { id: "gemini-pro", label: "Gemini Pro", provider: "Google" },
  { id: "llama-3", label: "Llama 3.1 70B", provider: "Open Source" },
];

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  model?: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "ai",
    content:
      "Hello! I'm Ivy, your AI workspace assistant. I have access to your files, projects, and memory context. What would you like to work on today?",
    timestamp: new Date(),
    model: "claude-3-5-sonnet",
  },
];

const SUGGESTIONS = [
  "Summarize my recent projects",
  "Help me draft a product brief",
  "Analyze my Q3 data",
  "Create a research outline",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [modelOpen, setModelOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "ai",
      content: generateResponse(input.trim()),
      timestamp: new Date(),
      model: selectedModel.id,
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-ivy-black">
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-14 h-14 rounded-2xl bg-ivy-green/10 border border-ivy-green/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={22} className="text-ivy-green" />
              </div>
              <h2 className="text-lg font-semibold text-ivy-text mb-2">How can I help you?</h2>
              <p className="text-sm text-ivy-text-muted mb-6">
                I have access to your workspace, memory, and files.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="text-left text-xs px-4 py-3 rounded-xl border border-ivy-border bg-ivy-surface hover:border-ivy-border-light hover:bg-ivy-surface-2 text-ivy-text-subtle hover:text-ivy-text transition-all duration-200"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChatBubble message={msg} />
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3"
            >
              <div className="w-7 h-7 rounded-full bg-ivy-green/20 border border-ivy-green/20 flex items-center justify-center flex-shrink-0">
                <Sparkles size={12} className="text-ivy-green" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-ivy-surface border border-ivy-border">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-ivy-green/60"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-ivy-border bg-ivy-dark/80 backdrop-blur-sm p-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl border border-ivy-border bg-ivy-surface focus-within:border-ivy-border-light transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything or give Ivy a task..."
              rows={1}
              className="w-full resize-none bg-transparent px-4 pt-3.5 pb-12 text-sm text-ivy-text placeholder:text-ivy-text-muted outline-none"
              style={{ minHeight: 52, maxHeight: 200 }}
            />

            {/* Bottom toolbar */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 pb-3">
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg text-ivy-text-muted hover:text-ivy-text hover:bg-ivy-dark transition-colors">
                  <Paperclip size={14} />
                </button>
                <button className="p-1.5 rounded-lg text-ivy-text-muted hover:text-ivy-text hover:bg-ivy-dark transition-colors">
                  <Globe size={14} />
                </button>
                <button className="p-1.5 rounded-lg text-ivy-text-muted hover:text-ivy-text hover:bg-ivy-dark transition-colors">
                  <Mic size={14} />
                </button>

                {/* Model selector */}
                <div className="relative ml-1">
                  <button
                    onClick={() => setModelOpen(!modelOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-ivy-border text-[11px] text-ivy-text-muted hover:text-ivy-text hover:border-ivy-border-light transition-colors"
                  >
                    <span>{selectedModel.label}</span>
                    <ChevronDown size={10} />
                  </button>

                  <AnimatePresence>
                    {modelOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full mb-2 left-0 w-52 rounded-xl border border-ivy-border bg-ivy-surface shadow-xl z-10"
                      >
                        {MODELS.map((model) => (
                          <button
                            key={model.id}
                            onClick={() => {
                              setSelectedModel(model);
                              setModelOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-xs first:rounded-t-xl last:rounded-b-xl hover:bg-ivy-surface-2 transition-colors ${
                              model.id === selectedModel.id ? "text-ivy-green" : "text-ivy-text-subtle"
                            }`}
                          >
                            <span>{model.label}</span>
                            <span className="text-ivy-text-muted text-[10px]">{model.provider}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-ivy-text-muted hidden sm:block">⌘↵</span>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="flex items-center justify-center w-7 h-7 rounded-lg bg-ivy-green text-ivy-black hover:bg-ivy-green-dim disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 disabled:hover:bg-ivy-green"
                >
                  <Send size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-semibold mt-0.5 ${
          isUser
            ? "bg-ivy-surface-2 border border-ivy-border text-ivy-text-subtle"
            : "bg-ivy-green/20 border border-ivy-green/20"
        }`}
      >
        {isUser ? "A" : <Sparkles size={12} className="text-ivy-green" />}
      </div>

      {/* Bubble */}
      <div className={`group max-w-[85%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1.5`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-ivy-surface-2 border border-ivy-border text-ivy-text-subtle rounded-tr-sm"
              : "bg-ivy-surface border border-ivy-border text-ivy-text rounded-tl-sm"
          }`}
        >
          {message.content}
        </div>

        {/* Message actions (AI only) */}
        {!isUser && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button className="p-1 rounded text-ivy-text-muted hover:text-ivy-text transition-colors">
              <Copy size={11} />
            </button>
            <button className="p-1 rounded text-ivy-text-muted hover:text-ivy-text transition-colors">
              <RefreshCw size={11} />
            </button>
            <button className="p-1 rounded text-ivy-text-muted hover:text-ivy-green transition-colors">
              <ThumbsUp size={11} />
            </button>
            <button className="p-1 rounded text-ivy-text-muted hover:text-red-400 transition-colors">
              <ThumbsDown size={11} />
            </button>
            {message.model && (
              <span className="text-[10px] text-ivy-text-muted ml-1 font-mono">{message.model}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function generateResponse(input: string): string {
  const responses = [
    "I've analyzed your request and here's what I found: Based on your workspace context and recent activity, I can see several key patterns that align with your goals. Let me break this down into actionable insights for you.",
    "Great question! Drawing from your project history and the files you've indexed, I've identified three main areas to address. I'll walk you through each one systematically to ensure nothing is missed.",
    "I've processed this using your workspace memory. Here's a comprehensive summary: Your recent work shows strong momentum in the core areas, with some optimization opportunities in the workflow pipeline that could save you significant time.",
    "Based on the context from your recent sessions, I can provide a tailored analysis. The data points to several important considerations that will directly impact your decision-making here.",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}
