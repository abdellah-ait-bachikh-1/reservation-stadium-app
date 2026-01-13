// app/api/auth/logout/route.ts - FIXED VERSION
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectTo = searchParams.get('redirect') || '/auth/login';
    
    // Create a REDIRECT response (not JSON)
    const response = NextResponse.redirect(new URL(redirectTo, request.url));
    
    // Clear all auth cookies in the redirect response
    const authCookieNames = [
      "next-auth.session-token",
      "__Secure-next-auth.session-token",
      "authjs.session-token",
      "__Secure-authjs.session-token",
    ];
    
    authCookieNames.forEach(cookieName => {
      // Delete the cookie
      response.cookies.delete(cookieName);
      
      // Also set with expired date (maxAge: 0)
      response.cookies.set({
        name: cookieName,
        value: '',
        maxAge: 0, // Expire immediately
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
    });
    
    return response;
  } catch (error) {
    console.error('Logout API error:', error);
    
    // Even on error, redirect to login
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    
    // Still try to clear cookies
    ["next-auth.session-token", "__Secure-next-auth.session-token"].forEach(cookieName => {
      response.cookies.set({
        name: cookieName,
        value: '',
        maxAge: 0,
        path: '/',
      });
    });
    
    return response;
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}