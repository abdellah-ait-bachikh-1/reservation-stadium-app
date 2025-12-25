// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/auth";
import db from "@/lib/db";
import { isDeletedUserInApi } from "@/lib/data/auth";

export async function GET() {
  try {
    const user = await isDeletedUserInApi();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }


    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
