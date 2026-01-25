// app/api/dashboard/home/route.ts
import { getDashboardData } from "@/lib/queries/dashboard-home";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get year from query parameters
    const searchParams = request.nextUrl.searchParams;
    const yearParam = searchParams.get("year");
    const currentYear = new Date().getFullYear();
    
    // Default to current year if not provided
    let year = yearParam ? parseInt(yearParam) : currentYear;
    
    // Validate year is from 2026 onward
    year = Math.max(2026, Math.min(year, currentYear));

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