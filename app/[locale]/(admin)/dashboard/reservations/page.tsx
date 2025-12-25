import { APP_NAMES } from "@/lib/const";
import { isDeletedUser } from "@/lib/data/auth";
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
    namespace: "Pages.Dashboard.Reservations",
  });
  return {
    title: t("headTitle"),
    description: t("metaDescription") || "Dashboard Reservations page",
  };
};

const DashboardReservationsPage = async () => {
   const user = await isDeletedUser();
    if (!user) {
      redirect("/auth/login");
    }
  return <div>DashboardReservationsPage</div>;
};

export default DashboardReservationsPage;
