import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const projectId = formData.get("projectId") as string | null;

  if (!file) return new Response("No file", { status: 400 });
  if (file.size > MAX_SIZE) return new Response("File too large (max 10MB)", { status: 413 });
  if (!ALLOWED_TYPES.includes(file.type)) return new Response("Unsupported file type", { status: 415 });

  const db = supabaseAdmin();
  const ext = file.name.split(".").pop() ?? "jpg";
  const storagePath = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await db.storage.from("ivy-uploads").upload(storagePath, arrayBuffer, { contentType: file.type });
  if (uploadError) return new Response("Upload failed", { status: 500 });

  const { data: urlData } = db.storage.from("ivy-uploads").getPublicUrl(storagePath);
  const { data: fileRecord, error: dbError } = await db.from("files").insert({
    user_id: user.id,
    project_id: projectId || null,
    name: file.name,
    size: file.size,
    mime_type: file.type,
    storage_path: storagePath,
    public_url: urlData.publicUrl,
  }).select().single();

  if (dbError) return new Response("DB insert failed", { status: 500 });
  return Response.json({ file: fileRecord, url: urlData.publicUrl });
}
