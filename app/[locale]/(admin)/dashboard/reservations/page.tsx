import { APP_NAMES } from "@/lib/const";
import { TLocale } from "@/lib/types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: TLocale }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "Pages.Dashboard.Reservations",
  });
  return {
    title: t("headTitle"),
    description: t("metaDescription") || "Dashboard Reservations page",
  };
};

const DashboardReservationsPage = () => {
  return <div>DashboardReservationsPage</div>;
};

export default DashboardReservationsPage;
