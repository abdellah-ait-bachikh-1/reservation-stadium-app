import {
  clearAuthCookies,
  isAuthenticatedUserTokenExistInDb,
} from "@/lib/auth";
import { isErrorHasMessage } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await isAuthenticatedUserTokenExistInDb(req);

    if (!user) {
      const response = NextResponse.json(
        { 
          success: false, 
          error: "Not authenticated",
          message: "User not found or session expired"
        },
        { status: 401 }
      );
      
      clearAuthCookies(response);
      return response;
    }
    
    return NextResponse.json({ 
      success: true, 
      user 
    });
    
  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    
    const response = NextResponse.json(
      { 
        success: false, 
        error: "Internal server error",
        message: isErrorHasMessage(error) ? error.message : "Unknown error"
      },
      { status: 500 }
    );
    
    // Optional: Clear cookies on error too
    clearAuthCookies(response);
    return response;
  }
}