// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Create redirect to home
  const redirectUrl = new URL('/', request.url);
  
  const response = NextResponse.redirect(redirectUrl);
  
  // Clear all auth cookies
  const authCookies = [
    'next-auth.session-token',
    '__Secure-next-auth.session-token',
    'authjs.session-token',
    '__Secure-authjs.session-token',
    'next-auth.csrf-token',
    '__Secure-next-auth.csrf-token',
  ];
  
  authCookies.forEach(cookieName => {
    response.cookies.delete(cookieName);
    response.cookies.set({
      name: cookieName,
      value: '',
      expires: new Date(0),
      path: '/',
    });
  });
  
  return response;
}

export async function POST(request: NextRequest) {
  return GET(request);
}