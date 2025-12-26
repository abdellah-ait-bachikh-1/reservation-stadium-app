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
  return <div>DashboardProfilePage</div>;
};

export default DashboardProfilePage;
