import { NextRequest } from "next/server";
import { createServerAuthClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const supabase = await createServerAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const projectId = req.nextUrl.searchParams.get("projectId");
  const db = supabaseAdmin();
  let query = db.from("conversations").select("*").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(50);
  if (projectId) query = query.eq("project_id", projectId);

  const { data, error } = await query;
  if (error) return new Response(error.message, { status: 500 });
  return Response.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createServerAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { title, model, projectId } = await req.json();
  const db = supabaseAdmin();
  const { data, error } = await db.from("conversations").insert({
    user_id: user.id,
    title: title ?? "New Chat",
    model: model ?? "llama-3.3-70b-versatile",
    project_id: projectId ?? null,
  }).select().single();

  if (error) return new Response(error.message, { status: 500 });
  return Response.json(data, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createServerAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return new Response("Missing id", { status: 400 });

  const db = supabaseAdmin();
  const { error } = await db.from("conversations").delete().eq("id", id).eq("user_id", user.id);
  if (error) return new Response(error.message, { status: 500 });
  return new Response(null, { status: 204 });
}
