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
    const limit = parseInt(searchParams.get('limit') || '12');
    const sportIds = sportsParam ? sportsParam.split(',').filter(Boolean) : [];
    
    const offset = (page - 1) * limit;
    const conditions = [];
    
    if (name) {
      conditions.push(like(stadiums.name, `%${name}%`));
    }
    
    // First, get stadium IDs that match sports filter
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
    
    // Fetch stadiums with pagination using Drizzle's query API
    const stadiumsResult = await db.query.stadiums.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: (stadiums, { desc }) => [desc(stadiums.createdAt)],
      limit: limit,
      offset: offset,
      with: {
        // Get the image with highest index for each stadium
        images: {
          orderBy: (stadiumImages, { desc }) => [desc(stadiumImages.index)],
          limit: 1,
        },
        // Get sports for each stadium
        stadiumSports: {
          with: {
            sport: true
          }
        }
      }
    });
    
    // Format the response
    const stadiumsWithDetails = stadiumsResult.map(stadium => {
      // Get the main image (first one from ordered images)
      const mainImage = stadium.images.length > 0 ? stadium.images[0].imageUri : null;
      
      // Extract sports from the relation
      const stadiumSports = stadium.stadiumSports.map(stadiumSport => ({
        id: stadiumSport.sport.id,
        nameAr: stadiumSport.sport.nameAr,
        nameFr: stadiumSport.sport.nameFr,
        icon: stadiumSport.sport.icon,
      }));
      
      return {
        id: stadium.id,
        name: stadium.name,
        address: stadium.address,
        googleMapsUrl: stadium.googleMapsUrl,
        monthlyPrice: stadium.monthlyPrice,
        pricePerSession: stadium.pricePerSession,
        image: mainImage,
        sports: stadiumSports,
      };
    });
    
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