"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Pagination } from "@heroui/pagination";
import {
  FaSearch,
  FaFilter,
  FaCalendar,
  FaPhone,
  FaTimes,
} from "react-icons/fa";
import StadiumCard from "@/components/public/StadiumCard";
import StadiumCardSkeleton from "@/components/public/StadiumCardSkeleton";

interface StadiumClientSectionProps {
  locale: string;
  initialStadiums: any[];
  allSports: any[];
  initialSelectedSports: string[];
  initialSearchTerm: string;
  initialPagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  initialPage: number;
  translations: {
    allStadiums: string;
    total: string;
    noResults: {
      title: string;
      message: string;
      resetFilters: string;
    };
    cta: {
      title: string;
      description: string;
      contactSupport: string;
      bookNow: string;
    };
    search: {
      placeholder: string;
    };
    filter: {
      sport: string;
      selectSports: string;
      activeFilters: string;
    };
    details: {
      monthlyRate: string;
      perMonth: string;
      type: string;
      perSession: string;
      from: string;
      additionalSports: string;
      totalSports: string;
      bestForOneTime: string;
      viewFullDetails: string;
      viewOnMaps: string;
    };
    type: {
      multipleSports: string;
      singleSport: string;
    };
    actions: {
      viewDetails: string;
    };
    pagination: {
      showing: string;
      to: string;
      of: string;
      results: string;
      previous: string;
      next: string;
      page: string;
      goToPage: string;
    };
  };
}

