import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

// Returns current user's raw DB record — for debugging role/admin issues
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("auth_users")
    .select("id, email, role, full_name, onboarding_complete, created_at")
    .eq("id", session.id)
    .single();

  return NextResponse.json({ session, db_record: data, error });
}

// Force-set caller's own role to admin (only works if email matches hardcoded admin email)
export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const ADMIN_EMAIL = "kickxly0@gmail.com";
  if (session.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("auth_users")
    .update({ role: "admin" })
    .eq("email", ADMIN_EMAIL)
    .select("id, email, role")
    .single();

  return NextResponse.json({ updated: data, error });
}
