// lib/queries/dashboard-home.ts
import { db } from "@/drizzle/db";
import {
  users,
  clubs,
  stadiums,
  reservations,
  monthlySubscriptions,
  monthlyPayments,
  cashPaymentRecords,
  stadiumSports,
  sports,
  notifications,
  reservationSeries,
} from "@/drizzle/schema";
import {
  eq,
  sql,
  and,
  gte,
  lte,
  isNull,
  desc,
  count,
  sum,
  between,
  inArray,
  or,
  like,
  isNotNull,
  lt,
} from "drizzle-orm";
import {
  startOfYear,
  endOfYear,
  startOfMonth,
  endOfMonth,
  subMonths,
  subYears,
} from "date-fns";
import { ReservationStatusType } from "@/types/db";

// Types based on your dashboard data structure
export interface DashboardStats {
  totalReservations: number;
  activeReservations: number;
  pendingReservations: number;
  totalClubs: number;
  totalStadiums: number;
  totalUsers: number;
  subscriptions: number;
  overduePayments: number;
  newClubsThisMonth: number;
  newUsersThisMonth: number;
  avgUtilization: number;
  completionRate: number;
}

export interface RecentActivity {
  id: string;
  type: "reservation" | "payment" | "subscription" | "user" | "club";
  title: string;
  description: string;
  time: string;
  status?: "success" | "pending" | "warning";
}

export interface OverduePayment {
  id: string;
  clubName: string;
  stadiumName: string;
  amount: number;
  dueDate: string;
  overdueDays: number;
  reservationSeriesId: string;
  userId: string;
  month: number;
  year: number;
}
export interface ChartData {
  month: string;
  value: number;
}

export interface StadiumRevenue {
  id: string;
  name: string;
  totalRevenue: number;
  subscriptionRevenue: number;
  singleSessionRevenue: number;
  percentage: number;
}

export interface MonthlyRevenueData {
  month: string;
  totalRevenue: number;
  subscriptionRevenue: number;
  singleSessionRevenue: number;
  paidAmount: number;
  overdueAmount: number;
  collectionRate: number;
}

