"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HardDrive, Upload, Trash2, ImageIcon, FileText, File, Loader2, X } from "lucide-react";
import Image from "next/image";

type IvyFile = {
  id: string;
  name: string;
  size: number | null;
  mime_type: string | null;
  public_url: string | null;
  created_at: string;
};

function formatSize(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function FileTypeIcon({ mimeType }: { mimeType: string | null }) {
  if (mimeType?.startsWith("image/")) return <ImageIcon size={15} className="text-ivy-green" />;
  if (mimeType?.includes("pdf")) return <FileText size={15} className="text-red-400" />;
  if (mimeType?.includes("text")) return <FileText size={15} className="text-blue-400" />;
  return <File size={15} className="text-ivy-text-muted" />;
}

export default function DrivePage() {
  const [files, setFiles] = useState<IvyFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<IvyFile | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/files");
      if (res.ok) setFiles(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (res.ok) {
        const data = await res.json();
        setFiles((prev) => [data.file, ...prev]);
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const deleteFile = async (id: string) => {
    if (preview?.id === id) setPreview(null);
    await fetch(`/api/files?id=${id}`, { method: "DELETE" });
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const totalSize = files.reduce((acc, f) => acc + (f.size ?? 0), 0);

  return (
    <div
      className="flex h-full"
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      <AnimatePresence>
        {dragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none"
          >
            <div className="flex flex-col items-center gap-3 p-10 rounded-2xl border-2 border-dashed border-ivy-green bg-ivy-green/5">
              <Upload size={32} className="text-ivy-green" />
              <span className="text-ivy-green font-semibold">Drop to upload</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="flex-1">
            <p className="text-xs text-ivy-text-muted">
              {files.length} file{files.length !== 1 ? "s" : ""} · {formatSize(totalSize)} used
            </p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handleFileInput}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ivy-green/10 hover:bg-ivy-green/15 text-ivy-green text-sm font-medium border border-ivy-green/20 transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            Upload
          </button>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={20} className="text-ivy-text-muted animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && files.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-ivy-surface border border-ivy-border flex items-center justify-center">
              <HardDrive size={22} className="text-ivy-text-muted" />
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-ivy-text mb-1">No files yet</div>
              <p className="text-xs text-ivy-text-muted">Upload images to use them in chat, or drag & drop here</p>
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ivy-green/10 hover:bg-ivy-green/15 text-ivy-green text-sm font-medium border border-ivy-green/20 transition-colors"
            >
              <Upload size={14} />
              Upload your first file
            </button>
          </motion.div>
        )}

        {/* File table */}
        {!loading && files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-xl border border-ivy-border bg-ivy-surface overflow-hidden"
          >
            {/* Table header */}
            <div className="grid grid-cols-[40px_1fr_80px_100px_40px] text-[10px] text-ivy-text-muted uppercase tracking-wider font-semibold px-4 py-2.5 border-b border-ivy-border">
              <div />
              <div>Name</div>
              <div className="text-right">Size</div>
              <div className="text-right">Uploaded</div>
              <div />
            </div>

            {files.map((file, i) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => file.mime_type?.startsWith("image/") && setPreview(file)}
                className={`grid grid-cols-[40px_1fr_80px_100px_40px] items-center px-4 py-3 border-b border-ivy-border last:border-0 transition-colors group ${
                  file.mime_type?.startsWith("image/") ? "cursor-pointer hover:bg-ivy-dark/60" : "hover:bg-ivy-dark/40"
                }`}
              >
                {/* Thumbnail or icon */}
                <div className="flex items-center">
                  {file.mime_type?.startsWith("image/") && file.public_url ? (
                    <Image
                      src={file.public_url}
                      alt={file.name}
                      width={28}
                      height={28}
                      className="w-7 h-7 object-cover rounded-lg border border-ivy-border"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-ivy-dark border border-ivy-border flex items-center justify-center">
                      <FileTypeIcon mimeType={file.mime_type} />
                    </div>
                  )}
                </div>

                {/* Name & type */}
                <div className="min-w-0 px-3">
                  <div className="text-xs font-medium text-ivy-text truncate">{file.name}</div>
                  <div className="text-[10px] text-ivy-text-muted">{file.mime_type ?? "unknown"}</div>
                </div>

                <div className="text-right text-xs text-ivy-text-muted">{formatSize(file.size)}</div>
                <div className="text-right text-xs text-ivy-text-muted">{timeAgo(file.created_at)}</div>

                {/* Delete */}
                <div className="flex justify-end">
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }}
                    className="p-1.5 rounded-lg text-ivy-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <p className="text-[10px] text-ivy-text-muted text-center pb-2">
          Drag & drop anywhere to upload · Images only (max 10MB)
        </p>
      </div>

      {/* Preview panel */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0 border-l border-ivy-border bg-ivy-dark overflow-hidden"
          >
            <div className="w-[280px] flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-3 border-b border-ivy-border">
                <span className="text-xs font-semibold text-ivy-text">Preview</span>
                <button onClick={() => setPreview(null)} className="p-1 text-ivy-text-muted hover:text-ivy-text">
                  <X size={14} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {preview.public_url && (
                  <div className="rounded-xl overflow-hidden border border-ivy-border">
                    <Image
                      src={preview.public_url}
                      alt={preview.name}
                      width={248}
                      height={248}
                      className="w-full object-cover"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  {[
                    { label: "Name", value: preview.name },
                    { label: "Type", value: preview.mime_type ?? "—" },
                    { label: "Size", value: formatSize(preview.size) },
                    { label: "Uploaded", value: timeAgo(preview.created_at) },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div className="text-[10px] text-ivy-text-muted uppercase tracking-wider mb-0.5">{label}</div>
                      <div className="text-xs text-ivy-text break-all">{value}</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => deleteFile(preview.id)}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-red-400/20 text-red-400 text-xs hover:bg-red-400/5 transition-colors"
                >
                  <Trash2 size={12} />
                  Delete file
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
