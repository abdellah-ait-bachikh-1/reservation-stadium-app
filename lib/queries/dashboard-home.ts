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

// ==================== TYPES ====================
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
  // ALL TIME
  totalClubs: number;
  totalStadiums: number;
  totalUsers: number;
  
  // YEAR FILTERED
  totalReservations: number;
  activeReservations: number;
  pendingReservations: number;
  newClubsThisYear: number;
  newUsersThisYear: number;
  subscriptions: number;
  overduePayments: number;
  overdueAmount: number;
  avgUtilization: number;
  completionRate: number;
  
  // MONTH FILTERED
  newClubsThisMonth: number;
  newUsersThisMonth: number;
  
  changes?: {
    totalReservationsChange?: string;
    activeReservationsChange?: string;
    pendingReservationsChange?: string;
    totalClubsChange?: string;
    totalStadiumsChange?: string;
    totalUsersChange?: string;
    subscriptionsChange?: string;
    overduePaymentsChange?: string;
    overdueAmountChange?: string;
    avgUtilizationChange?: string;
    completionRateChange?: string;
    newClubsChange?: string;
    newUsersChange?: string;
  };
}

// ==================== MAIN DATA FETCHER ====================
// ==================== MAIN DATA FETCHER ====================
export async function getDashboardData(
  year: number = new Date().getFullYear(),
): Promise<{
  stats: DashboardStats;
  pendingUserApprovals: PendingUserApproval[];
  overduePayments: OverduePayment[];
  reservationsByMonth: ChartData[];
  revenueByMonth: MonthlyRevenueData[];
  revenueByStadium: StadiumRevenue[];
  reservationsByStatus: ReservationStatusData[];
  revenueTrends: MonthlyRevenueData[];
  availableYears: number[]; // ADD THIS
}> {
  try {
    const [
      stats,
      pendingUserApprovals,
      overduePayments,
      reservationsByMonth,
      revenueByMonth,
      revenueByStadium,
      reservationsByStatus,
      availableYears, // ADD THIS
    ] = await Promise.all([
      getDashboardStats(year),
      getPendingUserApprovals(year),
      getOverduePayments(year),
      getReservationsByMonth(year),
      getRevenueByMonth(year),
      getRevenueByStadium(year),
      getReservationsByStatus(year),
      getAvailableYears(), // ADD THIS
    ]);

    return {
      stats,
      pendingUserApprovals,
      overduePayments,
      reservationsByMonth,
      revenueByMonth,
      revenueByStadium,
      reservationsByStatus,
      revenueTrends: revenueByMonth,
      availableYears, // ADD THIS
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}

// ==================== OVERDUE PAYMENTS ====================
export async function getOverduePayments(year: number): Promise<OverduePayment[]> {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    // Validate year
    if (!year || year < 2020 || year > currentYear) {
      year = currentYear;
    }

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
          eq(monthlyPayments.year, year),
          isNull(users.deletedAt),
          isNull(stadiums.deletedAt)
        )
      )
      .orderBy(desc(monthlyPayments.month), desc(monthlyPayments.createdAt))
      .limit(10);

    if (!overduePayments.length) {
      return [];
    }

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
    return [];
  }
}

// ==================== REVENUE BY STADIUM ====================
export async function getRevenueByStadium(year: number): Promise<StadiumRevenue[]> {
  try {
    const startDate = startOfYear(new Date(year, 0, 1)).toISOString();
    const endDate = endOfYear(new Date(year, 11, 31)).toISOString();

    // Single session revenue per stadium (YEAR)
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

    // Subscription revenue per stadium (YEAR)
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

    // Combine results
    const revenueMap = new Map<string, StadiumRevenue>();

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

    const stadiumRevenues = Array.from(revenueMap.values());
    const totalRevenue = stadiumRevenues.reduce((sum, stadium) => sum + stadium.totalRevenue, 0);

    stadiumRevenues.forEach((stadium) => {
      stadium.percentage = totalRevenue > 0 
        ? Math.round((stadium.totalRevenue / totalRevenue) * 100)
        : 0;
    });

    return stadiumRevenues
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);
  } catch (error) {
    console.error("Error fetching revenue by stadium:", error);
    return [];
  }
}

