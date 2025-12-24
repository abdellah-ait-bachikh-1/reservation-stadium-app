
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
  const t = getTranslations({ locale, namespace: "Pages.Dashboard.Home" });
  return {
    title: {
      template: `%s | ${APP_NAMES[locale as TLocale] || "Tan-Tan Stades"}`,
      default: `${"title"} | ${
        APP_NAMES[locale as TLocale] || "Tan-Tan Stades"
      }`,
    },
    description: "decription",
  };
};

const DashboardHomePage = () => {
  return <div>DashboardHomePage</div>;
};

export default DashboardHomePage;
