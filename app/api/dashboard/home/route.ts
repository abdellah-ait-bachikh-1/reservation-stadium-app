// app/api/dashboard/home/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSession } from "@/auth";
import { getLocaleFromNextIntlCookie } from "@/lib/api/locale";

// Helper function to get available years from database
async function getAvailableYears(): Promise<number[]> {
  try {
    // Get earliest and latest reservation dates
    const earliestReservation = await db.reservation.findFirst({
      where: { deletedAt: null },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    });

    const latestReservation = await db.reservation.findFirst({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });

    if (!earliestReservation || !latestReservation) {
      return [new Date().getFullYear()];
    }

    const startYear = earliestReservation.createdAt.getFullYear();
    const endYear = latestReservation.createdAt.getFullYear();

    const years: number[] = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }

    return years.reverse(); // Return most recent first
  } catch (error) {
    console.error("Error getting available years:", error);
    return [new Date().getFullYear()];
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
    const year =
      searchParams.get("year") || new Date().getFullYear().toString();
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    // Calculate date ranges
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    // Handle custom date range
    if (startDateParam && endDateParam) {
      startDate = new Date(startDateParam);
      endDate = new Date(endDateParam);
    }
    // Handle year selection
    else if (year) {
      const selectedYear = parseInt(year);
      startDate = new Date(selectedYear, 0, 1); // January 1st of selected year
      endDate = new Date(selectedYear, 11, 31, 23, 59, 59); // December 31st of selected year
    }
    // Handle predefined time ranges
    else {
      switch (timeRange) {
        case "day":
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
          );
          break;
        case "year":
          startDate = new Date(
            now.getFullYear() - 1,
            now.getMonth(),
            now.getDate()
          );
          break;
        default:
          startDate = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
          );
      }
    }

    // Fetch available years for filter dropdown
    const availableYears = await getAvailableYears();

    // Fetch core stats in parallel first, then derived data
    const [
      totalUsers,
      totalClubs,
      totalReservations,
      pendingReservations,
      totalRevenueAgg,
      monthlyRevenueAgg,
      activeStadiums,
      activeUsers,
      // NEW: Pending Approvals
      pendingUserApprovals,
      // NEW: Payment Stats
      totalCashPayments,
      totalMonthlyPayments,
      pendingMonthlyPaymentsCount,
      overduePaymentsCount,
      // NEW: Subscription Stats
      activeSubscriptionsCount,
      cancelledSubscriptionsCount,
      expiredSubscriptionsCount,
      suspendedSubscriptionsCount,
      subscriptionRevenueAgg,
    ] = await Promise.all([
      // Total Users (not deleted)
      db.user.count({
        where: { deletedAt: null },
      }),

      // Total Clubs (users with role CLUB)
      db.user.count({
        where: {
          deletedAt: null,
          role: "CLUB",
        },
      }),

      // Total Reservations
      db.reservation.count({
        where: {
          deletedAt: null,
          createdAt: { gte: startDate, lte: endDate },
        },
      }),

      // Pending Reservations
      db.reservation.count({
        where: {
          deletedAt: null,
          status: "PENDING",
          createdAt: { gte: startDate, lte: endDate },
        },
      }),

      // Total Revenue (sum of all paid reservations)
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

      // Monthly Revenue (last 30 days)
      db.reservation.aggregate({
        where: {
          deletedAt: null,
          isPaid: true,
          createdAt: {
            gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
            lte: endDate,
          },
        },
        _sum: {
          sessionPrice: true,
        },
      }),

      // Active Stadiums (with at least one reservation in period)
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

      // Active Users (users with reservations in selected period)
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

      // NEW: Pending User Approvals (User.approved = false)
      db.user.count({
        where: {
          deletedAt: null,
          approved: false,
          createdAt: { gte: startDate, lte: endDate },
        },
      }),

      // NEW: Total Cash Payments
      db.cashPaymentRecord.count({
        where: {
          paymentDate: { gte: startDate, lte: endDate },
        },
      }),

      // NEW: Total Monthly Payments
      db.monthlyPayment.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
      }),

      // NEW: Pending Monthly Payments (MonthlyPayment.status = PENDING)
      db.monthlyPayment.count({
        where: {
          status: "PENDING",
          createdAt: { gte: startDate, lte: endDate },
        },
      }),

      // NEW: Overdue Payments (MonthlyPayment.status = OVERDUE)
      db.monthlyPayment.count({
        where: {
          status: "OVERDUE",
          createdAt: { gte: startDate, lte: endDate },
        },
      }),

      // NEW: Active Subscriptions (MonthlySubscription.status = ACTIVE)
      db.monthlySubscription.count({
        where: {
          status: "ACTIVE",
          createdAt: { gte: startDate, lte: endDate },
        },
      }),

      // NEW: Cancelled Subscriptions
      db.monthlySubscription.count({
        where: {
          status: "CANCELLED",
          createdAt: { gte: startDate, lte: endDate },
        },
      }),

      // NEW: Expired Subscriptions
      db.monthlySubscription.count({
        where: {
          status: "EXPIRED",
          createdAt: { gte: startDate, lte: endDate },
        },
      }),

      // NEW: Suspended Subscriptions
      db.monthlySubscription.count({
        where: {
          status: "SUSPENDED",
          createdAt: { gte: startDate, lte: endDate },
        },
      }),

      // NEW: Subscription Revenue
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

    // Fetch remaining data with better error handling
    const [
      recentReservations,
      recentUsers,
      revenueData,
      sportDistribution,
      reservationsByStatus,
      topStadiumsRaw,
      topClubsRaw,
      // NEW: Recent pending users for review
      pendingUsersForReview,
      // NEW: Payments by status breakdown
      paymentsByStatus,
      // NEW: Subscription breakdown by status
      subscriptionsByStatus,
      // NEW: Payment type breakdown
      paymentTypeBreakdown,
      // NEW: Recent pending payments
      recentPendingPayments,
    ] = await Promise.all([
      // Recent Reservations (last 24 hours)
      db.reservation.findMany({
        where: {
          deletedAt: null,
          createdAt: {
            gte: new Date(now.getTime() - 24 * 60 * 60 * 1000),
            lte: endDate,
          },
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

      // Recent Users (last 7 days)
      db.user.findMany({
        where: {
          deletedAt: null,
          createdAt: {
            gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
            lte: endDate,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      }),

      // Revenue data for selected period
      (async () => {
        try {
          const months = [];
          const periodStart = startDate;
          const periodEnd = endDate;

          // Determine number of months to show based on time range
          const monthDiff =
            (periodEnd.getFullYear() - periodStart.getFullYear()) * 12 +
            (periodEnd.getMonth() - periodStart.getMonth());

          const numMonths = Math.min(
            Math.max(monthDiff + 1, 1),
            timeRange === "year" ? 12 : 6
          );

          for (let i = 0; i < numMonths; i++) {
            const monthDate = new Date(
              periodEnd.getFullYear(),
              periodEnd.getMonth() - i,
              1
            );
            const monthStart = new Date(
              monthDate.getFullYear(),
              monthDate.getMonth(),
              1
            );
            const monthEnd = new Date(
              monthDate.getFullYear(),
              monthDate.getMonth() + 1,
              0,
              23,
              59,
              59
            );

            const revenue = await db.reservation.aggregate({
              where: {
                deletedAt: null,
                isPaid: true,
                createdAt: {
                  gte: monthStart,
                  lte: monthEnd,
                },
              },
              _sum: {
                sessionPrice: true,
              },
            });

            const bookings = await db.reservation.count({
              where: {
                deletedAt: null,
                createdAt: {
                  gte: monthStart,
                  lte: monthEnd,
                },
              },
            });

            // Get month name based on locale
            let monthName: string;
            if (locale === "ar") {
              monthName = monthDate.toLocaleDateString("ar-MA", {
                month: "short",
                year: "numeric",
              });
            } else if (locale === "fr") {
              monthName = monthDate.toLocaleDateString("fr-FR", {
                month: "short",
                year: "numeric",
              });
            } else {
              monthName = monthDate.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              });
            }

            months.push({
              month: monthName,
              revenue: revenue._sum.sessionPrice?.toNumber() || 0,
              bookings,
            });
          }
          return months.reverse();
        } catch (error) {
          console.error("Error fetching revenue data:", error);
          return [];
        }
      })(),

      // Sport distribution based on reservations - Simplified Query
      (async () => {
        try {
          // Get sports and manually count reservations for each
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
              try {
                // Count reservations for clubs in this sport
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
              } catch (error) {
                console.error(
                  `Error counting reservations for sport ${sport.id}:`,
                  error
                );
                return {
                  name: locale === "ar" ? sport.nameAr : sport.nameFr,
                  value: 0,
                };
              }
            })
          );

          return sportsWithCounts.filter((item) => item.value > 0);
        } catch (error) {
          console.error("Error fetching sport distribution:", error);
          return [];
        }
      })(),

      // Reservations by status - FIXED QUERY
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

      // Top stadiums by reservations - FIXED QUERY
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

          // Get stadium names
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

      // Top clubs by activity - FIXED QUERY
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

          // Get club names
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

      // NEW: Recent pending users for review
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

      // NEW: Payments by status breakdown
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

      // NEW: Subscription breakdown by status
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

      // NEW: Payment type breakdown
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

      // NEW: Recent pending payments
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
      // Existing stats
      totalUsers,
      totalClubs,
      totalReservations,
      pendingReservations,
      totalRevenue: totalRevenueAgg._sum.sessionPrice?.toNumber() || 0,
      monthlyRevenue: monthlyRevenueAgg._sum.sessionPrice?.toNumber() || 0,
      activeStadiums,
      activeUsers,
      
      // NEW: Pending Approvals
      pendingUserApprovals,
      
      // NEW: Payment Stats
      totalPayments: totalCashPayments + totalMonthlyPayments,
      totalCashPayments,
      totalMonthlyPayments,
      pendingMonthlyPayments: pendingMonthlyPaymentsCount,
      overduePayments: overduePaymentsCount,
      
      // NEW: Subscription Stats
      activeSubscriptions: activeSubscriptionsCount,
      cancelledSubscriptions: cancelledSubscriptionsCount,
      expiredSubscriptions: expiredSubscriptionsCount,
      suspendedSubscriptions: suspendedSubscriptionsCount,
      subscriptionRevenue: subscriptionRevenueAgg._sum.amount?.toNumber() || 0,
    };

    return NextResponse.json({
      // Existing data
      stats,
      recentReservations,
      recentUsers,
      revenueData,
      sportDistribution,
      reservationsByStatus,
      topStadiums,
      topClubs,
      availableYears,
      
      // NEW: Pending Approvals Data
      pendingUsersForReview,
      
      // NEW: Payment Data
      paymentsByStatus,
      paymentTypeBreakdown,
      recentPendingPayments,
      
      // NEW: Subscription Data
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