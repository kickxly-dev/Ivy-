import { createClient } from "@supabase/supabase-js";

function getEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing env var: ${key}`);
  return val;
}

// Server-side Supabase (service role — only call inside route handlers)
export function supabaseAdmin() {
  return createClient(
    getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Client-side Supabase (anon key, safe for browser)
export function getSupabase() {
  return createClient(
    getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
}

export type Profile = {
  id: string;
  clerk_id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  plan: string;
  created_at: string;
};

export type Project = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  color: string;
  starred: boolean;
  created_at: string;
  updated_at: string;
};

export type Conversation = {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  model: string;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  image_url: string | null;
  model: string | null;
  created_at: string;
};

export type IvyFile = {
  id: string;
  user_id: string;
  project_id: string | null;
  name: string;
  size: number | null;
  mime_type: string | null;
  storage_path: string;
  public_url: string | null;
  created_at: string;
};
