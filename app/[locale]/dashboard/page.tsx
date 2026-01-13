import {  logoutUser } from "@/app/actions/auth/logout";
import TestNotificationsPage from "@/components/dashboard/TestNotificationsPage";
import { redirect } from "@/i18n/navigation";
import { isAuthenticatedUserExistsInDB } from "@/lib/auth";

import { getLocale } from "next-intl/server";

const DashboardHomePage = async () => {
  const locale = await getLocale();
  const authenticatedUser = await isAuthenticatedUserExistsInDB()

  if (!authenticatedUser) {
    await logoutUser()
    redirect({locale:locale,href:"/auth/login"})
  }
  return <TestNotificationsPage />;
};

export default DashboardHomePage;
