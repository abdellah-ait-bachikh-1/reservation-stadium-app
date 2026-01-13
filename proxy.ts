import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import {
  updateUserPreferredLocaleLocale,
  getUserPreferredLocale
} from "./lib/queries/user";
import { getToken } from "next-auth/jwt";
import { convertCase } from "./utils";
import { LocaleEnumType } from "./types";

const intlMiddleware = createMiddleware(routing);
const secret = process.env.NEXTAUTH_SECRET;
const validLocales = routing.locales;

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 🚨 SKIP ALL MIDDLEWARE LOGIC FOR API ROUTES
  if (pathname.startsWith("/api/")) {
    // Pass through to the route handler without any modifications
    return NextResponse.next();
  }

  // 🔽 BELOW THIS LINE: ONLY NON-API ROUTES GET PROCESSED 🔽

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
  const pathLocale = pathSegments[1];
  
  // Check if the path starts with a valid locale
  const hasValidLocalePrefix = validLocales.includes(pathLocale as LocaleEnumType);
  
  // If locale is not valid (for non-API routes)
  if (!hasValidLocalePrefix) {
    // Redirect to user's preferred locale
    const url = request.nextUrl.clone();
    
    // Preserve the rest of the path
    const restOfPath = pathSegments.slice(1).join("/");
    const redirectPath = restOfPath ? 
      `/${convertCase(userPrefferedLocale, "lower")}/${restOfPath}` :
      `/${convertCase(userPrefferedLocale, "lower")}`;
    
    url.pathname = redirectPath;
    return NextResponse.redirect(url);
  }

  const locale = hasValidLocalePrefix ? pathLocale : convertCase(userPrefferedLocale, "lower");
  
  // Update locale in DB if authenticated
  if (token && hasValidLocalePrefix) {
    await updateUserPreferredLocaleLocale(
      token.id,
      convertCase(locale as LocaleEnumType, "upper")
    );
  }

  // Pass through to i18n middleware for non-API routes
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Only match non-API routes
    "/((?!api|_next|_vercel|.*\\..*).*)",
    // 🚨 REMOVED API ROUTES FROM MATCHER
  ],
};