// app/dashboard/home/page.tsx
import { Metadata } from "next";
import { redirect } from "@/i18n/navigation";
import { apiLogout, isAuthenticatedUserExistsInDB } from "@/lib/auth";
import { getDashboardData } from "@/lib/queries/dashboard-home";
import DashboardClient from "@/components/dashboard/home/DashboardClient";
import { DashboardData } from "@/hooks/useDashboardData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`../../../messages/${locale}.json`))
    .default;

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
  const authenticatedUser = await isAuthenticatedUserExistsInDB();

  if (!authenticatedUser) {
    await apiLogout();
    redirect({ locale: locale, href: "/auth/login" });
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
    <>{authenticatedUser && <DashboardClient
      user={authenticatedUser}
      currentYear={currentYear}
      initialData={initialData}
    />}</>
  );
};

export default DashboardPage;

function getStaticDashboardData(): DashboardData {
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
      completionRate: 0
    },
    recentActivity: [],
    upcomingReservations: [],
    reservationsByMonth: [],
    revenueByMonth: [],
    stadiumUtilization: [],
    reservationsByStatus: [],
    revenueTrends: []
  };
}