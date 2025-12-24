// app/api/dashboard/home/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSession } from "@/auth";
import { getLocaleFromNextIntlCookie } from "@/lib/api/locale";
import { isError } from "@/lib/utils";

export const GET = async (request: Request) => {
  try {
  } catch (error) {
    if (isError(error)) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
};
