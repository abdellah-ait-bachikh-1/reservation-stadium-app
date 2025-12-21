"use server";

import db from "@/lib/db";
import type { Sport, Stadium, StadiumImage, StadiumSport } from "@/lib/generated/prisma/client"

export async function getStadiums(locale: "ar" | "fr") {
  try {
    const stadiums = await db.stadium.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        images: {
          where: {
            deletedAt: null,
          },
          take: 3,
        },
        stadiumSports: {
          include: {
            sport: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return stadiums.map((stadium): any => {
      return {
        id: stadium.id,
        name: locale === "ar" ? stadium.nameAr : stadium.nameFr,
        address: locale === "ar" ? stadium.adressAr : stadium.adressfr,
        googleMapsUrl: stadium.googleMapsUrl,
        sports: stadium.stadiumSports.map(ss => ({
          id: ss.sport.id,
          name: locale === "ar" ? ss.sport.nameAr : ss.sport.nameFr,
        })),
        type: stadium.stadiumSports.length > 1 ? "multiple-sports" : "single-sport",
        images: stadium.images.map(img => ({
          id: img.id,
          imageUri: img.imageUri,
        })),
        monthlyPrice: stadium.monthlyPrice.toNumber(),
        pricePerSession: stadium.pricePerSession.toNumber(),
        currency: "MAD",
        createdAt: stadium.createdAt,
        updatedAt: stadium.updatedAt,
      };
    });
  } catch (error) {
    console.error("Error fetching stadiums:", error);
    return [];
  }
}

export async function getSports(locale: "ar" | "fr") {
  try {
    const sports = await db.sport.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        nameFr: "asc",
      },
    });

    return sports.map(sport => ({
      id: sport.id,
      name: locale === "ar" ? sport.nameAr : sport.nameFr,
    }));
  } catch (error) {
    console.error("Error fetching sports:", error);
    return [];
  }
}