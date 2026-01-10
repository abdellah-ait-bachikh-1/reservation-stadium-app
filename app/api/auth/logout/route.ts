// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return await handleLogout(request);
}

export async function POST(request: NextRequest) {
  return await handleLogout(request);
}

async function handleLogout(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json(
      { 
        success: true, 
        message: "Logged out successfully",
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
    
    // Clear ALL possible NextAuth cookies
    clearAuthCookies(response);
    

    return response;
    
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Logout failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

function clearAuthCookies(response: NextResponse) {
  const baseCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
  
  // List of all possible NextAuth cookie names
  const authCookies = [
    // NextAuth v5 cookies
    "authjs.session-token",
    "authjs.csrf-token",
    "__Secure-authjs.session-token",
    "__Secure-authjs.csrf-token",
    
    // NextAuth v4 cookies
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.callback-url",
    "__Secure-next-auth.callback-url",
    "next-auth.csrf-token",
    "__Host-next-auth.csrf-token",
    
    // Additional session cookies
    "session",
    "session-token",
    "access-token",
    "refresh-token",
  ];
  
  // Clear each cookie
  authCookies.forEach(cookieName => {
    response.cookies.set(cookieName, "", {
      ...baseCookieOptions,
      expires: new Date(0), // Set to past date to expire immediately
    });
  });
  
  // Also clear any cookie with "next-auth" in the name
  response.cookies.getAll().forEach(cookie => {
    if (cookie.name.includes("next-auth") || cookie.name.includes("authjs")) {
      response.cookies.delete(cookie.name);
    }
  });
}