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
  notifications
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
  like
} from "drizzle-orm";
import { startOfYear, endOfYear, startOfMonth, endOfMonth, subMonths, subYears } from "date-fns";
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
  type: 'reservation' | 'payment' | 'subscription' | 'user' | 'club';
  title: string;
  description: string;
  time: string;
  status?: 'success' | 'pending' | 'warning';
}

export interface UpcomingReservation {
  id: string;
  stadiumName: string;
  clubName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled'; // CHANGE: 'confirmed' not 'approved'
  amount?: number;
}
export interface ChartData {
  month: string;
  value: number;
}

export interface StadiumUtilization {
  name: string;
  usage: number;
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
  status:  ReservationStatusType;
  count: number;
  color: string;
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
// Main dashboard data fetcher
export async function getDashboardData(year: number = new Date().getFullYear()) {
  try {
    const [
      stats, 
      recentActivity, 
      upcomingReservations, 
      reservationsByMonth, 
      revenueByMonth, 
      stadiumUtilization,
      reservationsByStatus
    ] = await Promise.all([
      getDashboardStats(year),
      getRecentActivity(year),
      getUpcomingReservations(year),
      getReservationsByMonth(year),
      getRevenueByMonth(year),
      getStadiumUtilization(year),
      getReservationsByStatus(year)
    ]);

    return {
      stats,
      recentActivity,
      upcomingReservations,
      reservationsByMonth,
      revenueByMonth,
      stadiumUtilization,
      reservationsByStatus,
      revenueTrends: revenueByMonth
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
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
    newUsersThisMonthResult  // This is current month (not year)
  ] = await Promise.all([
    // Total Reservations (FILTERED BY YEAR)
    db.select({ count: count() })
      .from(reservations)
      .where(
        and(
          isNull(reservations.deletedAt),
          gte(reservations.createdAt, startOfYearDate.toISOString()),
          lte(reservations.createdAt, endOfYearDate.toISOString())
        )
      ),

    // Active Reservations (FILTERED BY YEAR)
    db.select({ count: count() })
      .from(reservations)
      .where(
        and(
          isNull(reservations.deletedAt),
          gte(reservations.startDateTime, new Date().toISOString().split('T')[0]),
          eq(reservations.status, 'APPROVED'),
          gte(reservations.createdAt, startOfYearDate.toISOString()),
          lte(reservations.createdAt, endOfYearDate.toISOString())
        )
      ),

    // Pending Reservations (FILTERED BY YEAR)
    db.select({ count: count() })
      .from(reservations)
      .where(
        and(
          isNull(reservations.deletedAt),
          eq(reservations.status, 'PENDING'),
          gte(reservations.createdAt, startOfYearDate.toISOString()),
          lte(reservations.createdAt, endOfYearDate.toISOString())
        )
      ),

    // Total Clubs - FILTERED BY YEAR (clubs created up to this year)
    db.select({ count: count() })
      .from(clubs)
      .where(
        and(
          isNull(clubs.deletedAt),
          lte(clubs.createdAt, endOfYearDate.toISOString())
        )
      ),

    // NEW: New Clubs this year (YEAR-FILTERED - this is what you want)
    db.select({ count: count() })
      .from(clubs)
      .where(
        and(
          isNull(clubs.deletedAt),
          gte(clubs.createdAt, startOfYearDate.toISOString()),
          lte(clubs.createdAt, endOfYearDate.toISOString())
        )
      ),

    // NEW: New Users this year (YEAR-FILTERED - this is what you want)
    db.select({ count: count() })
      .from(users)
      .where(
        and(
          isNull(users.deletedAt),
          gte(users.createdAt, startOfYearDate.toISOString()),
          lte(users.createdAt, endOfYearDate.toISOString())
        )
      ),

    // Total Stadiums - ALL TIME (NOT year-filtered)
    db.select({ count: count() })
      .from(stadiums)
      .where(isNull(stadiums.deletedAt)),

    // Total Users - ALL TIME (NOT year-filtered)
    db.select({ count: count() })
      .from(users)
      .where(isNull(users.deletedAt)),

    // Active Subscriptions - ALL TIME (not year-filtered)
    db.select({ count: count() })
      .from(monthlySubscriptions)
      .where(eq(monthlySubscriptions.status, 'ACTIVE')),

    // Overdue Payments - FILTERED BY YEAR
    db.select({ count: count() })
      .from(monthlyPayments)
      .where(
        and(
          eq(monthlyPayments.status, 'OVERDUE'),
          eq(monthlyPayments.year, year)
        )
      ),

    // New Clubs this month - CURRENT MONTH (not year-filtered)
    db.select({ count: count() })
      .from(clubs)
      .where(
        and(
          isNull(clubs.deletedAt),
          gte(clubs.createdAt, startOfCurrentMonth.toISOString()),
          lte(clubs.createdAt, endOfCurrentMonth.toISOString())
        )
      ),

    // New Users this month - CURRENT MONTH (not year-filtered)
    db.select({ count: count() })
      .from(users)
      .where(
        and(
          isNull(users.deletedAt),
          gte(users.createdAt, startOfCurrentMonth.toISOString()),
          lte(users.createdAt, endOfCurrentMonth.toISOString())
        )
      )
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
            newClubsThisYear:  0,
    newUsersThisYear:  0,
        avgUtilization: 0,
        completionRate: 0
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
      overduePaymentsPreviousResult
    ] = await Promise.all([
      // Total Reservations previous year
      db.select({ count: count() })
        .from(reservations)
        .where(
          and(
            isNull(reservations.deletedAt),
            gte(reservations.createdAt, startOfPreviousYear.toISOString()),
            lte(reservations.createdAt, endOfPreviousYear.toISOString())
          )
        ),
      
      // Active Reservations previous year
      db.select({ count: count() })
        .from(reservations)
        .where(
          and(
            isNull(reservations.deletedAt),
            eq(reservations.status, 'APPROVED'),
            gte(reservations.createdAt, startOfPreviousYear.toISOString()),
            lte(reservations.createdAt, endOfPreviousYear.toISOString())
          )
        ),
      
      // Pending Reservations previous year
      db.select({ count: count() })
        .from(reservations)
        .where(
          and(
            isNull(reservations.deletedAt),
            eq(reservations.status, 'PENDING'),
            gte(reservations.createdAt, startOfPreviousYear.toISOString()),
            lte(reservations.createdAt, endOfPreviousYear.toISOString())
          )
        ),
      
      // Total Clubs previous year
      db.select({ count: count() })
        .from(clubs)
        .where(
          and(
            isNull(clubs.deletedAt),
            lte(clubs.createdAt, endOfPreviousYear.toISOString())
          )
        ),
      
      // New Clubs previous year (YEAR-FILTERED)
      db.select({ count: count() })
        .from(clubs)
        .where(
          and(
            isNull(clubs.deletedAt),
            gte(clubs.createdAt, startOfPreviousYear.toISOString()),
            lte(clubs.createdAt, endOfPreviousYear.toISOString())
          )
        ),
      
      // New Users previous year (YEAR-FILTERED)
      db.select({ count: count() })
        .from(users)
        .where(
          and(
            isNull(users.deletedAt),
            gte(users.createdAt, startOfPreviousYear.toISOString()),
            lte(users.createdAt, endOfPreviousYear.toISOString())
          )
        ),
      
      // Overdue Payments previous year
      db.select({ count: count() })
        .from(monthlyPayments)
        .where(
          and(
            eq(monthlyPayments.status, 'OVERDUE'),
            eq(monthlyPayments.year, previousYear)
          )
        )
    ]);

    // Calculate previous year avg utilization
    const totalStadiums = totalStadiumsResult[0]?.count || 1;
    const totalReservationsPreviousYear = totalReservationsPreviousResult[0]?.count || 0;
    const avgUtilizationPrevious = Math.min(100, Math.round((totalReservationsPreviousYear / (totalStadiums * 365)) * 100));

    // Calculate previous year completion rate
    const completedReservationsPrevious = await db.select({ count: count() })
      .from(reservations)
      .where(
        and(
          isNull(reservations.deletedAt),
          gte(reservations.createdAt, startOfPreviousYear.toISOString()),
          lte(reservations.createdAt, endOfPreviousYear.toISOString()),
          eq(reservations.status, 'APPROVED')
        )
      );
    
    const completionRatePrevious = totalReservationsPreviousYear > 0 
      ? Math.round((completedReservationsPrevious[0]?.count || 0) / totalReservationsPreviousYear * 100)
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
  const avgUtilization = Math.min(100, Math.round((totalReservationsThisYear / (totalStadiums * 365)) * 100));

  // Calculate completion rate (approved vs total reservations this year)
  const completedReservations = await db.select({ count: count() })
    .from(reservations)
    .where(
      and(
        isNull(reservations.deletedAt),
        gte(reservations.createdAt, startOfYearDate.toISOString()),
        lte(reservations.createdAt, endOfYearDate.toISOString()),
        eq(reservations.status, 'APPROVED')
      )
    );
  
  const completionRate = totalReservationsThisYear > 0 
    ? Math.round((completedReservations[0]?.count || 0) / totalReservationsThisYear * 100)
    : 0;

  // Calculate changes
  const calculateChange = (current: number, previous: number): string => {
    if (previous === 0) return ""; // No change shown if no previous data
    const change = ((current - previous) / previous) * 100;
    return change >= 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`;
  };

  const calculateAbsoluteChange = (current: number, previous: number): string => {
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
      totalReservationsChange: calculateChange(totalReservationsResult[0]?.count || 0, previousYearData.totalReservations),
      activeReservationsChange: calculateChange(activeReservationsResult[0]?.count || 0, previousYearData.activeReservations),
      pendingReservationsChange: calculateAbsoluteChange(pendingReservationsResult[0]?.count || 0, previousYearData.pendingReservations),
      totalClubsChange: calculateChange(totalClubsResult[0]?.count || 0, previousYearData.totalClubs),
      totalStadiumsChange: calculateAbsoluteChange(totalStadiumsResult[0]?.count || 0, previousYearData.totalStadiums),
      totalUsersChange: calculateChange(totalUsersResult[0]?.count || 0, previousYearData.totalUsers),
      subscriptionsChange: calculateAbsoluteChange(subscriptionsResult[0]?.count || 0, previousYearData.subscriptions),
      overduePaymentsChange: calculateAbsoluteChange(overduePaymentsResult[0]?.count || 0, previousYearData.overduePayments),
      avgUtilizationChange: calculateChange(avgUtilization, previousYearData.avgUtilization),
      completionRateChange: calculateChange(completionRate, previousYearData.completionRate),
      newClubsChange: calculateAbsoluteChange(newClubsThisYearResult[0]?.count || 0, previousYearData.newClubsThisYear || 0),
      newUsersChange: calculateChange(newUsersThisYearResult[0]?.count || 0, previousYearData.newUsersThisYear || 0)
    }
  };
}
// Get recent activity from notifications and recent actions
export async function getRecentActivity(year: number): Promise<RecentActivity[]> {
  try {
    const startDate = startOfYear(new Date(year, 0, 1)).toISOString();
    const endDate = endOfYear(new Date(year, 11, 31)).toISOString();

    // Get recent notifications for the specific year
    const recentNotifications = await db.query.notifications.findMany({
      where: and(
        gte(notifications.createdAt, startDate),
        lte(notifications.createdAt, endDate)
      ),
      orderBy: [desc(notifications.createdAt)],
      limit: 10,
      with: {
        user: {
          columns: {
            name: true,
            email: true
          }
        }
      }
    });

    // If no notifications, return empty array
    if (!recentNotifications.length) {
      return [];
    }

    // Transform notifications to activity format
    return recentNotifications.map(notification => {
      let type: RecentActivity['type'] = 'reservation';
      let status: RecentActivity['status'] = 'success';

      // Determine type from notification model
      switch (notification.model) {
        case 'RESERVATION':
          type = 'reservation';
          break;
        case 'PAYMENT':
          type = 'payment';
          break;
        case 'SUBSCRIPTION':
          type = 'subscription';
          break;
        case 'USER':
          type = 'user';
          break;
        case 'SYSTEM':
          type = 'club';
          break;
      }

      // Determine status from notification type
      if (notification.type.includes('APPROVED') || notification.type.includes('RECEIVED') || notification.type.includes('VERIFIED')) {
        status = 'success';
      } else if (notification.type.includes('PENDING') || notification.type.includes('REQUESTED')) {
        status = 'pending';
      } else if (notification.type.includes('OVERDUE') || notification.type.includes('CANCELLED') || notification.type.includes('DECLINED')) {
        status = 'warning';
      }

      // Calculate time ago
      const createdAt = new Date(notification.createdAt);
      const now = new Date();
      const diffMs = now.getTime() - createdAt.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      let time = '';
      if (diffMins < 1) {
        time = 'just now';
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
        status
      };
    });
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return getMockRecentActivity(year);
  }
}

// Get upcoming reservations
// Get upcoming reservations
export async function getUpcomingReservations(year: number): Promise<UpcomingReservation[]> {
  try {
    const startDate = startOfYear(new Date(year, 0, 1)).toISOString();
    const endDate = endOfYear(new Date(year, 11, 31)).toISOString();
    
    const upcoming = await db.query.reservations.findMany({
      where: and(
        isNull(reservations.deletedAt),
        gte(reservations.startDateTime, startDate),
        lte(reservations.startDateTime, endDate),
        inArray(reservations.status, ['APPROVED', 'PENDING'])
      ),
      orderBy: [reservations.startDateTime],
      limit: 5,
      with: {
        stadium: {
          columns: {
            name: true
          }
        },
        user: {
          columns: {
            name: true
          }
        }
      }
    });

    // If no reservations, return empty array
    if (!upcoming.length) {
      return [];
    }

    return upcoming.map(reservation => {
      // Map database status to interface status - USE 'confirmed' not 'approved'
      let status: 'confirmed' | 'pending' | 'cancelled' = 'pending';
      if (reservation.status === 'APPROVED') {
        status = 'confirmed'; // CHANGE: 'confirmed' instead of 'approved'
      } else if (reservation.status === 'CANCELLED') {
        status = 'cancelled';
      } else if (reservation.status === 'PENDING') {
        status = 'pending';
      }

      return {
        id: reservation.id,
        stadiumName: reservation.stadium?.name || 'Unknown Stadium',
        clubName: reservation.user?.name || 'Unknown Club',
        date: new Date(reservation.startDateTime).toISOString().split('T')[0],
        time: `${new Date(reservation.startDateTime).getHours().toString().padStart(2, '0')}:${new Date(reservation.startDateTime).getMinutes().toString().padStart(2, '0')} - ${new Date(reservation.endDateTime).getHours().toString().padStart(2, '0')}:${new Date(reservation.endDateTime).getMinutes().toString().padStart(2, '0')}`,
        status, // Now returns 'confirmed' which matches frontend
        amount: Number(reservation.sessionPrice) || undefined
      };
    });
  } catch (error) {
    console.error("Error fetching upcoming reservations:", error);
    return getMockUpcomingReservations(year);
  }
}

// Get reservations by month for a specific year
export async function getReservationsByMonth(year: number): Promise<ChartData[]> {
  try {
    const startDate = startOfYear(new Date(year, 0, 1)).toISOString();
    const endDate = endOfYear(new Date(year, 11, 31)).toISOString();

    // Group reservations by month
    const reservationsByMonth = await db
      .select({
        month: sql<string>`MONTH(${reservations.createdAt})`,
        count: count()
      })
      .from(reservations)
      .where(
        and(
          isNull(reservations.deletedAt),
          gte(reservations.createdAt, startDate),
          lte(reservations.createdAt, endDate)
        )
      )
      .groupBy(sql`MONTH(${reservations.createdAt})`);

    // Create array for all 12 months
    const monthlyData: ChartData[] = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2000, i, 1).toLocaleDateString('en-US', { month: 'short' }),
      value: 0
    }));

    // Fill in actual data
    reservationsByMonth.forEach(item => {
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
export async function getRevenueByMonth(year: number): Promise<MonthlyRevenueData[]> {
  try {
    const startDate = startOfYear(new Date(year, 0, 1)).toISOString();
    const endDate = endOfYear(new Date(year, 11, 31)).toISOString();

    // Get all payments for the year
    const monthlyPaymentsData = await db
      .select({
        month: sql<string>`MONTH(${monthlyPayments.createdAt})`,
        amount: sum(monthlyPayments.amount),
        status: monthlyPayments.status
      })
      .from(monthlyPayments)
      .where(
        and(
          gte(monthlyPayments.createdAt, startDate),
          lte(monthlyPayments.createdAt, endDate)
        )
      )
      .groupBy(sql`MONTH(${monthlyPayments.createdAt})`, monthlyPayments.status);

    // Get single session payments
    const cashPaymentsData = await db
      .select({
        month: sql<string>`MONTH(${cashPaymentRecords.createdAt})`,
        amount: sum(cashPaymentRecords.amount)
      })
      .from(cashPaymentRecords)
      .where(
        and(
          gte(cashPaymentRecords.createdAt, startDate),
          lte(cashPaymentRecords.createdAt, endDate),
          isNull(cashPaymentRecords.reservationId) // Single session payments
        )
      )
      .groupBy(sql`MONTH(${cashPaymentRecords.createdAt})`);

    // Create array for all 12 months
    const monthlyData: MonthlyRevenueData[] = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2000, i, 1).toLocaleDateString('en-US', { month: 'short' }),
      totalRevenue: 0,
      subscriptionRevenue: 0,
      singleSessionRevenue: 0,
      paidAmount: 0,
      overdueAmount: 0,
      collectionRate: 0
    }));

    // Process subscription payments
    monthlyPaymentsData.forEach(item => {
      const monthIndex = parseInt(item.month) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        const amount = Number(item.amount) || 0;
        monthlyData[monthIndex].subscriptionRevenue += amount;
        monthlyData[monthIndex].totalRevenue += amount;
        
        if (item.status === 'PAID') {
          monthlyData[monthIndex].paidAmount += amount;
        } else if (item.status === 'OVERDUE') {
          monthlyData[monthIndex].overdueAmount += amount;
        }
      }
    });

    // Process single session payments
    cashPaymentsData.forEach(item => {
      const monthIndex = parseInt(item.month) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        const amount = Number(item.amount) || 0;
        monthlyData[monthIndex].singleSessionRevenue += amount;
        monthlyData[monthIndex].totalRevenue += amount;
        monthlyData[monthIndex].paidAmount += amount; // Cash payments are considered paid
      }
    });

    // Calculate collection rate for each month
    monthlyData.forEach(month => {
      month.collectionRate = month.totalRevenue > 0 
        ? Math.round((month.paidAmount / month.totalRevenue) * 100)
        : 0;
    });

    return monthlyData;
  } catch (error) {
    console.error("Error fetching revenue by month:", error);
    return getMockRevenueTrends(year);
  }
}

// Get stadium utilization
export async function getStadiumUtilization(year: number): Promise<StadiumUtilization[]> {
  try {
    // Get all stadiums
    const allStadiums = await db.query.stadiums.findMany({
      where: isNull(stadiums.deletedAt),
      columns: {
        id: true,
        name: true
      }
    });

    const startDate = startOfYear(new Date(year, 0, 1)).toISOString();
    const endDate = endOfYear(new Date(year, 11, 31)).toISOString();

    const stadiumUtilization = await Promise.all(
      allStadiums.map(async (stadium) => {
        const reservationsCount = await db
          .select({ count: count() })
          .from(reservations)
          .where(
            and(
              isNull(reservations.deletedAt),
              eq(reservations.stadiumId, stadium.id),
              gte(reservations.createdAt, startDate),
              lte(reservations.createdAt, endDate)
            )
          );

        // Calculate utilization percentage
        const maxCapacity = 20; // Adjust based on your logic
        const usage = Math.min(100, Math.round((reservationsCount[0]?.count || 0) / maxCapacity * 100));

        return {
          name: stadium.name,
          usage
        };
      })
    );

    return stadiumUtilization
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 5);
  } catch (error) {
    console.error("Error fetching stadium utilization:", error);
    return getMockStadiumUtilization();
  }
}

// Helper function to get total reservations for a year
async function getTotalReservationsForYear(year: number): Promise<number> {
  const startDate = startOfYear(new Date(year, 0, 1)).toISOString();
  const endDate = endOfYear(new Date(year, 11, 31)).toISOString();

  const result = await db
    .select({ count: count() })
    .from(reservations)
    .where(
      and(
        isNull(reservations.deletedAt),
        gte(reservations.createdAt, startDate),
        lte(reservations.createdAt, endDate)
      )
    );

  return result[0]?.count || 0;
}

// Get reservation status distribution
export async function getReservationsByStatus(year: number): Promise<ReservationStatusData[]> {
  try {
    const startDate = startOfYear(new Date(year, 0, 1)).toISOString();
    const endDate = endOfYear(new Date(year, 11, 31)).toISOString();

    const statusData = await db
      .select({
        status: reservations.status,
        count: count()
      })
      .from(reservations)
      .where(
        and(
          isNull(reservations.deletedAt),
          gte(reservations.createdAt, startDate),
          lte(reservations.createdAt, endDate)
        )
      )
      .groupBy(reservations.status);

    // If no data, return empty array
    if (!statusData.length) {
      return [];
    }

    // Define colors for each status
    const statusColors: Record<ReservationStatusType, string> = {
      "PENDING": "#f59e0b",
      "APPROVED": "#10b981",
      "DECLINED": "#ef4444",
      "CANCELLED": "#6b7280",
      "PAID": "#3b82f6",
      "UNPAID": "#ec4899"
    };

    return statusData.map(item => ({
      status: item.status,
      count: item.count,
      color: statusColors[item.status] || "#6b7280"
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

function getMockUpcomingReservations(year: number): UpcomingReservation[] {
  return []; // Always return empty array
}

function getMockReservationsByMonth(year: number): ChartData[] {
  // Return all months with value 0
  return Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2000, i, 1).toLocaleDateString('en-US', { month: 'short' }),
    value: 0
  }));
}

function getMockRevenueTrends(year: number): MonthlyRevenueData[] {
  // Return all months with all values as 0
  return Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2000, i, 1).toLocaleDateString('en-US', { month: 'short' }),
    totalRevenue: 0,
    subscriptionRevenue: 0,
    singleSessionRevenue: 0,
    paidAmount: 0,
    overdueAmount: 0,
    collectionRate: 0
  }));
}

function getMockStadiumUtilization(): StadiumUtilization[] {
  return []; // Always return empty array
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

    const yearsFromPayments = yearsData.map(item => item.year).filter(year => year >= 2026);
    
    // Always include current year
    const currentYear = new Date().getFullYear();
    const allYears = [...new Set([...yearsFromPayments, currentYear])]
      .filter(year => year >= 2026 && year <= currentYear)
      .sort((a, b) => b - a); // Sort descending (most recent first)

    return allYears.length > 0 ? allYears : [currentYear];
  } catch (error) {
    console.error("Error fetching available years:", error);
    // Fallback: generate years from 2026 to current year
    const currentYear = new Date().getFullYear();
    const startYear = 2026;
    return Array.from(
      { length: Math.max(0, currentYear - startYear + 1) },
      (_, i) => startYear + i
    ).reverse();
  }
}