// components/dashboard/home/sections/DashboardHeader.tsx
"use client";

import { useTypedTranslations } from "@/utils/i18n";
import { Select, SelectItem } from "@heroui/select";
import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CLUB";
}

interface DashboardHeaderProps {
  user: User;
  currentYear: number;
}

export default function DashboardHeader({ user, currentYear }: DashboardHeaderProps) {
  const t = useTypedTranslations();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // Generate years for dropdown
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

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
          selectedKeys={[selectedYear.toString()]}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
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