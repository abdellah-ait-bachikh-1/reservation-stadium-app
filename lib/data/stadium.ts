import db from "@/lib/db";
import { StadiumWhereInput } from "../generated/prisma/models";

const ITEMS_PER_PAGE = 6;

export interface GetStadiumsParams {
  locale: "ar" | "fr" | "en";
  page?: number;
  limit?: number;
  filters?: {
    search?: string;
    sports?: string[];
  };
}

export async function getStadiums({
  locale,
  page = 1,
  limit = ITEMS_PER_PAGE,
  filters = {},
}: GetStadiumsParams) {
  try {
    const skip = (page - 1) * limit;
    const { search, sports = [] } = filters;

    /** 🔑 ONE SOURCE OF TRUTH */
    const isArabic = locale === "ar";

    // Build where clause
    const whereClause: StadiumWhereInput = {
      deletedAt: null,
    };

    if (sports.length > 0) {
      whereClause.stadiumSports = {
        some: {
          sportId: { in: sports },
        },
      };
    }

  if (search && search.trim()) {
  const searchTerm = search.trim();
  whereClause.OR = [
    { nameFr: { contains: searchTerm ,} },
    { nameAr: { contains: searchTerm } },
    { addressFr: { contains: searchTerm } }, 
    { addressAr: { contains: searchTerm } }, 
  ];
}


    const [stadiums, total] = await Promise.all([
      db.stadium.findMany({
        where: whereClause,
        include: {
          images: {
            where: { deletedAt: null },
            take: 3,
          },
          stadiumSports: {
            include: {
              sport: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.stadium.count({ where: whereClause }),
    ]);

    const formattedStadiums = stadiums
      .map((stadium) => {
        const activeSports = stadium.stadiumSports.filter(
          (ss) => ss.sport && ss.sport.deletedAt === null
        );

        return {
          id: stadium.id,
          name: isArabic ? stadium.nameAr : stadium.nameFr,
          address: isArabic ? stadium.addressAr : stadium.addressFr,
          googleMapsUrl: stadium.googleMapsUrl,
          sports: activeSports.map((ss) => ({
            id: ss.sport.id,
            name: isArabic ? ss.sport.nameAr : ss.sport.nameFr,
          })),
          type:
            activeSports.length > 1
              ? "multiple-sports"
              : "single-sport",
          images: stadium.images.map((img) => ({
            id: img.id,
            imageUri: img.imageUri,
          })),
          monthlyPrice: stadium.monthlyPrice.toNumber(),
          pricePerSession: stadium.pricePerSession.toNumber(),
          currency: "MAD",
          createdAt: stadium.createdAt,
          updatedAt: stadium.updatedAt,
        };
      })
      .filter((stadium) => stadium.sports.length > 0);

    return {
      data: formattedStadiums,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching stadiums:", error);
    return {
      data: [],
      pagination: {
        currentPage: page,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: limit,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

export async function getSports(locale: "ar" | "fr" | "en") {
  try {
    const isArabic = locale === "ar";

    const sports = await db.sport.findMany({
      where: { deletedAt: null },
      orderBy: { nameFr: "asc" },
    });

    return sports.map((sport) => ({
      id: sport.id,
      name: isArabic ? sport.nameAr : sport.nameFr,
    }));
  } catch (error) {
    console.error("Error fetching sports:", error);
    return [];
  }
}
