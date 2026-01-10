import TestNotificationsPage from "@/components/dashboard/TestNotificationsPage";
import { redirect } from "@/i18n/navigation";
import { handleLogoutUserFromServerComponent, isAuthenticatedUserExistsInDB } from "@/lib/auth";
import { signOut } from "next-auth/react";
import { getLocale } from "next-intl/server";

const DashboardHomePage = async () => {
  const locale = await getLocale();
 
  return <TestNotificationsPage />;
};

export default DashboardHomePage;
