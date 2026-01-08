import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { updateUserPreferredLocaleLocale } from "./lib/queries/user";
import { getSession } from "./lib/auth";
import { getToken } from "next-auth/jwt";
import { convertCase } from "./utils";
import { LocaleEnumType } from "./types";

const intlMiddleware = createMiddleware(routing);
const secret = process.env.NEXTAUTH_SECRET;

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: secret,
  });
  console.log({ token });
  // Redirect "/" to default locale
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${routing.defaultLocale}`;
    return NextResponse.redirect(url);
  }

  const locale = pathname.split("/")[1] || routing.defaultLocale;
  const isAuthPage = pathname.startsWith(`/${locale}/auth`);
  const isDashboardPage = pathname.startsWith(`/${locale}/dashboard`);
  const isApiRoute = pathname.startsWith("/api");
  const isPusherApi = pathname.startsWith("/api/pusher");
  const isDashboardApi = pathname.startsWith("/api/dashboard");
  const isAuthenticated = !!token;
  if (isAuthenticated) {
    await updateUserPreferredLocaleLocale(
      token.id,
      convertCase(locale as LocaleEnumType, "upper")
    );
  }

  // ------------------ Pages ------------------
  // Authenticated users → block /auth/*
  if (!isApiRoute && isAuthPage && isAuthenticated) {
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
