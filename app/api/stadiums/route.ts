import { getStadiums } from "@/lib/data/stadium";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const search = searchParams.get("search") || "";
    const sports = searchParams.getAll("sports") || [];
    const page = Number(searchParams.get("page") || 1);

    const rawLocale = searchParams.get("locale");

    const locale: "ar" | "fr" | "en" =
      rawLocale === "ar" || rawLocale === "fr" || rawLocale === "en"
        ? rawLocale
        : "fr";

    const data = await getStadiums({
      locale,
      page,
      filters: {
        search,
        sports,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in stadiums API:", error);
    return NextResponse.json(
      {
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 6,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
      { status: 500 }
    );
  }
}
