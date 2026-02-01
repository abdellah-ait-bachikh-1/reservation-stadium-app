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
  totalRevenue: number; // Expected revenue (PAID + PENDING + OVERDUE)
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
  revenueByStadium: StadiumRevenue[]; // This should still be the array
  reservationsByStatus: ReservationStatusData[];
  revenueTrends: MonthlyRevenueData[];
  availableYears: number[];
  detailedRevenueStats?: any;
  stadiumRevenueSummary?: StadiumRevenueSummary; // Add this for the full object
}> {
  try {
    const [
      stats,
      pendingUserApprovals,
      overduePayments,
      reservationsByMonth,
      revenueByMonth,
      revenueByStadiumResult, // This is now an object with stadiums and summary
      reservationsByStatus,
      availableYears,
      detailedRevenueStats,
    ] = await Promise.all([
      getDashboardStats(year),
      getPendingUserApprovals(year),
      getOverduePayments(year),
      getReservationsByMonth(year),
      getRevenueByMonth(year),
      getRevenueByStadium(year), // This returns the full object
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
      revenueByStadium: revenueByStadiumResult.stadiums, // Extract just the stadiums array
      reservationsByStatus,
      revenueTrends: revenueByMonth,
      availableYears,
      detailedRevenueStats,
      stadiumRevenueSummary: revenueByStadiumResult, // Add the full object if needed
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}

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

    const totalRevenue = revenueByMonth.reduce((sum, item) => sum + item.totalRevenue, 0);
    const totalSubscription = revenueByMonth.reduce((sum, item) => sum + item.subscriptionRevenue, 0);
    const totalSingleSession = revenueByMonth.reduce((sum, item) => sum + item.singleSessionRevenue, 0);
    
    const totalPaid = revenueByMonth.reduce((sum, item) => sum + item.paidAmount, 0);
    const totalOverdue = revenueByMonth.reduce((sum, item) => sum + item.overdueAmount, 0);
    const totalPending = revenueByMonth.reduce((sum, item) => sum + (item.pendingAmount || 0), 0);
    
    // Calculate breakdowns (estimated based on revenue proportions)
    const paidSubscription = Math.round(totalPaid * (totalSubscription / (totalSubscription + totalSingleSession)));
    const paidSingleSession = totalPaid - paidSubscription;
    const overdueSubscription = Math.round(totalOverdue * (totalSubscription / (totalSubscription + totalSingleSession)));
    const overdueSingleSession = totalOverdue - overdueSubscription;
    const pendingSubscription = Math.round(totalPending * (totalSubscription / (totalSubscription + totalSingleSession)));
    const pendingSingleSession = totalPending - pendingSubscription;
    
    const expectedRevenue = totalPaid + totalOverdue + totalPending;
    const collectionRate = expectedRevenue > 0 ? Math.round((totalPaid / expectedRevenue) * 100) : 0;
    const collectedRevenue = totalPaid;
    
    const activeMonths = revenueByMonth.filter(month => month.totalRevenue > 0).length || 1;
    const avgMonthlyRevenue = Math.round(totalRevenue / activeMonths);
    const avgMonthlySubscription = Math.round(totalSubscription / activeMonths);
    const avgMonthlySingleSession = Math.round(totalSingleSession / activeMonths);
    
    const subscriptionPercentage = totalRevenue > 0 ? Math.round((totalSubscription / totalRevenue) * 100) : 0;
    const singleSessionPercentage = totalRevenue > 0 ? Math.round((totalSingleSession / totalRevenue) * 100) : 0;
    const paidPercentage = expectedRevenue > 0 ? Math.round((totalPaid / expectedRevenue) * 100) : 0;
    const overduePercentage = expectedRevenue > 0 ? Math.round((totalOverdue / expectedRevenue) * 100) : 0;
    const pendingPercentage = expectedRevenue > 0 ? Math.round((totalPending / expectedRevenue) * 100) : 0;

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
export async function getRevenueByStadium(year: number): Promise<{
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
}> {
  try {
    console.log(`=== DEBUG: Fetching stadium revenue for year: ${year} ===`);

    // ===== GET ALL STADIUMS =====
    const allStadiums = await db
      .select({
        id: stadiums.id,
        name: stadiums.name,
      })
      .from(stadiums)
      .where(isNull(stadiums.deletedAt));

    console.log(`Total stadiums: ${allStadiums.length}`);

    // Initialize revenue map
    const revenueMap = new Map<
      string,
      {
        id: string;
        name: string;
        totalRevenue: number; // Expected revenue (PAID + PENDING + OVERDUE)
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
      }
    >();

    allStadiums.forEach((stadium) => {
      revenueMap.set(stadium.id, {
        id: stadium.id,
        name: stadium.name,
        totalRevenue: 0,
        paidRevenue: 0,
        overdueRevenue: 0,
        pendingRevenue: 0,
        subscriptionRevenue: 0,
        singleSessionRevenue: 0,
        subscriptionPaid: 0,
        subscriptionOverdue: 0,
        subscriptionPending: 0,
        singleSessionPaid: 0,
        singleSessionOverdue: 0,
        singleSessionPending: 0,
      });
    });

    // ===== 1. SINGLE SESSION REVENUE - EXPECTED (ALL APPROVED RESERVATIONS) =====
    // First, get ALL single session reservations (expected revenue)
    const allSingleSessions = await db
      .select({
        stadiumId: reservations.stadiumId,
        totalExpected: sql<number>`COALESCE(SUM(${reservations.sessionPrice}), 0)`,
        count: sql<number>`COUNT(*)`,
      })
      .from(reservations)
      .innerJoin(stadiums, eq(reservations.stadiumId, stadiums.id))
      .where(
        and(
          sql`YEAR(${reservations.startDateTime}) = ${year}`,
          eq(reservations.paymentType, "SINGLE_SESSION"),
          eq(reservations.status, "APPROVED"), // Only approved reservations
          isNull(reservations.deletedAt),
          isNull(stadiums.deletedAt),
        ),
      )
      .groupBy(reservations.stadiumId);

    console.log(`All single sessions (expected): ${allSingleSessions.length} rows`);

    // Process expected single session revenue
    allSingleSessions.forEach((row) => {
      const stadium = revenueMap.get(row.stadiumId);
      if (stadium) {
        const amount = Number(row.totalExpected) || 0;
        stadium.singleSessionRevenue += amount;
        stadium.totalRevenue += amount;
        // Mark as pending initially (will be updated with actual payments)
        stadium.pendingRevenue += amount;
        stadium.singleSessionPending += amount;
      }
    });

    // ===== 2. SINGLE SESSION ACTUAL PAYMENTS (CASH PAYMENTS) =====
    const singleSessionPayments = await db
      .select({
        stadiumId: reservations.stadiumId,
        amount: sql<number>`COALESCE(SUM(${cashPaymentRecords.amount}), 0)`,
        paymentCount: sql<number>`COUNT(*)`,
      })
      .from(cashPaymentRecords)
      .innerJoin(
        reservations,
        eq(cashPaymentRecords.reservationId, reservations.id),
      )
      .innerJoin(stadiums, eq(reservations.stadiumId, stadiums.id))
      .where(
        and(
          sql`YEAR(${cashPaymentRecords.paymentDate}) = ${year}`,
          isNull(cashPaymentRecords.monthlyPaymentId), // Single sessions only
          isNull(stadiums.deletedAt),
        ),
      )
      .groupBy(reservations.stadiumId);

    console.log(`Single session payments (actual): ${singleSessionPayments.length} rows`);

    // Process actual payments - adjust from pending to paid
    singleSessionPayments.forEach((row) => {
      const stadium = revenueMap.get(row.stadiumId);
      if (stadium) {
        const amount = Number(row.amount) || 0;
        // Move from pending to paid
        stadium.pendingRevenue -= amount;
        stadium.singleSessionPending -= amount;
        
        stadium.paidRevenue += amount;
        stadium.singleSessionPaid += amount;
      }
    });

    // ===== 3. SUBSCRIPTION REVENUE FROM MONTHLY PAYMENTS (EXPECTED REVENUE) =====
    const subscriptionData = await db
      .select({
        stadiumId: reservationSeries.stadiumId,
        status: monthlyPayments.status,
        amount: sql<number>`COALESCE(SUM(${monthlyPayments.amount}), 0)`,
        paymentCount: sql<number>`COUNT(*)`,
      })
      .from(monthlyPayments)
      .innerJoin(
        reservationSeries,
        eq(monthlyPayments.reservationSeriesId, reservationSeries.id),
      )
      .innerJoin(stadiums, eq(reservationSeries.stadiumId, stadiums.id))
      .where(
        and(
          eq(monthlyPayments.year, year),
          isNull(stadiums.deletedAt),
        ),
      )
      .groupBy(reservationSeries.stadiumId, monthlyPayments.status);

    console.log(`Subscription payments: ${subscriptionData.length} rows`);

    // Process subscription payments (EXPECTED REVENUE)
    subscriptionData.forEach((row) => {
      const stadium = revenueMap.get(row.stadiumId);
      if (stadium) {
        const amount = Number(row.amount) || 0;
        const status = row.status;

        // Add to subscription revenue (expected)
        stadium.subscriptionRevenue += amount;
        // Add to total revenue (expected)
        stadium.totalRevenue += amount;

        switch (status) {
          case "PAID":
            stadium.paidRevenue += amount;
            stadium.subscriptionPaid += amount;
            break;
          case "OVERDUE":
            stadium.overdueRevenue += amount;
            stadium.subscriptionOverdue += amount;
            break;
          case "PENDING":
            stadium.pendingRevenue += amount;
            stadium.subscriptionPending += amount;
            break;
        }
      }
    });

    // ===== 4. GET SUBSCRIPTION CASH PAYMENTS (ACTUAL PAYMENTS) =====
    // Already counted in monthlyPayments, but we track for consistency
    const subscriptionCashData = await db
      .select({
        stadiumId: reservationSeries.stadiumId,
        amount: sql<number>`COALESCE(SUM(${cashPaymentRecords.amount}), 0)`,
      })
      .from(cashPaymentRecords)
      .innerJoin(
        monthlyPayments,
        eq(cashPaymentRecords.monthlyPaymentId, monthlyPayments.id),
      )
      .innerJoin(
        reservationSeries,
        eq(monthlyPayments.reservationSeriesId, reservationSeries.id),
      )
      .innerJoin(stadiums, eq(reservationSeries.stadiumId, stadiums.id))
      .where(
        and(
          sql`YEAR(${cashPaymentRecords.paymentDate}) = ${year}`,
          isNotNull(cashPaymentRecords.monthlyPaymentId),
          isNull(stadiums.deletedAt),
        ),
      )
      .groupBy(reservationSeries.stadiumId);

    console.log(`Subscription cash payments: ${subscriptionCashData.length} rows`);

    // ===== 5. CORRECT SINGLE SESSION UNPAID AMOUNTS =====
    // Some single sessions might be UNPAID status (not just pending)
    const unpaidSingleSessions = await db
      .select({
        stadiumId: reservations.stadiumId,
        totalUnpaid: sql<number>`COALESCE(SUM(${reservations.sessionPrice}), 0)`,
        count: sql<number>`COUNT(*)`,
      })
      .from(reservations)
      .innerJoin(stadiums, eq(reservations.stadiumId, stadiums.id))
      .where(
        and(
          sql`YEAR(${reservations.startDateTime}) = ${year}`,
          eq(reservations.paymentType, "SINGLE_SESSION"),
          eq(reservations.status, "UNPAID"), // Specifically UNPAID status
          isNull(reservations.deletedAt),
          isNull(stadiums.deletedAt),
        ),
      )
      .groupBy(reservations.stadiumId);

    console.log(`Unpaid single sessions (UNPAID status): ${unpaidSingleSessions.length} rows`);
    unpaidSingleSessions.forEach((row) => {
      console.log(
        `Stadium ${row.stadiumId}: ${row.count} UNPAID sessions, total: ${row.totalUnpaid}`,
      );
      
      const stadium = revenueMap.get(row.stadiumId);
      if (stadium) {
        const amount = Number(row.totalUnpaid) || 0;
        // Move from pending to overdue for UNPAID sessions
        stadium.pendingRevenue -= amount;
        stadium.singleSessionPending -= amount;
        
        stadium.overdueRevenue += amount;
        stadium.singleSessionOverdue += amount;
      }
    });

    // ===== 6. PREPARE FINAL DATA =====
    const stadiumRevenues = Array.from(revenueMap.values());
    const stadiumsWithRevenue = stadiumRevenues.filter((s) => s.totalRevenue > 0);

    // Calculate totals for summary
    const totalRevenue = stadiumsWithRevenue.reduce(
      (sum, stadium) => sum + stadium.totalRevenue,
      0,
    );
    const totalPaid = stadiumsWithRevenue.reduce(
      (sum, stadium) => sum + stadium.paidRevenue,
      0,
    );
    const totalOverdue = stadiumsWithRevenue.reduce(
      (sum, stadium) => sum + stadium.overdueRevenue,
      0,
    );
    const totalPending = stadiumsWithRevenue.reduce(
      (sum, stadium) => sum + stadium.pendingRevenue,
      0,
    );
    const totalSubscription = stadiumsWithRevenue.reduce(
      (sum, stadium) => sum + stadium.subscriptionRevenue,
      0,
    );
    const totalSingleSession = stadiumsWithRevenue.reduce(
      (sum, stadium) => sum + stadium.singleSessionRevenue,
      0,
    );

    const expectedRevenue = totalRevenue; // This is already expected revenue
    const collectionRate =
      expectedRevenue > 0
        ? Math.round((totalPaid / expectedRevenue) * 100)
        : 0;

    // Calculate percentages for each stadium
    const stadiumsWithPercentages = stadiumsWithRevenue.map((stadium) => {
      const percentage =
        totalRevenue > 0
          ? Math.round((stadium.totalRevenue / totalRevenue) * 100)
          : 0;

      const stadiumExpectedRevenue = stadium.totalRevenue;
      const stadiumCollectionRate =
        stadiumExpectedRevenue > 0
          ? Math.round((stadium.paidRevenue / stadiumExpectedRevenue) * 100)
          : 0;

      return {
        ...stadium,
        percentage,
        collectionRate: stadiumCollectionRate,
      };
    });

    // Sort by total revenue (highest first)
    const sortedStadiums = stadiumsWithPercentages.sort(
      (a, b) => b.totalRevenue - a.totalRevenue,
    );

    console.log(`\nFinal result: ${sortedStadiums.length} stadiums with revenue`);
    console.log(`Total expected revenue: ${totalRevenue} MAD`);
    console.log(`Total paid: ${totalPaid} MAD`);
    console.log(`Total overdue: ${totalOverdue} MAD`);
    console.log(`Total pending: ${totalPending} MAD`);
    console.log(`Collection rate: ${collectionRate}%`);
    console.log(`Subscription revenue: ${totalSubscription} MAD`);
    console.log(`Single session revenue: ${totalSingleSession} MAD`);
    
    sortedStadiums.forEach((stadium) => {
      console.log(
        `${stadium.name}: ${stadium.totalRevenue} MAD (Paid: ${stadium.paidRevenue}, Overdue: ${stadium.overdueRevenue}, Pending: ${stadium.pendingRevenue})`,
      );
      console.log(`  - Single: ${stadium.singleSessionRevenue} MAD (Paid: ${stadium.singleSessionPaid}, Overdue: ${stadium.singleSessionOverdue}, Pending: ${stadium.singleSessionPending})`);
      console.log(`  - Subscription: ${stadium.subscriptionRevenue} MAD (Paid: ${stadium.subscriptionPaid}, Overdue: ${stadium.subscriptionOverdue}, Pending: ${stadium.subscriptionPending})`);
    });

    return {
      stadiums: sortedStadiums,
      summary: {
        totalRevenue,
        subscriptionRevenue: totalSubscription,
        singleSessionRevenue: totalSingleSession,
        paidAmount: totalPaid,
        overdueAmount: totalOverdue,
        pendingAmount: totalPending,
        collectionRate,
        expectedRevenue,
      },
    };
  } catch (error) {
    console.error("Error fetching revenue by stadium:", error);
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
// Add this temporary debug function
export async function debugRevenueData(year: number) {
  try {
    console.log(`\n=== DEBUG REVENUE DATA FOR ${year} ===`);
    
    // 1. Check monthly payments
    const monthlyPaymentsData = await db
      .select({
        month: monthlyPayments.month,
        year: monthlyPayments.year,
        status: monthlyPayments.status,
        amount: monthlyPayments.amount,
        stadiumName: stadiums.name,
      })
      .from(monthlyPayments)
      .leftJoin(reservationSeries, eq(monthlyPayments.reservationSeriesId, reservationSeries.id))
      .leftJoin(stadiums, eq(reservationSeries.stadiumId, stadiums.id))
      .where(eq(monthlyPayments.year, year))
      .orderBy(monthlyPayments.month);

    console.log(`Monthly payments for ${year}: ${monthlyPaymentsData.length}`);
    monthlyPaymentsData.forEach(p => {
      console.log(`Month ${p.month}: ${p.amount} MAD, Status: ${p.status}, Stadium: ${p.stadiumName}`);
    });

    // 2. Check cash payments
    const cashPaymentsData = await db
      .select({
        amount: cashPaymentRecords.amount,
        paymentDate: cashPaymentRecords.paymentDate,
        monthlyPaymentId: cashPaymentRecords.monthlyPaymentId,
        reservationId: cashPaymentRecords.reservationId,
      })
      .from(cashPaymentRecords)
      .where(sql`YEAR(${cashPaymentRecords.paymentDate}) = ${year}`);

    console.log(`\nCash payments for ${year}: ${cashPaymentsData.length}`);
    const totalCash = cashPaymentsData.reduce((sum, p) => sum + Number(p.amount), 0);
    console.log(`Total cash payments: ${totalCash} MAD`);
    
    const withMonthlyId = cashPaymentsData.filter(p => p.monthlyPaymentId);
    const withoutMonthlyId = cashPaymentsData.filter(p => !p.monthlyPaymentId);
    console.log(`With monthlyPaymentId (subscriptions): ${withMonthlyId.length}`);
    console.log(`Without monthlyPaymentId (single sessions): ${withoutMonthlyId.length}`);

    // 3. Check reservations with cash payments
    const paidReservations = await db
      .select({
        id: reservations.id,
        stadiumName: stadiums.name,
        sessionPrice: reservations.sessionPrice,
        isPaid: reservations.isPaid,
        paymentType: reservations.paymentType,
        cashPaymentAmount: cashPaymentRecords.amount,
      })
      .from(reservations)
      .innerJoin(stadiums, eq(reservations.stadiumId, stadiums.id))
      .leftJoin(cashPaymentRecords, eq(reservations.id, cashPaymentRecords.reservationId))
      .where(
        and(
          sql`YEAR(${reservations.createdAt}) = ${year}`,
          eq(reservations.isPaid, true)
        )
      )
      .limit(10);

    console.log(`\nPaid reservations for ${year}: ${paidReservations.length}`);
    paidReservations.forEach(r => {
      console.log(`Reservation: ${r.sessionPrice} MAD, Type: ${r.paymentType}, Stadium: ${r.stadiumName}, Cash: ${r.cashPaymentAmount || 'none'}`);
    });

  } catch (error) {
    console.error("Debug error:", error);
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

    // YEAR: Total Reservations - FIXED: Use startDateTime instead of createdAt
    db.select({ count: count() })
      .from(reservations)
      .where(
        and(
          isNull(reservations.deletedAt),
          gte(reservations.startDateTime, startOfYearDate.toISOString()),
          lte(reservations.startDateTime, endOfYearDate.toISOString()),
        ),
      ),

    // YEAR: Active Reservations - FIXED: Current and future APPROVED reservations
    db.select({ count: count() })
      .from(reservations)
      .where(
        and(
          isNull(reservations.deletedAt),
          gte(reservations.startDateTime, currentDate.toISOString()),
          eq(reservations.status, "APPROVED"),
          gte(reservations.startDateTime, startOfYearDate.toISOString()),
          lte(reservations.startDateTime, endOfYearDate.toISOString()),
        ),
      ),

    // YEAR: Pending Reservations - FIXED: Use startDateTime
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

    // YEAR: New Clubs this year - FIXED: Based on club.createdAt
    db.select({ count: count() })
      .from(clubs)
      .where(
        and(
          isNull(clubs.deletedAt),
          gte(clubs.createdAt, startOfYearDate.toISOString()),
          lte(clubs.createdAt, endOfYearDate.toISOString()),
        ),
      ),

    // YEAR: New Users this year - FIXED: Based on user.createdAt
    db.select({ count: count() })
      .from(users)
      .where(
        and(
          isNull(users.deletedAt),
          eq(users.role, "CLUB"), // Only club users
          gte(users.createdAt, startOfYearDate.toISOString()),
          lte(users.createdAt, endOfYearDate.toISOString()),
        ),
      ),

    // YEAR: Active Subscriptions - FIXED: Count all ACTIVE regardless of creation date
    db.select({ count: count() })
      .from(monthlySubscriptions)
      .where(
        and(
          eq(monthlySubscriptions.status, "ACTIVE"),
          // Don't filter by createdAt - count all active subscriptions
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

  // Calculate YEAR: Average stadium utilization - FIXED: Use actual days passed
  const totalStadiums = totalStadiumsResult[0]?.count || 1;
  const totalReservationsThisYear = totalReservationsResult[0]?.count || 0;
  
  // Calculate days passed this year (or full year if not current year)
  const now = new Date();
  const daysInYear = year === now.getFullYear() 
    ? Math.ceil((now.getTime() - new Date(year, 0, 1).getTime()) / (1000 * 60 * 60 * 24))
    : 365;
  
  const avgUtilization = Math.min(
    100,
    Math.round((totalReservationsThisYear / (totalStadiums * Math.max(1, daysInYear))) * 100),
  );

  // Calculate YEAR: Completion rate - FIXED: Consider reservations that actually happened
  // Count reservations that have started and are APPROVED
  const completedReservations = await db
    .select({ count: count() })
    .from(reservations)
    .where(
      and(
        isNull(reservations.deletedAt),
        gte(reservations.startDateTime, startOfYearDate.toISOString()),
        lte(reservations.startDateTime, endOfYearDate.toISOString()),
        eq(reservations.status, "APPROVED"),
        lte(reservations.startDateTime, now.toISOString()), // Only reservations that have started
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
    if (previous === 0) return current > 0 ? "+100%" : "";
    const change = ((current - previous) / previous) * 100;
    return change >= 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`;
  };

  const calculateAbsoluteChange = (current: number, previous: number): string => {
    if (previous === 0) return current > 0 ? `+${current}` : "";
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




// ==================== RESERVATIONS BY MONTH ====================
export async function getReservationsByMonth(year: number): Promise<ChartData[]> {
  try {
    const startDate = startOfYear(new Date(year, 0, 1)).toISOString();
    const endDate = endOfYear(new Date(year, 11, 31)).toISOString();

    const reservationsByMonth = await db
      .select({
        month: sql<string>`MONTH(${reservations.startDateTime})`, // FIXED: Use startDateTime
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

// ==================== REVENUE BY MONTH - IMPROVED ====================
// ==================== REVENUE BY MONTH - FIXED VERSION ====================
// ==================== REVENUE BY MONTH - FINAL FIX ====================
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

    // ===== 1. SINGLE SESSION: EXPECTED REVENUE (ALL APPROVED RESERVATIONS) =====
    const singleSessionExpected = await db
      .select({
        month: sql<string>`MONTH(${reservations.startDateTime})`,
        totalExpected: sql<number>`COALESCE(SUM(${reservations.sessionPrice}), 0)`,
      })
      .from(reservations)
      .where(
        and(
          sql`YEAR(${reservations.startDateTime}) = ${year}`,
          eq(reservations.paymentType, "SINGLE_SESSION"),
          eq(reservations.status, "APPROVED"),
          isNull(reservations.deletedAt),
        ),
      )
      .groupBy(sql`MONTH(${reservations.startDateTime})`);

    console.log("\n=== DEBUG: Single Session Expected Revenue ===");
    singleSessionExpected.forEach(item => {
      console.log(`Month ${item.month}: ${item.totalExpected} MAD`);
    });

    // Process expected single session revenue
    singleSessionExpected.forEach(item => {
      const monthIndex = parseInt(item.month) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        const amount = Number(item.totalExpected) || 0;
        monthlyData[monthIndex].singleSessionRevenue = amount;
        monthlyData[monthIndex].totalRevenue += amount;
        monthlyData[monthIndex].pendingAmount += amount; // Start as pending
      }
    });

    // ===== 2. SINGLE SESSION: ACTUAL CASH PAYMENTS =====
    const singleSessionPayments = await db
      .select({
        month: sql<string>`MONTH(${cashPaymentRecords.paymentDate})`,
        amount: sql<number>`COALESCE(SUM(${cashPaymentRecords.amount}), 0)`,
      })
      .from(cashPaymentRecords)
      .where(
        and(
          sql`YEAR(${cashPaymentRecords.paymentDate}) = ${year}`,
          isNull(cashPaymentRecords.monthlyPaymentId), // Single sessions only
        ),
      )
      .groupBy(sql`MONTH(${cashPaymentRecords.paymentDate})`);

    console.log("\n=== DEBUG: Single Session Cash Payments ===");
    singleSessionPayments.forEach(item => {
      console.log(`Month ${item.month}: ${item.amount} MAD`);
    });

    // Process actual payments - adjust from pending to paid
    singleSessionPayments.forEach(item => {
      const monthIndex = parseInt(item.month) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        const amount = Number(item.amount) || 0;
        monthlyData[monthIndex].pendingAmount -= amount;
        monthlyData[monthIndex].paidAmount += amount;
      }
    });

    // ===== 3. SUBSCRIPTION: MONTHLY PAYMENTS (EXPECTED REVENUE) =====
    const allMonthlyPayments = await db
      .select({
        month: monthlyPayments.month,
        paidAmount: sql<number>`COALESCE(SUM(CASE WHEN ${monthlyPayments.status} = 'PAID' THEN ${monthlyPayments.amount} ELSE 0 END), 0)`,
        overdueAmount: sql<number>`COALESCE(SUM(CASE WHEN ${monthlyPayments.status} = 'OVERDUE' THEN ${monthlyPayments.amount} ELSE 0 END), 0)`,
        pendingAmount: sql<number>`COALESCE(SUM(CASE WHEN ${monthlyPayments.status} = 'PENDING' THEN ${monthlyPayments.amount} ELSE 0 END), 0)`,
        totalExpected: sql<number>`COALESCE(SUM(${monthlyPayments.amount}), 0)`,
      })
      .from(monthlyPayments)
      .where(eq(monthlyPayments.year, year))
      .groupBy(monthlyPayments.month);

    console.log("\n=== DEBUG: Monthly Payments ===");
    allMonthlyPayments.forEach(item => {
      console.log(`Month ${item.month}: Paid=${item.paidAmount}, Overdue=${item.overdueAmount}, Pending=${item.pendingAmount}, Total=${item.totalExpected}`);
    });

    // Process monthly payments
    allMonthlyPayments.forEach(item => {
      const monthIndex = Number(item.month) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        const paid = Number(item.paidAmount) || 0;
        const pending = Number(item.pendingAmount) || 0;
        const overdue = Number(item.overdueAmount) || 0;
        const totalExpected = Number(item.totalExpected) || 0;
        
        // Add to subscription revenue
        monthlyData[monthIndex].subscriptionRevenue += totalExpected;
        // Add to total revenue
        monthlyData[monthIndex].totalRevenue += totalExpected;
        
        // Track status amounts
        monthlyData[monthIndex].paidAmount += paid;
        monthlyData[monthIndex].pendingAmount += pending;
        monthlyData[monthIndex].overdueAmount += overdue;
      }
    });

    // ===== 4. ADJUST FOR UNPAID SINGLE SESSIONS =====
    const unpaidSingleSessions = await db
      .select({
        month: sql<string>`MONTH(${reservations.startDateTime})`,
        totalUnpaid: sql<number>`COALESCE(SUM(${reservations.sessionPrice}), 0)`,
      })
      .from(reservations)
      .where(
        and(
          sql`YEAR(${reservations.startDateTime}) = ${year}`,
          eq(reservations.paymentType, "SINGLE_SESSION"),
          eq(reservations.status, "UNPAID"),
          isNull(reservations.deletedAt),
        ),
      )
      .groupBy(sql`MONTH(${reservations.startDateTime})`);

    console.log("\n=== DEBUG: Unpaid Single Sessions ===");
    unpaidSingleSessions.forEach(item => {
      console.log(`Month ${item.month}: ${item.totalUnpaid} MAD`);
    });

    // Adjust UNPAID single sessions from pending to overdue
    unpaidSingleSessions.forEach(item => {
      const monthIndex = parseInt(item.month) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        const amount = Number(item.totalUnpaid) || 0;
        monthlyData[monthIndex].pendingAmount -= amount;
        monthlyData[monthIndex].overdueAmount += amount;
      }
    });

    // ===== 5. CALCULATE COLLECTION RATE =====
    monthlyData.forEach(month => {
      const expectedRevenue = month.totalRevenue;
      if (expectedRevenue > 0) {
        const paid = Math.max(0, month.paidAmount); // Ensure not negative
        const pending = Math.max(0, month.pendingAmount); // Ensure not negative
        const overdue = Math.max(0, month.overdueAmount); // Ensure not negative
        
        // Recalculate to ensure consistency
        month.paidAmount = paid;
        month.pendingAmount = pending;
        month.overdueAmount = overdue;
        
        // Recalculate total to ensure it matches sum of statuses
        month.totalRevenue = paid + pending + overdue;
        
        // Recalculate single session revenue to match total minus subscription
        month.singleSessionRevenue = month.totalRevenue - month.subscriptionRevenue;
        
        // Calculate collection rate
        month.collectionRate = Math.min(100, Math.max(0, Math.round((paid / month.totalRevenue) * 100)));
      }
    });

    // ===== 6. DEBUG LOGGING =====
    console.log("\n=== DEBUG: Final Monthly Revenue Breakdown ===");
    let totalSingle = 0;
    let totalSub = 0;
    let totalAll = 0;
    
    monthlyData.forEach((month, index) => {
      if (month.totalRevenue > 0) {
        totalSingle += month.singleSessionRevenue;
        totalSub += month.subscriptionRevenue;
        totalAll += month.totalRevenue;
        
        console.log(`${month.month}: Total=${month.totalRevenue}, Single=${month.singleSessionRevenue}, Sub=${month.subscriptionRevenue}, Paid=${month.paidAmount}, Overdue=${month.overdueAmount}, Pending=${month.pendingAmount}, Rate=${month.collectionRate}%`);
      }
    });
    
    console.log(`\nTotals: Single=${totalSingle}, Subscription=${totalSub}, All=${totalAll}`);

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

// ==================== RESERVATIONS BY STATUS - FIXED ====================
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
          gte(reservations.startDateTime, startDate), // FIXED: Use startDateTime
          lte(reservations.startDateTime, endDate),
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
    // Get years from monthlyPayments (subscriptions)
    const yearsFromPayments = await db
      .selectDistinct({ year: monthlyPayments.year })
      .from(monthlyPayments)
      .orderBy(desc(monthlyPayments.year));

    // Get years from cashPaymentRecords (single sessions)
    const yearsFromCash = await db
      .selectDistinct({
        year: sql<number>`YEAR(${cashPaymentRecords.paymentDate})`
      })
      .from(cashPaymentRecords)
      .where(isNull(cashPaymentRecords.monthlyPaymentId)) // Only single sessions
      .orderBy(desc(sql`YEAR(${cashPaymentRecords.paymentDate})`));

    // Also check reservations for years
    const yearsFromReservations = await db
      .selectDistinct({
        year: sql<number>`YEAR(${reservations.createdAt})`
      })
      .from(reservations)
      .orderBy(desc(sql`YEAR(${reservations.createdAt})`));

    // Combine all years
    const allYears = [
      ...yearsFromPayments.map(item => item.year),
      ...yearsFromCash.map(item => item.year),
      ...yearsFromReservations.map(item => item.year)
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