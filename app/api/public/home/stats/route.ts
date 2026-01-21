// app/api/public/stats/route.ts
import { db } from "@/drizzle/db";
import {
  clubs,
  monthlySubscriptions,
  reservations,
  stadiums,
} from "@/drizzle/schema";
import { NextResponse } from "next/server";
import { count, eq, isNull } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Fetch counts concurrently
    const [
      stadiumsCountResult,
      clubsCountResult,
      reservationsCountResult,
      activeSubscriptionsResult,
    ] = await Promise.all([
      // Count active stadiums (not deleted) - MySQL style
      db
        .select({ count: count() })
        .from(stadiums)
        .where(isNull(stadiums.deletedAt)),

      // Count active clubs (not deleted)
      db.select({ count: count() }).from(clubs).where(isNull(clubs.deletedAt)),

      // Count reservations (use for single sessions + monthly)
      db
        .select({ count: count() })
        .from(reservations)
        .where(isNull(reservations.deletedAt)),

      // Count active subscriptions
      db
        .select({ count: count() })
        .from(monthlySubscriptions)
        .where(eq(monthlySubscriptions.status, "ACTIVE")),
    ]);

    // Extract counts from results (MySQL returns array with count object)
    const stadiumsCount = stadiumsCountResult[0]?.count || 0;
    const clubsCount = clubsCountResult[0]?.count || 0;
    const reservationsCount = reservationsCountResult[0]?.count || 0;
    const activeSubscriptions = activeSubscriptionsResult[0]?.count || 0;


    // Static 100% as requested
    const satisfactionRate = 100;

    // Format data - show actual counts with "+" if over threshold
    const formatWithPlus = (count: number, threshold: number = 100) => {
      return count >= threshold ? `${count} +` : `${count}`;
    };

    const stats = [
      {
        value: formatWithPlus(stadiumsCount, 10),
        label: "stadiums" as const,
      },
      {
        value: formatWithPlus(clubsCount, 100),
        label: "clubs" as const,
      },
      {
        value: formatWithPlus(reservationsCount, 1000),
        label: "reservations" as const,
      },
      {
        value: `${satisfactionRate} %`,
        label: "satisfaction" as const,
      },
    ];

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error fetching stats:", error);

    // Return fallback data if DB query fails
    return NextResponse.json(
      {
        stats: [
          { value: "5 +", label: "stadiums" as const },
          { value: "200 +", label: "clubs" as const },
          { value: "5000 +", label: "reservations" as const },
          { value: "100 %", label: "satisfaction" as const },
        ],
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
