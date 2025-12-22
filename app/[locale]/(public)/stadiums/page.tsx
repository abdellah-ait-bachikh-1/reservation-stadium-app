// app/[locale]/stadiums/page.tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import StadiumHeroSection from "@/components/StadiumHeroSection";
import StadiumClientSection from "@/components/StadiumClientSection";
import db from "@/lib/db";
import { getSports, getStadiums } from "@/lib/data/stadium";

export const revalidate = 3600;

// Define pagination constants
const ITEMS_PER_PAGE = 6;

interface GetStadiumsParams {
  locale: "ar" | "fr" | "en";
  page?: number;
  limit?: number;
  filters?: {
    search?: string;
    sports?: string[];
  };
}

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
  page?: string;
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

  // Parse query parameters
  const searchTerm = sp.search || "";
  const sportParam = sp.sports;
  const page = parseInt(sp.page || "1");
  
  // Convert sports param to array
  const selectedSports = Array.isArray(sportParam) 
    ? sportParam 
    : sportParam 
    ? [sportParam]
    : [];

  // Get data from server
  const [stadiumsData, allSports] = await Promise.all([
    getStadiums({
      locale: locale as "ar" | "fr" | "en",
      page,
      limit: ITEMS_PER_PAGE,
      filters: {
        search: searchTerm,
        sports: selectedSports,
      },
    }),
    getSports(locale as "ar" | "fr" | "en"),
  ]);
console.log(stadiumsData)
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
        initialStadiums={stadiumsData.data}
        allSports={allSports}
        initialSelectedSports={selectedSports}
        initialSearchTerm={searchTerm}
        initialPagination={stadiumsData.pagination}
        initialPage={page}
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
            selectSports: t("filter.selectSports"),
            activeFilters: t("filter.activeFilters")
          },
          details: {
            monthlyRate: t("details.monthlyRate"),
            perMonth: t("details.perMonth"),
            type: t("details.type"),
            perSession: t("details.perSession"),
            from: t("details.from"),
            additionalSports: t("details.additionalSports"),
            totalSports: t("details.totalSports"),
            bestForOneTime: t("details.bestForOneTime"),
            viewFullDetails: t("details.viewFullDetails"),
            viewOnMaps: t("details.viewOnMaps")
          },
          type: {
            multipleSports: t("type.multipleSports"),
            singleSport: t("type.singleSport")
          },
          actions: {
            viewDetails: t("actions.viewDetails")
          },
          pagination: {
            showing: t("pagination.showing"),
            to: t("pagination.to"),
            of: t("pagination.of"),
            results: t("pagination.results"),
            previous: t("pagination.previous"),
            next: t("pagination.next"),
            page: t("pagination.page"),
            goToPage: t("pagination.goToPage"),
          }
        }}
      />
    </section>
  );
};

export default StadiumsPage;