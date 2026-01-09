import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import {
  updateUserPreferredLocaleLocale,getUserPreferredLocale
} from "./lib/queries/user";
import { getToken } from "next-auth/jwt";
import { convertCase } from "./utils";
import { LocaleEnumType } from "./types";

const intlMiddleware = createMiddleware(routing);
const secret = process.env.NEXTAUTH_SECRET;

// Define valid locales from your routing configuration
const validLocales = routing.locales; // This should contain ['en', 'fr', 'ar'] or similar

export default async function middleware(request: NextRequest) {
  const { pathname } =  request.nextUrl;
  const token = await getToken({
    req: request,
    secret: secret,
  });
  
  let userPrefferedLocale = "FR";
  if (token) {
    userPrefferedLocale = await getUserPreferredLocale(token.id);
  }

  // Handle root path redirect
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${convertCase(userPrefferedLocale, "lower")}`;
    return NextResponse.redirect(url);
  }

  // Extract locale from pathname (first segment after /)
  const pathSegments = pathname.split("/");
  const pathLocale = pathSegments[1]; // First segment after /
  
  // Check if the path starts with a valid locale
  const hasValidLocalePrefix = validLocales.includes(pathLocale as LocaleEnumType);
  
  // If locale is not valid and it's not an API route
  if (!hasValidLocalePrefix && !pathname.startsWith("/api")) {
    // Redirect to user's preferred locale
    const url = request.nextUrl.clone();
    
    // Preserve the rest of the path after the invalid locale
    const restOfPath = pathSegments.slice(2).join("/");
    const redirectPath = restOfPath ? 
      `/${convertCase(userPrefferedLocale, "lower")}/${restOfPath}` :
      `/${convertCase(userPrefferedLocale, "lower")}`;
    
    url.pathname = redirectPath;
    return NextResponse.redirect(url);
  }

  const locale = hasValidLocalePrefix ? pathLocale : convertCase(userPrefferedLocale, "lower");
  
  // Only update locale in DB if it's valid and user is authenticated
  const isAuthenticated = !!token;
  if (isAuthenticated && hasValidLocalePrefix) {
    await updateUserPreferredLocaleLocale(
      token.id,
      convertCase(locale as LocaleEnumType, "upper")
    );
  }

  const isAuthPage = pathname.startsWith(`/${locale}/auth`);
  const isDashboardPage = pathname.startsWith(`/${locale}/dashboard`);
  const isApiRoute = pathname.startsWith("/api");
  const isPusherApi = pathname.startsWith("/api/pusher");
  const isDashboardApi = pathname.startsWith("/api/dashboard");
  
  const isVerifyEmailPage = pathname.startsWith(`/${locale}/auth/verify-email`);

  // ------------------ Pages ------------------
  // Authenticated users → block /auth/*
  if (!isApiRoute && isAuthPage && isAuthenticated && !isVerifyEmailPage) {
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}`;
  return NextResponse.redirect(url);
}

  // Unauthenticated users → block /dashboard/*
  if (!isApiRoute && isDashboardPage && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/auth/login`;
    return NextResponse.redirect(url);
  }

  // ------------------ API Routes ------------------
  if (isApiRoute) {
    // Unauthenticated users → block /api/dashboard/*
    if (isDashboardApi && !isAuthenticated) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // /api/auth/* → accessible by anyone, no checks needed
    // /api/pusher/* → accessible by anyone, no checks needed
  }

  // Pass through to i18n middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // All pages except _next, _vercel, files
    "/((?!api|_next|_vercel|.*\\..*).*)",
    // API routes we want to protect (only dashboard)
    "/api/dashboard/(.*)",
  ],
};