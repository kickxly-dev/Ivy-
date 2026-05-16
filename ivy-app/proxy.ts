import { clerkMiddleware } from "@clerk/nextjs/server";

// Minimal proxy — just initializes Clerk context.
// Route protection is handled inside API handlers and the core layout.
export const proxy = clerkMiddleware();

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
