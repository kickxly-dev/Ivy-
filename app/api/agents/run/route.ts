import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { getGroq, MODELS } from "@/lib/groq";

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return new Response("Missing agent id", { status: 400 });

  const db = supabaseAdmin();
  const { data: agent } = await db
    .from("agents")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!agent) return new Response("Agent not found", { status: 404 });

  const { data: run } = await db
    .from("agent_runs")
    .insert({ agent_id: id, status: "running" })
    .select()
    .single();

  const modelId = MODELS[agent.model as keyof typeof MODELS] ?? agent.model ?? MODELS.balanced;

  const stream = await getGroq().chat.completions.create({
    model: modelId,
    messages: [
      { role: "system", content: agent.instructions || "You are a helpful AI agent." },
      { role: "user", content: "Execute your task and provide your output." },
    ],
    stream: true,
    max_tokens: 2048,
    temperature: 0.7,
  });

  let fullOutput = "";

  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content ?? "";
          if (delta) {
            fullOutput += delta;
            controller.enqueue(encoder.encode(delta));
          }
        }
        // Mark run complete
        await db.from("agent_runs").update({
          status: "success",
          output: fullOutput,
          completed_at: new Date().toISOString(),
        }).eq("id", run!.id);

        await db.from("agents").update({ status: "idle", updated_at: new Date().toISOString() }).eq("id", id);
      } catch (err) {
        await db.from("agent_runs").update({
          status: "failed",
          error: String(err),
          completed_at: new Date().toISOString(),
        }).eq("id", run!.id);
      } finally {
        controller.close();
      }
    },
  });

  // Mark agent as active while running
  await db.from("agents").update({ status: "active" }).eq("id", id);

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "X-Content-Type-Options": "nosniff" },
  });
}

export async function GET(req: NextRequest) {
  const user = await getSession();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return new Response("Missing agent id", { status: 400 });

  const db = supabaseAdmin();
  const { data } = await db
    .from("agent_runs")
    .select("*")
    .eq("agent_id", id)
    .order("started_at", { ascending: false })
    .limit(20);

  return Response.json(data ?? []);
}