export interface ReservationStatusData {
  status: ReservationStatusType;
  count: number;
  color: string;
}
export interface PendingUserApproval {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  emailVerifiedAt: string | null; 
  createdAt: string;
  timeAgo: string;
}
export interface DashboardStats {
  totalReservations: number;
  activeReservations: number;
  pendingReservations: number;
  totalClubs: number;
  totalStadiums: number;
  totalUsers: number;
  newClubsThisYear: number; // Add this
  newUsersThisYear: number; // Add this
  subscriptions: number;
  overduePayments: number;
  newClubsThisMonth: number;
  newUsersThisMonth: number;
  avgUtilization: number;
  completionRate: number;
  // Add changes object
  changes?: {
    totalReservationsChange?: string;
    activeReservationsChange?: string;
    pendingReservationsChange?: string;
    totalClubsChange?: string;
    totalStadiumsChange?: string;
    totalUsersChange?: string;
    subscriptionsChange?: string;
    overduePaymentsChange?: string;
    avgUtilizationChange?: string;
    completionRateChange?: string;
    newClubsChange?: string;
    newUsersChange?: string;
  };
}
// lib/queries/dashboard-home.ts
export async function getDashboardData(
  year: number = new Date().getFullYear(),
): Promise<{
  stats: DashboardStats;
  pendingUserApprovals: PendingUserApproval[];
  overduePayments: OverduePayment[]; // ADD THIS
  reservationsByMonth: ChartData[];
  revenueByMonth: MonthlyRevenueData[];
  revenueByStadium: StadiumRevenue[];
  reservationsByStatus: ReservationStatusData[];
  revenueTrends: MonthlyRevenueData[];
}> {
  try {
    const [
      stats,
      pendingUserApprovals,
      overduePayments, // ADD THIS
      reservationsByMonth,
      revenueByMonth,
      revenueByStadium, 
      reservationsByStatus,
    ] = await Promise.all([
      getDashboardStats(year),
      getPendingUserApprovals(year),
      getOverduePayments(year), // ADD THIS - Get overdue payments
      getReservationsByMonth(year),
      getRevenueByMonth(year),
      getRevenueByStadium(year), 
      getReservationsByStatus(year),
    ]);

    return {
      stats,
      pendingUserApprovals,
      overduePayments, // ADD THIS to return object
      reservationsByMonth,
      revenueByMonth,
      revenueByStadium,
      reservationsByStatus,
      revenueTrends: revenueByMonth,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}
export async function getOverduePayments(year: number): Promise<OverduePayment[]> {
  try {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // Validate year
    if (!year || year < 2020 || year > currentYear) {
      year = currentYear;
    }

    // Get overdue monthly payments with their details for the specified year
    const overduePayments = await db
      .select({
        id: monthlyPayments.id,
        amount: monthlyPayments.amount,
        month: monthlyPayments.month,
        year: monthlyPayments.year,
        status: monthlyPayments.status,
        createdAt: monthlyPayments.createdAt,
        clubName: users.name,
        stadiumName: stadiums.name,
        userId: monthlyPayments.userId,
        reservationSeriesId: monthlyPayments.reservationSeriesId,
      })
      .from(monthlyPayments)
      .innerJoin(users, eq(monthlyPayments.userId, users.id))
      .innerJoin(reservationSeries, eq(monthlyPayments.reservationSeriesId, reservationSeries.id))
      .innerJoin(stadiums, eq(reservationSeries.stadiumId, stadiums.id))
      .where(
        and(
          eq(monthlyPayments.status, "OVERDUE"),
          eq(monthlyPayments.year, year), // Filter by selected year
          isNull(users.deletedAt),
          isNull(stadiums.deletedAt)
        )
      )
      .orderBy(desc(monthlyPayments.month), desc(monthlyPayments.createdAt))
      .limit(10);

    // If no overdue payments, return empty array
    if (!overduePayments.length) {
      return [];
    }

    // Calculate overdue days and format data
    return overduePayments.map((payment) => {
      const dueDate = new Date(payment.year, payment.month - 1, 1);
      const overdueMs = today.getTime() - dueDate.getTime();
      const overdueDays = Math.floor(overdueMs / (1000 * 60 * 60 * 24));
      
      return {
        id: payment.id,
        clubName: payment.clubName,
        stadiumName: payment.stadiumName,
        amount: Number(payment.amount) || 0,
        dueDate: dueDate.toISOString().split('T')[0],
        overdueDays: Math.max(0, overdueDays),
        reservationSeriesId: payment.reservationSeriesId,
        userId: payment.userId,
        month: payment.month,
        year: payment.year,
      };
    });
  } catch (error) {
    console.error("Error fetching overdue payments:", error);
    return getMockOverduePayments();
  }
}


// Mock data function
function getMockOverduePayments(): OverduePayment[] {
  return [];
}
// lib/queries/dashboard-home.ts
// Add this function to get revenue by stadium
// lib/queries/dashboard-home.ts
export async function getRevenueByStadium(
  year: number,
): Promise<StadiumRevenue[]> {
  try {
    const startDate = startOfYear(new Date(year, 0, 1)).toISOString();
    const endDate = endOfYear(new Date(year, 11, 31)).toISOString();

    // Get single session revenue per stadium
    const singleSessionRevenue = await db
      .select({
        stadiumId: reservations.stadiumId,
        stadiumName: stadiums.name,
        amount: sum(cashPaymentRecords.amount),
      })
      .from(cashPaymentRecords)
      .innerJoin(reservations, eq(cashPaymentRecords.reservationId, reservations.id))
      .innerJoin(stadiums, eq(reservations.stadiumId, stadiums.id))
      .where(
        and(
          gte(cashPaymentRecords.createdAt, startDate),
          lte(cashPaymentRecords.createdAt, endDate),
          isNull(stadiums.deletedAt),
        ),
      )
      .groupBy(reservations.stadiumId, stadiums.name);

    // Get subscription revenue per stadium
    const subscriptionRevenue = await db
      .select({
        stadiumId: reservationSeries.stadiumId,
        stadiumName: stadiums.name,
        amount: sum(monthlyPayments.amount),
      })
      .from(monthlyPayments)
      .innerJoin(reservationSeries, eq(monthlyPayments.reservationSeriesId, reservationSeries.id))
      .innerJoin(stadiums, eq(reservationSeries.stadiumId, stadiums.id))
      .where(
        and(
          gte(monthlyPayments.createdAt, startDate),
          lte(monthlyPayments.createdAt, endDate),
          isNull(stadiums.deletedAt),
        ),
      )
      .groupBy(reservationSeries.stadiumId, stadiums.name);

    // Combine the results
    const revenueMap = new Map<string, StadiumRevenue>();

    // Process single session revenue
    singleSessionRevenue.forEach((row) => {
      if (row.stadiumId && row.stadiumName) {
        revenueMap.set(row.stadiumId, {
          id: row.stadiumId,
          name: row.stadiumName,
          totalRevenue: Number(row.amount) || 0,
          subscriptionRevenue: 0,
          singleSessionRevenue: Number(row.amount) || 0,
          percentage: 0,
        });
      }
    });

    // Add subscription revenue
    subscriptionRevenue.forEach((row) => {
      if (row.stadiumId && row.stadiumName) {
        const existing = revenueMap.get(row.stadiumId);
        const subscriptionAmount = Number(row.amount) || 0;
        
        if (existing) {
          existing.subscriptionRevenue = subscriptionAmount;
          existing.totalRevenue += subscriptionAmount;
        } else {
          revenueMap.set(row.stadiumId, {
            id: row.stadiumId,
            name: row.stadiumName,
            totalRevenue: subscriptionAmount,
            subscriptionRevenue: subscriptionAmount,
            singleSessionRevenue: 0,
            percentage: 0,
          });
        }
      }
    });

    // Convert to array and calculate percentages
    const stadiumRevenues = Array.from(revenueMap.values());
    const totalRevenue = stadiumRevenues.reduce((sum, stadium) => sum + stadium.totalRevenue, 0);

    // Calculate percentages
    stadiumRevenues.forEach((stadium) => {
      stadium.percentage = totalRevenue > 0 
        ? Math.round((stadium.totalRevenue / totalRevenue) * 100)
        : 0;
    });

    // Sort by total revenue descending
    return stadiumRevenues
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);
  } catch (error) {
    console.error("Error fetching revenue by stadium:", error);
    return getMockRevenueByStadium();
  }
}
// Add this mock function
function getMockRevenueByStadium(): StadiumRevenue[] {
  return [];
}
// Update the function name and return type
export async function getPendingUserApprovals(
  year: number,
): Promise<PendingUserApproval[]> {
  try {
    const startDate = startOfYear(new Date(year, 0, 1)).toISOString();
    const endDate = endOfYear(new Date(year, 11, 31)).toISOString();

    // Get unapproved users for the specific year
    const pendingUsers = await db.query.users.findMany({
      where: and(
        isNull(users.deletedAt),
        eq(users.isApproved, false),
        eq(users.role, "CLUB"), // Only CLUB users need approval
        gte(users.createdAt, startDate),
        lte(users.createdAt, endDate),
      ),
      orderBy: [desc(users.createdAt)],
      limit: 10,
      columns: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        emailVerifiedAt: true,
        createdAt: true,
      },
    });

    // If no pending users, return empty array
    if (!pendingUsers.length) {
      return [];
    }

    // Calculate time ago for each user
    const now = new Date();

    return pendingUsers.map((user) => {
      const createdAt = new Date(user.createdAt);
      const diffMs = now.getTime() - createdAt.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      let timeAgo = "";
      if (diffMins < 1) {
        timeAgo = "just now";
      } else if (diffMins < 60) {
        timeAgo = `${diffMins} minutes ago`;
      } else if (diffHours < 24) {
        timeAgo = `${diffHours} hours ago`;
      } else {
        timeAgo = `${diffDays} days ago`;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        createdAt: user.createdAt,
        emailVerifiedAt: user.emailVerifiedAt, // Add this field

        timeAgo,
      };
    });
  } catch (error) {
    console.error("Error fetching pending user approvals:", error);
    return [];
  }
}
// lib/queries/dashboard-home.ts - Updated getDashboardStats function

