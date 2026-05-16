"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  ChevronDown,
  Copy,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  X,
  ImageIcon,
  Plus,
  Trash2,
} from "lucide-react";
import Image from "next/image";

const MODELS = [
  { id: "balanced", label: "Llama 3.3 70B", description: "Best for complex reasoning" },
  { id: "fast", label: "Llama 3.1 8B", description: "Fastest responses" },
  { id: "vision", label: "Llama 3.2 Vision", description: "For image analysis" },
] as const;

type ModelId = (typeof MODELS)[number]["id"];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  pending?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  model: string;
  updated_at: string;
}

const SUGGESTIONS = [
  "Analyze this image and describe what you see",
  "Help me write a product requirements document",
  "Summarize my recent projects",
  "Create a research outline on AI trends",
];

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelId>("balanced");
  const [modelOpen, setModelOpen] = useState(false);
  const [pendingImage, setPendingImage] = useState<{ file: File; previewUrl: string } | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch {}
  };

  const loadMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/messages?conversationId=${convId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(
          data.map((m: { id: string; role: "user" | "assistant"; content: string; image_url?: string }) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            imageUrl: m.image_url ?? undefined,
          }))
        );
      }
    } catch {}
  };

  const createConversation = async (): Promise<string | null> => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Chat", model: selectedModel }),
      });
      if (res.ok) {
        const data = await res.json();
        setConversations((prev) => [data, ...prev]);
        return data.id;
      }
    } catch {}
    return null;
  };

  const selectConversation = (conv: Conversation) => {
    setActiveConvId(conv.id);
    loadMessages(conv.id);
  };

  const newChat = () => {
    setActiveConvId(null);
    setMessages([]);
    setPendingImage(null);
    setUploadedImageUrl(null);
  };

  const deleteConversation = async (e: React.MouseEvent, convId: string) => {
    e.stopPropagation();
    await fetch(`/api/conversations?id=${convId}`, { method: "DELETE" });
    setConversations((prev) => prev.filter((c) => c.id !== convId));
    if (activeConvId === convId) newChat();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setPendingImage({ file, previewUrl });
    setSelectedModel("vision");
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!pendingImage) return null;
    const form = new FormData();
    form.append("file", pendingImage.file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (res.ok) {
        const data = await res.json();
        return data.url;
      }
    } catch {}
    return null;
  };

  const handleSend = async () => {
    if ((!input.trim() && !pendingImage) || isLoading) return;

    let convId = activeConvId;
    if (!convId) {
      convId = await createConversation();
      if (!convId) return;
      setActiveConvId(convId);
    }

    // Upload image if pending
    let imageUrl = uploadedImageUrl;
    if (pendingImage && !imageUrl) {
      imageUrl = await uploadImage();
      setUploadedImageUrl(imageUrl);
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      imageUrl: pendingImage?.previewUrl,
    };

    const aiMsgId = (Date.now() + 1).toString();
    const aiMsg: Message = { id: aiMsgId, role: "assistant", content: "", pending: true };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setPendingImage(null);
    setUploadedImageUrl(null);
    const sentInput = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => !m.pending)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...history, { role: "user", content: sentInput }],
          conversationId: convId,
          model: selectedModel,
          imageUrl,
        }),
      });

      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, content: accumulated, pending: false } : m))
        );
      }

      // Refresh conversation list to update title/timestamp
      loadConversations();
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId
            ? { ...m, content: "Something went wrong. Please try again.", pending: false }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSend();
  };

  const copyMessage = (content: string) => navigator.clipboard.writeText(content);

  const activeModel = MODELS.find((m) => m.id === selectedModel)!;
  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full bg-ivy-black">
      {/* Conversation sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 220, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0 border-r border-ivy-border bg-ivy-dark overflow-hidden"
          >
            <div className="flex flex-col h-full w-[220px]">
              <div className="p-3 border-b border-ivy-border">
                <button
                  onClick={newChat}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-ivy-green/10 hover:bg-ivy-green/15 text-ivy-green text-xs font-medium border border-ivy-green/20 transition-colors"
                >
                  <Plus size={12} />
                  New Chat
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => selectConversation(conv)}
                    className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      activeConvId === conv.id
                        ? "bg-ivy-surface border border-ivy-border text-ivy-text"
                        : "text-ivy-text-muted hover:text-ivy-text hover:bg-ivy-surface/50"
                    }`}
                  >
                    <span className="flex-1 text-xs truncate">{conv.title}</span>
                    <button
                      onClick={(e) => deleteConversation(e, conv.id)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
                {conversations.length === 0 && (
                  <p className="text-xs text-ivy-text-muted px-3 py-4 text-center">No conversations yet</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-ivy-border bg-ivy-dark/60">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-ivy-text-muted hover:text-ivy-text hover:bg-ivy-surface transition-colors text-xs"
          >
            {sidebarOpen ? "←" : "→"}
          </button>
          <span className="text-xs text-ivy-text-muted">
            {activeConvId
              ? conversations.find((c) => c.id === activeConvId)?.title ?? "Chat"
              : "New Chat"}
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {isEmpty && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-14 h-14 rounded-2xl bg-ivy-green/10 border border-ivy-green/20 flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={22} className="text-ivy-green" />
                </div>
                <h2 className="text-lg font-semibold text-ivy-text mb-2">How can I help you?</h2>
                <p className="text-sm text-ivy-text-muted mb-6">
                  Ask anything, upload an image, or give me a task.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChatBubble message={msg} onCopy={copyMessage} />
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && messages[messages.length - 1]?.content === "" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <div className="w-7 h-7 rounded-full bg-ivy-green/20 border border-ivy-green/20 flex items-center justify-center">
                  <Sparkles size={12} className="text-ivy-green" />
                </div>
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
              </motion.div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-ivy-border bg-ivy-dark/80 backdrop-blur-sm p-4">
          <div className="max-w-3xl mx-auto">
            {/* Image preview */}
            <AnimatePresence>
              {pendingImage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-2"
                >
                  <div className="relative inline-block">
                    <Image
                      src={pendingImage.previewUrl}
                      alt="Upload preview"
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-xl border border-ivy-border"
                    />
                    <button
                      onClick={() => { setPendingImage(null); setUploadedImageUrl(null); }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-ivy-dark border border-ivy-border flex items-center justify-center text-ivy-text-muted hover:text-ivy-text"
                    >
                      <X size={10} />
                    </button>
                    <div className="absolute bottom-1 left-1 right-1 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60">
                      <ImageIcon size={8} className="text-ivy-green" />
                      <span className="text-[9px] text-white truncate">{pendingImage.file.name}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative rounded-2xl border border-ivy-border bg-ivy-surface focus-within:border-ivy-border-light transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={pendingImage ? "Ask about this image..." : "Ask anything or give Ivy a task..."}
                rows={1}
                className="w-full resize-none bg-transparent px-4 pt-3.5 pb-12 text-sm text-ivy-text placeholder:text-ivy-text-muted outline-none"
                style={{ minHeight: 52, maxHeight: 200 }}
              />

              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 pb-3">
                <div className="flex items-center gap-1">
                  {/* Image upload */}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="p-1.5 rounded-lg text-ivy-text-muted hover:text-ivy-text hover:bg-ivy-dark transition-colors"
                    title="Upload image"
                  >
                    <Paperclip size={14} />
                  </button>

                  {/* Model selector */}
                  <div className="relative ml-1">
                    <button
                      onClick={() => setModelOpen(!modelOpen)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-ivy-border text-[11px] text-ivy-text-muted hover:text-ivy-text hover:border-ivy-border-light transition-colors"
                    >
                      <span>{activeModel.label}</span>
                      <ChevronDown size={10} />
                    </button>

                    <AnimatePresence>
                      {modelOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 4, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute bottom-full mb-2 left-0 w-56 rounded-xl border border-ivy-border bg-ivy-surface shadow-xl z-10 overflow-hidden"
                        >
                          {MODELS.map((model) => (
                            <button
                              key={model.id}
                              onClick={() => { setSelectedModel(model.id); setModelOpen(false); }}
                              className={`w-full flex flex-col px-3 py-2.5 text-left hover:bg-ivy-surface-2 transition-colors ${
                                model.id === selectedModel ? "bg-ivy-green/5" : ""
                              }`}
                            >
                              <span className={`text-xs font-medium ${model.id === selectedModel ? "text-ivy-green" : "text-ivy-text"}`}>
                                {model.label}
                              </span>
                              <span className="text-[10px] text-ivy-text-muted">{model.description}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-ivy-text-muted hidden sm:block">⌘↵ to send</span>
                  <button
                    onClick={handleSend}
                    disabled={(!input.trim() && !pendingImage) || isLoading}
                    className="flex items-center justify-center w-7 h-7 rounded-lg bg-ivy-green text-ivy-black hover:bg-ivy-green-dim disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <Send size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ message, onCopy }: { message: Message; onCopy: (s: string) => void }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-semibold mt-0.5 ${
          isUser
            ? "bg-ivy-surface-2 border border-ivy-border text-ivy-text-subtle"
            : "bg-ivy-green/20 border border-ivy-green/20"
        }`}
      >
        {isUser ? "U" : <Sparkles size={12} className="text-ivy-green" />}
      </div>

      <div className={`group max-w-[85%] flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
        {/* Image preview */}
        {message.imageUrl && (
          <Image
            src={message.imageUrl}
            alt="Attached"
            width={200}
            height={200}
            className="w-48 h-48 object-cover rounded-xl border border-ivy-border"
          />
        )}

        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-ivy-surface-2 border border-ivy-border text-ivy-text-subtle rounded-tr-sm"
              : "bg-ivy-surface border border-ivy-border text-ivy-text rounded-tl-sm"
          } ${message.pending ? "animate-pulse" : ""}`}
        >
          {message.content || (message.pending ? "..." : "")}
        </div>

        {!isUser && !message.pending && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button onClick={() => onCopy(message.content)} className="p-1 rounded text-ivy-text-muted hover:text-ivy-text transition-colors">
              <Copy size={11} />
            </button>
            <button className="p-1 rounded text-ivy-text-muted hover:text-ivy-green transition-colors">
              <ThumbsUp size={11} />
            </button>
            <button className="p-1 rounded text-ivy-text-muted hover:text-red-400 transition-colors">
              <ThumbsDown size={11} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
