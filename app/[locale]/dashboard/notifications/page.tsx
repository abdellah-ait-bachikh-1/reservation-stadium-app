import TestNotificationsPage from "@/components/dashboard/TestNotificationsPage";
import { redirect } from "@/i18n/navigation";
import { getSession } from "@/lib/auth";

import { getLocale } from "next-intl/server";

const DashboardHomePage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
   const session = await getSession()
  if (!session || !session.user) {
    redirect({ locale: locale, href: "/" })
    return
  }
  if (session.user.role !== "ADMIN") {
    return <div>Club Noptificatoions  page</div>

  }

  return <TestNotificationsPage />;
};

export default DashboardHomePage;
