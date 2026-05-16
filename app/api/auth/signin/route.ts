import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";
import { createSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email?.trim() || !password) return new Response("Email and password required", { status: 400 });

  const db = supabaseAdmin();
  const { data: user } = await db
    .from("auth_users")
    .select("id, email, role, full_name, use_case, onboarding_complete, created_at, password_hash")
    .eq("email", email.trim().toLowerCase())
    .single();

  // Constant-time comparison to prevent timing attacks
  const dummyHash = "$2a$12$dummyhashfordummycomparison000000000000000000000000000";
  const valid = user
    ? await bcrypt.compare(password, user.password_hash)
    : await bcrypt.compare(password, dummyHash);

  if (!user || !valid) return new Response("Invalid email or password", { status: 401 });

  const token = await createSession(user.id);
  await setSessionCookie(token);

  const { password_hash, ...safeUser } = user;
  void password_hash;
  return Response.json(safeUser);
}