// ==================== PENDING USER APPROVALS ====================
export async function getPendingUserApprovals(year: number): Promise<PendingUserApproval[]> {
  try {
    const startDate = startOfYear(new Date(year, 0, 1)).toISOString();
    const endDate = endOfYear(new Date(year, 11, 31)).toISOString();

    const pendingUsers = await db.query.users.findMany({
      where: and(
        isNull(users.deletedAt),
        eq(users.isApproved, false),
        eq(users.role, "CLUB"),
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

    if (!pendingUsers.length) {
      return [];
    }

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
        emailVerifiedAt: user.emailVerifiedAt,
        timeAgo,
      };
    });
  } catch (error) {
    console.error("Error fetching pending user approvals:", error);
    return [];
  }
}

// ==================== DASHBOARD STATS ====================
export async function getDashboardStats(year: number): Promise<DashboardStats> {
  const currentDate = new Date();
  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);
  const startOfYearDate = startOfYear(new Date(year, 0, 1));
  const endOfYearDate = endOfYear(new Date(year, 11, 31));
  const previousYear = year - 1;

  // Execute all queries in parallel
  const [
    // ALL TIME QUERIES
    totalClubsResult,
    totalStadiumsResult,
    totalUsersResult,
    
    // YEAR FILTERED QUERIES
    totalReservationsResult,
    activeReservationsResult,
    pendingReservationsResult,
    newClubsThisYearResult,
    newUsersThisYearResult,
    subscriptionsResult,
    overduePaymentsResult,
    overdueAmountResult,
    
    // MONTH FILTERED QUERIES
    newClubsThisMonthResult,
    newUsersThisMonthResult,
  ] = await Promise.all([
    // ALL TIME: Total Clubs
    db.select({ count: count() })
      .from(clubs)
      .where(isNull(clubs.deletedAt)),

    // ALL TIME: Total Stadiums
    db.select({ count: count() })
      .from(stadiums)
      .where(isNull(stadiums.deletedAt)),

    // ALL TIME: Total Users
    db.select({ count: count() })
      .from(users)
      .where(isNull(users.deletedAt)),

    // YEAR: Total Reservations
    db.select({ count: count() })
      .from(reservations)
      .where(
        and(
          isNull(reservations.deletedAt),
          gte(reservations.createdAt, startOfYearDate.toISOString()),
          lte(reservations.createdAt, endOfYearDate.toISOString()),
        ),
      ),

    // YEAR: Active Reservations
    db.select({ count: count() })
      .from(reservations)
      .where(
        and(
          isNull(reservations.deletedAt),
          gte(reservations.startDateTime, currentDate.toISOString().split("T")[0]),
          eq(reservations.status, "APPROVED"),
          gte(reservations.createdAt, startOfYearDate.toISOString()),
          lte(reservations.createdAt, endOfYearDate.toISOString()),
        ),
      ),

    // YEAR: Pending Reservations
    db.select({ count: count() })
      .from(reservations)
      .where(
        and(
          isNull(reservations.deletedAt),
          eq(reservations.status, "PENDING"),
          gte(reservations.createdAt, startOfYearDate.toISOString()),
          lte(reservations.createdAt, endOfYearDate.toISOString()),
        ),
      ),

    // YEAR: New Clubs this year
    db.select({ count: count() })
      .from(clubs)
      .where(
        and(
          isNull(clubs.deletedAt),
          gte(clubs.createdAt, startOfYearDate.toISOString()),
          lte(clubs.createdAt, endOfYearDate.toISOString()),
        ),
      ),

    // YEAR: New Users this year
    db.select({ count: count() })
      .from(users)
      .where(
        and(
          isNull(users.deletedAt),
          gte(users.createdAt, startOfYearDate.toISOString()),
          lte(users.createdAt, endOfYearDate.toISOString()),
        ),
      ),

    // YEAR: Active Subscriptions (using created date)
    db.select({ count: count() })
      .from(monthlySubscriptions)
      .where(
        and(
          eq(monthlySubscriptions.status, "ACTIVE"),
          gte(monthlySubscriptions.createdAt, startOfYearDate.toISOString()),
          lte(monthlySubscriptions.createdAt, endOfYearDate.toISOString()),
        ),
      ),

    // YEAR: Overdue Payments Count
    db.select({ count: count() })
      .from(monthlyPayments)
      .where(
        and(
          eq(monthlyPayments.status, "OVERDUE"),
          eq(monthlyPayments.year, year),
        ),
      ),

    // YEAR: Overdue Payments Amount
    db.select({ totalAmount: sum(monthlyPayments.amount) })
      .from(monthlyPayments)
      .where(
        and(
          eq(monthlyPayments.status, "OVERDUE"),
          eq(monthlyPayments.year, year),
        ),
      ),

    // MONTH: New Clubs this month
    db.select({ count: count() })
      .from(clubs)
      .where(
        and(
          isNull(clubs.deletedAt),
          gte(clubs.createdAt, startOfCurrentMonth.toISOString()),
          lte(clubs.createdAt, endOfCurrentMonth.toISOString()),
        ),
      ),

    // MONTH: New Users this month
    db.select({ count: count() })
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
  const previousYearData = await getPreviousYearData(year, previousYear);

  // Calculate YEAR: Average stadium utilization
  const totalStadiums = totalStadiumsResult[0]?.count || 1;
  const totalReservationsThisYear = totalReservationsResult[0]?.count || 0;
  const avgUtilization = Math.min(
    100,
    Math.round((totalReservationsThisYear / (totalStadiums * 365)) * 100),
  );

  // Calculate YEAR: Completion rate
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
    if (previous === 0) return "";
    const change = ((current - previous) / previous) * 100;
    return change >= 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`;
  };

  const calculateAbsoluteChange = (current: number, previous: number): string => {
    if (previous === 0) return "";
    const change = current - previous;
    return change >= 0 ? `+${change}` : `${change}`;
  };

  return {
    // ALL TIME
    totalClubs: totalClubsResult[0]?.count || 0,
    totalStadiums: totalStadiumsResult[0]?.count || 0,
    totalUsers: totalUsersResult[0]?.count || 0,
    
    // YEAR
    totalReservations: totalReservationsResult[0]?.count || 0,
    activeReservations: activeReservationsResult[0]?.count || 0,
    pendingReservations: pendingReservationsResult[0]?.count || 0,
    newClubsThisYear: newClubsThisYearResult[0]?.count || 0,
    newUsersThisYear: newUsersThisYearResult[0]?.count || 0,
    subscriptions: subscriptionsResult[0]?.count || 0,
    overduePayments: overduePaymentsResult[0]?.count || 0,
    overdueAmount: Number(overdueAmountResult[0]?.totalAmount) || 0,
    avgUtilization: avgUtilization || 0,
    completionRate: completionRate || 0,
    
    // MONTH
    newClubsThisMonth: newClubsThisMonthResult[0]?.count || 0,
    newUsersThisMonth: newUsersThisMonthResult[0]?.count || 0,
    
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
      overdueAmountChange: calculateChange(
        Number(overdueAmountResult[0]?.totalAmount) || 0,
        previousYearData.overdueAmount || 0,
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

// Helper function for previous year data
async function getPreviousYearData(
  currentYear: number,
  previousYear: number
): Promise<{
  totalReservations: number;
  activeReservations: number;
  pendingReservations: number;
  totalClubs: number;
  totalStadiums: number;
  totalUsers: number;
  subscriptions: number;
  overduePayments: number;
  overdueAmount: number;
  newClubsThisMonth: number;
  newUsersThisMonth: number;
  newClubsThisYear: number;
  newUsersThisYear: number;
  avgUtilization: number;
  completionRate: number;
}> {
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
      overdueAmount: 0,
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

  const [
    totalReservationsPrevious,
    activeReservationsPrevious,
    pendingReservationsPrevious,
    totalClubsPrevious,
    newClubsPreviousYear,
    newUsersPreviousYear,
    overduePaymentsPrevious,
    overdueAmountPrevious,
  ] = await Promise.all([
    db.select({ count: count() }).from(reservations).where(
      and(
        isNull(reservations.deletedAt),
        gte(reservations.createdAt, startOfPreviousYear.toISOString()),
        lte(reservations.createdAt, endOfPreviousYear.toISOString()),
      ),
    ),
    db.select({ count: count() }).from(reservations).where(
      and(
        isNull(reservations.deletedAt),
        eq(reservations.status, "APPROVED"),
        gte(reservations.createdAt, startOfPreviousYear.toISOString()),
        lte(reservations.createdAt, endOfPreviousYear.toISOString()),
      ),
    ),
    db.select({ count: count() }).from(reservations).where(
      and(
        isNull(reservations.deletedAt),
        eq(reservations.status, "PENDING"),
        gte(reservations.createdAt, startOfPreviousYear.toISOString()),
        lte(reservations.createdAt, endOfPreviousYear.toISOString()),
      ),
    ),
    db.select({ count: count() }).from(clubs).where(
      and(
        isNull(clubs.deletedAt),
        lte(clubs.createdAt, endOfPreviousYear.toISOString()),
      ),
    ),
    db.select({ count: count() }).from(clubs).where(
      and(
        isNull(clubs.deletedAt),
        gte(clubs.createdAt, startOfPreviousYear.toISOString()),
        lte(clubs.createdAt, endOfPreviousYear.toISOString()),
      ),
    ),
    db.select({ count: count() }).from(users).where(
      and(
        isNull(users.deletedAt),
        gte(users.createdAt, startOfPreviousYear.toISOString()),
        lte(users.createdAt, endOfPreviousYear.toISOString()),
      ),
    ),
    db.select({ count: count() }).from(monthlyPayments).where(
      and(
        eq(monthlyPayments.status, "OVERDUE"),
        eq(monthlyPayments.year, previousYear),
      ),
    ),
    db.select({ totalAmount: sum(monthlyPayments.amount) }).from(monthlyPayments).where(
      and(
        eq(monthlyPayments.status, "OVERDUE"),
        eq(monthlyPayments.year, previousYear),
      ),
    ),
  ]);

  // Calculate previous year stats
  const totalStadiumsAllTime = await db
    .select({ count: count() })
    .from(stadiums)
    .where(isNull(stadiums.deletedAt));

  const totalStadiums = totalStadiumsAllTime[0]?.count || 1;
  const totalReservationsPreviousYear = totalReservationsPrevious[0]?.count || 0;
  const avgUtilizationPrevious = Math.min(
    100,
    Math.round((totalReservationsPreviousYear / (totalStadiums * 365)) * 100),
  );

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
          ((completedReservationsPrevious[0]?.count || 0) / totalReservationsPreviousYear) *
            100,
        )
      : 0;

  return {
    totalReservations: totalReservationsPreviousYear,
    activeReservations: activeReservationsPrevious[0]?.count || 0,
    pendingReservations: pendingReservationsPrevious[0]?.count || 0,
    totalClubs: totalClubsPrevious[0]?.count || 0,
    totalStadiums,
    totalUsers: 0, // Simplified - would need actual previous year total users
    subscriptions: 0, // Simplified
    overduePayments: overduePaymentsPrevious[0]?.count || 0,
    overdueAmount: Number(overdueAmountPrevious[0]?.totalAmount) || 0,
    newClubsThisMonth: 0, // Simplified
    newUsersThisMonth: 0, // Simplified
    avgUtilization: avgUtilizationPrevious,
    completionRate: completionRatePrevious,
    newClubsThisYear: newClubsPreviousYear[0]?.count || 0,
    newUsersThisYear: newUsersPreviousYear[0]?.count || 0,
  };
}

// ==================== RESERVATIONS BY MONTH ====================
export async function getReservationsByMonth(year: number): Promise<ChartData[]> {
  try {
    const startDate = startOfYear(new Date(year, 0, 1)).toISOString();
    const endDate = endOfYear(new Date(year, 11, 31)).toISOString();

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

    const monthlyData: ChartData[] = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2000, i, 1).toLocaleDateString("en-US", { month: "short" }),
      value: 0,
    }));

    reservationsByMonth.forEach((item) => {
      const monthIndex = parseInt(item.month) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyData[monthIndex].value = item.count;
      }
    });

    return monthlyData;
  } catch (error) {
    console.error("Error fetching reservations by month:", error);
    return Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2000, i, 1).toLocaleDateString("en-US", { month: "short" }),
      value: 0,
    }));
  }
}

// ==================== REVENUE BY MONTH ====================
// ==================== REVENUE BY MONTH ====================
// ==================== REVENUE BY MONTH ====================
export async function getRevenueByMonth(year: number): Promise<MonthlyRevenueData[]> {
  try {
    console.log(`Fetching revenue by month for year: ${year}`);

    // Create array for all 12 months
    const monthlyData: MonthlyRevenueData[] = Array.from(
      { length: 12 },
      (_, i) => ({
        month: new Date(2000, i, 1).toLocaleDateString("en-US", { month: "short" }),
        totalRevenue: 0,
        subscriptionRevenue: 0,
        singleSessionRevenue: 0,
        paidAmount: 0,
        overdueAmount: 0,
        collectionRate: 0,
      }),
    );

    // 1. Get subscription payments for the SPECIFIED YEAR - use year field for subscription payments
    const monthlyPaymentsData = await db
      .select({
        month: monthlyPayments.month, // Use month field from table
        amount: sum(monthlyPayments.amount),
        status: monthlyPayments.status,
      })
      .from(monthlyPayments)
      .where(
        and(
          eq(monthlyPayments.year, year), // Filter by year field, not created_at
        ),
      )
      .groupBy(
        monthlyPayments.month,
        monthlyPayments.status,
      );

    console.log('Subscription payments for year:', year, monthlyPaymentsData);

    // 2. Get single session payments for the specified year - use created_at
    const cashPaymentsData = await db
      .select({
        month: sql<string>`MONTH(${cashPaymentRecords.createdAt})`,
        amount: sum(cashPaymentRecords.amount),
      })
      .from(cashPaymentRecords)
      .where(
        and(
          sql`YEAR(${cashPaymentRecords.createdAt}) = ${year}`,
          isNotNull(cashPaymentRecords.reservationId),
        ),
      )
      .groupBy(sql`MONTH(${cashPaymentRecords.createdAt})`);

    console.log('Single session payments for year:', year, cashPaymentsData);

    // Process subscription payments
    monthlyPaymentsData.forEach((item) => {
      const monthIndex = Number(item.month) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        const amount = Number(item.amount) || 0;
        
        // Add to subscription revenue
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
        
        // Add to single session revenue
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

    // DEBUG: Log final results
    console.log(`Final revenue data for ${year}:`, monthlyData.map((m, i) => ({
      monthIndex: i,
      month: m.month,
      totalRevenue: m.totalRevenue,
      subscriptionRevenue: m.subscriptionRevenue,
      singleSessionRevenue: m.singleSessionRevenue,
      paidAmount: m.paidAmount,
      overdueAmount: m.overdueAmount,
    })));

    return monthlyData;
  } catch (error) {
    console.error("Error fetching revenue by month:", error);
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
}

// ==================== RESERVATIONS BY STATUS ====================
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

    if (!statusData.length) {
      return [];
    }

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
    return [];
  }
}

// ==================== AVAILABLE YEARS ====================
// ==================== AVAILABLE YEARS ====================
export async function getAvailableYears(): Promise<number[]> {
  try {
    // Get distinct years from monthlyPayments (subscriptions)
    const yearsFromPayments = await db
      .selectDistinct({ year: monthlyPayments.year })
      .from(monthlyPayments)
      .orderBy(desc(monthlyPayments.year));

    // Get distinct years from cashPaymentRecords (single sessions)
    const yearsFromCash = await db
      .selectDistinct({
        year: sql<number>`YEAR(${cashPaymentRecords.createdAt})`
      })
      .from(cashPaymentRecords)
      .orderBy(desc(sql`YEAR(${cashPaymentRecords.createdAt})`));

    // Combine all years
    const allYears = [
      ...yearsFromPayments.map(item => item.year),
      ...yearsFromCash.map(item => item.year)
    ];

    const currentYear = new Date().getFullYear();
    const startYear = 2025; // Your app start year
    
    // Create a Set to remove duplicates and filter valid years
    const uniqueYears = [...new Set([...allYears, currentYear])]
      .filter(year => year >= startYear && year <= currentYear)
      .sort((a, b) => b - a); // Most recent first

    return uniqueYears.length > 0 ? uniqueYears : [currentYear];
  } catch (error) {
    console.error("Error fetching available years:", error);
    const currentYear = new Date().getFullYear();
    const startYear = 2025;
    return Array.from(
      { length: Math.max(0, currentYear - startYear + 1) },
      (_, i) => startYear + i,
    ).reverse();
  }
}