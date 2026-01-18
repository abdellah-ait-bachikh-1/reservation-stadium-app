import TestNotificationsPage from "@/components/dashboard/TestNotificationsPage";
import { redirect } from "@/i18n/navigation";
import { apiLogout, isAuthenticatedUserExistsInDB } from "@/lib/auth";

import { getLocale } from "next-intl/server";

const DashboardHomePage = async () => {
  const locale = await getLocale();
  const authenticatedUser = await isAuthenticatedUserExistsInDB()

  if (!authenticatedUser) {
    await apiLogout()
    redirect({ locale: locale, href: "/auth/login" })
  }
  return <TestNotificationsPage />;
};

export default DashboardHomePage;
