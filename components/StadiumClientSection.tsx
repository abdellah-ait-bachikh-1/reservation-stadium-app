"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { FaSearch, FaFilter, FaCalendar, FaPhone, FaTimes } from "react-icons/fa";
import StadiumCard from "@/components/StadiumCard";
import StadiumCardSkeleton from "@/components/StadiumCardSkeleton";
import { sports } from '@/lib/const';

interface StadiumClientSectionProps {
  locale: string;
  allStadiums: any[];
  initialSelectedSports: string[];
  initialSearchTerm: string;
  initialFilteredStadiums: any[];
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
    };
    type: {
      multipleSports: string;
      singleSport: string;
    };
    actions: {
      viewDetails: string;
    };
  };
}

const StadiumClientSection = ({
  locale,
  allStadiums,
  initialSelectedSports,
  initialSearchTerm,
  initialFilteredStadiums,
  translations
}: StadiumClientSectionProps) => {
  const isRTL = locale === "ar";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [searchValue, setSearchValue] = useState(initialSearchTerm);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(initialSelectedSports));
  const [isCardsLoading, setIsCardsLoading] = useState(false);
  const [filteredStadiums, setFilteredStadiums] = useState(initialFilteredStadiums);
  const searchTimeoutRef = useRef<NodeJS.Timeout>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showSearchSpinner, setShowSearchSpinner] = useState(false);

  // Update URL when filters change
  const updateURL = useCallback((search: string, sportIds: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (search.trim()) {
      params.set('search', search.trim());
    } else {
      params.delete('search');
    }
    
    params.delete('sports');
    if (sportIds.length > 0) {
      sportIds.forEach(sport => {
        params.append('sports', sport);
      });
    }
    
    const url = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(url, { scroll: false });
  }, [router, pathname, searchParams]);

  // Client-side filtering function
  const filterStadiums = useCallback((search: string, sportIds: string[]) => {
    let results = [...allStadiums];
    
    if (sportIds.length > 0) {
      results = results.filter(stadium => 
        stadium.sports.some((sport: any) => sportIds.includes(sport.id))
      );
    }
    
    if (search.trim()) {
      const term = search.toLowerCase().trim();
      results = results.filter(stadium => 
        stadium.name.toLowerCase().includes(term) ||
        stadium.address.toLowerCase().includes(term)
      );
    }
    
    return results;
  }, [allStadiums]);

  // Handle search input change with debouncing
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
      const filtered = filterStadiums(value, sportArray);
      setFilteredStadiums(filtered);
      updateURL(value, sportArray);
      setShowSearchSpinner(false);
    }, 300);
  }, [selectedKeys, filterStadiums, updateURL]);

  // Handle sport selection change
  const handleSportSelectionChange = useCallback((keys: any) => {
    // Clear search timeout if any
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    setIsCardsLoading(true);
    
    let sportArray: string[];
    let selectedKeysSet: Set<string>;
    
    if (keys === "all") {
      selectedKeysSet = new Set();
      sportArray = [];
    } else if (keys instanceof Set) {
      selectedKeysSet = keys;
      sportArray = Array.from(keys);
    } else if (keys === "all" || keys === "none") {
      selectedKeysSet = new Set();
      sportArray = [];
    } else {
      selectedKeysSet = new Set();
      sportArray = [];
    }
    
    setSelectedKeys(selectedKeysSet);
    
    // Filter and update
    const filtered = filterStadiums(searchValue, sportArray);
    setFilteredStadiums(filtered);
    updateURL(searchValue, sportArray);
    
    // Quick loading state for cards only
    setTimeout(() => {
      setIsCardsLoading(false);
    }, 200);
  }, [searchValue, filterStadiums, updateURL]);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    setSearchValue('');
    setSelectedKeys(new Set());
    setFilteredStadiums(allStadiums);
    setShowSearchSpinner(false);
    setIsCardsLoading(false);
    router.replace(pathname, { scroll: false });
  }, [allStadiums, router, pathname]);

  // Clear search input
  const handleClearSearch = useCallback(() => {
    setSearchValue('');
    setShowSearchSpinner(false);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    const sportArray = Array.from(selectedKeys);
    const filtered = filterStadiums('', sportArray);
    setFilteredStadiums(filtered);
    updateURL('', sportArray);
    
    // Focus back on input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedKeys, filterStadiums, updateURL]);

  // Prepare sports for Select component
  const sportOptions = sports.map(sport => ({
    key: sport.id,
    label: locale === 'ar' ? sport.nameAr : sport.nameFr,
  }));

  return (
    <>
      {/* Search and Filter Section */}
      <div className="mb-12">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="relative">
                <FaSearch className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 text-gray-400`} />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchValue}
                  onChange={handleSearchChange}
                  placeholder={translations.search.placeholder}
                  className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400`}
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className={`absolute ${isRTL ? 'left-12' : 'right-12'} top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600`}
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                )}
                {showSearchSpinner && (
                  <div className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2`}>
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
                  <SelectItem key={sport.key}>
                    {sport.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          
          {/* Active filters display */}
          {(selectedKeys.size > 0 || searchValue) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">{translations.filter.activeFilters}:</span>
              
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
              
              {Array.from(selectedKeys).map(sportId => {
                const sport = sports.find(s => s.id === sportId);
                const sportName = sport ? (locale === 'ar' ? sport.nameAr : sport.nameFr) : sportId;
                return (
                  <span key={sportId} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                    {sportName}
                    <button
                      type="button"
                      onClick={() => {
                        const newKeys = new Set(selectedKeys);
                        newKeys.delete(sportId);
                        setSelectedKeys(newKeys);
                        
                        const filtered = filterStadiums(searchValue, Array.from(newKeys));
                        setFilteredStadiums(filtered);
                        updateURL(searchValue, Array.from(newKeys));
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
      <div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            {translations.allStadiums}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">
                {filteredStadiums.length} {translations.total}
              </span>
            </div>
          </div>
        </div>

        {isCardsLoading ? (
          // Loading skeletons
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <StadiumCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredStadiums.length === 0 ? (
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
          // Show filtered stadiums
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStadiums.map((stadium) => (
              <StadiumCard 
                stadium={stadium} 
                locale={locale} 
                key={stadium.id}
                translations={{
                  details: translations.details,
                  type: translations.type,
                  actions: translations.actions
                }}
              />
            ))}
          </div>
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