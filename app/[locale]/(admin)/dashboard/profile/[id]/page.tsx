// app/[locale]/dashboard/profile/page.tsx
import { isExistsAuthenticatedUser } from "@/lib/data/auth";
import { TLocale } from "@/lib/types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import { Card, CardBody, CardHeader } from "@heroui/card";
import SettingsTabs from "@/components/dashboard/SettingsTabs";
import SportsInfo from "@/components/dashboard/SportsInfo";
import QuickStats from "@/components/dashboard/QuickStats";
import ReservationsSummary from "@/components/dashboard/ReservationsSummary";
import SubscriptionsSummary from "@/components/dashboard/SubscriptionsSummary";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: TLocale }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "Pages.Dashboard.Profile",
  });
  return {
    title: t("headTitle"),
    description: t("metaDescription") || "Dashboard Profile page",
  };
};

const DashboardProfilePage = async () => {
  const user = await isExistsAuthenticatedUser();
  if (!user) {
    redirect("/auth/login");
  }

  const t = await getTranslations("Pages.Dashboard.Profile");

  return (
    <div className="p-2">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("pageTitle")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {t("pageDescription")}
        </p>
      </div>
      <div className="mb-8">
        <SettingsTabs />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg bg-white dark:bg-gray-950 rounded-xl border border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-0 pt-6 px-6 flex flex-col  items-start">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("sportsInfo.title")}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t("sportsInfo.description")}
              </p>
            </CardHeader>
            <CardBody className="px-6 py-6">
              <SportsInfo />
            </CardBody>
          </Card>

          {/* Active Subscriptions */}
          <Card className="shadow-lg bg-white dark:bg-gray-950 rounded-xl border border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-0 pt-6 px-6 flex flex-col  items-start">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("subscriptions.title")}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t("subscriptions.description")}
              </p>
            </CardHeader>
            <CardBody className="px-6 py-6">
              <SubscriptionsSummary />
            </CardBody>
          </Card>
        </div>

        {/* Right Column - Stats & Summaries */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <QuickStats />

          {/* Recent Reservations */}
          <Card className="shadow-lg bg-white dark:bg-gray-950 rounded-xl border border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-0 pt-6 px-6 flex flex-col  items-start">
              <h2 className="text-xl  font-semibold text-gray-900 dark:text-white">
                {t("reservations.title")}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t("reservations.description")}
              </p>
            </CardHeader>
            <CardBody className="px-6 py-6">
              <ReservationsSummary />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfilePage;
