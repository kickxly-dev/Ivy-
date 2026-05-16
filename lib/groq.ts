import Groq from "groq-sdk";

let _groq: Groq | null = null;

export function getGroq(): Groq {
  if (!_groq) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY is not set");
    _groq = new Groq({ apiKey });
  }
  return _groq;
}

export const MODELS = {
  fast: "llama-3.1-8b-instant",
  balanced: "llama-3.3-70b-versatile",
  vision: "llama-3.2-11b-vision-preview",
} as const;

export type ModelKey = keyof typeof MODELS;
export type ModelId = (typeof MODELS)[ModelKey];

export const MODEL_LABELS: Record<ModelId, string> = {
  "llama-3.1-8b-instant": "Llama 3.1 8B (Fast)",
  "llama-3.3-70b-versatile": "Llama 3.3 70B",
  "llama-3.2-11b-vision-preview": "Llama 3.2 Vision",
};

export const SYSTEM_PROMPT = `You are Ivy, an AI-native workspace assistant. You are intelligent, concise, and helpful. You assist users with their projects, files, research, and productivity tasks. You have access to the user's workspace context. Be direct and useful — avoid filler phrases. Format your responses clearly using markdown when helpful.`;
