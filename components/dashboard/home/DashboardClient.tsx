// app/dashboard/home/DashboardClient.tsx
"use client";

import { useState } from "react";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import ChartsSection from "@/components/dashboard/home/BarChartSection";
import DashboardHeader from "@/components/dashboard/home/DashboardHeader";
import QuickActionsSection from "@/components/dashboard/home/QuickActionsSection";
import RevenueTrendsChart from "@/components/dashboard/home/RevenueTrendsChart";
import StatsGridSection from "@/components/dashboard/home/StatsGridSection";
import { DashboardData } from "@/hooks/dashboard/useDashboardData";
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner"
import { HiExclamationTriangle } from "react-icons/hi2";
import PendingUserApprovalsSection from "./PendingUserApprovalsSection";
import OverduePaymentsSection from "./OverduePaymentsSection";
import { useTypedTranslations } from "@/utils/i18n";

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
  const t = useTypedTranslations()
  // Use React Query to fetch data
  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
    refetch, // Add refetch function
    isRefetching // Add isRefetching state
  } = useDashboardData(selectedYear);

  // Use the data from React Query if available, otherwise use initial data
  const data = dashboardData || initialData;

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isError) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Card className="max-w-md">
            <CardBody className="flex flex-col items-center gap-4 text-center">
              <HiExclamationTriangle className="w-12 h-12 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('pages.dashboard.home.loading.failedToLoad')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {error instanceof Error ? error.message : t('pages.dashboard.home.loading.anErrorOccurred')}
              </p>
              <button
                onClick={() => refetch()}
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
  console.log(data)
  return (
    <div className="">
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
            <Spinner size="lg" color="primary" />
            <p className="text-gray-600 dark:text-gray-400">
              {t('pages.dashboard.home.loading.loadingDataForYear', { selectedYear })}
            </p>
          </div>
        </div>
      )}

      {/* Header with Year Filter and Refresh Button */}
      <DashboardHeader
        user={user}
        currentYear={selectedYear}
        onYearChange={handleYearChange}
        onRefresh={handleRefresh}
        isRefreshing={isRefetching}
        availableYears={data.availableYears || []} // PASS AVAILABLE YEARS
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

        <OverduePaymentsSection
          payments={data.overduePayments} // You'll need to add this to your data structure
        />
      </div>

      {/* Charts Section */}
  <ChartsSection
  revenueByStadium={data.stadiumRevenueSummary || { 
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
    }
  }}
  reservationsByStatus={data.reservationsByStatus || []}
/>

      {/* Revenue Trends Chart */}
      <div className="mt-6">
        <RevenueTrendsChart
          monthlyData={data.revenueTrends}
          currentYear={selectedYear}
          onYearChange={handleYearChange}
          onRefresh={handleRefresh}
          isRefreshing={isRefetching}
          availableYears={data.availableYears || []} // PASS AVAILABLE YEARS

        />
      </div>
    </div>
  );
}