// Update the DashboardStats interface to include changes

// Get all dashboard statistics
// Get all dashboard statistics
export async function getDashboardStats(year: number): Promise<DashboardStats> {
  const currentDate = new Date();
  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);
  const startOfYearDate = startOfYear(new Date(year, 0, 1));
  const endOfYearDate = endOfYear(new Date(year, 11, 31));

  // Get previous year for comparison
  const previousYear = year - 1;

  // Execute all queries in parallel for better performance
  const [
    // YEAR-FILTERED QUERIES (most stats)
    totalReservationsResult,
    activeReservationsResult,
    pendingReservationsResult,
    totalClubsResult,
    newClubsThisYearResult, // YEAR-FILTERED: New Clubs this year
    newUsersThisYearResult, // YEAR-FILTERED: New Users this year

    // ALL-TIME QUERIES (these should NOT be year-filtered)
    totalStadiumsResult,
    totalUsersResult,
    subscriptionsResult,
    overduePaymentsResult,
    newClubsThisMonthResult, // This is current month (not year)
    newUsersThisMonthResult, // This is current month (not year)
  ] = await Promise.all([
    // Total Reservations (FILTERED BY YEAR)
    db
      .select({ count: count() })
      .from(reservations)
      .where(
        and(
          isNull(reservations.deletedAt),
          gte(reservations.createdAt, startOfYearDate.toISOString()),
          lte(reservations.createdAt, endOfYearDate.toISOString()),
        ),
      ),

    // Active Reservations (FILTERED BY YEAR)
    db
      .select({ count: count() })
      .from(reservations)
      .where(
        and(
          isNull(reservations.deletedAt),
          gte(
            reservations.startDateTime,
            new Date().toISOString().split("T")[0],
          ),
          eq(reservations.status, "APPROVED"),
          gte(reservations.createdAt, startOfYearDate.toISOString()),
          lte(reservations.createdAt, endOfYearDate.toISOString()),
        ),
      ),

    // Pending Reservations (FILTERED BY YEAR)
    db
      .select({ count: count() })
      .from(reservations)
      .where(
        and(
          isNull(reservations.deletedAt),
          eq(reservations.status, "PENDING"),
          gte(reservations.createdAt, startOfYearDate.toISOString()),
          lte(reservations.createdAt, endOfYearDate.toISOString()),
        ),
      ),

    // Total Clubs - FILTERED BY YEAR (clubs created up to this year)
    db
      .select({ count: count() })
      .from(clubs)
      .where(
        and(
          isNull(clubs.deletedAt),
          lte(clubs.createdAt, endOfYearDate.toISOString()),
        ),
      ),

    // NEW: New Clubs this year (YEAR-FILTERED - this is what you want)
    db
      .select({ count: count() })
      .from(clubs)
      .where(
        and(
          isNull(clubs.deletedAt),
          gte(clubs.createdAt, startOfYearDate.toISOString()),
          lte(clubs.createdAt, endOfYearDate.toISOString()),
        ),
      ),

    // NEW: New Users this year (YEAR-FILTERED - this is what you want)
    db
      .select({ count: count() })
      .from(users)
      .where(
        and(
          isNull(users.deletedAt),
          gte(users.createdAt, startOfYearDate.toISOString()),
          lte(users.createdAt, endOfYearDate.toISOString()),
        ),
      ),

    // Total Stadiums - ALL TIME (NOT year-filtered)
    db
      .select({ count: count() })
      .from(stadiums)
      .where(isNull(stadiums.deletedAt)),

    // Total Users - ALL TIME (NOT year-filtered)
    db.select({ count: count() }).from(users).where(isNull(users.deletedAt)),

    // Active Subscriptions - ALL TIME (not year-filtered)
    db
      .select({ count: count() })
      .from(monthlySubscriptions)
      .where(eq(monthlySubscriptions.status, "ACTIVE")),

    // Overdue Payments - FILTERED BY YEAR
    db
      .select({ count: count() })
      .from(monthlyPayments)
      .where(
        and(
          eq(monthlyPayments.status, "OVERDUE"),
          eq(monthlyPayments.year, year),
        ),
      ),

    // New Clubs this month - CURRENT MONTH (not year-filtered)
    db
      .select({ count: count() })
      .from(clubs)
      .where(
        and(
          isNull(clubs.deletedAt),
          gte(clubs.createdAt, startOfCurrentMonth.toISOString()),
          lte(clubs.createdAt, endOfCurrentMonth.toISOString()),
        ),
      ),

    // New Users this month - CURRENT MONTH (not year-filtered)
    db
      .select({ count: count() })
      .from(users)
      .where(
        and(
          isNull(users.deletedAt),
          gte(users.createdAt, startOfCurrentMonth.toISOString()),
          lte(users.createdAt, endOfCurrentMonth.toISOString()),
        ),
      ),
  ]);

  // Get previous year data for comparison
  const getPreviousYearData = async (): Promise<{
    totalReservations: number;
    activeReservations: number;
    pendingReservations: number;
    totalClubs: number;
    totalStadiums: number;
    totalUsers: number;
    subscriptions: number;
    overduePayments: number;
    newClubsThisMonth: number;
    newUsersThisMonth: number;
    newClubsThisYear: number; // Add this
    newUsersThisYear: number; // Add this
    avgUtilization: number;
    completionRate: number;
  }> => {
    if (previousYear < 2025) {
      return {
        totalReservations: 0,
        activeReservations: 0,
        pendingReservations: 0,
        totalClubs: 0,
        totalStadiums: 0,
        totalUsers: 0,
        subscriptions: 0,
        overduePayments: 0,
        newClubsThisMonth: 0,
        newUsersThisMonth: 0,
        newClubsThisYear: 0,
        newUsersThisYear: 0,
        avgUtilization: 0,
        completionRate: 0,
      };
    }

    const startOfPreviousYear = startOfYear(new Date(previousYear, 0, 1));
    const endOfPreviousYear = endOfYear(new Date(previousYear, 11, 31));

    // Get previous year stats
    const [
      totalReservationsPreviousResult,
      activeReservationsPreviousResult,
      pendingReservationsPreviousResult,
      totalClubsPreviousResult,
      newClubsPreviousYearResult, // Previous year's new clubs
      newUsersPreviousYearResult, // Previous year's new users
      overduePaymentsPreviousResult,
    ] = await Promise.all([
      // Total Reservations previous year
      db
        .select({ count: count() })
        .from(reservations)
        .where(
          and(
            isNull(reservations.deletedAt),
            gte(reservations.createdAt, startOfPreviousYear.toISOString()),
            lte(reservations.createdAt, endOfPreviousYear.toISOString()),
          ),
        ),

      // Active Reservations previous year
      db
        .select({ count: count() })
        .from(reservations)
        .where(
          and(
            isNull(reservations.deletedAt),
            eq(reservations.status, "APPROVED"),
            gte(reservations.createdAt, startOfPreviousYear.toISOString()),
            lte(reservations.createdAt, endOfPreviousYear.toISOString()),
          ),
        ),

      // Pending Reservations previous year
      db
        .select({ count: count() })
        .from(reservations)
        .where(
          and(
            isNull(reservations.deletedAt),
            eq(reservations.status, "PENDING"),
            gte(reservations.createdAt, startOfPreviousYear.toISOString()),
            lte(reservations.createdAt, endOfPreviousYear.toISOString()),
          ),
        ),

      // Total Clubs previous year
      db
        .select({ count: count() })
        .from(clubs)
        .where(
          and(
            isNull(clubs.deletedAt),
            lte(clubs.createdAt, endOfPreviousYear.toISOString()),
          ),
        ),

      // New Clubs previous year (YEAR-FILTERED)
      db
        .select({ count: count() })
        .from(clubs)
        .where(
          and(
            isNull(clubs.deletedAt),
            gte(clubs.createdAt, startOfPreviousYear.toISOString()),
            lte(clubs.createdAt, endOfPreviousYear.toISOString()),
          ),
        ),

      // New Users previous year (YEAR-FILTERED)
      db
        .select({ count: count() })
        .from(users)
        .where(
          and(
            isNull(users.deletedAt),
            gte(users.createdAt, startOfPreviousYear.toISOString()),
            lte(users.createdAt, endOfPreviousYear.toISOString()),
          ),
        ),

      // Overdue Payments previous year
      db
        .select({ count: count() })
        .from(monthlyPayments)
        .where(
          and(
            eq(monthlyPayments.status, "OVERDUE"),
            eq(monthlyPayments.year, previousYear),
          ),
        ),
    ]);

    // Calculate previous year avg utilization
    const totalStadiums = totalStadiumsResult[0]?.count || 1;
    const totalReservationsPreviousYear =
      totalReservationsPreviousResult[0]?.count || 0;
    const avgUtilizationPrevious = Math.min(
      100,
      Math.round((totalReservationsPreviousYear / (totalStadiums * 365)) * 100),
    );

    // Calculate previous year completion rate
    const completedReservationsPrevious = await db
      .select({ count: count() })
      .from(reservations)
      .where(
        and(
          isNull(reservations.deletedAt),
          gte(reservations.createdAt, startOfPreviousYear.toISOString()),
          lte(reservations.createdAt, endOfPreviousYear.toISOString()),
          eq(reservations.status, "APPROVED"),
        ),
      );

    const completionRatePrevious =
      totalReservationsPreviousYear > 0
        ? Math.round(
            ((completedReservationsPrevious[0]?.count || 0) /
              totalReservationsPreviousYear) *
              100,
          )
        : 0;

    return {
      totalReservations: totalReservationsPreviousYear,
      activeReservations: activeReservationsPreviousResult[0]?.count || 0,
      pendingReservations: pendingReservationsPreviousResult[0]?.count || 0,
      totalClubs: totalClubsPreviousResult[0]?.count || 0,
      totalStadiums: totalStadiumsResult[0]?.count || 0, // Stadiums are all-time
      totalUsers: totalUsersResult[0]?.count || 0, // Users are all-time
      subscriptions: 0, // Simplified - subscriptions are all-time
      overduePayments: overduePaymentsPreviousResult[0]?.count || 0,
      newClubsThisMonth: 0, // Simplified
      newUsersThisMonth: 0, // Simplified
      avgUtilization: avgUtilizationPrevious,
      completionRate: completionRatePrevious,
      newClubsThisYear: newClubsPreviousYearResult[0]?.count || 0,
      newUsersThisYear: newUsersPreviousYearResult[0]?.count || 0,
      // Previous year's new users
    };
  };

  // Get previous year data
  const previousYearData = await getPreviousYearData();

  // Calculate average stadium utilization
  const totalStadiums = totalStadiumsResult[0]?.count || 1;
  const totalReservationsThisYear = totalReservationsResult[0]?.count || 0;
  const avgUtilization = Math.min(
    100,
    Math.round((totalReservationsThisYear / (totalStadiums * 365)) * 100),
  );

  // Calculate completion rate (approved vs total reservations this year)
  const completedReservations = await db
    .select({ count: count() })
    .from(reservations)
    .where(
      and(
        isNull(reservations.deletedAt),
        gte(reservations.createdAt, startOfYearDate.toISOString()),
        lte(reservations.createdAt, endOfYearDate.toISOString()),
        eq(reservations.status, "APPROVED"),
      ),
    );

  const completionRate =
    totalReservationsThisYear > 0
      ? Math.round(
          ((completedReservations[0]?.count || 0) / totalReservationsThisYear) *
            100,
        )
      : 0;

  // Calculate changes
  const calculateChange = (current: number, previous: number): string => {
    if (previous === 0) return ""; // No change shown if no previous data
    const change = ((current - previous) / previous) * 100;
    return change >= 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`;
  };

  const calculateAbsoluteChange = (
    current: number,
    previous: number,
  ): string => {
    if (previous === 0) return ""; // No change shown if no previous data
    const change = current - previous;
    return change >= 0 ? `+${change}` : `${change}`;
  };

  return {
    totalReservations: totalReservationsResult[0]?.count || 0,
    activeReservations: activeReservationsResult[0]?.count || 0,
    pendingReservations: pendingReservationsResult[0]?.count || 0,
    totalClubs: totalClubsResult[0]?.count || 0,
    totalStadiums: totalStadiumsResult[0]?.count || 0, // ALL TIME
    totalUsers: totalUsersResult[0]?.count || 0, // ALL TIME
    subscriptions: subscriptionsResult[0]?.count || 0,
    overduePayments: overduePaymentsResult[0]?.count || 0,
    newClubsThisMonth: newClubsThisMonthResult[0]?.count || 0, // Current month
    newUsersThisMonth: newUsersThisMonthResult[0]?.count || 0, // Current month
    newClubsThisYear: newClubsThisYearResult[0]?.count || 0, // YEAR-FILTERED
    newUsersThisYear: newUsersThisYearResult[0]?.count || 0, // YEAR-FILTERED
    avgUtilization: avgUtilization || 0,
    completionRate: completionRate || 0,
    changes: {
      totalReservationsChange: calculateChange(
        totalReservationsResult[0]?.count || 0,
        previousYearData.totalReservations,
      ),
      activeReservationsChange: calculateChange(
        activeReservationsResult[0]?.count || 0,
        previousYearData.activeReservations,
      ),
      pendingReservationsChange: calculateAbsoluteChange(
        pendingReservationsResult[0]?.count || 0,
        previousYearData.pendingReservations,
      ),
      totalClubsChange: calculateChange(
        totalClubsResult[0]?.count || 0,
        previousYearData.totalClubs,
      ),
      totalStadiumsChange: calculateAbsoluteChange(
        totalStadiumsResult[0]?.count || 0,
        previousYearData.totalStadiums,
      ),
      totalUsersChange: calculateChange(
        totalUsersResult[0]?.count || 0,
        previousYearData.totalUsers,
      ),
      subscriptionsChange: calculateAbsoluteChange(
        subscriptionsResult[0]?.count || 0,
        previousYearData.subscriptions,
      ),
      overduePaymentsChange: calculateAbsoluteChange(
        overduePaymentsResult[0]?.count || 0,
        previousYearData.overduePayments,
      ),
      avgUtilizationChange: calculateChange(
        avgUtilization,
        previousYearData.avgUtilization,
      ),
      completionRateChange: calculateChange(
        completionRate,
        previousYearData.completionRate,
      ),
      newClubsChange: calculateAbsoluteChange(
        newClubsThisYearResult[0]?.count || 0,
        previousYearData.newClubsThisYear || 0,
      ),
      newUsersChange: calculateChange(
        newUsersThisYearResult[0]?.count || 0,
        previousYearData.newUsersThisYear || 0,
      ),
    },
  };
}
// Get recent activity from notifications and recent actions
export async function getRecentActivity(
  year: number,
): Promise<RecentActivity[]> {
  try {
    const startDate = startOfYear(new Date(year, 0, 1)).toISOString();
    const endDate = endOfYear(new Date(year, 11, 31)).toISOString();

    // Get recent notifications for the specific year
    const recentNotifications = await db.query.notifications.findMany({
      where: and(
        gte(notifications.createdAt, startDate),
        lte(notifications.createdAt, endDate),
      ),
      orderBy: [desc(notifications.createdAt)],
      limit: 10,
      with: {
        user: {
          columns: {
            name: true,
            email: true,
          },
        },
      },
    });

    // If no notifications, return empty array
    if (!recentNotifications.length) {
      return [];
    }

    // Transform notifications to activity format
    return recentNotifications.map((notification) => {
      let type: RecentActivity["type"] = "reservation";
      let status: RecentActivity["status"] = "success";

      // Determine type from notification model
      switch (notification.model) {
        case "RESERVATION":
          type = "reservation";
          break;
        case "PAYMENT":
          type = "payment";
          break;
        case "SUBSCRIPTION":
          type = "subscription";
          break;
        case "USER":
          type = "user";
          break;
        case "SYSTEM":
          type = "club";
          break;
      }

      // Determine status from notification type
      if (
        notification.type.includes("APPROVED") ||
        notification.type.includes("RECEIVED") ||
        notification.type.includes("VERIFIED")
      ) {
        status = "success";
      } else if (
        notification.type.includes("PENDING") ||
        notification.type.includes("REQUESTED")
      ) {
        status = "pending";
      } else if (
        notification.type.includes("OVERDUE") ||
        notification.type.includes("CANCELLED") ||
        notification.type.includes("DECLINED")
      ) {
        status = "warning";
      }

      // Calculate time ago
      const createdAt = new Date(notification.createdAt);
      const now = new Date();
      const diffMs = now.getTime() - createdAt.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      let time = "";
      if (diffMins < 1) {
        time = "just now";
      } else if (diffMins < 60) {
        time = `${diffMins} minutes ago`;
      } else if (diffHours < 24) {
        time = `${diffHours} hours ago`;
      } else {
        time = `${diffDays} days ago`;
      }

      return {
        id: notification.id,
        type,
        title: notification.titleEn,
        description: notification.messageEn,
        time,
        status,
      };
    });
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return getMockRecentActivity(year);
  }
}



// Get reservations by month for a specific year
export async function getReservationsByMonth(
  year: number,
): Promise<ChartData[]> {
  try {
    const startDate = startOfYear(new Date(year, 0, 1)).toISOString();
    const endDate = endOfYear(new Date(year, 11, 31)).toISOString();

    // Group reservations by month
    const reservationsByMonth = await db
      .select({
        month: sql<string>`MONTH(${reservations.createdAt})`,
        count: count(),
      })
      .from(reservations)
      .where(
        and(
          isNull(reservations.deletedAt),
          gte(reservations.createdAt, startDate),
          lte(reservations.createdAt, endDate),
        ),
      )
      .groupBy(sql`MONTH(${reservations.createdAt})`);

    // Create array for all 12 months
    const monthlyData: ChartData[] = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2000, i, 1).toLocaleDateString("en-US", {
        month: "short",
      }),
      value: 0,
    }));

    // Fill in actual data
    reservationsByMonth.forEach((item) => {
      const monthIndex = parseInt(item.month) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyData[monthIndex].value = item.count;
      }
    });

    return monthlyData;
  } catch (error) {
    console.error("Error fetching reservations by month:", error);
    return getMockReservationsByMonth(year);
  }
}

// Get revenue by month for a specific year
export async function getRevenueByMonth(
  year: number,
): Promise<MonthlyRevenueData[]> {
  try {
    const startDate = startOfYear(new Date(year, 0, 1)).toISOString();
    const endDate = endOfYear(new Date(year, 11, 31)).toISOString();

    // Get all payments for the year
    const monthlyPaymentsData = await db
      .select({
        month: sql<string>`MONTH(${monthlyPayments.createdAt})`,
        amount: sum(monthlyPayments.amount),
        status: monthlyPayments.status,
      })
      .from(monthlyPayments)
      .where(
        and(
          gte(monthlyPayments.createdAt, startDate),
          lte(monthlyPayments.createdAt, endDate),
        ),
      )
      .groupBy(
        sql`MONTH(${monthlyPayments.createdAt})`,
        monthlyPayments.status,
      );

    // Get single session payments
    const cashPaymentsData = await db
      .select({
        month: sql<string>`MONTH(${cashPaymentRecords.createdAt})`,
        amount: sum(cashPaymentRecords.amount),
      })
      .from(cashPaymentRecords)
      .where(
        and(
          gte(cashPaymentRecords.createdAt, startDate),
          lte(cashPaymentRecords.createdAt, endDate),
          isNull(cashPaymentRecords.reservationId), // Single session payments
        ),
      )
      .groupBy(sql`MONTH(${cashPaymentRecords.createdAt})`);

    // Create array for all 12 months
    const monthlyData: MonthlyRevenueData[] = Array.from(
      { length: 12 },
      (_, i) => ({
        month: new Date(2000, i, 1).toLocaleDateString("en-US", {
          month: "short",
        }),
        totalRevenue: 0,
        subscriptionRevenue: 0,
        singleSessionRevenue: 0,
        paidAmount: 0,
        overdueAmount: 0,
        collectionRate: 0,
      }),
    );

    // Process subscription payments
    monthlyPaymentsData.forEach((item) => {
      const monthIndex = parseInt(item.month) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        const amount = Number(item.amount) || 0;
        monthlyData[monthIndex].subscriptionRevenue += amount;
        monthlyData[monthIndex].totalRevenue += amount;

        if (item.status === "PAID") {
          monthlyData[monthIndex].paidAmount += amount;
        } else if (item.status === "OVERDUE") {
          monthlyData[monthIndex].overdueAmount += amount;
        }
      }
    });

    // Process single session payments
    cashPaymentsData.forEach((item) => {
      const monthIndex = parseInt(item.month) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        const amount = Number(item.amount) || 0;
        monthlyData[monthIndex].singleSessionRevenue += amount;
        monthlyData[monthIndex].totalRevenue += amount;
        monthlyData[monthIndex].paidAmount += amount; // Cash payments are considered paid
      }
    });

    // Calculate collection rate for each month
    monthlyData.forEach((month) => {
      month.collectionRate =
        month.totalRevenue > 0
          ? Math.round((month.paidAmount / month.totalRevenue) * 100)
          : 0;
    });

    return monthlyData;
  } catch (error) {
    console.error("Error fetching revenue by month:", error);
    return getMockRevenueTrends(year);
  }
}


// Get reservation status distribution
export async function getReservationsByStatus(
  year: number,
): Promise<ReservationStatusData[]> {
  try {
    const startDate = startOfYear(new Date(year, 0, 1)).toISOString();
    const endDate = endOfYear(new Date(year, 11, 31)).toISOString();

    const statusData = await db
      .select({
        status: reservations.status,
        count: count(),
      })
      .from(reservations)
      .where(
        and(
          isNull(reservations.deletedAt),
          gte(reservations.createdAt, startDate),
          lte(reservations.createdAt, endDate),
        ),
      )
      .groupBy(reservations.status);

    // If no data, return empty array
    if (!statusData.length) {
      return [];
    }

    // Define colors for each status
    const statusColors: Record<ReservationStatusType, string> = {
      PENDING: "#f59e0b",
      APPROVED: "#10b981",
      DECLINED: "#ef4444",
      CANCELLED: "#6b7280",
      PAID: "#3b82f6",
      UNPAID: "#ec4899",
    };

    return statusData.map((item) => ({
      status: item.status,
      count: item.count,
      color: statusColors[item.status] || "#6b7280",
    }));
  } catch (error) {
    console.error("Error fetching reservations by status:", error);
    return getMockReservationsByStatus(year);
  }
}

// Mock data functions (fallback in case of errors) - All return empty/zero values
function getMockRecentActivity(year: number): RecentActivity[] {
  return []; // Always return empty array
}



function getMockReservationsByMonth(year: number): ChartData[] {
  // Return all months with value 0
  return Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2000, i, 1).toLocaleDateString("en-US", { month: "short" }),
    value: 0,
  }));
}

function getMockRevenueTrends(year: number): MonthlyRevenueData[] {
  // Return all months with all values as 0
  return Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2000, i, 1).toLocaleDateString("en-US", { month: "short" }),
    totalRevenue: 0,
    subscriptionRevenue: 0,
    singleSessionRevenue: 0,
    paidAmount: 0,
    overdueAmount: 0,
    collectionRate: 0,
  }));
}



function getMockReservationsByStatus(year: number): ReservationStatusData[] {
  return []; // Always return empty array
}

// Get available years with data (from 2026 to current year)
export async function getAvailableYears(): Promise<number[]> {
  try {
    // Get distinct years from monthlyPayments table
    const yearsData = await db
      .selectDistinct({ year: monthlyPayments.year })
      .from(monthlyPayments)
      .orderBy(desc(monthlyPayments.year));

    const yearsFromPayments = yearsData
      .map((item) => item.year)
      .filter((year) => year >= 2026);

    // Always include current year
    const currentYear = new Date().getFullYear();
    const allYears = [...new Set([...yearsFromPayments, currentYear])]
      .filter((year) => year >= 2026 && year <= currentYear)
      .sort((a, b) => b - a); // Sort descending (most recent first)

    return allYears.length > 0 ? allYears : [currentYear];
  } catch (error) {
    console.error("Error fetching available years:", error);
    // Fallback: generate years from 2026 to current year
    const currentYear = new Date().getFullYear();
    const startYear = 2026;
    return Array.from(
      { length: Math.max(0, currentYear - startYear + 1) },
      (_, i) => startYear + i,
    ).reverse();
  }
}
