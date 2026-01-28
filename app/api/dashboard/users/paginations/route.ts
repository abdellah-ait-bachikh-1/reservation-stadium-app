// /api/dashboard/users/paginations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUsers } from "@/lib/queries/dashboard/users";

// /api/dashboard/users/paginations/route.ts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Extract query parameters
    const params = {
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 10,
      search: searchParams.get("search") || undefined,
      role: searchParams.get("role") ? 
           (searchParams.get("role")!.split(",") as ("ADMIN" | "CLUB")[]) : 
           undefined,
      isApproved: searchParams.get("isApproved") === "true" ? true : 
                 searchParams.get("isApproved") === "false" ? false : undefined,
      isVerified: searchParams.get("isVerified") === "true" ? true : 
                 searchParams.get("isVerified") === "false" ? false : undefined,
      deletedFilter: searchParams.get("deletedFilter") as "all" | "deleted" | "notDeleted" || "notDeleted", // Add this
      sortBy: searchParams.get("sortBy") as "name" | "email" | "createdAt" | "updatedAt" || "createdAt",
      sortOrder: searchParams.get("sortOrder") as "asc" | "desc" || "desc",
      clubSearch: searchParams.get("clubSearch") || undefined,
      sports: searchParams.get("sports") ? searchParams.get("sports")!.split(",") : undefined,
    };

    // Fetch users with params
    const data = await getUsers(params);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}