// app/api/dashboard/home/route.ts
import { getDashboardData } from "@/lib/queries/dashboard/dashboard-home";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get year from query parameters
    const searchParams = request.nextUrl.searchParams;
    const yearParam = searchParams.get("year");
    const currentYear = new Date().getFullYear();
    
    // Default to current year if not provided
    let year = yearParam ? parseInt(yearParam) : currentYear;
    
    // Validate year is not in the future
    year = Math.min(year, currentYear); // REMOVE Math.max(2026, ...)

    console.log(`Fetching dashboard data for year: ${year}`);

    // Fetch dashboard data for the specified year
    const dashboardData = await getDashboardData(year);

    return NextResponse.json({
      success: true,
      data: dashboardData,
      year: year,
    });
  } catch (error) {
    console.log("API Error fetching dashboard data:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch dashboard data",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}