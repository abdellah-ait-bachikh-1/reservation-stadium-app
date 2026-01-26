// app/dashboard/home/DashboardClient.tsx
"use client";

import { useState } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import ChartsSection from "@/components/dashboard/home/BarChartSection";
import DashboardHeader from "@/components/dashboard/home/DashboardHeader";
import QuickActionsSection from "@/components/dashboard/home/QuickActionsSection";
import RevenueTrendsChart from "@/components/dashboard/home/RevenueTrendsChart";
import StatsGridSection from "@/components/dashboard/home/StatsGridSection";
import UpcomingReservationsSection from "@/components/dashboard/home/UpcomingReservationsSection";
import { DashboardData } from "@/hooks/useDashboardData";
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner"
import { HiExclamationTriangle } from "react-icons/hi2";
import PendingUserApprovalsSection from "./PendingUserApprovalsSection";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CLUB";
}

interface DashboardClientProps {
  user: User;
  currentYear: number;
  initialData: DashboardData;
}

export default function DashboardClient({
  user,
  currentYear,
  initialData
}: DashboardClientProps) {
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // Use React Query to fetch data
  const {
    data: dashboardData,
    isLoading,
    isError,
    error
  } = useDashboardData(selectedYear);

  // Use the data from React Query if available, otherwise use initial data
  const data = dashboardData || initialData;

  console.log({ dashboardData, selectedYear })
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  if (isError) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Card className="max-w-md">
            <CardBody className="flex flex-col items-center gap-4 text-center">
              <HiExclamationTriangle className="w-12 h-12 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Failed to Load Dashboard Data
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {error instanceof Error ? error.message : "An error occurred while loading dashboard data"}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Loading overgetDashboardDatalay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
            <Spinner size="lg" color="primary" />
            <p className="text-gray-600 dark:text-gray-400">
              Loading dashboard data for {selectedYear}...
            </p>
          </div>
        </div>
      )}

      {/* Header with Year Filter */}
      <DashboardHeader
        user={user}
        currentYear={selectedYear}
        onYearChange={handleYearChange}
      />

      {/* Quick Actions */}
      <QuickActionsSection />

      {/* Stats Grid */}
      <StatsGridSection
        stats={data.stats}
        currentYear={selectedYear}
      />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        {/* Recent Activity */}
        <PendingUserApprovalsSection
          users={data.pendingUserApprovals}
        />

        {/* Upcoming Reservations */}
        <UpcomingReservationsSection
          reservations={data.upcomingReservations}
        />
      </div>

      {/* Charts Section */}
      <ChartsSection
      revenueByStadium={data.revenueByStadium}
        reservationsByStatus={data.reservationsByStatus || []}
      />

      {/* Revenue Trends Chart */}
      <div className="mt-6">
        <RevenueTrendsChart
          monthlyData={data.revenueTrends}
          currentYear={selectedYear}
          onYearChange={handleYearChange}
        />
      </div>
    </div>
  );
}