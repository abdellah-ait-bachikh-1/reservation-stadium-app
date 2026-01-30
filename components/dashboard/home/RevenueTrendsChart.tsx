// components/dashboard/home/sections/RevenueTrendsChart.tsx
"use client";

import { useTypedTranslations } from "@/utils/i18n";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState, useMemo, useEffect } from "react";
import { Button } from "@heroui/button";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Ticket,
  BarChart3,
  FileText,
  Wallet,
  Package,
  Receipt,
  CircleDollarSign,
  CalendarDays,
  RefreshCw,
  RefreshCcw,
  Percent,
  Target,
  AlertTriangle,
  Check,
  X,
  Clock4,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Circle,
  CheckCheck,
  AlertOctagon,
  Hourglass,
  Banknote,
  Layers,
  PieChart,
  TrendingUp as TrendUp
} from "lucide-react";

interface MonthlyRevenueData {
  month: string;
  totalRevenue: number;
  subscriptionRevenue: number;
  singleSessionRevenue: number;
  paidAmount: number;
  overdueAmount: number;
  pendingAmount: number;
  collectionRate: number;
}

interface RevenueTrendsChartProps {
  monthlyData?: MonthlyRevenueData[];
  currentYear: number;
  onYearChange?: (year: number) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  availableYears?: number[];
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
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-72">
        <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
        <div className="space-y-2">
          {/* Total Revenue */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <DollarSign className="w-3 h-3" />
              {t("pages.dashboard.home.revenueTrends.monthlyRevenue")}:
            </span>
            <span className="text-sm font-semibold text-green-600">
              {data.totalRevenue.toLocaleString()} {t("common.currency.symbol")}
            </span>
          </div>
          
          {/* Revenue Breakdown */}
          <div className="pl-3 border-l-2 border-gray-200 dark:border-gray-700 ml-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Circle className="w-2 h-2 fill-blue-500 text-blue-500" />
                {t("pages.dashboard.home.revenueTrends.monthlySubscription")}:
              </span>
              <span className="text-sm font-semibold text-blue-600">
                {data.subscriptionRevenue.toLocaleString()} {t("common.currency.symbol")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Circle className="w-2 h-2 fill-purple-500 text-purple-500" />
                {t("pages.dashboard.home.revenueTrends.monthlySingleSession")}:
              </span>
              <span className="text-sm font-semibold text-purple-600">
                {data.singleSessionRevenue.toLocaleString()} {t("common.currency.symbol")}
              </span>
            </div>
          </div>
          
          {/* Payment Status */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
              <Wallet className="w-3 h-3" />
              {t("common.status.paymentStatus")}:
            </p>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  {t("pages.dashboard.home.revenueTrends.paidAnnual")}:
                </span>
                <span className="text-sm font-semibold text-green-500">
                  {data.paidAmount.toLocaleString()} {t("common.currency.symbol")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-red-500" />
                  {t("pages.dashboard.home.revenueTrends.overdueAnnual")}:
                </span>
                <span className="text-sm font-semibold text-red-500">
                  {data.overdueAmount.toLocaleString()} {t("common.currency.symbol")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Clock className="w-3 h-3 text-yellow-500" />
                  {t("pages.dashboard.home.revenueTrends.pendingAnnual")}:
                </span>
                <span className="text-sm font-semibold text-yellow-500">
                  {data.pendingAmount?.toLocaleString() || 0} {t("common.currency.symbol")}
                </span>
              </div>
            </div>
            
            {/* Collection Rate */}
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Percent className="w-3 h-3" />
                  {t("pages.dashboard.home.revenueTrends.collectionRate")}:
                </span>
                <span className="text-sm font-semibold">
                  {data.collectionRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function RevenueTrendsChart({
  monthlyData = [],
  currentYear,
  onYearChange,
  onRefresh,
  isRefreshing = false,
  availableYears = [],
}: RevenueTrendsChartProps) {
  const t = useTypedTranslations();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [showLines, setShowLines] = useState({
    total: true,
    subscription: true,
    singleSession: true,
  });

  useEffect(() => {
    setSelectedYear(currentYear);
  }, [currentYear]);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    onYearChange?.(year);
  };

  const handleRefresh = () => {
    onRefresh?.();
  };

  const yearOptions = useMemo(() => {
    if (availableYears && availableYears.length > 0) {
      return availableYears;
    }

    const currentYearNow = new Date().getFullYear();
    const startYear = 2026;
    return Array.from(
      { length: Math.max(0, currentYearNow - startYear + 1) },
      (_, i) => startYear + i
    ).reverse();
  }, [availableYears]);

  const data = monthlyData;

  const annualStats = useMemo(() => {
    if (!data.length) {
      return {
        totalRevenue: 0,
        totalSubscription: 0,
        totalSingleSession: 0,
        
        totalPaid: 0,
        totalOverdue: 0,
        totalPending: 0,
        
        paidSubscription: 0,
        paidSingleSession: 0,
        overdueSubscription: 0,
        overdueSingleSession: 0,
        pendingSubscription: 0,
        pendingSingleSession: 0,
        
        collectionRate: 0,
        expectedRevenue: 0,
        collectedRevenue: 0,
        
        avgMonthlyRevenue: 0,
        avgMonthlySubscription: 0,
        avgMonthlySingleSession: 0,
        
        subscriptionPercentage: 0,
        singleSessionPercentage: 0,
        paidPercentage: 0,
        overduePercentage: 0,
        pendingPercentage: 0,
        
        revenueChange: 0,
        subscriptionChange: 0,
        singleSessionChange: 0,
      };
    }

    const totalRevenue = data.reduce((sum, item) => sum + item.totalRevenue, 0);
    const totalSubscription = data.reduce((sum, item) => sum + item.subscriptionRevenue, 0);
    const totalSingleSession = data.reduce((sum, item) => sum + item.singleSessionRevenue, 0);
    
    const totalPaid = data.reduce((sum, item) => sum + item.paidAmount, 0);
    const totalOverdue = data.reduce((sum, item) => sum + item.overdueAmount, 0);
    const totalPending = data.reduce((sum, item) => sum + (item.pendingAmount || 0), 0);
    
    const paidSubscription = Math.round(totalPaid * (totalSubscription / (totalSubscription + totalSingleSession)));
    const paidSingleSession = totalPaid - paidSubscription;
    const overdueSubscription = Math.round(totalOverdue * (totalSubscription / (totalSubscription + totalSingleSession)));
    const overdueSingleSession = totalOverdue - overdueSubscription;
    const pendingSubscription = Math.round(totalPending * (totalSubscription / (totalSubscription + totalSingleSession)));
    const pendingSingleSession = totalPending - pendingSubscription;
    
    const expectedRevenue = totalPaid + totalOverdue + totalPending;
    const collectionRate = expectedRevenue > 0 ? Math.round((totalPaid / expectedRevenue) * 100) : 0;
    const collectedRevenue = totalPaid;
    
    const activeMonths = data.filter(month => month.totalRevenue > 0).length || 1;
    const avgMonthlyRevenue = Math.round(totalRevenue / activeMonths);
    const avgMonthlySubscription = Math.round(totalSubscription / activeMonths);
    const avgMonthlySingleSession = Math.round(totalSingleSession / activeMonths);
    
    const subscriptionPercentage = totalRevenue > 0 ? Math.round((totalSubscription / totalRevenue) * 100) : 0;
    const singleSessionPercentage = totalRevenue > 0 ? Math.round((totalSingleSession / totalRevenue) * 100) : 0;
    const paidPercentage = expectedRevenue > 0 ? Math.round((totalPaid / expectedRevenue) * 100) : 0;
    const overduePercentage = expectedRevenue > 0 ? Math.round((totalOverdue / expectedRevenue) * 100) : 0;
    const pendingPercentage = expectedRevenue > 0 ? Math.round((totalPending / expectedRevenue) * 100) : 0;

    return {
      totalRevenue,
      totalSubscription,
      totalSingleSession,
      
      totalPaid,
      totalOverdue,
      totalPending,
      
      paidSubscription,
      paidSingleSession,
      overdueSubscription,
      overdueSingleSession,
      pendingSubscription,
      pendingSingleSession,
      
      collectionRate,
      expectedRevenue,
      collectedRevenue,
      
      avgMonthlyRevenue,
      avgMonthlySubscription,
      avgMonthlySingleSession,
      
      subscriptionPercentage,
      singleSessionPercentage,
      paidPercentage,
      overduePercentage,
      pendingPercentage,
      
      revenueChange: 0,
      subscriptionChange: 0,
      singleSessionChange: 0,
    };
  }, [data]);

  const monthlyStats = useMemo(() => {
    if (data.length < 2) return { revenueChange: 0 };

    const currentMonth = data[data.length - 1];
    const previousMonth = data[data.length - 2];

    let revenueChange = 0;
    if (previousMonth.totalRevenue > 0 && !isNaN(previousMonth.totalRevenue)) {
      const change = ((currentMonth.totalRevenue - previousMonth.totalRevenue) / previousMonth.totalRevenue) * 100;
      revenueChange = isNaN(change) ? 0 : Math.round(change);
    }

    return { revenueChange };
  }, [data]);

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

  const chartData = useMemo(() => {
    const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const dataMap = new Map<string, MonthlyRevenueData>();
    data.forEach(item => {
      dataMap.set(item.month, item);
    });

    return allMonths.map(month => {
      const existingData = dataMap.get(month);
      if (existingData) {
        return {
          ...existingData,
          month: translateMonth(month)
        };
      }

      return {
        month: translateMonth(month),
        totalRevenue: 0,
        subscriptionRevenue: 0,
        singleSessionRevenue: 0,
        paidAmount: 0,
        overdueAmount: 0,
        pendingAmount: 0,
        collectionRate: 0,
      };
    });
  }, [data, translateMonth]);

  const hasData = useMemo(() => {
    return data.some(item =>
      item.totalRevenue > 0 ||
      item.subscriptionRevenue > 0 ||
      item.singleSessionRevenue > 0
    );
  }, [data]);

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

          <div className="flex items-center gap-3">
            <Button
              isIconOnly
              color="primary"
              variant="flat"
              size="lg"
              onPress={handleRefresh}
              isLoading={isRefreshing}
              spinner={
                <RefreshCw className="animate-spin" size={14} />
              }
              radius="md"
            >
              <RefreshCcw size={14} />
            </Button>

            <Select
              classNames={{
                trigger: "bg-white dark:bg-zinc-900 shadow-sm w-30 cursor-pointer",
                label: "text-xs"
              }}
              selectedKeys={[selectedYear.toString()]}
              onSelectionChange={(keys) => {
                const year = Array.from(keys)[0] as string;
                handleYearChange(parseInt(year));
              }}
              size="sm"
              variant="flat"
              label={t("pages.dashboard.home.yearFilter.selectYear")}
            >
              {yearOptions.map((year) => (
                <SelectItem key={year.toString()}>
                  {year.toString()}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardBody>
        {/* COMPREHENSIVE STATS SECTION */}
        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Annual Total Revenue Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 p-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 rtl:text-right">
                    {t("pages.dashboard.home.revenueTrends.annualTotal")}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 rtl:text-right">
                    {annualStats.totalRevenue.toLocaleString()} {t("common.currency.symbol")}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500 rtl:text-right">
                      {selectedYear}
                    </span>
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <TrendUp className="w-3 h-3" />
                  {t("common.monthlyAverage")}: {annualStats.avgMonthlyRevenue.toLocaleString()}/{t("common.month")}
                </div>
                <div className="text-xs font-medium text-green-600 flex items-center gap-1">
                  <Percent className="w-3 h-3" />
                  {annualStats.collectionRate}% {t("pages.dashboard.home.revenueTrends.collected")}
                </div>
              </div>
            </div>

            {/* Annual Subscription Revenue Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 p-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 rtl:text-right">
                    {t("pages.dashboard.home.revenueTrends.subscriptionAnnual")}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 rtl:text-right">
                    {annualStats.totalSubscription.toLocaleString()} {t("common.currency.symbol")}
                  </p>
                  <div className="flex items-center gap-1 mt-2 rtl:text-right">
                    <PieChart className="w-3 h-3 text-blue-500" />
                    <span className="text-xs text-gray-500 rtl:text-right">
                      {annualStats.subscriptionPercentage}% {t("pages.dashboard.home.revenueTrends.ofTotal")}
                    </span>
                  </div>
                </div>
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                <div className="text-green-600 font-medium flex items-center gap-1" title={t("common.status.paid")}>
                  <CheckCircle className="w-3 h-3" />
                  {annualStats.paidSubscription.toLocaleString()}
                </div>
                <div className="text-yellow-600 font-medium flex items-center gap-1" title={t("common.status.pending")}>
                  <Clock className="w-3 h-3" />
                  {annualStats.pendingSubscription.toLocaleString()}
                </div>
                <div className="text-red-600 font-medium flex items-center gap-1" title={t("common.status.overdue")}>
                  <AlertTriangle className="w-3 h-3" />
                  {annualStats.overdueSubscription.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Annual Single Session Revenue Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 p-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 rtl:text-right">
                    {t("pages.dashboard.home.revenueTrends.singleSessionAnnual")}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 rtl:text-right">
                    {annualStats.totalSingleSession.toLocaleString()} {t("common.currency.symbol")}
                  </p>
                  <div className="flex items-center gap-1 mt-2 rtl:text-right">
                    <Ticket className="w-3 h-3 text-purple-500" />
                    <span className="text-xs text-gray-500 rtl:text-right">
                      {annualStats.singleSessionPercentage}% {t("pages.dashboard.home.revenueTrends.ofTotal")}
                    </span>
                  </div>
                </div>
                <Ticket className="w-8 h-8 text-purple-600" />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                <div className="text-green-600 font-medium flex items-center gap-1" title={t("common.status.paid")}>
                  <CheckCircle className="w-3 h-3" />
                  {annualStats.paidSingleSession.toLocaleString()}
                </div>
                <div className="text-yellow-600 font-medium flex items-center gap-1" title={t("common.status.pending")}>
                  <Clock className="w-3 h-3" />
                  {annualStats.pendingSingleSession.toLocaleString()}
                </div>
                <div className="text-red-600 font-medium flex items-center gap-1" title={t("common.status.overdue")}>
                  <AlertTriangle className="w-3 h-3" />
                  {annualStats.overdueSingleSession.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Collection Summary Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10 p-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 rtl:text-right">
                    {t("pages.dashboard.home.revenueTrends.collectionSummary")}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 rtl:text-right">
                    {annualStats.collectionRate}%
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Target className="w-3 h-3 text-indigo-500" />
                    <span className="text-xs text-gray-500 rtl:text-right">
                      {t("pages.dashboard.home.revenueTrends.collectionRate")}
                    </span>
                  </div>
                </div>
                <BarChart3 className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                <div className="text-green-600 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {annualStats.paidPercentage}%
                </div>
                <div className="text-yellow-600 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {annualStats.pendingPercentage}%
                </div>
                <div className="text-red-600 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {annualStats.overduePercentage}%
                </div>
              </div>
            </div>
          </div>

          {/* DETAILED AMOUNT BREAKDOWN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Paid Amounts Breakdown */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 p-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 rtl:text-right flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    {t("pages.dashboard.home.revenueTrends.totalPaidAmount")}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 rtl:text-right">
                    {annualStats.totalPaid.toLocaleString()} {t("common.currency.symbol")}
                  </p>
                </div>
                <CheckCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">{t("pages.dashboard.home.revenueTrends.subscription")}:</span>
                  <span className="font-medium text-emerald-600">{annualStats.paidSubscription.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">{t("pages.dashboard.home.revenueTrends.singleSession")}:</span>
                  <span className="font-medium text-emerald-600">{annualStats.paidSingleSession.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Overdue Amounts Breakdown */}
            <div className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-900/10 p-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 rtl:text-right flex items-center gap-2">
                    <AlertOctagon className="w-3 h-3 text-rose-500" />
                    {t("pages.dashboard.home.revenueTrends.totalOverdueAmount")}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 rtl:text-right">
                    {annualStats.totalOverdue.toLocaleString()} {t("common.currency.symbol")}
                  </p>
                </div>
                <AlertOctagon className="w-8 h-8 text-rose-600" />
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">{t("pages.dashboard.home.revenueTrends.subscription")}:</span>
                  <span className="font-medium text-rose-600">{annualStats.overdueSubscription.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">{t("pages.dashboard.home.revenueTrends.singleSession")}:</span>
                  <span className="font-medium text-rose-600">{annualStats.overdueSingleSession.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Pending Amounts Breakdown */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 p-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 rtl:text-right flex items-center gap-2">
                    <Hourglass className="w-3 h-3 text-amber-500" />
                    {t("pages.dashboard.home.revenueTrends.totalPendingAmount")}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 rtl:text-right">
                    {annualStats.totalPending.toLocaleString()} {t("common.currency.symbol")}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">{t("pages.dashboard.home.revenueTrends.subscription")}:</span>
                  <span className="font-medium text-amber-600">{annualStats.pendingSubscription.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">{t("pages.dashboard.home.revenueTrends.singleSession")}:</span>
                  <span className="font-medium text-amber-600">{annualStats.pendingSingleSession.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Expected Revenue */}
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-900/10 p-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 rtl:text-right flex items-center gap-2">
                    <Target className="w-3 h-3 text-cyan-500" />
                    {t("pages.dashboard.home.revenueTrends.expectedRevenue")}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 rtl:text-right">
                    {annualStats.expectedRevenue.toLocaleString()} {t("common.currency.symbol")}
                  </p>
                </div>
                <TrendUp className="w-8 h-8 text-cyan-600" />
              </div>
              <div className="mt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">{t("pages.dashboard.home.revenueTrends.collected")}:</span>
                  <span className="font-medium text-cyan-600">{annualStats.collectedRevenue.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-cyan-600 h-2 rounded-full" 
                    style={{ width: `${annualStats.collectionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="h-80">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("pages.dashboard.home.revenueTrends.monthlyBreakdown")}
            </p>
            {data.length >= 2 && monthlyStats.revenueChange !== 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {t("pages.dashboard.home.revenueTrends.monthlyChange")}:
                  <span className={`ml-1 font-medium ${monthlyStats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {monthlyStats.revenueChange >= 0 ? '+' : ''}{monthlyStats.revenueChange}%
                  </span>
                </span>
              </div>
            )}
          </div>

          {!hasData ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
              <Calendar className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">
                {t("pages.dashboard.home.revenueTrends.noData") || "No revenue data available"}
              </p>
              <p className="text-xs mt-1">
                {selectedYear}
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
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
                  tickFormatter={(value) => {
                    if (value >= 1000) {
                      return `${(value / 1000).toFixed(0)}K`;
                    }
                    return value.toString();
                  }}
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
          )}
        </div>

        {/* Legend Toggles */}
        {hasData && (
          <div className="flex flex-wrap justify-center gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowLines(prev => ({ ...prev, total: !prev.total }))}
              className={`flex items-center gap-2 px-3 py-1 rounded-full ${showLines.total ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}
            >
              <div className={`w-3 h-3 rounded-full ${showLines.total ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-xs">
                {t("pages.dashboard.home.revenueTrends.monthlyRevenue")}
              </span>
            </button>

            <button
              onClick={() => setShowLines(prev => ({ ...prev, subscription: !prev.subscription }))}
              className={`flex items-center gap-2 px-3 py-1 rounded-full ${showLines.subscription ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}
            >
              <div className={`w-3 h-3 rounded-full ${showLines.subscription ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
              <span className="text-xs">
                {t("pages.dashboard.home.revenueTrends.monthlySubscription")}
              </span>
            </button>

            <button
              onClick={() => setShowLines(prev => ({ ...prev, singleSession: !prev.singleSession }))}
              className={`flex items-center gap-2 px-3 py-1 rounded-full ${showLines.singleSession ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}
            >
              <div className={`w-3 h-3 rounded-full ${showLines.singleSession ? 'bg-purple-500' : 'bg-gray-400'}`}></div>
              <span className="text-xs">
                {t("pages.dashboard.home.revenueTrends.monthlySingleSession")}
              </span>
            </button>
          </div>
        )}
      </CardBody>
    </Card>
  );
}