import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = supabaseAdmin();
  const { data: agents } = await db
    .from("agents")
    .select("*, agent_runs(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Attach run count and last run info
  const agentIds = (agents ?? []).map((a) => a.id);
  const { data: lastRuns } = agentIds.length
    ? await db
        .from("agent_runs")
        .select("agent_id, started_at, status")
        .in("agent_id", agentIds)
        .order("started_at", { ascending: false })
    : { data: [] };

  const runsByAgent = (lastRuns ?? []).reduce<Record<string, typeof lastRuns>>((acc, r) => {
    if (!acc[r.agent_id]) acc[r.agent_id] = [];
    acc[r.agent_id]!.push(r);
    return acc;
  }, {});

  const result = (agents ?? []).map((a) => ({
    ...a,
    run_count: (a.agent_runs as { count: number }[])?.[0]?.count ?? 0,
    last_run: runsByAgent[a.id]?.[0]?.started_at ?? null,
    agent_runs: undefined,
  }));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, description, instructions, model, color } = body;
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("agents")
    .insert({
      user_id: user.id,
      name: name.trim(),
      description: description?.trim() || null,
      instructions: instructions?.trim() || "",
      model: model || "llama-3.3-70b-versatile",
      color: color || "#4afa98",
      status: "idle",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ...data, run_count: 0, last_run: null });
}

export async function PATCH(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const body = await req.json();
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("agents")
    .update(body)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const db = supabaseAdmin();
  await db.from("agents").delete().eq("id", id).eq("user_id", user.id);
  return NextResponse.json({ success: true });
}
