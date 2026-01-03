import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = `/${routing.defaultLocale}`;
    return NextResponse.redirect(url);
  }
  
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};