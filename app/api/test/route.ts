import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const localeFromReqCookie = request.cookies.get("NEXT_LOCALE")?.value;
  console.log(localeFromReqCookie);
  return NextResponse.json({ localeFromReqCookie });
}
