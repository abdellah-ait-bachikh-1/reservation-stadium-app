import { APP_NAMES } from "@/lib/const";
import { isExistsAuthenticatedUser } from "@/lib/data/auth";
import { TLocale } from "@/lib/types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: TLocale }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "Pages.Dashboard.Notifications",
  });
  return {
    title: t("headTitle"),
    description: t("metaDescription") || "Dashboard Notifications page",
  };
};

const DashboardNotificationsPage = async () => {
   const user = await isExistsAuthenticatedUser();
    if (!user) {
      redirect("/auth/login");
    }
  return <div>DashboardNotificationsPage</div>;
};

export default DashboardNotificationsPage;
