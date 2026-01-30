// app/dashboard/home/page.tsx
import { Metadata } from "next";
import { redirect } from "@/i18n/navigation";
import { getSession } from "@/lib/auth";
import { getDashboardData } from "@/lib/queries/dashboard/dashboard-home";
import DashboardClient from "@/components/dashboard/home/DashboardClient";
import { DashboardData } from "@/hooks/dashboard/useDashboardData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return {
    title: `${messages.pages?.dashboard?.home?.metadata?.title || "Dashboard"} - ${messages.common?.appName || "Tantan Stadium Booking"}`,
    description: messages.pages?.dashboard?.home?.metadata?.description,
  };
}

const DashboardPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;

  const session = await getSession()
  if (!session || !session.user) {
    redirect({ locale: locale, href: "/" })
    return
  }

  if (session.user.role !== "ADMIN") {
    redirect({ locale: locale, href: "/dashboard/profile" })
  return
  }

  // Get current year
  const currentYear = new Date().getFullYear();

  // Fetch initial data on the server for SSR
  let initialData: DashboardData;
  try {
    initialData = await getDashboardData(currentYear); // No conversion needed now
  } catch (error) {
    console.error("Failed to fetch initial dashboard data:", error);
    // Fallback to static data if database query fails
    initialData = getStaticDashboardData();
  }

  return (
    <>
      {session.user && (
        <DashboardClient
          user={session.user}
          currentYear={currentYear}
          initialData={initialData}
        />
      )}
    </>
  );
};

export default DashboardPage;

// app/dashboard/home/page.tsx
function getStaticDashboardData(): DashboardData {
  const currentYear = new Date().getFullYear();
  const startYear = 2025;

  return {
    stats: {
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
      avgUtilization: 0,
      completionRate: 0,
      newClubsThisYear: 0,
      newUsersThisYear: 0,
      changes: {},overdueAmount:0
    },
    overduePayments: [],
    reservationsByMonth: [],
    revenueByMonth: Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2000, i, 1).toLocaleDateString("en-US", { month: "short" }),
      totalRevenue: 0,
      subscriptionRevenue: 0,
      singleSessionRevenue: 0,
      paidAmount: 0,
      overdueAmount: 0,
      pendingAmount: 0, // ADD THIS
      collectionRate: 0,
    })),
    reservationsByStatus: [],
    revenueTrends: Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2000, i, 1).toLocaleDateString("en-US", { month: "short" }),
      totalRevenue: 0,
      subscriptionRevenue: 0,
      singleSessionRevenue: 0,
      paidAmount: 0,
      overdueAmount: 0,
      pendingAmount: 0, // ADD THIS
      collectionRate: 0,
    })),
    pendingUserApprovals: [],
    revenueByStadium: [],
    availableYears: Array.from(
      { length: Math.max(0, currentYear - startYear + 1) },
      (_, i) => startYear + i,
    ).reverse(),
  };
}