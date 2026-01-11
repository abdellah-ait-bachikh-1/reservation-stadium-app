// app/api/public/stadiums/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { getStadiums } from "@/lib/queries/stadiums"

export interface StadiumsApiResponse {
  data: Array<{
    id: string
    name: string
    address: string
    googleMapsUrl?: string
    monthlyPrice?: number
    pricePerSession?: number
    image: string
    sports: Array<{
      id: string
      name: string
      icon?: string | null  // Add null here
    }>
  }>
  sports: Array<{
    id: string
    name: string
    icon?: string | null  // Add null here
  }>
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const search = searchParams.get("search") || ""
    const sportIds = searchParams.get("sports")?.split(",").filter(Boolean) || []
    const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10))
    const pageSize = Math.min(50, Math.max(1, Number.parseInt(searchParams.get("pageSize") || "10", 10)))
    const locale = (searchParams.get("locale") || "fr") as "fr" | "ar"

    // Get data from database
    const result = await getStadiums({
      page,
      pageSize,
      search,
      sportIds,
      locale
    })

    // Transform the data to match the interface
    const response: StadiumsApiResponse = {
      data: result.data.map(stadium => ({
        ...stadium,
        googleMapsUrl: stadium.googleMapsUrl || undefined,
        sports: stadium.sports.map(sport => ({
          id: sport.id,
          name: sport.name,
          icon: sport.icon || undefined  // Convert null to undefined
        }))
      })),
      sports: result.sports.map(sport => ({
        id: sport.id,
        name: sport.name,
        icon: sport.icon || undefined  // Convert null to undefined
      })),
      pagination: result.pagination
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Failed to fetch stadiums:", error)
    return NextResponse.json(
      { error: "Failed to fetch stadiums" },
      { status: 500 }
    )
  }
}