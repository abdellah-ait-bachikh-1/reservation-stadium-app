import { getLocaleFromNextIntlCookie } from "@/lib/api/locale";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const localeFromReqCookie = await getLocaleFromNextIntlCookie();
  console.log(localeFromReqCookie);
  return NextResponse.json({ localeFromReqCookie });
}
