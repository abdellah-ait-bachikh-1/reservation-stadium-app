// app/dashboard/home/page.tsx
import DashboardHomePageClient from "@/components/dashboard/home/DashboardHomePageClient";
import { redirect } from "@/i18n/navigation";
import { apiLogout, isAuthenticatedUserExistsInDB } from "@/lib/auth";

import { Metadata } from "next";

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

// Static data that can later be replaced with database queries
const getDashboardData = () => {
  return {
    stats: {
      totalReservations: 1248,
      activeReservations: 47,
      pendingReservations: 12,
      totalClubs: 89,
      totalStadiums: 15,
      totalUsers: 156,
      totalRevenue: 245850,
      monthlyRevenue: 38420,
      subscriptions: 32,
      overduePayments: 8,
    },
    recentActivity: [
      {
        id: "1",
        type: "reservation" as const,
        title: "New Stadium Reservation",
        description: "Club Al Nasr reserved Stadium Olympique for 2 hours",
        time: "10 minutes ago",
        status: "success" as const,
      },
      {
        id: "2",
        type: "payment" as const,
        title: "Payment Received",
        description:
          "DH 1,200 received from Club Atlas for monthly subscription",
        time: "45 minutes ago",
        status: "success" as const,
      },
      {
        id: "3",
        type: "subscription" as const,
        title: "New Subscription",
        description: "Club Juventus Tan-Tan subscribed to monthly plan",
        time: "2 hours ago",
        status: "pending" as const,
      },
      {
        id: "4",
        type: "user" as const,
        title: "New User Registered",
        description: "Ahmed Benali registered as club manager",
        time: "5 hours ago",
        status: "success" as const,
      },
      {
        id: "5",
        type: "club" as const,
        title: "Club Registration",
        description: "FC Tan-Tan Youth registered on platform",
        time: "1 day ago",
        status: "pending" as const,
      },
    ],
    upcomingReservations: [
      {
        id: "1",
        stadiumName: "Stadium Olympique",
        clubName: "Club Al Nasr",
        date: "2024-01-15",
        time: "14:00 - 16:00",
        status: "confirmed" as const,
        amount: 800,
      },
      {
        id: "2",
        stadiumName: "Municipal Stadium",
        clubName: "FC Atlas",
        date: "2024-01-15",
        time: "16:00 - 18:00",
        status: "confirmed" as const,
        amount: 750,
      },
      {
        id: "3",
        stadiumName: "Sports Complex",
        clubName: "Club Juventus",
        date: "2024-01-16",
        time: "10:00 - 12:00",
        status: "pending" as const,
      },
      {
        id: "4",
        stadiumName: "Youth Center",
        clubName: "FC Tan-Tan",
        date: "2024-01-16",
        time: "18:00 - 20:00",
        status: "confirmed" as const,
        amount: 600,
      },
      {
        id: "5",
        stadiumName: "City Stadium",
        clubName: "AS Municipale",
        date: "2024-01-17",
        time: "08:00 - 10:00",
        status: "confirmed" as const,
        amount: 900,
      },
    ],
    reservationsByMonth: [
      { month: "Jan", value: 85 },
      { month: "Feb", value: 92 },
      { month: "Mar", value: 78 },
      { month: "Apr", value: 105 },
      { month: "May", value: 120 },
      { month: "Jun", value: 135 },
      { month: "Jul", value: 150 },
      { month: "Aug", value: 142 },
      { month: "Sep", value: 128 },
      { month: "Oct", value: 115 },
      { month: "Nov", value: 98 },
      { month: "Dec", value: 87 },
    ],
    revenueByMonth: [
      { month: "Jan", value: 28500 },
      { month: "Feb", value: 31200 },
      { month: "Mar", value: 27800 },
      { month: "Apr", value: 35500 },
      { month: "May", value: 42800 },
      { month: "Jun", value: 48500 },
      { month: "Jul", value: 53200 },
      { month: "Aug", value: 51200 },
      { month: "Sep", value: 47800 },
      { month: "Oct", value: 41500 },
      { month: "Nov", value: 36800 },
      { month: "Dec", value: 32500 },
    ],
    stadiumUtilization: [
      { name: "Stadium Olympique", usage: 85 },
      { name: "Municipal Stadium", usage: 78 },
      { name: "Sports Complex", usage: 92 },
      { name: "Youth Center", usage: 65 },
      { name: "City Stadium", usage: 88 },
    ],
  };
};

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

  // Get static data (can be replaced with database queries)
  const dashboardData = getDashboardData();

  return (
    <>
      {authenticatedUser && (
        <DashboardHomePageClient
          user={authenticatedUser}
          initialData={dashboardData}
          currentYear={new Date().getFullYear()}
        />
      )}
    </>
  );
};

export default DashboardPage;
