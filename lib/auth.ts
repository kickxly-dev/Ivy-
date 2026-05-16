import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { supabaseAdmin } from "./supabase";

const COOKIE = "ivy_session";
const TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

export type AuthUser = {
  id: string;
  email: string;
  role: string;
  full_name: string | null;
  use_case: string | null;
  onboarding_complete: boolean;
  created_at: string;
};

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const db = supabaseAdmin();
  await db.from("auth_sessions").insert({
    user_id: userId,
    token_hash: hashToken(token),
    expires_at: new Date(Date.now() + TTL_SECONDS * 1000).toISOString(),
  });
  return token;
}

export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: TTL_SECONDS,
    path: "/",
  });
}

export async function getSession(): Promise<AuthUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;

  const db = supabaseAdmin();
  const { data } = await db
    .from("auth_sessions")
    .select("user_id, expires_at, auth_users!inner(id, email, role, full_name, use_case, onboarding_complete, created_at)")
    .eq("token_hash", hashToken(token))
    .gt("expires_at", new Date().toISOString())
    .single();

  if (!data) return null;
  return (data as unknown as { auth_users: AuthUser }).auth_users;
}

export async function deleteSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) {
    const db = supabaseAdmin();
    await db.from("auth_sessions").delete().eq("token_hash", hashToken(token));
  }
  store.delete(COOKIE);
}
