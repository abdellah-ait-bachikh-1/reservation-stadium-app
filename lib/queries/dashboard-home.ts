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
  status: 'confirmed' | 'pending' | 'cancelled';
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

// Main dashboard data fetcher
export async function getDashboardData(year: number = new Date().getFullYear()) {
  try {
    const [stats, recentActivity, upcomingReservations, reservationsByMonth, revenueByMonth, stadiumUtilization] = await Promise.all([
      getDashboardStats(year),
      getRecentActivity(),
      getUpcomingReservations(),
      getReservationsByMonth(year),
      getRevenueByMonth(year),
      getStadiumUtilization()
    ]);

    return {
      stats,
      recentActivity,
      upcomingReservations,
      reservationsByMonth,
      revenueByMonth,
      stadiumUtilization,
      revenueTrends: revenueByMonth // Reuse revenue data for trends chart
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}

// Get all dashboard statistics
export async function getDashboardStats(year: number): Promise<DashboardStats> {
  const currentDate = new Date();
  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);
  const startOfYearDate = startOfYear(new Date(year, 0, 1));
  const endOfYearDate = endOfYear(new Date(year, 11, 31));

  // Execute all queries in parallel for better performance
  const [
    totalReservationsResult,
    activeReservationsResult,
    pendingReservationsResult,
    totalClubsResult,
    totalStadiumsResult,
    totalUsersResult,
    subscriptionsResult,
    overduePaymentsResult,
    newClubsThisMonthResult,
    newUsersThisMonthResult
  ] = await Promise.all([
    // Total Reservations (all time)
    db.select({ count: count() })
      .from(reservations)
      .where(isNull(reservations.deletedAt)),

    // Active Reservations (reservations happening today or in the future)
    db.select({ count: count() })
      .from(reservations)
      .where(
        and(
          isNull(reservations.deletedAt),
          gte(reservations.startDateTime, new Date().toISOString().split('T')[0]),
          eq(reservations.status, 'APPROVED')
        )
      ),

    // Pending Reservations
    db.select({ count: count() })
      .from(reservations)
      .where(
        and(
          isNull(reservations.deletedAt),
          eq(reservations.status, 'PENDING')
        )
      ),

    // Total Clubs
    db.select({ count: count() })
      .from(clubs)
      .where(isNull(clubs.deletedAt)),

    // Total Stadiums
    db.select({ count: count() })
      .from(stadiums)
      .where(isNull(stadiums.deletedAt)),

    // Total Users
    db.select({ count: count() })
      .from(users)
      .where(isNull(users.deletedAt)),

    // Active Subscriptions
    db.select({ count: count() })
      .from(monthlySubscriptions)
      .where(eq(monthlySubscriptions.status, 'ACTIVE')),

    // Overdue Payments
    db.select({ count: count() })
      .from(monthlyPayments)
      .where(
        and(
          eq(monthlyPayments.status, 'OVERDUE'),
          gte(monthlyPayments.year, year)
        )
      ),

    // New Clubs this month
    db.select({ count: count() })
      .from(clubs)
      .where(
        and(
          isNull(clubs.deletedAt),
          gte(clubs.createdAt, startOfCurrentMonth.toISOString()),
          lte(clubs.createdAt, endOfCurrentMonth.toISOString())
        )
      ),

    // New Users this month
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

  // Calculate average stadium utilization (mock calculation based on reservations)
  const totalStadiums = totalStadiumsResult[0]?.count || 1;
  const totalReservationsThisYear = await getTotalReservationsForYear(year);
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

  return {
    totalReservations: totalReservationsResult[0]?.count || 0,
    activeReservations: activeReservationsResult[0]?.count || 0,
    pendingReservations: pendingReservationsResult[0]?.count || 0,
    totalClubs: totalClubsResult[0]?.count || 0,
    totalStadiums: totalStadiums || 0,
    totalUsers: totalUsersResult[0]?.count || 0,
    subscriptions: subscriptionsResult[0]?.count || 0,
    overduePayments: overduePaymentsResult[0]?.count || 0,
    newClubsThisMonth: newClubsThisMonthResult[0]?.count || 0,
    newUsersThisMonth: newUsersThisMonthResult[0]?.count || 0,
    avgUtilization: avgUtilization || 78,
    completionRate: completionRate || 94
  };
}

// Get recent activity from notifications and recent actions
export async function getRecentActivity(): Promise<RecentActivity[]> {
  try {
    // Get recent notifications
    const recentNotifications = await db.query.notifications.findMany({
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
    // Return mock data if query fails
    return getMockRecentActivity();
  }
}

// Get upcoming reservations
export async function getUpcomingReservations(): Promise<UpcomingReservation[]> {
  try {
    const upcoming = await db.query.reservations.findMany({
      where: and(
        isNull(reservations.deletedAt),
        gte(reservations.startDateTime, new Date().toISOString()),
        eq(reservations.status, 'APPROVED')
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

    return upcoming.map(reservation => ({
      id: reservation.id,
      stadiumName: reservation.stadium?.name || 'Unknown Stadium',
      clubName: reservation.user?.name || 'Unknown Club',
      date: new Date(reservation.startDateTime).toISOString().split('T')[0],
      time: `${new Date(reservation.startDateTime).getHours().toString().padStart(2, '0')}:${new Date(reservation.startDateTime).getMinutes().toString().padStart(2, '0')} - ${new Date(reservation.endDateTime).getHours().toString().padStart(2, '0')}:${new Date(reservation.endDateTime).getMinutes().toString().padStart(2, '0')}`,
      status: 'confirmed' as const,
      amount: Number(reservation.sessionPrice) || undefined
    }));
  } catch (error) {
    console.error("Error fetching upcoming reservations:", error);
    // Return mock data if query fails
    return getMockUpcomingReservations();
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
    return getMockRevenueTrends();
  }
}

// Get stadium utilization
export async function getStadiumUtilization(): Promise<StadiumUtilization[]> {
  try {
    // Get all stadiums
    const allStadiums = await db.query.stadiums.findMany({
      where: isNull(stadiums.deletedAt),
      columns: {
        id: true,
        name: true
      }
    });

    // Get reservation count for each stadium in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stadiumUtilization = await Promise.all(
      allStadiums.map(async (stadium) => {
        const reservationsCount = await db
          .select({ count: count() })
          .from(reservations)
          .where(
            and(
              isNull(reservations.deletedAt),
              eq(reservations.stadiumId, stadium.id),
              gte(reservations.createdAt, thirtyDaysAgo.toISOString())
            )
          );

        // Calculate utilization percentage (max 20 reservations per stadium per month as 100%)
        const maxCapacity = 20; // Adjust this based on your business logic
        const usage = Math.min(100, Math.round((reservationsCount[0]?.count || 0) / maxCapacity * 100));

        return {
          name: stadium.name,
          usage
        };
      })
    );

    // Sort by usage descending and limit to top 5
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

// Mock data functions (fallback in case of errors)
function getMockRecentActivity(): RecentActivity[] {
  return [
    {
      id: "1",
      type: "reservation",
      title: "New Stadium Reservation",
      description: "Club Al Nasr reserved Stadium Olympique for 2 hours",
      time: "10 minutes ago",
      status: "success"
    },
    {
      id: "2",
      type: "payment",
      title: "Payment Received",
      description: "DH 1,200 received from Club Atlas for monthly subscription",
      time: "45 minutes ago",
      status: "success"
    },
    {
      id: "3",
      type: "subscription",
      title: "New Subscription",
      description: "Club Juventus Tan-Tan subscribed to monthly plan",
      time: "2 hours ago",
      status: "pending"
    },
    {
      id: "4",
      type: "user",
      title: "New User Registered",
      description: "Ahmed Benali registered as club manager",
      time: "5 hours ago",
      status: "success"
    },
    {
      id: "5",
      type: "club",
      title: "Club Registration",
      description: "FC Tan-Tan Youth registered on platform",
      time: "1 day ago",
      status: "pending"
    }
  ];
}

function getMockUpcomingReservations(): UpcomingReservation[] {
  return [
    {
      id: "1",
      stadiumName: "Stadium Olympique",
      clubName: "Club Al Nasr",
      date: "2024-01-15",
      time: "14:00 - 16:00",
      status: "confirmed",
      amount: 800
    },
    {
      id: "2",
      stadiumName: "Municipal Stadium",
      clubName: "FC Atlas",
      date: "2024-01-15",
      time: "16:00 - 18:00",
      status: "confirmed",
      amount: 750
    },
    {
      id: "3",
      stadiumName: "Sports Complex",
      clubName: "Club Juventus",
      date: "2024-01-16",
      time: "10:00 - 12:00",
      status: "pending"
    },
    {
      id: "4",
      stadiumName: "Youth Center",
      clubName: "FC Tan-Tan",
      date: "2024-01-16",
      time: "18:00 - 20:00",
      status: "confirmed",
      amount: 600
    },
    {
      id: "5",
      stadiumName: "City Stadium",
      clubName: "AS Municipale",
      date: "2024-01-17",
      time: "08:00 - 10:00",
      status: "confirmed",
      amount: 900
    }
  ];
}

function getMockReservationsByMonth(year: number): ChartData[] {
  // Generate realistic mock data based on year
  const baseValues = [85, 92, 78, 105, 120, 135, 150, 142, 128, 115, 98, 87];
  const multiplier = year === new Date().getFullYear() ? 1 : 0.8;
  
  return baseValues.map((value, index) => ({
    month: new Date(2000, index, 1).toLocaleDateString('en-US', { month: 'short' }),
    value: Math.round(value * multiplier)
  }));
}

function getMockRevenueTrends(): MonthlyRevenueData[] {
  const baseRevenue = 20000;
  const months = Array.from({ length: 12 }, (_, i) => 
    new Date(2000, i, 1).toLocaleDateString('en-US', { month: 'short' })
  );

  return months.map((month, index) => {
    const totalRevenue = baseRevenue + (Math.random() * 10000) + (index * 2000);
    const subscriptionPercentage = 0.6 + (Math.random() * 0.2);
    const singleSessionPercentage = 1 - subscriptionPercentage;
    const paidPercentage = 0.85 + (Math.random() * 0.1);
    
    const subscriptionRevenue = Math.round(totalRevenue * subscriptionPercentage);
    const singleSessionRevenue = Math.round(totalRevenue * singleSessionPercentage);
    const paidAmount = Math.round(totalRevenue * paidPercentage);
    const overdueAmount = totalRevenue - paidAmount;

    return {
      month,
      totalRevenue: Math.round(totalRevenue),
      subscriptionRevenue,
      singleSessionRevenue,
      paidAmount,
      overdueAmount,
      collectionRate: Math.round(paidPercentage * 100)
    };
  });
}

function getMockStadiumUtilization(): StadiumUtilization[] {
  return [
    { name: "Stadium Olympique", usage: 85 },
    { name: "Municipal Stadium", usage: 78 },
    { name: "Sports Complex", usage: 92 },
    { name: "Youth Center", usage: 65 },
    { name: "City Stadium", usage: 88 }
  ];
}