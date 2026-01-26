// components/dashboard/home/sections/DashboardHeader.tsx
"use client";

import { useTypedTranslations } from "@/utils/i18n";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { FiRefreshCw } from "react-icons/fi";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CLUB";
}

interface DashboardHeaderProps {
  user: User;
  currentYear: number;
  onYearChange?: (year: number) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function DashboardHeader({ 
  user, 
  currentYear, 
  onYearChange,
  onRefresh,
  isRefreshing = false
}: DashboardHeaderProps) {
  const t = useTypedTranslations();

  // Generate years from 2025 to current year
  const currentYearNow = new Date().getFullYear();
  const startYear = 2025;
  
  const yearOptions = Array.from(
    { length: Math.max(0, currentYearNow - startYear + 1) },
    (_, i) => startYear + i
  ).reverse(); // Show most recent first

  const handleYearChange = (year: string) => {
    const selectedYear = parseInt(year);
    onYearChange?.(selectedYear);
  };

  const handleRefresh = () => {
    onRefresh?.();
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {t("pages.dashboard.home.welcome", { name: user.name })}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {t("pages.dashboard.home.subtitle")}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          isIconOnly
          color="primary"
          variant="flat"
          size="lg"
          onPress={handleRefresh}
          isLoading={isRefreshing}
          spinner={
            <FiRefreshCw className="animate-spin" size={16} />
          }
          
            radius="md"
        >
          <FiRefreshCw size={16} />
        </Button>

        <Select
          classNames={{ 
            trigger: "bg-white dark:bg-zinc-900 shadow-sm w-30 cursor-pointer",
            label: "text-xs"
          }}
          selectedKeys={[currentYear.toString()]}
          onSelectionChange={(keys) => {
            const year = Array.from(keys)[0] as string;
            handleYearChange(year);
          }}
          label={t("pages.dashboard.home.yearFilter.selectYear")}
          variant="flat"
          size="sm"
          radius="md"
        >
          {yearOptions.map((year) => (
            <SelectItem key={year.toString()}>
              {year.toString()}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
}