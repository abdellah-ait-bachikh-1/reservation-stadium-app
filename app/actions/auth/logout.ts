// app/actions/auth.ts
"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";


export async function logoutUser() {
  try {
    const cookieStore = await cookies();
    
    // Clear all auth cookies
    const authCookieNames = [
      "authjs.session-token",
      "__Secure-authjs.session-token",
      "next-auth.session-token",
      "__Secure-next-auth.session-token",
      "authjs.csrf-token",
      "next-auth.csrf-token",
    ];
    
    authCookieNames.forEach(cookieName => {
      cookieStore.delete(cookieName);
    });
    
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: "Logout failed" };
  }
}

export async function forceLogoutAndRedirect(redirectPath = "/auth/login") {
  await logoutUser();
  redirect(redirectPath);
}