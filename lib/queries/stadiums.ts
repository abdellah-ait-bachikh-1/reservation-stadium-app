// lib/queries/stadiums.ts
import { db } from "@/drizzle/db"
import { stadiums, sports, stadiumImages, stadiumSports } from "@/drizzle/schema"
import { eq, sql, and, inArray, or, like, isNull } from "drizzle-orm"

export async function getStadiums({
  page = 1,
  pageSize = 10,
  search = "",
  sportIds = [],
  locale = "fr"
}: {
  page?: number
  pageSize?: number
  search?: string
  sportIds?: string[]
  locale?: "fr" | "ar"
}) {
  try {
    const offset = (page - 1) * pageSize

    // Build where conditions
    const conditions: any[] = [isNull(stadiums.deletedAt)]
    
    if (search) {
      const searchTerm = `%${search}%`
      conditions.push(
        or(
          like(stadiums.name, searchTerm),
          like(stadiums.address, searchTerm)
        )
      )
    }

    // Filter by sports if provided
    let stadiumIdsFilteredBySport: string[] = []
    if (sportIds.length > 0) {
      const stadiumSportsResult = await db
        .select({ stadiumId: stadiumSports.stadiumId })
        .from(stadiumSports)
        .where(inArray(stadiumSports.sportId, sportIds))
        .groupBy(stadiumSports.stadiumId)
      
      stadiumIdsFilteredBySport = stadiumSportsResult.map(s => s.stadiumId)
      
      if (stadiumIdsFilteredBySport.length > 0) {
        conditions.push(inArray(stadiums.id, stadiumIdsFilteredBySport))
      } else {
        // No stadiums match the sport filter
        return {
          data: [],
          sports: [],
          pagination: {
            page,
            pageSize,
            total: 0,
            totalPages: 0
          }
        }
      }
    }

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(stadiums)
      .where(and(...conditions))
    
    const total = Number(totalResult[0]?.count) || 0
    const totalPages = Math.ceil(total / pageSize)

    // Get stadiums with relations
    const stadiumsResult = await db
      .select({
        id: stadiums.id,
        name: stadiums.name,
        address: stadiums.address,
        googleMapsUrl: stadiums.googleMapsUrl,
        monthlyPrice: stadiums.monthlyPrice,
        pricePerSession: stadiums.pricePerSession,
        image: sql<string>`(
          SELECT ${stadiumImages.imageUri}
          FROM ${stadiumImages}
          WHERE ${stadiumImages.stadiumId} = ${stadiums.id}
          ORDER BY ${stadiumImages.index}
          LIMIT 1
        )`
      })
      .from(stadiums)
      .where(and(...conditions))
      .orderBy(stadiums.name)
      .limit(pageSize)
      .offset(offset)

    // Get stadium sports for each stadium
    const stadiumIds = stadiumsResult.map(s => s.id)
    
    const stadiumSportsResult = await db
      .select({
        stadiumId: stadiumSports.stadiumId,
        sportId: sports.id,
        nameAr: sports.nameAr,
        nameFr: sports.nameFr,
        icon: sports.icon
      })
      .from(stadiumSports)
      .innerJoin(sports, eq(stadiumSports.sportId, sports.id))
      .where(
        and(
          inArray(stadiumSports.stadiumId, stadiumIds),
          isNull(sports.deletedAt)
        )
      )

    // Group sports by stadium
    const sportsByStadiumId = stadiumSportsResult.reduce((acc, item) => {
      if (!acc[item.stadiumId]) {
        acc[item.stadiumId] = []
      }
      acc[item.stadiumId].push({
        id: item.sportId,
        name: locale === "ar" ? item.nameAr : item.nameFr,
        icon: item.icon
      })
      return acc
    }, {} as Record<string, Array<{ id: string, name: string, icon: string | null }>>)

    // Transform data
    const data = stadiumsResult.map(stadium => ({
      id: stadium.id,
      name: stadium.name,
      address: stadium.address,
      googleMapsUrl: stadium.googleMapsUrl || undefined,
      monthlyPrice: stadium.monthlyPrice ? Number(stadium.monthlyPrice) : undefined,
      pricePerSession: stadium.pricePerSession ? Number(stadium.pricePerSession) : undefined,
      image: stadium.image || "https://static.vecteezy.com/system/resources/thumbnails/051/167/728/small_2x/the-football-stadium-is-empty-during-the-day-clean-grass-no-markings-copy-space-horizontal-format-photo.jpg",
      sports: sportsByStadiumId[stadium.id] || []
    }))

    // Get all sports for filters
    const allSports = await db
      .select({
        id: sports.id,
        nameAr: sports.nameAr,
        nameFr: sports.nameFr,
        icon: sports.icon
      })
      .from(sports)
      .where(isNull(sports.deletedAt))
      .orderBy(sports.nameFr)

    const sportsList = allSports.map(sport => ({
      id: sport.id,
      name: locale === "ar" ? sport.nameAr : sport.nameFr,
      icon: sport.icon
    }))

    return {
      data,
      sports: sportsList,
      pagination: {
        page,
        pageSize,
        total,
        totalPages
      }
    }
  } catch (error) {
    console.error("Error fetching stadiums:", error)
    return {
      data: [],
      sports: [],
      pagination: {
        page,
        pageSize,
        total: 0,
        totalPages: 0
      }
    }
  }
}