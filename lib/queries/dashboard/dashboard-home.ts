// lib/queries/dashboard-home.ts
import { db } from "@/drizzle/db";
import {
  users,
  clubs,
  stadiums,
  reservations,
  monthlySubscriptions,
  monthlyPayments,
 
  stadiumSports,
  sports,
  notifications,
  reservationSeries,
  singleSessionPayments,
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
  gt,
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
  paidRevenue: number;
  overdueRevenue: number;
  pendingRevenue: number;
  subscriptionRevenue: number;
  singleSessionRevenue: number;
  subscriptionPaid: number;
  subscriptionOverdue: number;
  subscriptionPending: number;
  singleSessionPaid: number;
  singleSessionOverdue: number;
  singleSessionPending: number;
  percentage: number;
  collectionRate: number;
}

export interface StadiumRevenueSummary {
  stadiums: StadiumRevenue[];
  summary: {
    totalRevenue: number;
    subscriptionRevenue: number;
    singleSessionRevenue: number;
    paidAmount: number;
    overdueAmount: number;
    pendingAmount: number;
    collectionRate: number;
    expectedRevenue: number;
  };
}

export interface MonthlyRevenueData {
  month: string;
  totalRevenue: number;
  subscriptionRevenue: number;
  singleSessionRevenue: number;
  paidAmount: number;
  overdueAmount: number;
  pendingAmount: number;
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
  totalClubs: number;
  totalStadiums: number;
  totalUsers: number;
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
  availableYears: number[];
  detailedRevenueStats?: any;
  stadiumRevenueSummary?: StadiumRevenueSummary;
}> {
  try {
    const [
      stats,
      pendingUserApprovals,
      overduePayments,
      reservationsByMonth,
      revenueByMonth,
      revenueByStadiumResult,
      reservationsByStatus,
      availableYears,
      detailedRevenueStats,
    ] = await Promise.all([
      getDashboardStats(year),
      getPendingUserApprovals(year),
      getOverduePayments(year),
      getReservationsByMonth(year),
      getRevenueByMonth(year),
      getRevenueByStadium(year),
      getReservationsByStatus(year),
      getAvailableYears(),
      getDetailedRevenueStats(year),
    ]);

    return {
      stats,
      pendingUserApprovals,
      overduePayments,
      reservationsByMonth,
      revenueByMonth,
      revenueByStadium: revenueByStadiumResult.stadiums,
      reservationsByStatus,
      revenueTrends: revenueByMonth,
      availableYears,
      detailedRevenueStats,
      stadiumRevenueSummary: revenueByStadiumResult,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}

// In getDetailedRevenueStats, ensure it uses the correct source:

export async function getDetailedRevenueStats(year: number): Promise<{
  totalRevenue: number;
  totalSubscription: number;
  totalSingleSession: number;
  totalPaid: number;
  totalOverdue: number;
  totalPending: number;
  paidSubscription: number;
  paidSingleSession: number;
  overdueSubscription: number;
  overdueSingleSession: number;
  pendingSubscription: number;
  pendingSingleSession: number;
  collectionRate: number;
  expectedRevenue: number;
  collectedRevenue: number;
  avgMonthlyRevenue: number;
  avgMonthlySubscription: number;
  avgMonthlySingleSession: number;
  subscriptionPercentage: number;
  singleSessionPercentage: number;
  paidPercentage: number;
  overduePercentage: number;
  pendingPercentage: number;
}> {
  try {
    // Get revenue by month first for accurate totals
    const revenueByMonth = await getRevenueByMonth(year);
    
    if (!revenueByMonth.length) {
      return {
        totalRevenue: 0,
        totalSubscription: 0,
        totalSingleSession: 0,
        totalPaid: 0,
        totalOverdue: 0,
        totalPending: 0,
        paidSubscription: 0,
        paidSingleSession: 0,
        overdueSubscription: 0,
        overdueSingleSession: 0,
        pendingSubscription: 0,
        pendingSingleSession: 0,
        collectionRate: 0,
        expectedRevenue: 0,
        collectedRevenue: 0,
        avgMonthlyRevenue: 0,
        avgMonthlySubscription: 0,
        avgMonthlySingleSession: 0,
        subscriptionPercentage: 0,
        singleSessionPercentage: 0,
        paidPercentage: 0,
        overduePercentage: 0,
        pendingPercentage: 0,
      };
    }

    // Calculate totals from monthly data
    const totalRevenue = revenueByMonth.reduce((sum, month) => sum + month.totalRevenue, 0);
    const totalSubscription = revenueByMonth.reduce((sum, month) => sum + month.subscriptionRevenue, 0);
    const totalSingleSession = revenueByMonth.reduce((sum, month) => sum + month.singleSessionRevenue, 0);
    const totalPaid = revenueByMonth.reduce((sum, month) => sum + month.paidAmount, 0);
    const totalOverdue = revenueByMonth.reduce((sum, month) => sum + month.overdueAmount, 0);
    const totalPending = revenueByMonth.reduce((sum, month) => sum + month.pendingAmount, 0);

    // Get stadium summary for breakdown
    const stadiumSummary = await getRevenueByStadium(year);
    
    // Calculate breakdowns from stadium data
    let paidSubscription = 0;
    let paidSingleSession = 0;
    let overdueSubscription = 0;
    let overdueSingleSession = 0;
    let pendingSubscription = 0;
    let pendingSingleSession = 0;

    for (const stadium of stadiumSummary.stadiums) {
      paidSubscription += stadium.subscriptionPaid;
      paidSingleSession += stadium.singleSessionPaid;
      overdueSubscription += stadium.subscriptionOverdue;
      overdueSingleSession += stadium.singleSessionOverdue;
      pendingSubscription += stadium.subscriptionPending;
      pendingSingleSession += stadium.singleSessionPending;
    }

    const collectionRate = totalRevenue > 0 ? Math.round((totalPaid / totalRevenue) * 100) : 0;
    const expectedRevenue = totalRevenue;
    const collectedRevenue = totalPaid;
    
    // Get active months
    const activeMonths = revenueByMonth.filter(month => month.totalRevenue > 0).length || 1;
    
    const avgMonthlyRevenue = Math.round(totalRevenue / activeMonths);
    const avgMonthlySubscription = Math.round(totalSubscription / activeMonths);
    const avgMonthlySingleSession = Math.round(totalSingleSession / activeMonths);
    
    const subscriptionPercentage = totalRevenue > 0 ? Math.round((totalSubscription / totalRevenue) * 100) : 0;
    const singleSessionPercentage = totalRevenue > 0 ? Math.round((totalSingleSession / totalRevenue) * 100) : 0;
    const paidPercentage = totalRevenue > 0 ? Math.round((totalPaid / totalRevenue) * 100) : 0;
    const overduePercentage = totalRevenue > 0 ? Math.round((totalOverdue / totalRevenue) * 100) : 0;
    const pendingPercentage = totalRevenue > 0 ? Math.round((totalPending / totalRevenue) * 100) : 0;

    return {
      totalRevenue,
      totalSubscription,
      totalSingleSession,
      totalPaid,
      totalOverdue,
      totalPending,
      paidSubscription,
      paidSingleSession,
      overdueSubscription,
      overdueSingleSession,
      pendingSubscription,
      pendingSingleSession,
      collectionRate,
      expectedRevenue,
      collectedRevenue,
      avgMonthlyRevenue,
      avgMonthlySubscription,
      avgMonthlySingleSession,
      subscriptionPercentage,
      singleSessionPercentage,
      paidPercentage,
      overduePercentage,
      pendingPercentage,
    };
  } catch (error) {
    console.error("Error calculating detailed revenue stats:", error);
    return {
      totalRevenue: 0,
      totalSubscription: 0,
      totalSingleSession: 0,
      totalPaid: 0,
      totalOverdue: 0,
      totalPending: 0,
      paidSubscription: 0,
      paidSingleSession: 0,
      overdueSubscription: 0,
      overdueSingleSession: 0,
      pendingSubscription: 0,
      pendingSingleSession: 0,
      collectionRate: 0,
      expectedRevenue: 0,
      collectedRevenue: 0,
      avgMonthlyRevenue: 0,
      avgMonthlySubscription: 0,
      avgMonthlySingleSession: 0,
      subscriptionPercentage: 0,
      singleSessionPercentage: 0,
      paidPercentage: 0,
      overduePercentage: 0,
      pendingPercentage: 0,
    };
  }
}
// ==================== OVERDUE PAYMENTS ====================
export async function getOverduePayments(year: number): Promise<OverduePayment[]> {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    if (!year || year < 2020 || year > currentYear) {
      year = currentYear;
    }

    // 1. Get Subscription Overdues (Monthly Payments)
    const subscriptionOverdues = await db
      .select({
        id: monthlyPayments.id,
        amount: monthlyPayments.amount,
        month: monthlyPayments.month,
        year: monthlyPayments.year,
        createdAt: monthlyPayments.createdAt,
        clubName: users.name,
        stadiumName: stadiums.name,
        userId: monthlyPayments.userId,
        reservationSeriesId: monthlyPayments.reservationSeriesId,
        dateRef: sql<string>`CONCAT(${monthlyPayments.year}, '-', ${monthlyPayments.month}, '-01')`.as('dateRef') // For sorting
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
      );

    // 2. Get Single Session Overdues (Unpaid Reservations)
    const singleSessionOverdues = await db
      .select({
        id: reservations.id,
        amount: reservations.sessionPrice,
        startDateTime: reservations.startDateTime,
        clubName: users.name,
        stadiumName: stadiums.name,
        userId: reservations.userId,
        reservationSeriesId: sql<string>`NULL`, // Placeholder
      })
      .from(reservations)
      .innerJoin(users, eq(reservations.userId, users.id))
      .innerJoin(stadiums, eq(reservations.stadiumId, stadiums.id))
      .where(
        and(
          eq(reservations.paymentType, "SINGLE_SESSION"),
          eq(reservations.status, "UNPAID"),
          sql`YEAR(${reservations.startDateTime}) = ${year}`,
          isNull(users.deletedAt),
          isNull(stadiums.deletedAt),
          isNull(reservations.deletedAt)
        )
      );

    // 3. Map and Merge both lists
    const formattedSubs = subscriptionOverdues.map(sub => {
      const dueDate = new Date(sub.year, sub.month - 1, 1);
      const overdueMs = today.getTime() - dueDate.getTime();
      const overdueDays = Math.floor(overdueMs / (1000 * 60 * 60 * 24));

      return {
        id: sub.id,
        clubName: sub.clubName,
        stadiumName: sub.stadiumName,
        amount: Number(sub.amount) || 0,
        dueDate: dueDate.toISOString().split('T')[0],
        overdueDays: Math.max(0, overdueDays),
        reservationSeriesId: sub.reservationSeriesId,
        userId: sub.userId,
        month: sub.month,
        year: sub.year,
        timestamp: dueDate.getTime() // For sorting
      };
    });

    const formattedSingles = singleSessionOverdues.map(single => {
      const dueDate = new Date(single.startDateTime);
      const overdueMs = today.getTime() - dueDate.getTime();
      const overdueDays = Math.floor(overdueMs / (1000 * 60 * 60 * 24));

      return {
        id: single.id,
        clubName: single.clubName,
        stadiumName: single.stadiumName,
        amount: Number(single.amount) || 0,
        dueDate: dueDate.toISOString().split('T')[0],
        overdueDays: Math.max(0, overdueDays),
        reservationSeriesId: "Single Session", // Indicator
        userId: single.userId,
        month: dueDate.getMonth() + 1,
        year: dueDate.getFullYear(),
        timestamp: dueDate.getTime() // For sorting
      };
    });

    // 4. Combine, Sort by most recent due date, and limit to top 10
    const allOverdues = [...formattedSubs, ...formattedSingles]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);

    // Remove the temporary timestamp property before returning
    return allOverdues.map(({ timestamp, ...rest }) => rest);

  } catch (error) {
    console.error("Error fetching overdue payments:", error);
    return [];
  }
}

// ==================== REVENUE BY STADIUM ====================
export async function getRevenueByStadium(year: number): Promise<StadiumRevenueSummary> {
  try {
       const startDate = startOfYear(new Date(year, 0, 1)).toISOString();
    const endDate = endOfYear(new Date(year, 11, 31)).toISOString();
    // Get all stadiums
    const allStadiums = await db
      .select({
        id: stadiums.id,
        name: stadiums.name,
      })
      .from(stadiums)
      .where(isNull(stadiums.deletedAt));

    const stadiumRevenues: StadiumRevenue[] = [];

    for (const stadium of allStadiums) {
      // ===== SUBSCRIPTION REVENUE =====
      // Get monthly payments for this stadium
      const subscriptionData = await db
        .select({
          paidAmount: sql<number>`COALESCE(SUM(CASE WHEN ${monthlyPayments.status} = 'PAID' THEN ${monthlyPayments.amount} ELSE 0 END), 0)`,
          overdueAmount: sql<number>`COALESCE(SUM(CASE WHEN ${monthlyPayments.status} = 'OVERDUE' THEN ${monthlyPayments.amount} ELSE 0 END), 0)`,
          pendingAmount: sql<number>`COALESCE(SUM(CASE WHEN ${monthlyPayments.status} = 'PENDING' THEN ${monthlyPayments.amount} ELSE 0 END), 0)`,
        })
        .from(monthlyPayments)
        .innerJoin(reservationSeries, eq(monthlyPayments.reservationSeriesId, reservationSeries.id))
        .where(
          and(
            eq(monthlyPayments.year, year),
            eq(reservationSeries.stadiumId, stadium.id),
            eq(reservationSeries.billingType, "MONTHLY_SUBSCRIPTION"),
          ),
        );

      const subscriptionPaid = Number(subscriptionData[0]?.paidAmount) || 0;
      const subscriptionOverdue = Number(subscriptionData[0]?.overdueAmount) || 0;
      const subscriptionPending = Number(subscriptionData[0]?.pendingAmount) || 0;
      const subscriptionRevenue = subscriptionPaid + subscriptionOverdue + subscriptionPending;

      // ===== SINGLE SESSION REVENUE =====
      // Get all single session reservations for this stadium/year with different statuses
 const singleSessionData = await db
  .select({
    paidAmount: sql<number>`COALESCE(SUM(CASE WHEN ${reservations.status} = 'PAID' THEN ${reservations.sessionPrice} ELSE 0 END), 0)`,
    unpaidAmount: sql<number>`COALESCE(SUM(CASE WHEN ${reservations.status} = 'UNPAID' THEN ${reservations.sessionPrice} ELSE 0 END), 0)`,
    approvedAmount: sql<number>`COALESCE(SUM(CASE WHEN ${reservations.status} = 'APPROVED' THEN ${reservations.sessionPrice} ELSE 0 END), 0)`,
  })
  .from(reservations)
  .where(
    and(
      gte(reservations.startDateTime, startDate),
      lte(reservations.startDateTime, endDate),
      eq(reservations.stadiumId, stadium.id),
      eq(reservations.paymentType, "SINGLE_SESSION"),
      inArray(reservations.status, ["APPROVED", "PAID", "UNPAID"]),
      isNull(reservations.deletedAt),
    ),
  );

const singleSessionPaid = Number(singleSessionData[0]?.paidAmount) || 0;
const singleSessionOverdue = Number(singleSessionData[0]?.unpaidAmount) || 0;
const singleSessionPending = Number(singleSessionData[0]?.approvedAmount) || 0;
const singleSessionRevenue = singleSessionPaid + singleSessionOverdue + singleSessionPending;

      // ===== CALCULATE TOTALS =====
    const totalRevenue = subscriptionRevenue + singleSessionRevenue;
const paidRevenue = subscriptionPaid + singleSessionPaid;
const overdueRevenue = subscriptionOverdue + singleSessionOverdue;
const pendingRevenue = subscriptionPending + singleSessionPending;

// Ensure totals make sense
const validatedTotalRevenue = Math.max(totalRevenue, 0);
const validatedPaidRevenue = Math.min(paidRevenue, validatedTotalRevenue);
const validatedOverdueRevenue = Math.min(overdueRevenue, validatedTotalRevenue - validatedPaidRevenue);
const validatedPendingRevenue = Math.min(
  pendingRevenue, 
  validatedTotalRevenue - validatedPaidRevenue - validatedOverdueRevenue
);

// Recalculate to ensure consistency
const finalTotalRevenue = validatedPaidRevenue + validatedOverdueRevenue + validatedPendingRevenue;

// Add to results
stadiumRevenues.push({
  id: stadium.id,
  name: stadium.name,
  totalRevenue: finalTotalRevenue,
  paidRevenue: validatedPaidRevenue,
  overdueRevenue: validatedOverdueRevenue,
  pendingRevenue: validatedPendingRevenue,
  subscriptionRevenue,
  singleSessionRevenue,
  subscriptionPaid,
  subscriptionOverdue,
  subscriptionPending,
  singleSessionPaid,
  singleSessionOverdue,
  singleSessionPending,
  percentage: 0,
  collectionRate: finalTotalRevenue > 0 ? 
    Math.round((validatedPaidRevenue / finalTotalRevenue) * 100) : 0,
});
    }

    // Calculate percentages
    const totalAllRevenue = stadiumRevenues.reduce((sum, s) => sum + s.totalRevenue, 0);
    
    const stadiumsWithPercentages = stadiumRevenues.map(stadium => ({
      ...stadium,
      percentage: totalAllRevenue > 0 ? Math.round((stadium.totalRevenue / totalAllRevenue) * 100) : 0,
    }));

    // Sort by total revenue
    const sortedStadiums = stadiumsWithPercentages.sort((a, b) => b.totalRevenue - a.totalRevenue);

    // Calculate summary
    const totalPaidAll = sortedStadiums.reduce((sum, s) => sum + s.paidRevenue, 0);
    const totalOverdueAll = sortedStadiums.reduce((sum, s) => sum + s.overdueRevenue, 0);
    const totalPendingAll = sortedStadiums.reduce((sum, s) => sum + s.pendingRevenue, 0);
    const totalAllRevenueValidated = Math.max(totalAllRevenue, totalPaidAll);

    const summary = {
      totalRevenue: totalAllRevenueValidated,
      subscriptionRevenue: sortedStadiums.reduce((sum, s) => sum + s.subscriptionRevenue, 0),
      singleSessionRevenue: sortedStadiums.reduce((sum, s) => sum + s.singleSessionRevenue, 0),
      paidAmount: totalPaidAll,
      overdueAmount: totalOverdueAll,
      pendingAmount: totalPendingAll,
      collectionRate: totalAllRevenueValidated > 0 ? 
        Math.round((totalPaidAll / totalAllRevenueValidated) * 100) : 0,
      expectedRevenue: totalAllRevenueValidated,
    };

    return {
      stadiums: sortedStadiums,
      summary,
    };
  } catch (error) {
    console.error("Error in getRevenueByStadium:", error);
    return {
      stadiums: [],
      summary: {
        totalRevenue: 0,
        subscriptionRevenue: 0,
        singleSessionRevenue: 0,
        paidAmount: 0,
        overdueAmount: 0,
        pendingAmount: 0,
        collectionRate: 0,
        expectedRevenue: 0,
      },
    };
  }
}

// ==================== PENDING USER APPROVALS ====================
export async function getPendingUserApprovals(year: number): Promise<PendingUserApproval[]> {
  try {
    const startDate = startOfYear(new Date(year, 0, 1)).toISOString();
    const endDate = endOfYear(new Date(year, 11, 31)).toISOString();

    const pendingUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phoneNumber: users.phoneNumber,
        emailVerifiedAt: users.emailVerifiedAt,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(
        and(
          isNull(users.deletedAt),
          eq(users.isApproved, false),
          eq(users.role, "CLUB"),
          gte(users.createdAt, startDate),
          lte(users.createdAt, endDate),
        )
      )
      .orderBy(desc(users.createdAt))
      .limit(10);

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
// lib/queries/dashboard-home.ts

export async function getDashboardStats(year: number): Promise<DashboardStats> {
  const currentDate = new Date();
  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);
  const startOfYearDate = startOfYear(new Date(year, 0, 1));
  const endOfYearDate = endOfYear(new Date(year, 11, 31));
  const previousYear = year - 1;

  // Execute all queries in parallel
  const [
    totalClubsResult,
    totalStadiumsResult,
    totalUsersResult,
    totalReservationsResult, // CHANGED: Now scoped to current year
    activeReservationsResult,
    pendingReservationsResult,
    newClubsThisYearResult,
    newUsersThisYearResult,
    subscriptionsResult,
    subscriptionOverdueCountResult, // Renamed for clarity
    subscriptionOverdueAmountResult, // Renamed for clarity
    singleSessionOverdueResult, // NEW: For single session overdues
    newClubsThisMonthResult,
    newUsersThisMonthResult,
    utilizationDurationResult, // NEW: For accurate utilization
  ] = await Promise.all([
    // Total Clubs - ALL TIME
    db.select({ count: count() })
      .from(clubs)
      .where(isNull(clubs.deletedAt)),

    // Total Stadiums - ALL TIME
    db.select({ count: count() })
      .from(stadiums)
      .where(isNull(stadiums.deletedAt)),

    // Total Users - ALL TIME
    db.select({ count: count() })
      .from(users)
      .where(isNull(users.deletedAt)),

    // Total Reservations - CURRENT YEAR (Fixed consistency issue)
    db.select({ count: count() })
      .from(reservations)
      .where(
        and(
          isNull(reservations.deletedAt),
          gte(reservations.startDateTime, startOfYearDate.toISOString()),
          lte(reservations.startDateTime, endOfYearDate.toISOString()),
        ),
      ),

    // Active Reservations - Current and future APPROVED
    db.select({ count: count() })
      .from(reservations)
      .where(
        and(
          isNull(reservations.deletedAt),
          eq(reservations.status, "APPROVED"),
          gte(reservations.endDateTime, currentDate.toISOString()),
        ),
      ),

    // Pending Reservations - Current year
    db.select({ count: count() })
      .from(reservations)
      .where(
        and(
          isNull(reservations.deletedAt),
          eq(reservations.status, "PENDING"),
          gte(reservations.startDateTime, startOfYearDate.toISOString()),
          lte(reservations.startDateTime, endOfYearDate.toISOString()),
        ),
      ),

    // New Clubs this year
    db.select({ count: count() })
      .from(clubs)
      .where(
        and(
          isNull(clubs.deletedAt),
          gte(clubs.createdAt, startOfYearDate.toISOString()),
          lte(clubs.createdAt, endOfYearDate.toISOString()),
        ),
      ),

    // New Users this year
    db.select({ count: count() })
      .from(users)
      .where(
        and(
          isNull(users.deletedAt),
          eq(users.role, "CLUB"),
          gte(users.createdAt, startOfYearDate.toISOString()),
          lte(users.createdAt, endOfYearDate.toISOString()),
        ),
      ),

    // Active Subscriptions
    db.select({ count: count() })
      .from(monthlySubscriptions)
      .where(
        and(
          eq(monthlySubscriptions.status, "ACTIVE"),
          lte(monthlySubscriptions.startDate, endOfYearDate.toISOString()),
          or(
            isNull(monthlySubscriptions.endDate),
            gte(monthlySubscriptions.endDate, startOfYearDate.toISOString()),
          ),
        ),
      ),

    // Subscription Overdue Count
    db.select({ count: count() })
      .from(monthlyPayments)
      .where(
        and(
          eq(monthlyPayments.status, "OVERDUE"),
          eq(monthlyPayments.year, year),
        ),
      ),

    // Subscription Overdue Amount
    db.select({ totalAmount: sum(monthlyPayments.amount) })
      .from(monthlyPayments)
      .where(
        and(
          eq(monthlyPayments.status, "OVERDUE"),
          eq(monthlyPayments.year, year),
        ),
      ),

    // Single Session Overdue (Unpaid) - NEW QUERY
    db.select({ 
        count: count(),
        amount: sum(reservations.sessionPrice) 
      })
      .from(reservations)
      .where(
        and(
          eq(reservations.paymentType, "SINGLE_SESSION"),
          eq(reservations.status, "UNPAID"),
          isNull(reservations.deletedAt),
          gte(reservations.startDateTime, startOfYearDate.toISOString()),
          lte(reservations.startDateTime, endOfYearDate.toISOString())
        )
      ),

    // New Clubs this month
    db.select({ count: count() })
      .from(clubs)
      .where(
        and(
          isNull(clubs.deletedAt),
          gte(clubs.createdAt, startOfCurrentMonth.toISOString()),
          lte(clubs.createdAt, endOfCurrentMonth.toISOString()),
        ),
      ),

    // New Users this month
    db.select({ count: count() })
      .from(users)
      .where(
        and(
          isNull(users.deletedAt),
          gte(users.createdAt, startOfCurrentMonth.toISOString()),
          lte(users.createdAt, endOfCurrentMonth.toISOString()),
        ),
      ),
      
    // Utilization Duration Calculation - NEW QUERY
    db.select({
      totalMinutes: sql<number>`SUM(TIMESTAMPDIFF(MINUTE, ${reservations.startDateTime}, ${reservations.endDateTime}))`
    })
    .from(reservations)
    .where(
      and(
        isNull(reservations.deletedAt),
        gte(reservations.startDateTime, startOfYearDate.toISOString()),
        lte(reservations.startDateTime, endOfYearDate.toISOString()),
        inArray(reservations.status, ["APPROVED", "PAID", "UNPAID"]) // Only count actual bookings
      )
    ),
  ]);

  // Get previous year data for comparison
  const previousYearData = await getPreviousYearData(year, previousYear);

  // --- Calculate Combined Overdue Stats ---
  const subOverdueCount = subscriptionOverdueCountResult[0]?.count || 0;
  const subOverdueAmount = Number(subscriptionOverdueAmountResult[0]?.totalAmount) || 0;
  
  const singleOverdueCount = singleSessionOverdueResult[0]?.count || 0;
  const singleOverdueAmount = Number(singleSessionOverdueResult[0]?.amount) || 0;

  const totalOverdueCount = subOverdueCount + singleOverdueCount;
  const totalOverdueAmount = subOverdueAmount + singleOverdueAmount;

  // --- Calculate Average stadium utilization (Time-based) ---
  const totalStadiums = totalStadiumsResult[0]?.count || 1;
  
  const now = new Date();
  // If viewing current year, only count days passed so far. If past year, count 365.
  const daysPassedThisYear = year === now.getFullYear() 
    ? Math.max(1, Math.ceil((now.getTime() - new Date(year, 0, 1).getTime()) / (1000 * 60 * 60 * 24)))
    : 365;
  
  const HOURS_OPEN_PER_DAY = 12; // Assumption: Stadiums open 12 hours/day
  const totalCapacityMinutes = totalStadiums * daysPassedThisYear * HOURS_OPEN_PER_DAY * 60;
  const totalBookedMinutes = Number(utilizationDurationResult[0]?.totalMinutes) || 0;

  const avgUtilization = totalCapacityMinutes > 0
    ? Math.min(100, Math.round((totalBookedMinutes / totalCapacityMinutes) * 100))
    : 0;

  // --- Calculate Completion rate ---
  // Using the totalReservationsResult which is now scoped to the YEAR
  const totalReservationsThisYear = totalReservationsResult[0]?.count || 0;
  
  const completedReservations = await db
    .select({ count: count() })
    .from(reservations)
    .where(
      and(
        isNull(reservations.deletedAt),
        gte(reservations.startDateTime, startOfYearDate.toISOString()),
        lte(reservations.startDateTime, endOfYearDate.toISOString()),
        inArray(reservations.status, ["APPROVED", "PAID"]),
        lte(reservations.startDateTime, now.toISOString()),
      ),
    );

  const completionRate =
    totalReservationsThisYear > 0
      ? Math.round(
          ((completedReservations[0]?.count || 0) / totalReservationsThisYear) *
            100,
        )
      : 0;

  // Helper for changes
  const calculateChange = (current: number, previous: number): string => {
    if (previous === 0 && current === 0) return "0%";
    if (previous === 0) return current > 0 ? "+∞%" : "";
    const change = ((current - previous) / previous) * 100;
    
    if (Math.abs(change) > 1000) return change > 0 ? "+1000%" : "-100%";
    return change >= 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`;
  };

  const calculateAbsoluteChange = (current: number, previous: number): string => {
    const change = current - previous;
    if (change === 0) return "0";
    return change > 0 ? `+${change}` : `${change}`;
  };

  return {
    totalClubs: totalClubsResult[0]?.count || 0,
    totalStadiums: totalStadiumsResult[0]?.count || 0,
    totalUsers: totalUsersResult[0]?.count || 0,
    totalReservations: totalReservationsResult[0]?.count || 0, // Now matches Year
    activeReservations: activeReservationsResult[0]?.count || 0,
    pendingReservations: pendingReservationsResult[0]?.count || 0,
    newClubsThisYear: newClubsThisYearResult[0]?.count || 0,
    newUsersThisYear: newUsersThisYearResult[0]?.count || 0,
    subscriptions: subscriptionsResult[0]?.count || 0,
    overduePayments: totalOverdueCount, // Corrected Combined Count
    overdueAmount: totalOverdueAmount,  // Corrected Combined Amount
    avgUtilization: avgUtilization || 0,
    completionRate: completionRate || 0,
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
        totalOverdueCount,
        previousYearData.overduePayments,
      ),
      overdueAmountChange: calculateChange(
        totalOverdueAmount,
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

// ==================== RESERVATIONS BY MONTH ====================
// The current getReservationsByMonth function looks correct, but let's add logging to debug:

// lib/queries/dashboard-home.ts - Update the function
export async function getReservationsByMonth(year: number): Promise<ChartData[]> {
  try {
    const startDate = startOfYear(new Date(year, 0, 1)).toISOString();
    const endDate = endOfYear(new Date(year, 11, 31)).toISOString();
    
    console.log(`getReservationsByMonth: year=${year}, start=${startDate}, end=${endDate}`);

    const reservationsByMonth = await db
      .select({
        month: sql<string>`MONTH(${reservations.startDateTime})`.as("month"),
        count: count(),
      })
      .from(reservations)
      .where(
        and(
          isNull(reservations.deletedAt),
          gte(reservations.startDateTime, startDate),
          lte(reservations.startDateTime, endDate),
        ),
      )
      .groupBy(sql`MONTH(${reservations.startDateTime})`);

    console.log(`getReservationsByMonth raw data:`, reservationsByMonth);

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

    console.log(`getReservationsByMonth final data:`, monthlyData);
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
// Replace the entire getRevenueByMonth function:

export async function getRevenueByMonth(year: number): Promise<MonthlyRevenueData[]> {
  try {
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
        pendingAmount: 0,
        collectionRate: 0,
      }),
    );

    // ===== 1. SUBSCRIPTION: MONTHLY PAYMENTS =====
    const monthlyPaymentsData = await db
      .select({
        month: monthlyPayments.month,
        paidAmount: sql<number>`COALESCE(SUM(CASE WHEN ${monthlyPayments.status} = 'PAID' THEN ${monthlyPayments.amount} ELSE 0 END), 0)`,
        overdueAmount: sql<number>`COALESCE(SUM(CASE WHEN ${monthlyPayments.status} = 'OVERDUE' THEN ${monthlyPayments.amount} ELSE 0 END), 0)`,
        pendingAmount: sql<number>`COALESCE(SUM(CASE WHEN ${monthlyPayments.status} = 'PENDING' THEN ${monthlyPayments.amount} ELSE 0 END), 0)`,
      })
      .from(monthlyPayments)
      .where(eq(monthlyPayments.year, year))
      .groupBy(monthlyPayments.month);

    // Process monthly payments
    monthlyPaymentsData.forEach((item: any) => {
      const monthIndex = Number(item.month) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        const paid = Number(item.paidAmount) || 0;
        const pending = Number(item.pendingAmount) || 0;
        const overdue = Number(item.overdueAmount) || 0;
        const totalSubscription = paid + pending + overdue;
        
        monthlyData[monthIndex].subscriptionRevenue += totalSubscription;
        monthlyData[monthIndex].totalRevenue += totalSubscription;
        
        monthlyData[monthIndex].paidAmount += paid;
        monthlyData[monthIndex].pendingAmount += pending;
        monthlyData[monthIndex].overdueAmount += overdue;
      }
    });

    // ===== 2. SINGLE SESSION: GET ALL SINGLE SESSION RESERVATIONS =====
    const singleSessionReservations = await db
      .select({
        month: sql<string>`MONTH(${reservations.startDateTime})`.as("month"),
        paidAmount: sql<number>`COALESCE(SUM(CASE WHEN ${reservations.status} = 'PAID' THEN ${reservations.sessionPrice} ELSE 0 END), 0)`.as("paidAmount"),
        unpaidAmount: sql<number>`COALESCE(SUM(CASE WHEN ${reservations.status} = 'UNPAID' THEN ${reservations.sessionPrice} ELSE 0 END), 0)`.as("unpaidAmount"),
        approvedAmount: sql<number>`COALESCE(SUM(CASE WHEN ${reservations.status} = 'APPROVED' THEN ${reservations.sessionPrice} ELSE 0 END), 0)`.as("approvedAmount"),
      })
      .from(reservations)
      .where(
        and(
          sql`YEAR(${reservations.startDateTime}) = ${year}`,
          eq(reservations.paymentType, "SINGLE_SESSION"),
          inArray(reservations.status, ["APPROVED", "PAID", "UNPAID"]),
          isNull(reservations.deletedAt),
        ),
      )
      .groupBy(sql`MONTH(${reservations.startDateTime})`);

    // Process single session reservations
    singleSessionReservations.forEach((item: any) => {
      const monthIndex = parseInt(item.month) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        const paid = Number(item.paidAmount) || 0;
        const overdue = Number(item.unpaidAmount) || 0;
        const pending = Number(item.approvedAmount) || 0;
        const totalSingleSession = paid + overdue + pending;
        
        monthlyData[monthIndex].singleSessionRevenue += totalSingleSession;
        monthlyData[monthIndex].totalRevenue += totalSingleSession;
        
        monthlyData[monthIndex].paidAmount += paid;
        monthlyData[monthIndex].overdueAmount += overdue;
        monthlyData[monthIndex].pendingAmount += pending;
      }
    });

    // ===== 3. CALCULATE COLLECTION RATE AND FINALIZE =====
    monthlyData.forEach(month => {
      // Ensure non-negative values
      month.paidAmount = Math.max(0, month.paidAmount);
      month.overdueAmount = Math.max(0, month.overdueAmount);
      month.pendingAmount = Math.max(0, month.pendingAmount);
      
      // Recalculate total as sum of statuses
      month.totalRevenue = month.paidAmount + month.pendingAmount + month.overdueAmount;
      
      // Recalculate individual revenues based on final amounts
      month.subscriptionRevenue = Math.min(month.subscriptionRevenue, month.totalRevenue);
      month.singleSessionRevenue = Math.min(month.singleSessionRevenue, month.totalRevenue);
      
      // Calculate collection rate
      if (month.totalRevenue > 0) {
        month.collectionRate = Math.min(100, Math.max(0, Math.round((month.paidAmount / month.totalRevenue) * 100)));
      } else {
        month.collectionRate = 0;
      }
    });

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
      pendingAmount: 0,
      collectionRate: 0,
    }));
  }
}

// ==================== RESERVATIONS BY STATUS ====================
// Replace getReservationsByStatus function:

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
          gte(reservations.startDateTime, startDate),
          lte(reservations.startDateTime, endDate),
        ),
      )
      .groupBy(reservations.status);

    // Add default counts for missing statuses
    const allStatuses: ReservationStatusType[] = ["PENDING", "APPROVED", "DECLINED", "CANCELLED", "PAID", "UNPAID"];
    
    const statusMap = new Map<string, number>();
    statusData.forEach(item => {
      statusMap.set(item.status, item.count);
    });

    const statusColors: Record<ReservationStatusType, string> = {
      PENDING: "#f59e0b",
      APPROVED: "#10b981",
      DECLINED: "#ef4444",
      CANCELLED: "#6b7280",
      PAID: "#3b82f6",
      UNPAID: "#ec4899",
    };

    return allStatuses.map(status => ({
      status,
      count: statusMap.get(status) || 0,
      color: statusColors[status] || "#6b7280",
    }));
  } catch (error) {
    console.error("Error fetching reservations by status:", error);
    return [];
  }
}

// ==================== AVAILABLE YEARS ====================
export async function getAvailableYears(): Promise<number[]> {
  try {
    // Get years from monthlyPayments (subscriptions)
    const yearsFromPayments = await db
      .selectDistinct({ year: monthlyPayments.year })
      .from(monthlyPayments)
      .orderBy(desc(monthlyPayments.year));

    // Get years from singleSessionPayments
    const yearsFromSingle = await db
      .selectDistinct({
        year: sql<number>`YEAR(${singleSessionPayments.paymentDate})`.as("year")
      })
      .from(singleSessionPayments)
      .orderBy(desc(sql`YEAR(${singleSessionPayments.paymentDate})`));

    // Get years from cashPaymentRecords
  
    // Also check reservations for years
    const yearsFromReservations = await db
      .selectDistinct({
        year: sql<number>`YEAR(${reservations.createdAt})`.as("year")
      })
      .from(reservations)
      .orderBy(desc(sql`YEAR(${reservations.createdAt})`));

    // Combine all years
    const allYears = [
      ...yearsFromPayments.map(item => item.year),
      ...yearsFromSingle.map((item: any) => item.year),
      ...yearsFromReservations.map((item: any) => item.year)
    ];

    const currentYear = new Date().getFullYear();
    const startYear = 2025;
    
    // Create a Set to remove duplicates and filter valid years
    const uniqueYears = [...new Set([...allYears, currentYear])]
      .filter(year => year && year >= startYear && year <= currentYear)
      .sort((a, b) => b - a);

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

// In the same file, replace the entire getPreviousYearData function:

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
    subscriptionsPrevious,
    overduePaymentsPrevious,
    overdueAmountPrevious,
    totalStadiumsPrevious,
    totalUsersPrevious,
  ] = await Promise.all([
    // Total Reservations up to end of previous year
    db.select({ count: count() })
      .from(reservations)
      .where(
        and(
          isNull(reservations.deletedAt),
          lt(reservations.startDateTime, new Date(currentYear, 0, 1).toISOString()),
        ),
      ),

    // Active Reservations at end of previous year (future reservations)
    db.select({ count: count() })
      .from(reservations)
      .where(
        and(
          isNull(reservations.deletedAt),
          eq(reservations.status, "APPROVED"),
          gte(reservations.startDateTime, new Date(previousYear, 0, 1).toISOString()),
          lte(reservations.startDateTime, endOfPreviousYear.toISOString()),
          gte(reservations.endDateTime, endOfPreviousYear.toISOString()),
        ),
      ),

    // Pending Reservations in previous year
    db.select({ count: count() })
      .from(reservations)
      .where(
        and(
          isNull(reservations.deletedAt),
          eq(reservations.status, "PENDING"),
          gte(reservations.startDateTime, startOfPreviousYear.toISOString()),
          lte(reservations.startDateTime, endOfPreviousYear.toISOString()),
        ),
      ),

    // Total Clubs up to end of previous year
    db.select({ count: count() })
      .from(clubs)
      .where(
        and(
          isNull(clubs.deletedAt),
          lt(clubs.createdAt, new Date(currentYear, 0, 1).toISOString()),
        ),
      ),

    // New Clubs in previous year
    db.select({ count: count() })
      .from(clubs)
      .where(
        and(
          isNull(clubs.deletedAt),
          gte(clubs.createdAt, startOfPreviousYear.toISOString()),
          lte(clubs.createdAt, endOfPreviousYear.toISOString()),
        ),
      ),

    // New Users in previous year
    db.select({ count: count() })
      .from(users)
      .where(
        and(
          isNull(users.deletedAt),
          gte(users.createdAt, startOfPreviousYear.toISOString()),
          lte(users.createdAt, endOfPreviousYear.toISOString()),
        ),
      ),

    // Active Subscriptions at end of previous year
    db.select({ count: count() })
      .from(monthlySubscriptions)
      .where(
        and(
          eq(monthlySubscriptions.status, "ACTIVE"),
          lte(monthlySubscriptions.startDate, endOfPreviousYear.toISOString()),
          or(
            isNull(monthlySubscriptions.endDate),
            gte(monthlySubscriptions.endDate, endOfPreviousYear.toISOString()),
          ),
        ),
      ),

    // Overdue Payments for previous year
    db.select({ count: count() })
      .from(monthlyPayments)
      .where(
        and(
          eq(monthlyPayments.status, "OVERDUE"),
          eq(monthlyPayments.year, previousYear),
        ),
      ),

    // Overdue Amount for previous year
    db.select({ totalAmount: sum(monthlyPayments.amount) })
      .from(monthlyPayments)
      .where(
        and(
          eq(monthlyPayments.status, "OVERDUE"),
          eq(monthlyPayments.year, previousYear),
        ),
      ),

    // Total Stadiums up to previous year (should be same as current)
    db.select({ count: count() })
      .from(stadiums)
      .where(isNull(stadiums.deletedAt)),

    // Total Users up to previous year
    db.select({ count: count() })
      .from(users)
      .where(
        and(
          isNull(users.deletedAt),
          lt(users.createdAt, new Date(currentYear, 0, 1).toISOString()),
        ),
      ),
  ]);

  // Calculate completion rate for previous year
  const completedReservationsPrevious = await db
    .select({ count: count() })
    .from(reservations)
    .where(
      and(
        isNull(reservations.deletedAt),
        gte(reservations.startDateTime, startOfPreviousYear.toISOString()),
        lte(reservations.startDateTime, endOfPreviousYear.toISOString()),
        inArray(reservations.status, ["APPROVED", "PAID"]),
        lte(reservations.startDateTime, endOfPreviousYear.toISOString()),
      ),
    );

  const totalReservationsPreviousYear = await db
    .select({ count: count() })
    .from(reservations)
    .where(
      and(
        isNull(reservations.deletedAt),
        gte(reservations.startDateTime, startOfPreviousYear.toISOString()),
        lte(reservations.startDateTime, endOfPreviousYear.toISOString()),
      ),
    );

  const completionRatePrevious =
    totalReservationsPreviousYear[0]?.count > 0
      ? Math.round(
          ((completedReservationsPrevious[0]?.count || 0) / 
           totalReservationsPreviousYear[0]?.count) * 100,
        )
      : 0;

  // Calculate avg utilization for previous year
  const totalStadiums = totalStadiumsPrevious[0]?.count || 1;
  const reservationsInPreviousYear = totalReservationsPreviousYear[0]?.count || 0;
  const avgUtilizationPrevious = Math.min(
    100,
    Math.round((reservationsInPreviousYear / (totalStadiums * 365)) * 100),
  );

  return {
    totalReservations: totalReservationsPrevious[0]?.count || 0,
    activeReservations: activeReservationsPrevious[0]?.count || 0,
    pendingReservations: pendingReservationsPrevious[0]?.count || 0,
    totalClubs: totalClubsPrevious[0]?.count || 0,
    totalStadiums: totalStadiumsPrevious[0]?.count || 0,
    totalUsers: totalUsersPrevious[0]?.count || 0,
    subscriptions: subscriptionsPrevious[0]?.count || 0,
    overduePayments: overduePaymentsPrevious[0]?.count || 0,
    overdueAmount: Number(overdueAmountPrevious[0]?.totalAmount) || 0,
    newClubsThisMonth: 0,
    newUsersThisMonth: 0,
    avgUtilization: avgUtilizationPrevious,
    completionRate: completionRatePrevious,
    newClubsThisYear: newClubsPreviousYear[0]?.count || 0,
    newUsersThisYear: newUsersPreviousYear[0]?.count || 0,
  };
}