import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getGroq, MODELS, SYSTEM_PROMPT } from "@/lib/groq";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const userId = user.id;

  const { messages, conversationId, model = "balanced", imageUrl } = await req.json();
  if (!messages || !Array.isArray(messages)) return new Response("Missing messages", { status: 400 });

  const db = supabaseAdmin();
  const selectedModel = imageUrl ? MODELS.vision : (MODELS[model as keyof typeof MODELS] ?? MODELS.balanced);

  const groqMessages: { role: "system" | "user" | "assistant"; content: string | { type: string; text?: string; image_url?: { url: string } }[] }[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.map((m: { role: string; content: string; image_url?: string }) => {
      if (m.image_url || imageUrl) {
        return {
          role: m.role as "user" | "assistant",
          content: [
            { type: "text", text: m.content },
            { type: "image_url", image_url: { url: m.image_url || imageUrl } },
          ],
        };
      }
      return { role: m.role as "user" | "assistant", content: m.content };
    }),
  ];

  if (conversationId) {
    const lastMsg = messages[messages.length - 1];
    await db.from("messages").insert({
      conversation_id: conversationId,
      role: "user",
      content: lastMsg.content,
      image_url: imageUrl || null,
    });
  }

  const stream = await getGroq().chat.completions.create({
    model: selectedModel,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messages: groqMessages as any,
    stream: true,
    max_tokens: 2048,
    temperature: 0.7,
  });

  let fullContent = "";

  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content ?? "";
          if (delta) {
            fullContent += delta;
            controller.enqueue(encoder.encode(delta));
          }
        }
      } finally {
        if (conversationId && fullContent) {
          await db.from("messages").insert({
            conversation_id: conversationId,
            role: "assistant",
            content: fullContent,
            model: selectedModel,
          });
          const firstUserMsg = messages.find((m: { role: string }) => m.role === "user");
          if (firstUserMsg && messages.length <= 2) {
            const title = firstUserMsg.content.slice(0, 60).trim();
            await db.from("conversations").update({ title }).eq("id", conversationId);
          }
        }
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "X-Content-Type-Options": "nosniff" },
  });
}
