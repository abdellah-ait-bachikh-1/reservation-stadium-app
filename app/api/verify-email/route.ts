import { getLocaleFromNextIntlCookie } from "@/lib/api/locale";
import db from "@/lib/db";
import { TLocale } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let locale: TLocale = "en";

  try {
    locale = await getLocaleFromNextIntlCookie();
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      // Redirect to home page without messages
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }

    // 1. Find user with this token
    const user = await db.user.findFirst({
      where: {
        verificationToken: token,
        emailVerifiedAt: null,
      },
    });

    if (!user) {
      // Check if user exists but is already verified
      const alreadyVerifiedUser = await db.user.findFirst({
        where: {
          verificationToken: token,
          emailVerifiedAt: { not: null },
        },
        select: { id: true, email: true },
      });

      if (alreadyVerifiedUser) {
        // Already verified - redirect to login (no message)
        return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url));
      } else {
        // Invalid token - redirect to home page (no message)
        return NextResponse.redirect(new URL(`/${locale}`, req.url));
      }
    }

    // 2. Update user: mark email as verified
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerifiedAt: new Date(),
        verificationToken: null,
      },
    });

    // 3. Successful verification - redirect to login (no message)
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url));

  } catch (error) {
    console.error("Verification error:", error);
    
    // Redirect to home page on error (no message)
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }
}