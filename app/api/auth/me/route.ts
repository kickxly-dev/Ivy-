import { getSession } from "@/lib/auth";

export async function GET() {
  const user = await getSession();
  if (!user) return new Response("Unauthorized", { status: 401 });
  return Response.json(user);
}
