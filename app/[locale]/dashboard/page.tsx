import TestNotificationsPage from "@/components/dashboard/TestNotificationsPage";
import { redirect } from "@/i18n/navigation";
import { isAuthenticatedUserExistsInDB } from "@/lib/auth";
import { getLocale } from "next-intl/server";

const DashboardHomePage = async () => {
  const locale = await getLocale();
  const user = await isAuthenticatedUserExistsInDB();
  // console.log({ user });
  if (!user) {
redirect({
      href: "/api/auth/signout?callbackUrl=/auth/login",
      locale,
      forcePrefix: true,
    });  }
  return <TestNotificationsPage />;
};

export default DashboardHomePage;
