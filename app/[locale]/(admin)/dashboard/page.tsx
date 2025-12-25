import { isAdminUser, isDeletedUser } from "@/lib/data/auth";
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
    namespace: "Pages.Dashboard.Home",
  });
  return {
    title: t("headTitle"),
    description: t("metaDescription") || "Dashboard home page",
  };
};
const DashboardHomePage = async () => {
 const user = await isAdminUser();
  
  return <section>DashboardHomePage</section>;
};

export default DashboardHomePage;
