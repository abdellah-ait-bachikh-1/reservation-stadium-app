// middleware.ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import db from "@/lib/db"; // استيراد Prisma client

export default async function middleware(request: NextRequest) {
  try {
    const intlMiddleware = createMiddleware(routing);
    const response = intlMiddleware(request);
    const { nextUrl } = request;
    const pathname = nextUrl.pathname;

    let currentLocale = "en";

    const localeMatch = pathname.match(/^\/(ar|en|fr)(\/|$)/);
    if (localeMatch) {
      currentLocale = localeMatch[1];
    } else {
      const localeCookie = request.cookies.get("NEXT_LOCALE")?.value;
      if (localeCookie && ["ar", "en", "fr"].includes(localeCookie)) {
        currentLocale = localeCookie;
      }
    }

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (token?.sub && currentLocale) {
      try {
        const user = await db.user.findUnique({
          where: { id: token.sub },
          select: { preferredLocale: true },
        });

        const dbLocale = user?.preferredLocale?.toLowerCase();

        if (dbLocale !== currentLocale) {
          console.log(
            `🔄 Updating user locale: ${dbLocale} → ${currentLocale}`
          );

          await db.user.update({
            where: { id: token.sub },
            data: {
              preferredLocale: currentLocale.toUpperCase() as any,
            },
          });

          console.log(
            `✅ User ${
              token.sub
            } locale updated to ${currentLocale.toUpperCase()}`
          );
        }
      } catch (dbError) {
        console.error("❌ Error updating user locale:", dbError);
      }
    }

    return response;
  } catch (error) {
    console.error("❌ Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: "/((?!api|_next|.*\\..*).*)",
};
