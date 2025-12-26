import { getSession } from "@/auth";
import { isExistsAuthenticatedUserInApi } from "@/lib/data/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await isExistsAuthenticatedUserInApi();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return NextResponse.json({ message: "Hello from club dashboard" });
}
