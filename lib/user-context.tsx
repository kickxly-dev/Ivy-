"use client";

import { createContext, useContext } from "react";
import type { AuthUser } from "./auth";

export type { AuthUser };
export const UserContext = createContext<AuthUser | null>(null);
export const useUser = () => useContext(UserContext);

export function displayName(user: AuthUser | null): string {
  if (!user) return "";
  return user.full_name || user.email.split("@")[0];
}

export function userInitial(user: AuthUser | null): string {
  return displayName(user).charAt(0).toUpperCase();
}

export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === "admin";
}
