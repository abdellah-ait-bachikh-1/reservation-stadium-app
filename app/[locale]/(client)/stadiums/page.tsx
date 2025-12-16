import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@heroui/button";
import { FaCalendar, FaFilter, FaPhone } from "react-icons/fa";
import StadiumCard from "@/components/StadiumCard";
import { stadiums } from "@/lib/const";
import FeaturedStadiumCard from "@/components/FeaturedStadiumCard";
import StadiumHeroSection from "@/components/StadiumHeroSection";
import StadiumSearchFilters from "@/components/StadiumSearchFilters";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.Stadiums" });

  return {
    title: t("headTitle"),
    description: t("metaDescription"),
    keywords: t("keywords"),
  };
}

const StadiumsPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Pages.Stadiums");
  const isRTL = locale === "ar";

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Hero Section */}
      <StadiumHeroSection locale={locale} />

      {/* Search and Filter Section */}
      <StadiumSearchFilters locale={locale} />

      {/* Featured Stadiums */}
      {stadiums.filter((s, i) => s.featured).length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            {t("featured.title")}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {stadiums
              .filter((s) => s.featured)
              .slice(0, 2)
              .map((stadium) => (
                <FeaturedStadiumCard
                  key={stadium.id}
                  stadium={stadium}
                  locale={locale}
                />
              ))}
          </div>
        </div>
      )}

      {/* All Stadiums Grid */}
      <div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            {t("allStadiums.title")}
          </h2>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">
              {stadiums.length} {t("allStadiums.total")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stadiums.map((stadium) => (
            <StadiumCard stadium={stadium} locale={locale} />
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-20">
        <div className="bg-gradient-to-r from-gray-100/50 to-gray-200/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-3xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-700/50 text-center">
          <div className="inline-block p-6 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 rounded-2xl shadow-lg mb-6">
            <FaCalendar className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            {t("cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              color="primary"
              size="lg"
              startContent={<FaPhone className="w-5 h-5" />}
              className="px-8"
            >
              {t("cta.contactSupport")}
            </Button>
            <Button
              color="default"
              variant="bordered"
              size="lg"
              startContent={<FaCalendar className="w-5 h-5" />}
              className="px-8"
            >
              {t("cta.bookNow")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StadiumsPage;
