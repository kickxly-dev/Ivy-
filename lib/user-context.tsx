"use client";

import { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";

export const UserContext = createContext<User | null>(null);
export const useUser = () => useContext(UserContext);

export function displayName(user: User | null): string {
  if (!user) return "";
  return user.user_metadata?.full_name || user.email?.split("@")[0] || "there";
}

export function userInitial(user: User | null): string {
  const name = displayName(user);
  return name.charAt(0).toUpperCase();
}

export function isAdmin(user: User | null): boolean {
  return user?.user_metadata?.role === "admin";
}
