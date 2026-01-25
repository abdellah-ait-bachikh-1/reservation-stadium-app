// components/dashboard/home/sections/BarChartSection.tsx
"use client";

import { useTypedTranslations } from "@/utils/i18n";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { HiCurrencyDollar } from "react-icons/hi";

interface ChartData {
  month: string;
  value: number;
}

interface StadiumUtilization {
  name: string;
  usage: number;
}

interface BarChartSectionProps {
  stadiumUtilization: StadiumUtilization[];
  revenueByMonth: ChartData[];
  currentYear: number;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartData;
    value: number;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  const t = useTypedTranslations();

  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
        <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1 ">
          <HiCurrencyDollar className="w-3 h-3" />
          <div className="flex items-center gap-1 "><span>{payload[0].value.toLocaleString()}</span> <span>{t("common.currency.symbol")}</span> </div>
        </span>
      </div>
    );
  }
  return null;
};

export default function BarChartSection({ stadiumUtilization, revenueByMonth, currentYear }: BarChartSectionProps) {
  const t = useTypedTranslations();

  // Helper function to translate months
  const translateMonth = (monthKey: string): string => {
    const monthMap: Record<string, string> = {
      "Jan": t("common.months.short.jan"),
      "Feb": t("common.months.short.feb"),
      "Mar": t("common.months.short.mar"),
      "Apr": t("common.months.short.apr"),
      "May": t("common.months.short.may"),
      "Jun": t("common.months.short.jun"),
      "Jul": t("common.months.short.jul"),
      "Aug": t("common.months.short.aug"),
      "Sep": t("common.months.short.sep"),
      "Oct": t("common.months.short.oct"),
      "Nov": t("common.months.short.nov"),
      "Dec": t("common.months.short.dec"),
    };
    return monthMap[monthKey] || monthKey;
  };

  // Translate month names in revenue data
  const translatedRevenueData = revenueByMonth.map(item => ({
    ...item,
    month: translateMonth(item.month)
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Stadium Utilization */}
      <Card className="shadow-sm">
        <CardHeader className="pb-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("pages.dashboard.home.charts.stadiumUtilization.title")}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("pages.dashboard.home.charts.stadiumUtilization.description")}
          </p>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {stadiumUtilization.map((stadium, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {stadium.name}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {stadium.usage}%
                  </span>
                </div>
                <Progress
                  value={stadium.usage}
                  color={
                    stadium.usage >= 80 ? "success" :
                      stadium.usage >= 60 ? "warning" : "danger"
                  }
                  size="sm"
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Monthly Revenue Bar Chart */}
      <Card className="shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("pages.dashboard.home.charts.revenueByMonth.title")}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("pages.dashboard.home.charts.revenueByMonth.description")} - {currentYear}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {t("pages.dashboard.home.charts.revenue")}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={translatedRevenueData}
                margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  vertical={false}
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  dx={-10}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                />
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                  fill="url(#colorRevenue)"
                >
                  {translatedRevenueData.map((entry, index) => {
                    const maxValue = Math.max(...translatedRevenueData.map(m => m.value));
                    const percentage = (entry.value / maxValue) * 100;

                    let color;
                    if (percentage >= 80) {
                      color = '#10b981'; // Green for high revenue
                    } else if (percentage >= 50) {
                      color = '#f59e0b'; // Amber for medium revenue
                    } else {
                      color = '#ef4444'; // Red for low revenue
                    }

                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("pages.dashboard.home.charts.maxRevenue")}
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {Math.max(...translatedRevenueData.map(m => m.value)).toLocaleString()} {t("common.currency.symbol")}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("pages.dashboard.home.charts.avgMonthly")}
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {Math.round(translatedRevenueData.reduce((sum, m) => sum + m.value, 0) / translatedRevenueData.length).toLocaleString()} {t("common.currency.symbol")}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("pages.dashboard.home.charts.totalYear")} ({currentYear})
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {translatedRevenueData.reduce((sum, m) => sum + m.value, 0).toLocaleString()} {t("common.currency.symbol")}
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {t("pages.dashboard.home.charts.legend.low")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {t("pages.dashboard.home.charts.legend.medium")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {t("pages.dashboard.home.charts.legend.high")}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}