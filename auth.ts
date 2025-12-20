// lib/auth.ts (or auth-server.ts)
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth.config";

// For server components, use getServerSession with authConfig
export async function getSession() {
  return await getServerSession(authConfig);
}

// For logout, redirect to NextAuth's signout endpoint
export async function signOutServer() {
  // This will redirect to the signout endpoint
  // You'll handle the actual logout in your API route
  return { redirect: "/api/auth/signout" };
}