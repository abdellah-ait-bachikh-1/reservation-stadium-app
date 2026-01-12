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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12'); // Default 12 items per page
    const sportIds = sportsParam ? sportsParam.split(',').filter(Boolean) : [];
    
    // Calculate offset
    const offset = (page - 1) * limit;
    
    // Build conditions
    const conditions = [];
    
    if (name) {
      conditions.push(
        sql`LOWER(${stadiums.name}) LIKE ${`%${name.toLowerCase()}%`}`
      );
    }
    
    // First, get stadium IDs that match sports filter (if any)
    let stadiumIdsFromSports: string[] = [];
    
    if (sportIds.length > 0) {
      const stadiumsWithSports = await db
        .select({ stadiumId: stadiumSports.stadiumId })
        .from(stadiumSports)
        .where(inArray(stadiumSports.sportId, sportIds))
        .groupBy(stadiumSports.stadiumId)
        .having(sql`COUNT(DISTINCT ${stadiumSports.sportId}) = ${sportIds.length}`);
      
      stadiumIdsFromSports = stadiumsWithSports.map(s => s.stadiumId);
      
      if (stadiumIdsFromSports.length === 0) {
        // If no stadium has all selected sports, return empty results
        return NextResponse.json({
          stadiums: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false
          }
        }, { status: 200 });
      }
      
      conditions.push(inArray(stadiums.id, stadiumIdsFromSports));
    }
    
    // Get total count for pagination
    const countQuery = await db
      .select({ count: sql<number>`count(*)` })
      .from(stadiums)
      .where(
        conditions.length > 0 
          ? and(...conditions) 
          : undefined
      );

    const total = Number(countQuery[0]?.count || 0);
    const totalPages = Math.ceil(total / limit);
    
    // Fetch stadiums with pagination
    const stadiumsQuery = await db
      .select({
        id: stadiums.id,
        name: stadiums.name,
        address: stadiums.address,
        googleMapsUrl: stadiums.googleMapsUrl,
        monthlyPrice: stadiums.monthlyPrice,
        pricePerSession: stadiums.pricePerSession,
        createdAt: stadiums.createdAt,
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
      .limit(limit)
      .offset(offset);

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

    return NextResponse.json({
      stadiums: stadiumsWithDetails,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching stadiums:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stadiums' },
      { status: 500 }
    );
  }
}