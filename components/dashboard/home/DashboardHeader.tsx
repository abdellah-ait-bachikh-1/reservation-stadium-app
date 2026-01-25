// components/dashboard/home/sections/DashboardHeader.tsx
"use client";

import { useTypedTranslations } from "@/utils/i18n";
import { Select, SelectItem } from "@heroui/select";

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
}

export default function DashboardHeader({ 
  user, 
  currentYear, 
  onYearChange 
}: DashboardHeaderProps) {
  const t = useTypedTranslations();

  // Generate years from 2026 to current year
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

      <div className="flex items-center gap-4">
        <Select
          classNames={{ trigger: "bg-white dark:bg-zinc-900 shadow-sm w-30 cursor-pointer" }}
          selectedKeys={[currentYear.toString()]}
          onSelectionChange={(keys) => {
            const year = Array.from(keys)[0] as string;
            handleYearChange(year);
          }}
          label={t("pages.dashboard.home.yearFilter.selectYear")}
          variant="flat"
          size="sm"
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