const StadiumClientSection = ({
  locale,
  initialStadiums,
  allSports,
  initialSelectedSports,
  initialSearchTerm,
  initialPagination,
  initialPage,
  translations,
}: StadiumClientSectionProps) => {
  const isRTL = locale === "ar";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Refs for scrolling
  const filtersSectionRef = useRef<HTMLDivElement>(null);
  const resultsSectionRef = useRef<HTMLDivElement>(null);

  // State variables
  const [searchValue, setSearchValue] = useState(initialSearchTerm);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    new Set(initialSelectedSports)
  );
  const [isCardsLoading, setIsCardsLoading] = useState(false);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [stadiums, setStadiums] = useState(initialStadiums);
  const [pagination, setPagination] = useState(initialPagination);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const searchTimeoutRef = useRef<NodeJS.Timeout>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showSearchSpinner, setShowSearchSpinner] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Scroll to filters section smoothly
  const scrollToFilters = useCallback(() => {
    if (filtersSectionRef.current) {
      const filtersTop = filtersSectionRef.current.offsetTop;
      const headerOffset = 80; // Account for fixed header if you have one

      window.scrollTo({
        top: filtersTop - headerOffset,
        behavior: "smooth",
      });
    }
  }, []);

  // Scroll to results section
  const scrollToResults = useCallback(() => {
    if (resultsSectionRef.current) {
      const resultsTop = resultsSectionRef.current.offsetTop;
      const headerOffset = 80; // Account for fixed header if you have one

      window.scrollTo({
        top: resultsTop - headerOffset,
        behavior: "smooth",
      });
    }
  }, []);

  // Update URL when filters or page change
  const updateURL = useCallback(
    (params: {
      search?: string;
      sports?: string[];
      page?: number;
      resetPagination?: boolean;
      scrollTo?: "filters" | "results";
    }) => {
      const urlParams = new URLSearchParams(searchParams.toString());

      // Update search parameter
      if (params.search !== undefined) {
        if (params.search.trim()) {
          urlParams.set("search", params.search.trim());
        } else {
          urlParams.delete("search");
        }
      }

      // Update sports parameters
      if (params.sports !== undefined) {
        // Remove existing sports params
        urlParams.delete("sports");

        // Add new sports params
        if (params.sports.length > 0) {
          params.sports.forEach((sport) => {
            urlParams.append("sports", sport);
          });
        }
      }

      // Update page parameter
      if (params.page !== undefined) {
        if (params.page > 1) {
          urlParams.set("page", params.page.toString());
        } else {
          urlParams.delete("page");
        }
      } else if (params.resetPagination) {
        // Reset to page 1 when filters change
        urlParams.delete("page");
      }

      const url = urlParams.toString()
        ? `${pathname}?${urlParams.toString()}`
        : pathname;

      router.replace(url, { scroll: false }); // Don't let Next.js auto-scroll

      // Handle scrolling manually
      if (params.scrollTo === "filters") {
        // Use setTimeout to ensure DOM is updated
        setTimeout(scrollToFilters, 100);
      } else if (params.scrollTo === "results") {
        // Use setTimeout to ensure DOM is updated
        setTimeout(scrollToResults, 100);
      }
    },
    [router, pathname, searchParams, scrollToFilters, scrollToResults]
  );

  // Handle search input change with debouncing
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchValue(value);

      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Show search spinner
      setShowSearchSpinner(true);

      // Create new timeout for debouncing
      searchTimeoutRef.current = setTimeout(() => {
        const sportArray = Array.from(selectedKeys);
        updateURL({
          search: value,
          sports: sportArray,
          resetPagination: true,
          scrollTo: "filters", // Scroll to filters when searching
        });
        setShowSearchSpinner(false);
      }, 500);
    },
    [selectedKeys, updateURL]
  );

  // Handle sport selection change
  const handleSportSelectionChange = useCallback(
    (keys: any) => {
      // Clear search timeout if any
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      let sportArray: string[];
      let selectedKeysSet: Set<string>;

      if (keys === "all") {
        selectedKeysSet = new Set();
        sportArray = [];
      } else if (keys instanceof Set) {
        selectedKeysSet = keys;
        sportArray = Array.from(keys);
      } else {
        selectedKeysSet = new Set();
        sportArray = [];
      }

      setSelectedKeys(selectedKeysSet);

      // Update URL with sports filter and reset to page 1
      updateURL({
        search: searchValue,
        sports: sportArray,
        resetPagination: true,
        scrollTo: "filters", // Scroll to filters when changing sports
      });
    },
    [searchValue, updateURL]
  );

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      setIsPaginationLoading(true);
      setCurrentPage(page);

      updateURL({
        search: searchValue,
        sports: Array.from(selectedKeys),
        page: page,
        scrollTo: "filters", // Scroll to filters when changing page
      });

      // Quick loading state
      setTimeout(() => {
        setIsPaginationLoading(false);
      }, 200);
    },
    [searchValue, selectedKeys, updateURL]
  );

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setSearchValue("");
    setSelectedKeys(new Set());

    // Reset to page 1 and clear all filters
    updateURL({
      search: "",
      sports: [],
      resetPagination: true,
      scrollTo: "filters", // Scroll to filters when clearing
    });

    setShowSearchSpinner(false);
  }, [updateURL]);

  // Clear search input
  const handleClearSearch = useCallback(() => {
    setSearchValue("");
    setShowSearchSpinner(false);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const sportArray = Array.from(selectedKeys);
    updateURL({
      search: "",
      sports: sportArray,
      resetPagination: true,
      scrollTo: "filters", // Scroll to filters when clearing search
    });

    // Focus back on input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedKeys, updateURL]);

  // Fetch data when URL params change (for initial load and back/forward navigation)
  const fetchData = useCallback(async () => {
    const search = searchParams.get("search") || "";
    const sports = searchParams.getAll("sports") || [];
    const page = parseInt(searchParams.get("page") || "1");

    setIsCardsLoading(true);

    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set("search", search);
      if (sports.length > 0) {
        sports.forEach((sport) => queryParams.append("sports", sport));
      }
      if (page > 1) queryParams.set("page", page.toString());
      // ADD THIS LINE - pass the current locale
      queryParams.set("locale", locale);

      const response = await fetch(`/api/stadiums?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setStadiums(data.data);
        setPagination(data.pagination);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching stadiums:", error);
    } finally {
      setIsCardsLoading(false);
    }
  }, [searchParams, locale]);

  // Initialize from URL params on mount
  useEffect(() => {
    // Only run once on mount
    if (isInitialized) return;

    const search = searchParams.get("search") || "";
    const sports = searchParams.getAll("sports") || [];
    const page = parseInt(searchParams.get("page") || "1");

    // Set initial values from URL
    setSearchValue(search);
    setSelectedKeys(new Set(sports));
    setCurrentPage(page);

    setIsInitialized(true);
  }, [searchParams, isInitialized]);

  // Fetch new data when URL params change
  useEffect(() => {
    if (!isInitialized) return;

    fetchData();
  }, [searchParams, isInitialized, fetchData]);

  // Calculate showing range
  const showingFrom = (currentPage - 1) * pagination.itemsPerPage + 1;
  const showingTo = Math.min(
    currentPage * pagination.itemsPerPage,
    pagination.totalItems
  );

  // Prepare sports for Select component
  const sportOptions = allSports.map((sport) => ({
    key: sport.id,
    label: sport.name,
  }));

  return (
    <>
      {/* Search and Filter Section */}
      <div ref={filtersSectionRef} className="mb-12">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="relative">
                <FaSearch
                  className={`absolute ${
                    isRTL ? "right-4" : "left-4"
                  } top-1/2 transform -translate-y-1/2 text-gray-400`}
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchValue}
                  onChange={handleSearchChange}
                  placeholder={translations.search.placeholder}
                  className={`w-full ${
                    isRTL ? "pr-12 pl-4" : "pl-12 pr-4"
                  } py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400`}
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className={`absolute ${
                      isRTL ? "left-12" : "right-12"
                    } top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"`}
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                )}
                {showSearchSpinner && (
                  <div
                    className={`absolute ${
                      isRTL ? "left-4" : "right-4"
                    } top-1/2 transform -translate-y-1/2`}
                  >
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                  </div>
                )}
              </div>
            </div>
            <div className="relative">
              <Select
                label={translations.filter.sport}
                selectionMode="multiple"
                placeholder={translations.filter.selectSports}
                className="max-w-full"
                selectedKeys={selectedKeys}
                onSelectionChange={handleSportSelectionChange}
                isLoading={isCardsLoading}
                disallowEmptySelection={false}
              >
                {sportOptions.map((sport) => (
                  <SelectItem key={sport.key}>{sport.label}</SelectItem>
                ))}
              </Select>
            </div>
          </div>

          {/* Active filters display */}
          {(selectedKeys.size > 0 || searchValue) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">
                {translations.filter.activeFilters}:
              </span>

              {searchValue && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                  Search: "{searchValue}"
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              )}

              {Array.from(selectedKeys).map((sportId) => {
                const sport = allSports.find((s) => s.id === sportId);
                const sportName = sport ? sport.name : sportId;
                return (
                  <span
                    key={sportId}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                  >
                    {sportName}
                    <button
                      type="button"
                      onClick={() => {
                        const newKeys = new Set(selectedKeys);
                        newKeys.delete(sportId);
                        setSelectedKeys(newKeys);

                        updateURL({
                          search: searchValue,
                          sports: Array.from(newKeys),
                          resetPagination: true,
                          scrollTo: "filters",
                        });
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}

              <button
                type="button"
                onClick={handleClearFilters}
                className="ml-auto text-sm text-primary hover:text-primary/80"
              >
                {translations.noResults.resetFilters}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* All Stadiums Grid */}
      <div ref={resultsSectionRef}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            {translations.allStadiums}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">
                {pagination.totalItems} {translations.total}
              </span>
            </div>
          </div>
        </div>

        {/* Results summary */}
        {pagination.totalItems > 0 && (
          <div className="mb-6 text-gray-600 dark:text-gray-400">
            <p>
              {translations.pagination.showing}{" "}
              <span className="font-semibold">{showingFrom}</span>{" "}
              {translations.pagination.to}{" "}
              <span className="font-semibold">{showingTo}</span>{" "}
              {translations.pagination.of}{" "}
              <span className="font-semibold">{pagination.totalItems}</span>{" "}
              {translations.pagination.results}
            </p>
          </div>
        )}

        {isCardsLoading ? (
          // Loading skeletons
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: pagination.itemsPerPage }).map((_, i) => (
              <StadiumCardSkeleton key={i} />
            ))}
          </div>
        ) : stadiums.length === 0 ? (
          // No results message
          <div className="text-center py-12">
            <div className="inline-block p-8 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg mb-6">
              <FaFilter className="w-16 h-16 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {translations.noResults.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {translations.noResults.message}
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              {translations.noResults.resetFilters}
            </button>
          </div>
        ) : (
          <>
            {/* Show stadiums */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {stadiums.map((stadium) => (
                <StadiumCard
                  stadium={stadium}
                  locale={locale}
                  key={stadium.id}
                  translations={{
                    details: {
                      monthlyRate: translations.details.monthlyRate,
                      perMonth: translations.details.perMonth,
                      type: translations.details.type,
                      perSession: translations.details.perSession,
                      from: translations.details.from,
                      additionalSports: translations.details.additionalSports,
                      totalSports: translations.details.totalSports,
                      bestForOneTime: translations.details.bestForOneTime,
                      viewFullDetails: translations.details.viewFullDetails,
                      viewOnMaps: translations.details.viewOnMaps,
                    },
                    type: translations.type,
                    actions: translations.actions,
                  }}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center overflow-hidden">
                <Pagination
                  total={pagination.totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  showControls
                  showShadow
                  classNames={{
                    next: "rtl:rotate-180",
                    prev: "rtl:rotate-180",
                  }}
                  color="default"
                  size="sm"
                  isDisabled={isPaginationLoading}
                />

                {isPaginationLoading && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span>
                      {translations.pagination.goToPage} {currentPage}...
                    </span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Call to Action */}
      <div className="mt-20">
        <div className="bg-gradient-to-r from-gray-100/50 to-gray-200/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-3xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-700/50 text-center">
          <div className="inline-block p-6 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 rounded-2xl shadow-lg mb-6">
            <FaCalendar className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {translations.cta.title}
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            {translations.cta.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              color="primary"
              size="lg"
              startContent={<FaPhone className="w-5 h-5" />}
              className="px-8"
            >
              {translations.cta.contactSupport}
            </Button>
            <Button
              color="default"
              variant="bordered"
              size="lg"
              startContent={<FaCalendar className="w-5 h-5" />}
              className="px-8"
            >
              {translations.cta.bookNow}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StadiumClientSection;
