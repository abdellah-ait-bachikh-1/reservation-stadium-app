// app/api/dashboard/home/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSession } from "@/auth";
import { getLocaleFromNextIntlCookie } from "@/lib/api/locale";
import { isError } from "@/lib/utils";
import { isAdminUserInApi } from "@/lib/data/auth";

export const GET = async (request: Request) => {
  try {
     const user = await isAdminUserInApi();
   
       if (!user) {
         return new Response(JSON.stringify({ error: "Unauthorized" }), {
           status: 401,
           headers: { "Content-Type": "application/json" },
         });
       }
  } catch (error) {
    if (isError(error)) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
};
