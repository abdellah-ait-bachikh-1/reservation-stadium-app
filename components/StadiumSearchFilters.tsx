"use client";

import { useTranslations } from 'next-intl';
import React, { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import { Select, SelectItem } from "@heroui/select";
import { sports } from '@/lib/const';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';

interface StadiumSearchFiltersProps {
  locale: string;
  initialSelectedSports: string[];
  initialSearchTerm: string;
}

const StadiumSearchFilters = ({ 
  locale,
  initialSelectedSports,
  initialSearchTerm
}: StadiumSearchFiltersProps) => {
  const t = useTranslations("Pages.Stadiums");
  const isRTL = locale === "ar";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [searchValue, setSearchValue] = useState(initialSearchTerm);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(initialSelectedSports));
  const [isLoading, setIsLoading] = useState(false);

  // Update URL with new filters (debounced)
  const updateURL = (search: string, sports: string[]) => {
    setIsLoading(true);
    
    // Create URLSearchParams object
    const params = new URLSearchParams(searchParams.toString());
    
    // Update search param
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    
    // Update sports params
    params.delete('sports'); // Remove all existing sports params
    sports.forEach(sport => {
      params.append('sports', sport);
    });
    
    // Navigate with new params after 2-second delay
    setTimeout(() => {
      router.push(`${pathname}?${params.toString()}`);
      setIsLoading(false);
    }, 2000);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    updateURL(value, Array.from(selectedKeys));
  };

  // Handle HeroUI Select change
  const handleSportSelectionChange = (keys: any) => {
    let selectedArray: string[];
    
    if (keys === "all") {
      // If "all" is selected, return all sport IDs
      const allSportIds = sports.map(sport => sport.id);
      selectedArray = allSportIds;
      setSelectedKeys(new Set(allSportIds));
    } else {
      const selectedKeysSet = keys as Set<string>;
      selectedArray = Array.from(selectedKeysSet);
      setSelectedKeys(selectedKeysSet);
    }
    
    updateURL(searchValue, selectedArray);
  };

  // Prepare sports for Select component
  const sportOptions = sports.map(sport => ({
    key: sport.id,
    label: locale === 'ar' ? sport.nameAr : sport.nameFr,
  }));

  return (
    <div className="mb-12">
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder={t("search.placeholder")}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
                disabled={isLoading}
              />
              {isLoading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                </div>
              )}
            </div>
          </div>
          <div>
            <Select
              label={t("filter.sport")}
              selectionMode="multiple"
              placeholder={t("filter.selectSports")}
              className="max-w-full"
              selectedKeys={selectedKeys}
              onSelectionChange={handleSportSelectionChange}
              isDisabled={isLoading}
              isLoading={isLoading}
            >
              {sportOptions.map((sport) => (
                <SelectItem key={sport.key}>
                  {sport.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StadiumSearchFilters;