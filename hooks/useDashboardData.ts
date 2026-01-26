// hooks/useDashboardData.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { ReservationStatusType } from "@/types/db";
import { wait } from "@/utils";
export interface DashboardData {
  stats: {
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
    newClubsThisYear: number; // ADD THIS
    newUsersThisYear: number; // ADD THIS
    avgUtilization: number;
    completionRate: number;
    changes?: {
      // ADD THIS OPTIONAL CHANGES OBJECT
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
  };
revenueByStadium: Array<{ // ADD THIS
    id: string;
    name: string;
    totalRevenue: number;
    subscriptionRevenue: number;
    singleSessionRevenue: number;
    percentage: number;
  }>;
  pendingUserApprovals: Array<{
    // Changed from recentActivity
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    emailVerifiedAt: string | null; 
    createdAt: string;
    timeAgo: string;
  }>;
  upcomingReservations: Array<{
    id: string;
    stadiumName: string;
    clubName: string;
    date: string;
    time: string;
    status: "confirmed" | "pending" | "cancelled";
    amount?: number;
  }>;
  reservationsByMonth: Array<{
    month: string;
    value: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    totalRevenue: number;
    subscriptionRevenue: number;
    singleSessionRevenue: number;
    paidAmount: number;
    overdueAmount: number;
    collectionRate: number;
  }>;

  reservationsByStatus: Array<{
    status: ReservationStatusType;
    count: number;
    color: string;
  }>;
  revenueTrends: Array<{
    month: string;
    totalRevenue: number;
    subscriptionRevenue: number;
    singleSessionRevenue: number;
    paidAmount: number;
    overdueAmount: number;
    collectionRate: number;
  }>;
}

async function fetchDashboardData(year: number): Promise<DashboardData> {
  // Only validate that year is not in the future
  const currentYear = new Date().getFullYear();
  const validatedYear = Math.min(year, currentYear); // REMOVE Math.max(2026, ...)
  await wait(3000)
  const response = await fetch(`/api/dashboard/home?year=${validatedYear}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch dashboard data");
  }

  return result.data;
}

export function useDashboardData(year: number) {
  // Only validate that year is not in the future
  const currentYear = new Date().getFullYear();
  const validatedYear = Math.min(year, currentYear); // REMOVE Math.max(2026, ...)

  return useQuery({
    queryKey: ["dashboard", "home", validatedYear],
    queryFn: () => fetchDashboardData(validatedYear),
    staleTime: 0, // No stale time - always fresh
    gcTime: 0, // No garbage collection - remove immediately
    refetchOnMount: true,
    // refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    enabled: !!validatedYear,
  });
}
