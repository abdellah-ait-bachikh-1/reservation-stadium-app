// app/api/public/stadiums/route.ts
import { db } from "@/drizzle/db";
import { stadiums, stadiumSports, stadiumImages, sports } from "@/drizzle/schema";
import { and, eq, like, inArray, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name') || '';
    const sportsParam = searchParams.get('sports') || '';
    const sportIds = sportsParam ? sportsParam.split(',').filter(Boolean) : [];
    
    // Build conditions
    const conditions = [];
    
    if (name) {
      // For MySQL, use LIKE with LOWER for case-insensitive search
      conditions.push(
        sql`LOWER(${stadiums.name}) LIKE ${`%${name.toLowerCase()}%`}`
      );
    }
    
    if (sportIds.length > 0) {
      // Get stadium IDs that have ALL the selected sports
      const stadiumsWithSports = await db
        .select({ stadiumId: stadiumSports.stadiumId })
        .from(stadiumSports)
        .where(inArray(stadiumSports.sportId, sportIds))
        .groupBy(stadiumSports.stadiumId)
        .having(sql`COUNT(DISTINCT ${stadiumSports.sportId}) = ${sportIds.length}`);
      
      const stadiumIds = stadiumsWithSports.map(s => s.stadiumId);
      if (stadiumIds.length > 0) {
        conditions.push(inArray(stadiums.id, stadiumIds));
      } else {
        // If no stadium has all selected sports, return empty array
        return NextResponse.json([], { status: 200 });
      }
    }
    
    // Fetch stadiums with their main image in a single query using LEFT JOIN
    const stadiumsQuery = await db
      .select({
        id: stadiums.id,
        name: stadiums.name,
        address: stadiums.address,
        googleMapsUrl: stadiums.googleMapsUrl,
        monthlyPrice: stadiums.monthlyPrice,
        pricePerSession: stadiums.pricePerSession,
        createdAt: stadiums.createdAt,
        // Get first image using subquery
        image: sql<string>`(
          SELECT ${stadiumImages.imageUri}
          FROM ${stadiumImages}
          WHERE ${stadiumImages.stadiumId} = ${stadiums.id}
          ORDER BY ${stadiumImages.index}
          LIMIT 1
        )`.as('image'),
      })
      .from(stadiums)
      .where(
        conditions.length > 0 
          ? and(...conditions) 
          : undefined
      )
      .orderBy(stadiums.createdAt)
      .limit(50); // Add a limit for safety

    // Fetch sports for all stadiums in a single query
    const stadiumIds = stadiumsQuery.map(s => s.id);
    let stadiumSportsData: Array<{
      stadiumId: string;
      sportId: string;
      nameAr: string;
      nameFr: string;
      icon: string | null;
    }> = [];
    
    if (stadiumIds.length > 0) {
      stadiumSportsData = await db
        .select({
          stadiumId: stadiumSports.stadiumId,
          sportId: sports.id,
          nameAr: sports.nameAr,
          nameFr: sports.nameFr,
          icon: sports.icon,
        })
        .from(stadiumSports)
        .innerJoin(sports, eq(stadiumSports.sportId, sports.id))
        .where(inArray(stadiumSports.stadiumId, stadiumIds));
    }

    // Group sports by stadiumId
    const sportsByStadiumId = stadiumSportsData.reduce((acc, curr) => {
      if (!acc[curr.stadiumId]) {
        acc[curr.stadiumId] = [];
      }
      acc[curr.stadiumId].push({
        id: curr.sportId,
        nameAr: curr.nameAr,
        nameFr: curr.nameFr,
        icon: curr.icon,
      });
      return acc;
    }, {} as Record<string, Array<{
      id: string;
      nameAr: string;
      nameFr: string;
      icon: string | null;
    }>>);

    // Combine stadium data with sports
    const stadiumsWithDetails = stadiumsQuery.map(stadium => ({
      ...stadium,
      image: stadium.image || null,
      sports: sportsByStadiumId[stadium.id] || [],
    }));

    return NextResponse.json(stadiumsWithDetails, { status: 200 });
  } catch (error) {
    console.error('Error fetching stadiums:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stadiums' },
      { status: 500 }
    );
  }
}