// app/api/dashboard/home/route.ts
import { getDashboardData } from "@/lib/queries/dashboard-home";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get year from query parameters
    const searchParams = request.nextUrl.searchParams;
    const yearParam = searchParams.get("year");
    const year = yearParam ? parseInt(yearParam) : new Date().getFullYear();

    // Validate year
    if (isNaN(year) || year < 2020 || year > 2100) {
      return NextResponse.json(
        { error: "Invalid year parameter" },
        { status: 400 }
      );
    }

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