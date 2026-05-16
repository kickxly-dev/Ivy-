import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function PATCH(req: NextRequest) {
  const user = await getSession();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const allowed = ["full_name", "use_case", "onboarding_complete"];
  const updates = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("auth_users")
    .update(updates)
    .eq("id", user.id)
    .select("id, email, role, full_name, use_case, onboarding_complete, created_at")
    .single();

  if (error) return new Response(error.message, { status: 500 });
  return Response.json(data);
}
