import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const user = await getSession();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const conversationId = req.nextUrl.searchParams.get("conversationId");
  if (!conversationId) return new Response("Missing conversationId", { status: 400 });

  const db = supabaseAdmin();
  const { data: conv } = await db.from("conversations").select("id").eq("id", conversationId).eq("user_id", user.id).single();
  if (!conv) return new Response("Not found", { status: 404 });

  const { data, error } = await db.from("messages").select("*").eq("conversation_id", conversationId).order("created_at", { ascending: true });
  if (error) return new Response(error.message, { status: 500 });
  return Response.json(data);
}
