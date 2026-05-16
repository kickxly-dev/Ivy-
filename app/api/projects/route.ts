import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const user = await getSession();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const db = supabaseAdmin();
  const { data, error } = await db.from("projects").select("*").eq("user_id", user.id).order("updated_at", { ascending: false });
  if (error) return new Response(error.message, { status: 500 });
  return Response.json(data);
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { name, description, color } = await req.json();
  if (!name?.trim()) return new Response("Name required", { status: 400 });

  const db = supabaseAdmin();
  const { data, error } = await db.from("projects").insert({ user_id: user.id, name: name.trim(), description: description ?? null, color: color ?? "#4afa98" }).select().single();
  if (error) return new Response(error.message, { status: 500 });
  return Response.json(data, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const user = await getSession();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return new Response("Missing id", { status: 400 });

  const body = await req.json();
  const allowed = ["name", "description", "color", "starred"];
  const updates = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));

  const db = supabaseAdmin();
  const { data, error } = await db.from("projects").update(updates).eq("id", id).eq("user_id", user.id).select().single();
  if (error) return new Response(error.message, { status: 500 });
  return Response.json(data);
}

export async function DELETE(req: NextRequest) {
  const user = await getSession();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return new Response("Missing id", { status: 400 });

  const db = supabaseAdmin();
  const { error } = await db.from("projects").delete().eq("id", id).eq("user_id", user.id);
  if (error) return new Response(error.message, { status: 500 });
  return new Response(null, { status: 204 });
}
