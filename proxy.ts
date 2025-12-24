// middleware.ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import db from "@/lib/db";

export default async function middleware(request: NextRequest) {
  try {
    const { nextUrl } = request;
    const pathname = nextUrl.pathname;
    
    // Check if the route is under /dashboard
    const isDashboardRoute = pathname.includes('/dashboard');
    
    // Get token for authentication check
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    // Protect dashboard routes
    if (isDashboardRoute) {
      // If no token, redirect to login
      if (!token?.sub) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
      
      // Check if user exists and isn't deleted
      const user = await db.user.findUnique({
        where: { id: token.sub },
      });
     
      // If user doesn't exist or is deleted, clear session and redirect
      if (!user || user.deletedAt !== null) {
        const loginUrl = new URL('/auth/login', request.url);
        const response = NextResponse.redirect(loginUrl);
        
        // Clear the auth cookie
        const cookieName = process.env.NODE_ENV === 'production' 
          ? '__Secure-next-auth.session-token' 
          : 'next-auth.session-token';
        response.cookies.delete(cookieName);
        
        return response;
      }
      
      // Check if user is approved (if needed)
      if (!user.approved) {
        // Redirect to pending approval page
        return NextResponse.redirect(new URL('/auth/pending-approval', request.url));
      }
      
      // Check if email is verified
      if (!user.emailVerifiedAt) {
        // Redirect to email verification page
        return NextResponse.redirect(new URL('/auth/verify-email', request.url));
      }
    }
    
    // Continue with internationalization middleware
    const intlMiddleware = createMiddleware(routing);
    const response = intlMiddleware(request);
    
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

    // Update user locale if needed (only for authenticated users)
    if (token?.sub && currentLocale) {
      try {
        const user = await db.user.findUnique({
          where: { id: token.sub },
          select: { preferredLocale: true },
        });

        const dbLocale = user?.preferredLocale?.toLowerCase();

        if (dbLocale !== currentLocale) {
          console.log(`🔄 Updating user locale: ${dbLocale} → ${currentLocale}`);

          await db.user.update({
            where: { id: token.sub },
            data: {
              preferredLocale: currentLocale.toUpperCase() as any,
            },
          });

          console.log(
            `✅ User ${token.sub} locale updated to ${currentLocale.toUpperCase()}`
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