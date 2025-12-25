// app/actions/auth.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function forceLogout() {
  const cookieStore = await cookies();
  
  // Clear auth cookies
  cookieStore.delete("next-auth.session-token");
  cookieStore.delete("__Secure-next-auth.session-token");
  cookieStore.delete("next-auth.csrf-token");
  
  // Revalidate any cached paths
  revalidatePath("/");
  
  // Redirect to login
  redirect("/auth/login");
}