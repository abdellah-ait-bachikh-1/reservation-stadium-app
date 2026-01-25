// hooks/useDashboardData.ts
"use client";

import { useQuery } from "@tanstack/react-query";

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
    avgUtilization: number;
    completionRate: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'reservation' | 'payment' | 'subscription' | 'user' | 'club';
    title: string;
    description: string;
    time: string;
    status?: 'success' | 'pending' | 'warning';
  }>;
  upcomingReservations: Array<{
    id: string;
    stadiumName: string;
    clubName: string;
    date: string;
    time: string;
    status: 'confirmed' | 'pending' | 'cancelled';
    amount?: number;
  }>;
  reservationsByMonth: Array<{
    month: string;
    value: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    value: number;
  }>;
  stadiumUtilization: Array<{
    name: string;
    usage: number;
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
  // Validate year is from 2026 onward
  const currentYear = new Date().getFullYear();
  const validatedYear = Math.max(2026, Math.min(year, currentYear));
  
  const response = await fetch(`/api/dashboard/home?year=${validatedYear}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
  }
  
  const result = await response.json();
  console.log({result})
  if (!result.success) {
    throw new Error(result.error || "Failed to fetch dashboard data");
  }
  
  return result.data;
}

export function useDashboardData(year: number) {
  // Validate year is from 2026 onward
  const currentYear = new Date().getFullYear();
  const validatedYear = Math.max(2026, Math.min(year, currentYear));
  
  return useQuery({
    queryKey: ["dashboard", "home", validatedYear],
    queryFn: () => fetchDashboardData(validatedYear),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}