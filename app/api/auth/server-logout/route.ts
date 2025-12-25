// app/api/auth/server-logout/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Create redirect response
  const response = NextResponse.redirect(
    new URL("/auth/login", request.url)
  );

  // Get cookies from the request and clear them in the response
  const authCookies = [
    "next-auth.session-token",
    "__Secure-next-auth.session-token", 
    "next-auth.callback-url",
    "next-auth.csrf-token",
    "next-auth.state",
    "session", // Your custom session cookie
  ];

  // Clear each cookie in the response
  authCookies.forEach(cookieName => {
    response.cookies.delete(cookieName);
  });

  return response;
}