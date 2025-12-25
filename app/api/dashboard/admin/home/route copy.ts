// app/api/dashboard/home/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSession } from "@/auth";
import { getLocaleFromNextIntlCookie } from "@/lib/api/locale";

// Helper function to get available years from database
async function getAvailableYears(): Promise<number[]> {
  
  try {
    const reservations = await db.reservation.findMany({
      where: { deletedAt: null },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    if (reservations.length === 0) {
      return [new Date().getFullYear()];
    }

    const years = new Set<number>();
    reservations.forEach(reservation => {
      years.add(reservation.createdAt.getFullYear());
    });

    return Array.from(years).sort((a, b) => b - a); // Recent years first
  } catch (error) {
    console.error("Error getting available years:", error);
    return [new Date().getFullYear()];
  }
}

// Helper function to calculate date range based on timeRange
function calculateDateRange(timeRange: string, selectedYear?: string | null) {
  const now = new Date();
  let startDate: Date;
  let endDate: Date = now;

  // If year is selected, always use that year regardless of timeRange
  if (selectedYear) {
    const year = parseInt(selectedYear);
    startDate = new Date(year, 0, 1); // January 1st
    endDate = new Date(year, 11, 31, 23, 59, 59); // December 31st
    console.log(`Year selected: ${year}, range: ${startDate.toISOString()} to ${endDate.toISOString()}`);
    return { startDate, endDate };
  }

  // Dynamic time ranges based on current date (when no specific year is selected)
  switch (timeRange) {
    case "day":
      // Today only
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      break;
    case "week":
      // Last 7 days including today
      startDate = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000); // 6 days ago
      startDate.setHours(0, 0, 0, 0);
      break;
    case "month":
      // Last 30 days including today
      startDate = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000); // 29 days ago
      startDate.setHours(0, 0, 0, 0);
      break;
    case "year":
      // Current year
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      break;
    default:
      // Default to last 30 days
      startDate = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
      startDate.setHours(0, 0, 0, 0);
  }

  console.log(`TimeRange: ${timeRange}, range: ${startDate.toISOString()} to ${endDate.toISOString()}`);
  return { startDate, endDate };
}

