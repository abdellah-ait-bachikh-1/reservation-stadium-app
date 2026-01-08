// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUsersWithDetails, getAdminsWithDetails } from "@/lib/services/notification-service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") || "all"; // "all" or "admins"
    
    let users;
    
    if (type === "admins") {
      users = await getAdminsWithDetails();
    } else {
      users = await getUsersWithDetails();
    }
    
    return NextResponse.json({
      success: true,
      data: users,
      count: users.length
    });
    
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to fetch users" 
      },
      { status: 500 }
    );
  }
}