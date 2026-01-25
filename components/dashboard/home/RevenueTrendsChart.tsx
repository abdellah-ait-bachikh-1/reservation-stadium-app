// components/dashboard/home/sections/RevenueTrendsChart.tsx
"use client";

import { useTypedTranslations } from "@/utils/i18n";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
  HiCurrencyDollar, 
  HiTrendingUp, 
  HiTrendingDown,
  HiCollection,
  HiTicket,
  HiCash,
  HiCheckCircle,
  HiExclamation,
  HiCalendar
} from "react-icons/hi";
import { useState, useMemo } from "react";


interface MonthlyRevenueData {
  month: string;
  totalRevenue: number;
  subscriptionRevenue: number;
  singleSessionRevenue: number;
  paidAmount: number;
  overdueAmount: number;
  collectionRate: number
}

interface RevenueTrendsChartProps {
  monthlyData?: MonthlyRevenueData[];
  currentYear: number;
  onYearChange?: (year: number) => void;
}


interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        dataKey: string;
        value: number;
        color: string;
        payload: MonthlyRevenueData;
    }>;
    label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    const t = useTypedTranslations();

    if (active && payload && payload.length) {
        const data = payload[0].payload;

        return (
            <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-64">
                <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t("pages.dashboard.home.revenueTrends.totalRevenue")}:</span>
                        <span className="text-sm font-semibold text-green-600">
                            {data.totalRevenue.toLocaleString()} {t("common.currency.symbol")}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t("pages.dashboard.home.revenueTrends.subscription")}:</span>
                        <span className="text-sm font-semibold text-blue-600">
                            {data.subscriptionRevenue.toLocaleString()} {t("common.currency.symbol")}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t("pages.dashboard.home.revenueTrends.singleSession")}:</span>
                        <span className="text-sm font-semibold text-purple-600">
                            {data.singleSessionRevenue.toLocaleString()} {t("common.currency.symbol")}
                        </span>
                    </div>
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{t("pages.dashboard.home.revenueTrends.paid")}:</span>
                            <span className="text-sm font-semibold text-green-500">
                                {data.paidAmount.toLocaleString()} {t("common.currency.symbol")}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{t("pages.dashboard.home.revenueTrends.overdue")}:</span>
                            <span className="text-sm font-semibold text-red-500">
                                {data.overdueAmount.toLocaleString()} {t("common.currency.symbol")}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export default function RevenueTrendsChart({ monthlyData, 
  currentYear, 
  onYearChange  }: RevenueTrendsChartProps) {
    const t = useTypedTranslations();
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [showLines, setShowLines] = useState({
        total: true,
        subscription: true,
        singleSession: true,
    });


  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    onYearChange?.(year);
  };

    // Generate demo data if not provided (based on your schema)
    const defaultData = useMemo(() => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        return months.map((month, index) => {
            const baseRevenue = 20000 + (Math.random() * 10000);
            const subscriptionPercentage = 0.6 + (Math.random() * 0.2); // 60-80% from subscriptions
            const singleSessionPercentage = 1 - subscriptionPercentage;

            const subscriptionRevenue = Math.round(baseRevenue * subscriptionPercentage);
            const singleSessionRevenue = Math.round(baseRevenue * singleSessionPercentage);
            const totalRevenue = subscriptionRevenue + singleSessionRevenue;

            // Payment status (80-95% paid, rest overdue)
            const paidPercentage = 0.85 + (Math.random() * 0.1);
            const paidAmount = Math.round(totalRevenue * paidPercentage);
            const overdueAmount = totalRevenue - paidAmount;

            return {
                month,
                totalRevenue,
                subscriptionRevenue,
                singleSessionRevenue,
                paidAmount,
                overdueAmount,
                collectionRate: Math.round(paidPercentage * 100),
            };
        });
    }, []);

    const data = monthlyData || defaultData;

    // Calculate YEAR-TO-DATE summary statistics (accumulated for the whole year)
    const yearToDateStats = useMemo(() => {
        const totalRevenue = data.reduce((sum, item) => sum + item.totalRevenue, 0);
        const totalSubscription = data.reduce((sum, item) => sum + item.subscriptionRevenue, 0);
        const totalSingleSession = data.reduce((sum, item) => sum + item.singleSessionRevenue, 0);
        const totalPaid = data.reduce((sum, item) => sum + item.paidAmount, 0);
        const totalOverdue = data.reduce((sum, item) => sum + item.overdueAmount, 0);
        
        // Calculate collection rate (paid vs total revenue)
        const collectionRate = totalRevenue > 0 ? Math.round((totalPaid / totalRevenue) * 100) : 0;
        
        // Year-over-year comparison (vs previous year)
        const previousYearRevenue = totalRevenue * 0.85; // Simulate 85% of current year
        const revenueChange = previousYearRevenue > 0 ? 
            Math.round(((totalRevenue - previousYearRevenue) / previousYearRevenue) * 100) : 0;

        return {
            totalRevenue,
            totalSubscription,
            totalSingleSession,
            totalPaid,
            totalOverdue,
            collectionRate,
            revenueChange,
        };
    }, [data]);

    // Calculate MONTHLY statistics for current vs previous month (for chart tooltip)
    const monthlyStats = useMemo(() => {
        if (data.length < 2) return { revenueChange: 0 };
        
        const currentMonth = data[data.length - 1];
        const previousMonth = data[data.length - 2];
        const revenueChange = previousMonth.totalRevenue > 0 ? 
            Math.round(((currentMonth.totalRevenue - previousMonth.totalRevenue) / previousMonth.totalRevenue) * 100) : 0;

        return {
            revenueChange,
        };
    }, [data]);

    // Generate years for dropdown
    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

    // Translate month names
    const translateMonth = useMemo(() => {
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

        return (monthKey: string): string => monthMap[monthKey] || monthKey;
    }, [t]);

    const translatedData = data.map(item => ({
        ...item,
        month: translateMonth(item.month)
    }));

    return (
        <Card className="shadow-sm col-span-1 lg:col-span-2">
       <CardHeader className="pb-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("pages.dashboard.home.revenueTrends.title")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("pages.dashboard.home.revenueTrends.description")} - {selectedYear}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Select
                classNames={{ trigger: "bg-white dark:bg-zinc-900 shadow-sm w-30 cursor-pointer" }}
                selectedKeys={[selectedYear.toString()]}
                onSelectionChange={(keys) => {
                  const year = Array.from(keys)[0] as string;
                  handleYearChange(parseInt(year));
                }}
                size="sm"
                variant="flat"
              >
                {yearOptions.map((year) => (
                  <SelectItem key={year.toString()}>
                    {year.toString()}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>

            <CardBody>
                {/* Summary Stats - YEAR-TO-DATE Totals */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
                    {/* Year-to-Date Total Revenue Card */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 rtl:text-right">
                                    {t("pages.dashboard.home.revenueTrends.totalRevenue")}
                                </p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 rtl:text-right">
                                    {yearToDateStats.totalRevenue.toLocaleString()} {t("common.currency.symbol")}
                                </p>
                                <div className="flex items-center gap-1 mt-2 rtl:text-right">
                                    <HiCalendar className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-500 rtl:text-right">
                                        {t("pages.dashboard.home.revenueTrends.yearToDate")}
                                    </span>
                                </div>
                            </div>
                            <HiCurrencyDollar className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="flex items-center gap-1 mt-2 rtl:text-right">
                            {yearToDateStats.revenueChange >= 0 ? (
                                <HiTrendingUp className="w-4 h-4 text-green-500" />
                            ) : (
                                <HiTrendingDown className="w-4 h-4 text-red-500" />
                            )}
                            <span className={`text-xs font-medium  rtl:text-right ${yearToDateStats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {yearToDateStats.revenueChange >= 0 ? '+' : ''}{yearToDateStats.revenueChange}%
                            </span> 
                            <span className="text-xs text-gray-500 ml-1 rtl:text-right">{t("pages.dashboard.home.revenueTrends.vsLastYear")}</span>
                        </div>
                    </div>
                    
                    {/* Year-to-Date Subscription Revenue Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 rtl:text-right">
                                    {t("pages.dashboard.home.revenueTrends.subscription")}
                                </p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 rtl:text-right">
                                    {yearToDateStats.totalSubscription.toLocaleString()} {t("common.currency.symbol")}
                                </p>
                                <div className="flex items-center gap-1 mt-2 rtl:text-right">
                                    <HiCalendar className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-500 rtl:text-right">
                                        {t("pages.dashboard.home.revenueTrends.yearToDate")}
                                    </span>
                                </div>
                            </div>
                            <HiCollection className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1 rtl:text-right">
                            {Math.round((yearToDateStats.totalSubscription / yearToDateStats.totalRevenue) * 100)}% {t("pages.dashboard.home.revenueTrends.ofTotal")}
                        </p>
                    </div>
                    
                    {/* Year-to-Date Single Session Revenue Card */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 rtl:text-right">
                                    {t("pages.dashboard.home.revenueTrends.singleSession")}
                                </p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 rtl:text-right">
                                    {yearToDateStats.totalSingleSession.toLocaleString()} {t("common.currency.symbol")}
                                </p>
                                <div className="flex items-center gap-1 mt-2 rtl:text-right">
                                    <HiCalendar className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-500 rtl:text-right">
                                        {t("pages.dashboard.home.revenueTrends.yearToDate")}
                                    </span>
                                </div>
                            </div>
                            <HiTicket className="w-8 h-8 text-purple-600" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1 rtl:text-right">
                            {Math.round((yearToDateStats.totalSingleSession / yearToDateStats.totalRevenue) * 100)}% {t("pages.dashboard.home.revenueTrends.ofTotal")}
                        </p>
                    </div>
                    
                    {/* Year-to-Date Paid Amount Card */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 rtl:text-right">
                                    {t("pages.dashboard.home.revenueTrends.paid")}
                                </p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 rtl:text-right">
                                    {yearToDateStats.totalPaid.toLocaleString()} {t("common.currency.symbol")}
                                </p>
                                <div className="flex items-center gap-1 mt-2 rtl:text-right">
                                    <HiCalendar className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-500 rtl:text-right">
                                        {t("pages.dashboard.home.revenueTrends.yearToDate")}
                                    </span>
                                </div>
                            </div>
                            <HiCheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <p className="text-xs text-green-600 font-medium mt-1 rtl:text-right">
                            {yearToDateStats.collectionRate}% {t("pages.dashboard.home.revenueTrends.collectionRate")}
                        </p>
                    </div>
                    
                    {/* Year-to-Date Overdue Amount Card */}
                    <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 rtl:text-right">
                                    {t("pages.dashboard.home.revenueTrends.overdue")}
                                </p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 rtl:text-right">
                                    {yearToDateStats.totalOverdue.toLocaleString()} {t("common.currency.symbol")}
                                </p>
                                <div className="flex items-center gap-1 mt-2 rtl:text-right">
                                    <HiCalendar className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-500 rtl:text-right">
                                        {t("pages.dashboard.home.revenueTrends.yearToDate")}
                                    </span>
                                </div>
                            </div>
                            <HiExclamation className="w-8 h-8 text-red-600" />
                        </div>
                        <p className="text-xs text-red-600 font-medium mt-1 rtl:text-right">
                            {Math.round((yearToDateStats.totalOverdue / yearToDateStats.totalRevenue) * 100)}% {t("pages.dashboard.home.revenueTrends.outstanding")}
                        </p>
                    </div>
                </div>

                {/* Chart */}
                <div className="h-80">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t("pages.dashboard.home.revenueTrends.monthlyBreakdown")}
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                                {t("pages.dashboard.home.revenueTrends.monthlyChange")}: 
                                <span className={`ml-1 font-medium ${monthlyStats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {monthlyStats.revenueChange >= 0 ? '+' : ''}{monthlyStats.revenueChange}%
                                </span>
                            </span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={translatedData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e5e7eb"
                                strokeOpacity={0.5}
                                vertical={false}
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
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                verticalAlign="top"
                                height={36}
                                iconType="circle"
                                iconSize={8}
                                formatter={(value) => (
                                    <span className="text-xs text-gray-600 dark:text-gray-300">{value}</span>
                                )}
                            />

                            {showLines.total && (
                                <Line
                                    type="monotone"
                                    dataKey="totalRevenue"
                                    name={t("pages.dashboard.home.revenueTrends.monthlyRevenue")}
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                    fill="url(#colorTotal)"
                                />
                            )}

                            {showLines.subscription && (
                                <Line
                                    type="monotone"
                                    dataKey="subscriptionRevenue"
                                    name={t("pages.dashboard.home.revenueTrends.monthlySubscription")}
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                    fill="url(#colorSubscription)"
                                />
                            )}

                            {showLines.singleSession && (
                                <Line
                                    type="monotone"
                                    dataKey="singleSessionRevenue"
                                    name={t("pages.dashboard.home.revenueTrends.monthlySingleSession")}
                                    stroke="#8b5cf6"
                                    strokeWidth={2}
                                    strokeDasharray="3 3"
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                    fill="url(#colorSingleSession)"
                                />
                            )}

                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="colorSubscription" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="colorSingleSession" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend Toggles */}
                <div className="flex flex-wrap justify-center gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setShowLines(prev => ({ ...prev, total: !prev.total }))}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full ${showLines.total ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}
                    >
                        <div className={`w-3 h-3 rounded-full ${showLines.total ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-xs">{t("pages.dashboard.home.revenueTrends.totalRevenue")}</span>
                    </button>

                    <button
                        onClick={() => setShowLines(prev => ({ ...prev, subscription: !prev.subscription }))}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full ${showLines.subscription ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}
                    >
                        <div className={`w-3 h-3 rounded-full ${showLines.subscription ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                        <span className="text-xs">{t("pages.dashboard.home.revenueTrends.subscription")}</span>
                    </button>

                    <button
                        onClick={() => setShowLines(prev => ({ ...prev, singleSession: !prev.singleSession }))}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full ${showLines.singleSession ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}
                    >
                        <div className={`w-3 h-3 rounded-full ${showLines.singleSession ? 'bg-purple-500' : 'bg-gray-400'}`}></div>
                        <span className="text-xs">{t("pages.dashboard.home.revenueTrends.singleSession")}</span>
                    </button>
                </div>
            </CardBody>
        </Card>
    );
}