// Helper function to generate revenue data points
async function generateRevenueData(startDate: Date, endDate: Date, timeRange: string, locale: string) {
  try {
    const revenueData = [];
    
    // Get the actual time difference
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    console.log(`Generating revenue data for ${timeRange}, days diff: ${daysDiff}`);
    
    // Determine number of points and interval based on time range
    let numPoints: number;
    let interval: 'hour' | 'day' | 'week' | 'month';
    let intervalMs: number;
    
    switch (timeRange) {
      case "day":
        // 12 points for 24 hours (2-hour intervals)
        numPoints = 12;
        interval = 'hour';
        intervalMs = 2 * 60 * 60 * 1000; // 2 hours
        break;
      case "week":
        // 7 points for 7 days
        numPoints = 7;
        interval = 'day';
        intervalMs = 24 * 60 * 60 * 1000; // 1 day
        break;
      case "month":
        // 4 points for 4 weeks
        numPoints = 4;
        interval = 'week';
        intervalMs = 7 * 24 * 60 * 60 * 1000; // 7 days
        break;
      case "year":
        // 12 points for 12 months
        numPoints = 12;
        interval = 'month';
        intervalMs = 30.44 * 24 * 60 * 60 * 1000; // Average month
        break;
      default:
        numPoints = 12;
        interval = 'month';
        intervalMs = 30.44 * 24 * 60 * 60 * 1000;
    }

    for (let i = 0; i < numPoints; i++) {
      let pointStartDate: Date;
      let pointEndDate: Date;
      let label: string;

      if (interval === 'hour' && timeRange === 'day') {
        // For day view: 2-hour intervals
        const hourStart = i * 2;
        pointStartDate = new Date(startDate);
        pointStartDate.setHours(hourStart, 0, 0, 0);
        pointEndDate = new Date(pointStartDate);
        pointEndDate.setHours(hourStart + 2, 0, 0, 0);
        label = `${hourStart.toString().padStart(2, '0')}:00`;
      } else if (interval === 'day') {
        // For day intervals (week view)
        pointStartDate = new Date(startDate.getTime() + i * intervalMs);
        pointEndDate = new Date(pointStartDate.getTime() + intervalMs);
        
        // Get day name
        const days = locale === "ar"
          ? ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
          : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        label = days[pointStartDate.getDay()];
      } else if (interval === 'week') {
        // For week intervals (month view)
        pointStartDate = new Date(startDate.getTime() + i * intervalMs);
        pointEndDate = new Date(pointStartDate.getTime() + intervalMs);
        label = `Week ${i + 1}`;
      } else if (interval === 'month') {
        // For month intervals (year view)
        const monthStart = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
        pointStartDate = monthStart;
        pointEndDate = new Date(startDate.getFullYear(), startDate.getMonth() + i + 1, 0, 23, 59, 59);
        
        // Get month name based on locale
        if (locale === "ar") {
          label = pointStartDate.toLocaleDateString("ar-MA", { month: "short" });
        } else if (locale === "fr") {
          label = pointStartDate.toLocaleDateString("fr-FR", { month: "short" });
        } else {
          label = pointStartDate.toLocaleDateString("en-US", { month: "short" });
        }
      } else {
        // Fallback
        pointStartDate = startDate;
        pointEndDate = endDate;
        label = "Unknown";
      }

      // Ensure we don't exceed the end date
      if (pointEndDate > endDate) {
        pointEndDate = endDate;
      }

      // Fetch revenue and bookings for this period
      const [revenueAgg, bookings] = await Promise.all([
        db.reservation.aggregate({
          where: {
            deletedAt: null,
            isPaid: true,
            createdAt: {
              gte: pointStartDate,
              lte: pointEndDate,
            },
          },
          _sum: {
            sessionPrice: true,
          },
        }),
        db.reservation.count({
          where: {
            deletedAt: null,
            createdAt: {
              gte: pointStartDate,
              lte: pointEndDate,
            },
          },
        }),
      ]);

      revenueData.push({
        month: label,
        revenue: revenueAgg._sum.sessionPrice?.toNumber() || 0,
        bookings,
      });
    }

    console.log(`Generated ${revenueData.length} revenue data points`);
    return revenueData;
  } catch (error) {
    console.error("Error generating revenue data:", error);
    return [];
  }
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    const locale = await getLocaleFromNextIntlCookie();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query params
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "year";
    const year = searchParams.get("year");

    console.log(`API called with timeRange: ${timeRange}, year: ${year}`);

    // Calculate date range based on filters
    const { startDate, endDate } = calculateDateRange(timeRange, year);

    console.log(`Date range calculated: ${startDate.toISOString()} to ${endDate.toISOString()}`);

    // Fetch available years for filter dropdown
    const availableYears = await getAvailableYears();

    // Fetch core stats
    const [
      totalUsers,
      totalClubs,
      totalReservations,
      pendingReservations,
      totalRevenueAgg,
      activeStadiums,
      activeUsers,
      pendingUserApprovals,
    ] = await Promise.all([
      // Total Users (not deleted) - NOT filtered by date
      db.user.count({
        where: { deletedAt: null },
      }),

      // Total Clubs (users with role CLUB) - NOT filtered by date
      db.user.count({
        where: {
          deletedAt: null,
          role: "CLUB",
        },
      }),

      // Total Reservations - FILTERED BY DATE
      db.reservation.count({
        where: {
          deletedAt: null,
          createdAt: { gte: startDate, lte: endDate },
        },
      }),

      // Pending Reservations - FILTERED BY DATE
      db.reservation.count({
        where: {
          deletedAt: null,
          status: "PENDING",
          createdAt: { gte: startDate, lte: endDate },
        },
      }),

      // Total Revenue - FILTERED BY DATE
      db.reservation.aggregate({
        where: {
          deletedAt: null,
          isPaid: true,
          createdAt: { gte: startDate, lte: endDate },
        },
        _sum: {
          sessionPrice: true,
        },
      }),

      // Active Stadiums - FILTERED BY DATE
      db.stadium.count({
        where: {
          deletedAt: null,
          reservations: {
            some: {
              createdAt: { gte: startDate, lte: endDate },
            },
          },
        },
      }),

      // Active Users - FILTERED BY DATE
      db.user.count({
        where: {
          deletedAt: null,
          reservations: {
            some: {
              createdAt: { gte: startDate, lte: endDate },
            },
          },
        },
      }),

      // Pending User Approvals - FILTERED BY DATE
      db.user.count({
        where: {
          deletedAt: null,
          approved: false,
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
    ]);

    // Calculate monthly revenue (last 30 days from endDate)
    const monthlyStartDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    const monthlyRevenueAgg = await db.reservation.aggregate({
      where: {
        deletedAt: null,
        isPaid: true,
        createdAt: { gte: monthlyStartDate, lte: endDate },
      },
      _sum: {
        sessionPrice: true,
      },
    });

    // Fetch additional payment stats
    const [
      totalCashPayments,
      totalMonthlyPayments,
      pendingMonthlyPaymentsCount,
      overduePaymentsCount,
    ] = await Promise.all([
      // Total Cash Payments - FILTERED BY DATE
      db.cashPaymentRecord.count({
        where: {
          paymentDate: { gte: startDate, lte: endDate },
        },
      }),

      // Total Monthly Payments - FILTERED BY DATE
      db.monthlyPayment.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
      }),

      // Pending Monthly Payments - FILTERED BY DATE
      db.monthlyPayment.count({
        where: {
          status: "PENDING",
          createdAt: { gte: startDate, lte: endDate },
        },
      }),

      // Overdue Payments - FILTERED BY DATE
      db.monthlyPayment.count({
        where: {
          status: "OVERDUE",
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
    ]);

    // Fetch subscription stats
    const [
      activeSubscriptionsCount,
      cancelledSubscriptionsCount,
      expiredSubscriptionsCount,
      suspendedSubscriptionsCount,
      subscriptionRevenueAgg,
    ] = await Promise.all([
      // Active Subscriptions - FILTERED BY DATE
      db.monthlySubscription.count({
        where: {
          status: "ACTIVE",
          createdAt: { gte: startDate, lte: endDate },
        },
      }),

      // Cancelled Subscriptions - FILTERED BY DATE
      db.monthlySubscription.count({
        where: {
          status: "CANCELLED",
          createdAt: { gte: startDate, lte: endDate },
        },
      }),

      // Expired Subscriptions - FILTERED BY DATE
      db.monthlySubscription.count({
        where: {
          status: "EXPIRED",
          createdAt: { gte: startDate, lte: endDate },
        },
      }),

      // Suspended Subscriptions - FILTERED BY DATE
      db.monthlySubscription.count({
        where: {
          status: "SUSPENDED",
          createdAt: { gte: startDate, lte: endDate },
        },
      }),

      // Subscription Revenue - FILTERED BY DATE
      db.monthlyPayment.aggregate({
        where: {
          status: "PAID",
          createdAt: { gte: startDate, lte: endDate },
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    // Fetch remaining data with proper date filtering
    const [
      recentReservations,
      recentUsers,
      revenueData,
      sportDistribution,
      reservationsByStatus,
      topStadiumsRaw,
      topClubsRaw,
      pendingUsersForReview,
      paymentsByStatus,
      subscriptionsByStatus,
      paymentTypeBreakdown,
      recentPendingPayments,
    ] = await Promise.all([
      // Recent Reservations (within the selected date range, limited to 10)
      db.reservation.findMany({
        where: {
          deletedAt: null,
          createdAt: { gte: startDate, lte: endDate },
        },
        include: {
          user: {
            select: {
              fullNameFr: true,
              fullNameAr: true,
              email: true,
            },
          },
          stadium: {
            select: {
              nameFr: true,
              nameAr: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      }),

      // Recent Users (within the selected date range, limited to 10)
      db.user.findMany({
        where: {
          deletedAt: null,
          createdAt: { gte: startDate, lte: endDate },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      }),

      // Revenue data for selected period
      generateRevenueData(startDate, endDate, timeRange, locale),

      // Sport distribution based on reservations
      (async () => {
        try {
          const sports = await db.sport.findMany({
            where: { deletedAt: null },
            select: {
              id: true,
              nameAr: true,
              nameFr: true,
            },
          });

          const sportsWithCounts = await Promise.all(
            sports.map(async (sport) => {
              const reservationCount = await db.reservation.count({
                where: {
                  deletedAt: null,
                  createdAt: { gte: startDate, lte: endDate },
                  user: {
                    club: {
                      sportId: sport.id,
                      deletedAt: null,
                    },
                    deletedAt: null,
                  },
                },
              });

              return {
                name: locale === "ar" ? sport.nameAr : sport.nameFr,
                value: reservationCount,
              };
            })
          );

          return sportsWithCounts.filter((item) => item.value > 0);
        } catch (error) {
          console.error("Error fetching sport distribution:", error);
          return [];
        }
      })(),

      // Reservations by status
      (async () => {
        try {
          const statusCounts = await db.reservation.groupBy({
            by: ["status"],
            where: {
              deletedAt: null,
              createdAt: { gte: startDate, lte: endDate },
            },
            _count: true,
          });

          return statusCounts.map((item) => ({
            status: item.status,
            count: item._count,
          }));
        } catch (error) {
          console.error("Error fetching reservations by status:", error);
          return [];
        }
      })(),

      // Top stadiums by reservations
      (async () => {
        try {
          const topStadiums = await db.reservation.groupBy({
            by: ["stadiumId"],
            where: {
              deletedAt: null,
              createdAt: { gte: startDate, lte: endDate },
            },
            _count: true,
            orderBy: {
              _count: {
                stadiumId: "desc",
              },
            },
            take: 5,
          });

          const stadiumsWithNames = await Promise.all(
            topStadiums.map(async (stadium) => {
              const stadiumData = await db.stadium.findUnique({
                where: { id: stadium.stadiumId },
                select: {
                  nameFr: true,
                  nameAr: true,
                },
              });

              return {
                name:
                  locale === "ar"
                    ? stadiumData?.nameAr || "Unknown"
                    : stadiumData?.nameFr || "Unknown",
                reservations: stadium._count,
              };
            })
          );

          return stadiumsWithNames;
        } catch (error) {
          console.error("Error fetching top stadiums:", error);
          return [];
        }
      })(),

      // Top clubs by activity
      (async () => {
        try {
          const topClubs = await db.reservation.groupBy({
            by: ["userId"],
            where: {
              deletedAt: null,
              user: {
                role: "CLUB",
              },
              createdAt: { gte: startDate, lte: endDate },
            },
            _count: true,
            orderBy: {
              _count: {
                userId: "desc",
              },
            },
            take: 5,
          });

          const clubsWithNames = await Promise.all(
            topClubs.map(async (club) => {
              const userData = await db.user.findUnique({
                where: { id: club.userId },
                select: {
                  fullNameFr: true,
                  fullNameAr: true,
                },
              });

              return {
                name:
                  locale === "ar"
                    ? userData?.fullNameAr || "Unknown"
                    : userData?.fullNameFr || "Unknown",
                reservations: club._count,
              };
            })
          );

          return clubsWithNames;
        } catch (error) {
          console.error("Error fetching top clubs:", error);
          return [];
        }
      })(),

      // Recent pending users for review
      db.user.findMany({
        where: {
          deletedAt: null,
          approved: false,
          createdAt: { gte: startDate, lte: endDate },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      }),

      // Payments by status breakdown
      (async () => {
        try {
          const statusCounts = await db.monthlyPayment.groupBy({
            by: ["status"],
            where: {
              createdAt: { gte: startDate, lte: endDate },
            },
            _count: true,
          });

          return statusCounts.map((item) => ({
            status: item.status,
            count: item._count,
          }));
        } catch (error) {
          console.error("Error fetching payments by status:", error);
          return [];
        }
      })(),

      // Subscription breakdown by status
      (async () => {
        try {
          const statusCounts = await db.monthlySubscription.groupBy({
            by: ["status"],
            where: {
              createdAt: { gte: startDate, lte: endDate },
            },
            _count: true,
          });

          return statusCounts.map((item) => ({
            status: item.status,
            count: item._count,
          }));
        } catch (error) {
          console.error("Error fetching subscriptions by status:", error);
          return [];
        }
      })(),

      // Payment type breakdown
      (async () => {
        try {
          const typeCounts = await db.reservation.groupBy({
            by: ["paymentType"],
            where: {
              deletedAt: null,
              createdAt: { gte: startDate, lte: endDate },
            },
            _count: true,
          });

          return typeCounts.map((item) => ({
            type: item.paymentType,
            count: item._count,
          }));
        } catch (error) {
          console.error("Error fetching payment type breakdown:", error);
          return [];
        }
      })(),

      // Recent pending payments
      db.monthlyPayment.findMany({
        where: {
          status: "PENDING",
          createdAt: { gte: startDate, lte: endDate },
        },
        include: {
          user: {
            select: {
              fullNameFr: true,
              fullNameAr: true,
              email: true,
            },
          },
          reservationSeries: {
            select: {
              stadium: {
                select: {
                  nameFr: true,
                  nameAr: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      }),
    ]);

    // Process top stadiums and clubs
    const topStadiums = Array.isArray(topStadiumsRaw) ? topStadiumsRaw : [];
    const topClubs = Array.isArray(topClubsRaw) ? topClubsRaw : [];

    const stats = {
      totalUsers,
      totalClubs,
      totalReservations,
      pendingReservations,
      totalRevenue: totalRevenueAgg._sum.sessionPrice?.toNumber() || 0,
      monthlyRevenue: monthlyRevenueAgg._sum.sessionPrice?.toNumber() || 0,
      activeStadiums,
      activeUsers,
      pendingUserApprovals,
      totalPayments: totalCashPayments + totalMonthlyPayments,
      totalCashPayments,
      totalMonthlyPayments,
      pendingMonthlyPayments: pendingMonthlyPaymentsCount,
      overduePayments: overduePaymentsCount,
      activeSubscriptions: activeSubscriptionsCount,
      cancelledSubscriptions: cancelledSubscriptionsCount,
      expiredSubscriptions: expiredSubscriptionsCount,
      suspendedSubscriptions: suspendedSubscriptionsCount,
      subscriptionRevenue: subscriptionRevenueAgg._sum.amount?.toNumber() || 0,
    };

    // Log summary for debugging
    console.log(`Stats summary for ${timeRange} ${year || ''}:`);
    console.log(`- Total reservations: ${stats.totalReservations}`);
    console.log(`- Total revenue: ${stats.totalRevenue}`);
    console.log(`- Date range: ${startDate.toISOString()} to ${endDate.toISOString()}`);

    return NextResponse.json({
      stats,
      recentReservations,
      recentUsers,
      revenueData,
      sportDistribution,
      reservationsByStatus,
      topStadiums,
      topClubs,
      availableYears,
      pendingUsersForReview,
      paymentsByStatus,
      paymentTypeBreakdown,
      recentPendingPayments,
      subscriptionsByStatus,
      filters: {
        timeRange,
        year,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch dashboard data",
      },
      { status: 500 }
    );
  }
}