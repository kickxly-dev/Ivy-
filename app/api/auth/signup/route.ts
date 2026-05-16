import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";
import { createSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email?.trim() || !password) return new Response("Email and password required", { status: 400 });
  if (password.length < 8) return new Response("Password must be at least 8 characters", { status: 400 });

  const db = supabaseAdmin();
  const normalizedEmail = email.trim().toLowerCase();

  const { data: existing } = await db.from("auth_users").select("id").eq("email", normalizedEmail).single();
  if (existing) return new Response("Email already in use", { status: 409 });

  const passwordHash = await bcrypt.hash(password, 12);
  const { data: user, error } = await db
    .from("auth_users")
    .insert({ email: normalizedEmail, password_hash: passwordHash })
    .select("id, email, role, full_name, use_case, onboarding_complete, created_at")
    .single();

  if (error) return new Response(error.message, { status: 500 });

  const token = await createSession(user.id);
  await setSessionCookie(token);
  return Response.json(user, { status: 201 });
}
