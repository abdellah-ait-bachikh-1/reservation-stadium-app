import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@heroui/button";
import { FaCalendar, FaFilter, FaPhone } from "react-icons/fa";
import StadiumHeroSection from "@/components/StadiumHeroSection";
import StadiumClientSection from "@/components/StadiumClientSection";
import { getStadiumForDisplay, stadiums } from "@/lib/const";

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

interface SearchParams {
  search?: string;
  sports?: string | string[];
}

const StadiumsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) => {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("Pages.Stadiums");
  const isRTL = locale === "ar";

  // Get filter values from URL query params
  const searchTerm = sp.search || "";
  const sportParam = sp.sports;
  
  // Convert sports param to array
  const selectedSports = Array.isArray(sportParam) 
    ? sportParam 
    : sportParam 
    ? [sportParam]
    : [];

  // Initialize all stadiums
  const allStadiums = stadiums.map(stadium => 
    getStadiumForDisplay(stadium.id, locale)
  ).filter(Boolean);

  // Prepare initial filtered stadiums (server-side for first load)
  let initialFilteredStadiums = allStadiums;
  
  // Filter by selected sports
  if (selectedSports.length > 0) {
    initialFilteredStadiums = initialFilteredStadiums.filter(stadium => 
    {  if(stadium){
        return stadium.sports.some(sport => selectedSports.includes(sport.id))
        
      }}
    );
  }
  
  // Filter by search term
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase().trim();
    initialFilteredStadiums = initialFilteredStadiums.filter(stadium => 
    {  if(stadium){

      return  stadium.name.toLowerCase().includes(term) ||
        stadium.address.toLowerCase().includes(term)
      }}
    );
  }

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Hero Section */}
      <StadiumHeroSection locale={locale} />

      {/* Client Component with all filtering logic */}
      <StadiumClientSection 
        locale={locale}
        allStadiums={allStadiums}
        initialSelectedSports={selectedSports}
        initialSearchTerm={searchTerm}
        initialFilteredStadiums={initialFilteredStadiums}
        translations={{
          allStadiums: t("allStadiums.title"),
          total: t("allStadiums.total"),
          noResults: {
            title: t("noResults.title"),
            message: t("noResults.message"),
            resetFilters: t("noResults.resetFilters")
          },
          cta: {
            title: t("cta.title"),
            description: t("cta.description"),
            contactSupport: t("cta.contactSupport"),
            bookNow: t("cta.bookNow")
          },
          search: {
            placeholder: t("search.placeholder")
          },
          filter: {
            sport: t("filter.sport"),
            selectSports: t("filter.selectSports"),            activeFilters: t("filter.activeFilters")  // Added this line

          },
          details: {
            monthlyRate: t("details.monthlyRate"),
            perMonth: t("details.perMonth"),
            type: t("details.type")
          },
          type: {
            multipleSports: t("type.multipleSports"),
            singleSport: t("type.singleSport")
          },
          actions: {
            viewDetails: t("actions.viewDetails")
          }
        }}
      />
    </section>
  );
};

export default StadiumsPage;