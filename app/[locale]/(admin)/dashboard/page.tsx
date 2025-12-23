"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Skeleton } from "@heroui/skeleton";
import { Badge } from "@heroui/badge";
import { Tooltip } from "@heroui/tooltip";
import { Select, SelectItem } from "@heroui/select";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";

// CORRECTED ICON IMPORTS - Use only existing icons from hi2
import {
  HiUsers,
  HiCalendar,
  HiArrowTrendingUp,
  HiArrowTrendingDown,
  HiArrowUp,
  HiHome,
  HiUser,
  HiArrowPath,
  HiExclamationCircle,
  HiTrophy,
} from "react-icons/hi2";

// Add lucide-react for missing icons
import { Filter, Calendar } from "lucide-react";

import {
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";

// Types based on your Prisma schema
interface DashboardStats {
  totalUsers: number;
  totalClubs: number;
  totalReservations: number;
  pendingReservations: number;
  totalRevenue: number;
  monthlyRevenue: number;
  activeStadiums: number;
  activeUsers: number;
  totalPayments?: number;
  pendingPayments?: number;
}

interface RecentReservation {
  id: string;
  startDateTime: string;
  user: {
    fullNameFr: string;
    fullNameAr: string;
    email: string;
  };
  stadium: {
    nameFr: string;
    nameAr: string;
  };
  status: string;
  sessionPrice: number;
  paymentType: string;
}

interface RecentUser {
  id: string;
  fullNameFr: string;
  fullNameAr: string;
  email: string;
  role: string;
  approved: boolean;
  createdAt: string;
}

interface RevenueData {
  month: string;
  revenue: number;
  bookings: number;
}

interface ChartData {
  name: string;
  value: number;
}

interface StatusData {
  status: string;
  count: number;
}

interface RoleData {
  role: string;
  count: number;
}

interface TopStadium {
  name: string;
  reservations: number;
}

interface TopClub {
  name: string;
  reservations: number;
}

// Extended type for Pie chart with percent
interface PieChartData extends ChartData {
  percent?: number;
  fill?: string;
  [key: string]: any;
}

// Custom Tooltip Props for Recharts
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  formatter?: (value: number, name: string) => [string, string];
}

interface Filters {
  timeRange: string;
  year: string | null;
  startDate: string;
  endDate: string;
}

const Dashboard = () => {
  const locale = useLocale();
  const t = useTranslations("Pages.Dashboard.Home");
  const isRTL = locale === "ar";

  const [loading, setLoading] = useState(true);
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(
    null
  );
  const [recentReservations, setRecentReservations] = useState<
    RecentReservation[]
  >([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [sportDistribution, setSportDistribution] = useState<PieChartData[]>(
    []
  );
  const [reservationsByStatus, setReservationsByStatus] = useState<
    StatusData[]
  >([]);
  const [usersByRole, setUsersByRole] = useState<RoleData[]>([]);
  const [topStadiums, setTopStadiums] = useState<TopStadium[]>([]);
  const [topClubs, setTopClubs] = useState<TopClub[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    timeRange: "year",
    year: new Date().getFullYear().toString(),
    startDate: "",
    endDate: "",
  });

  // Build query string based on filters
  const buildQueryString = () => {
    const params = new URLSearchParams();

    if (filters.timeRange) params.set("timeRange", filters.timeRange);
    if (filters.year) params.set("year", filters.year);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);

    return params.toString();
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryString = buildQueryString();
      const response = await fetch(`/api/dashboard/stats?${queryString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch dashboard data");
      }

      const data = await response.json();

      // Transform data to match component types
      setDashboardData(data.stats);
      setRecentReservations(data.recentReservations || []);
      setRecentUsers(data.recentUsers || []);
      
      // Transform revenue data based on time range
      if (data.revenueData) {
        const transformedData = transformRevenueData(data.revenueData, filters.timeRange, locale);
        setRevenueData(transformedData);
      } else {
        setRevenueData([]);
      }
      
      setSportDistribution(data.sportDistribution || []);
      setReservationsByStatus(data.reservationsByStatus || []);
      setUsersByRole(data.usersByRole || []);
      setTopStadiums(data.topStadiums || []);
      setTopClubs(data.topClubs || []);
      setAvailableYears(data.availableYears || []);

      // Update filters from API response (keep year as string or null)
      if (data.filters) {
        setFilters((prev) => ({
          ...prev,
          timeRange: data.filters.timeRange || prev.timeRange,
          year: data.filters.year || prev.year,
          startDate: data.filters.startDate || prev.startDate,
          endDate: data.filters.endDate || prev.endDate,
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Transform revenue data based on time range
  const transformRevenueData = (data: RevenueData[], timeRange: string, locale: string): RevenueData[] => {
    if (!data || data.length === 0) return [];
    
    // If data is already in the right format for the current timeRange, return as is
    // Otherwise, we need to transform it based on the API response structure
    // For now, we'll assume the API returns appropriate data structure
    // but we'll add labels based on timeRange
    
    return data.map((item, index) => {
      // Add time-based labels if needed
      if (timeRange === 'day') {
        // For day view, show hours
        const hour = index * 2; // Assuming 12 data points for 24 hours
        return {
          ...item,
          month: `${hour}:00` // Format as hour:00
        };
      } else if (timeRange === 'week') {
        // For week view, show days of week
        const days = locale === 'ar' 
          ? ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
          : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return {
          ...item,
          month: days[index % 7] || item.month
        };
      }
      
      // For month or year, use the month names from API
      return item;
    });
  };

  // Get X-axis label based on time range
  const getXAxisLabel = () => {
    switch (filters.timeRange) {
      case 'day':
        return t('charts.hours');
      case 'week':
        return t('charts.days');
      case 'month':
        return t('charts.weeks');
      case 'year':
        return t('charts.months');
      default:
        return t('charts.months');
    }
  };

  // Get chart subtitle based on filters
  const getChartSubtitle = () => {
    if (filters.year) {
      return `${t('filters.year')}: ${filters.year}`;
    }
    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate).toLocaleDateString(locale, { 
        month: 'short', 
        day: 'numeric' 
      });
      const end = new Date(filters.endDate).toLocaleDateString(locale, { 
        month: 'short', 
        day: 'numeric' 
      });
      return `${start} - ${end}`;
    }
    return t(`filters.${filters.timeRange}`);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filters.timeRange, filters.year, filters.startDate, filters.endDate]);

  // Apply year filter
  const handleYearChange = (year: string | null) => {
    setFilters((prev) => ({
      ...prev,
      year: year || null,
      timeRange: year ? "year" : prev.timeRange,
      startDate: "",
      endDate: "",
    }));
  };

  // Apply custom date range
  const handleCustomDateRange = () => {
    if (customStartDate && customEndDate) {
      setFilters((prev) => ({
        ...prev,
        timeRange: "custom",
        year: null,
        startDate: customStartDate,
        endDate: customEndDate,
      }));
      setShowDateRangeModal(false);
    }
  };

  // Reset to default filters
  const handleResetFilters = () => {
    setFilters({
      timeRange: "year",
      year: new Date().getFullYear().toString(),
      startDate: "",
      endDate: "",
    });
    setCustomStartDate("");
    setCustomEndDate("");
  };

  // Refresh data
  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === "ar" ? "ar-MA" : "fr-FR", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      locale === "ar" ? "ar-MA" : "fr-FR",
      {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return t("time.justNow");
    } else if (diffInHours < 24) {
      return t("time.hoursAgo", { hours: diffInHours });
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return t("time.daysAgo", { days: diffInDays });
    }
  };

  // Get active filter label
  const getActiveFilterLabel = () => {
    if (filters.year) {
      return `${t("filters.year")}: ${filters.year}`;
    }
    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate).toLocaleDateString(locale);
      const end = new Date(filters.endDate).toLocaleDateString(locale);
      return `${start} - ${end}`;
    }
    return t(`filters.${filters.timeRange}`);
  };

  // Calculate percentage change
  const calculatePercentageChange = (
    current: number,
    previous: number
  ): string => {
    if (previous === 0) return "+100%";
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  // Stats cards data
  const statsCards = dashboardData
    ? [
        {
          id: 1,
          title: t("stats.totalUsers"),
          value: dashboardData.totalUsers.toLocaleString(),
          change: calculatePercentageChange(
            dashboardData.activeUsers,
            dashboardData.totalUsers - dashboardData.activeUsers
          ),
          isPositive: true,
          icon: HiUsers,
          color: "bg-blue-500",
          chartColor: "#3b82f6",
          details: t("stats.activeUsers", { count: dashboardData.activeUsers }),
        },
        {
          id: 2,
          title: t("stats.totalReservations"),
          value: dashboardData.totalReservations.toLocaleString(),
          change:
            dashboardData.pendingReservations > 0
              ? `${dashboardData.pendingReservations} ${t("stats.pending")}`
              : t("stats.allApproved"),
          isPositive: dashboardData.pendingReservations === 0,
          icon: HiCalendar,
          color: "bg-green-500",
          chartColor: "#10b981",
          details: t("stats.pendingApproval", {
            count: dashboardData.pendingReservations,
          }),
        },
        {
          id: 3,
          title: t("stats.totalRevenue"),
          value: formatCurrency(dashboardData.totalRevenue),
          change: calculatePercentageChange(
            dashboardData.monthlyRevenue,
            dashboardData.totalRevenue - dashboardData.monthlyRevenue
          ),
          isPositive: dashboardData.monthlyRevenue > 0,
          icon: HiUser,
          color: "bg-amber-500",
          chartColor: "#f59e0b",
          details: t("stats.monthlyRevenue", {
            amount: formatCurrency(dashboardData.monthlyRevenue),
          }),
        },
        {
          id: 4,
          title: t("stats.activeStadiums"),
          value: dashboardData.activeStadiums.toString(),
          change:
            dashboardData.totalClubs > 0
              ? `${dashboardData.totalClubs} ${t("stats.clubs")}`
              : "0",
          isPositive: true,
          icon: HiHome,
          color: "bg-purple-500",
          chartColor: "#8b5cf6",
          details: t("stats.availability", { rate: "78%" }),
        },
      ]
    : [];

  // Colors for charts
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];
  const STATUS_COLORS = {
    APPROVED: "#10b981",
    PENDING: "#f59e0b",
    DECLINED: "#ef4444",
    CANCELLED: "#6b7280",
    PAID: "#3b82f6",
    UNPAID: "#8b5cf6",
  };

  // Custom Tooltip for Revenue Chart
  const RevenueTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="font-medium text-gray-900 dark:text-white mb-2">
            {filters.timeRange === 'day' ? `${t('charts.time')}: ${label}` : label}
          </p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">{t("charts.revenue")}: </span>
              <span className="text-amber-600 dark:text-amber-400">
                {formatCurrency(payload[0].value as number)}
              </span>
            </p>
            <p className="text-sm">
              <span className="font-medium">{t("charts.bookings")}: </span>
              <span className="text-blue-600 dark:text-blue-400">
                {payload[1]?.value}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Pie Chart
  const PieTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="font-medium text-gray-900 dark:text-white">
            {payload[0].payload.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("charts.reservations")}: {payload[0].value?.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {payload[0].payload.percent &&
              `${(payload[0].payload.percent * 100).toFixed(1)}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Format Pie chart label
  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent > 0.05) {
      // Only show label if more than 5%
      return (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          fontSize={12}
          fontWeight="medium"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    }
    return null;
  };

  // Render loading state
  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-10 w-48 rounded-lg" />
            <Skeleton className="h-4 w-64 mt-2 rounded-lg" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card
              key={i}
              className="border border-slate-200 dark:border-slate-700"
            >
              <CardBody className="space-y-4">
                <Skeleton className="h-6 w-32 rounded-lg" />
                <Skeleton className="h-12 w-24 rounded-lg" />
                <Skeleton className="h-4 w-48 rounded-lg" />
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-slate-200 dark:border-slate-700">
            <CardBody>
              <Skeleton className="h-64 w-full rounded-lg" />
            </CardBody>
          </Card>
          <Card className="border border-slate-200 dark:border-slate-700">
            <CardBody>
              <Skeleton className="h-64 w-full rounded-lg" />
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="text-center space-y-4">
          <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/20 inline-flex">
            <HiExclamationCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t("error.title")}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">{error}</p>
          <Button
            color="primary"
            variant="flat"
            onPress={handleRefresh}
            startContent={<HiArrowPath className="w-4 h-4" />}
          >
            {t("actions.retry")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`space-y-6 p-4 md:p-6 ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t("subtitle")} •{" "}
            {new Date().toLocaleDateString(
              locale === "ar" ? "ar-MA" : "fr-FR",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Active Filter Display */}
          <Chip color="primary" variant="flat" size="sm">
            <Filter className="w-3 h-3 mr-1" />
            {getActiveFilterLabel()}
          </Chip>

          {/* Time Range Selector */}
          <Select
            label={t("filters.timeRange")}
            selectedKeys={new Set([filters.timeRange])}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              if (selected) {
                setFilters((prev) => ({
                  ...prev,
                  timeRange: selected,
                  year: selected === "year" ? prev.year : null,
                  startDate: "",
                  endDate: "",
                }));
              }
            }}
            className="min-w-32"
            size="sm"
          >
            <SelectItem key="day">{t("filters.today")}</SelectItem>
            <SelectItem key="week">{t("filters.thisWeek")}</SelectItem>
            <SelectItem key="month">{t("filters.thisMonth")}</SelectItem>
            <SelectItem key="year">{t("filters.thisYear")}</SelectItem>
            <SelectItem key="all">{t("filters.allTime")}</SelectItem>
          </Select>

          {/* Year Selector */}
          {filters.timeRange === "year" && (
            <Select
              label={t("filters.selectYear")}
              selectedKeys={filters.year ? new Set([filters.year]) : new Set()}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                handleYearChange(selected || null);
              }}
              className="min-w-32"
              size="sm"
            >
              <SelectItem key="">{t("filters.currentYear")}</SelectItem>
              {availableYears.map((year) => (
                <SelectItem key={year.toString()}>{year.toString()}</SelectItem>
              ))}
            </Select>
          )}

          {/* Custom Date Range Button */}
          <Button
            size="sm"
            variant="flat"
            onPress={() => setShowDateRangeModal(true)}
            startContent={<Calendar className="w-4 h-4" />}
          >
            {t("filters.customRange")}
          </Button>

          {/* Reset Filters Button */}
          {(filters.year !== new Date().getFullYear().toString() ||
            filters.startDate ||
            filters.timeRange !== "year") && (
            <Button size="sm" variant="light" onPress={handleResetFilters}>
              {t("filters.reset")}
            </Button>
          )}

          {/* Refresh Button */}
          <Button
            isIconOnly
            variant="flat"
            onPress={handleRefresh}
            aria-label={t("actions.refresh")}
          >
            <HiArrowPath className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.id}
              className="border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200"
            >
              <CardBody className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </h3>
                      <Chip
                        size="sm"
                        color={stat.isPositive ? "success" : "danger"}
                        variant="flat"
                        startContent={
                          stat.isPositive ? (
                            <HiArrowTrendingUp className="w-3 h-3" />
                          ) : (
                            <HiArrowTrendingDown className="w-3 h-3" />
                          )
                        }
                      >
                        {stat.change}
                      </Chip>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {stat.details}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                    <Icon
                      className={`w-6 h-6 ${stat.color.replace(
                        "bg-",
                        "text-"
                      )}`}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-0">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("charts.revenueTrend")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getChartSubtitle()} • {getXAxisLabel()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Chip color="success" variant="flat" size="sm">
                <HiArrowUp className="w-3 h-3 mr-1" />
                {t("charts.growth")}:{" "}
                {dashboardData && dashboardData.monthlyRevenue > 0
                  ? calculatePercentageChange(
                      dashboardData.monthlyRevenue,
                      dashboardData.totalRevenue - dashboardData.monthlyRevenue
                    )
                  : "0%"}
              </Chip>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="month"
                    stroke="#9ca3af"
                    tick={{ fill: "#6b7280" }}
                    label={{ 
                      value: getXAxisLabel(), 
                      position: 'insideBottom', 
                      offset: -5,
                      style: { fill: '#6b7280', fontSize: 12 }
                    }}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    tick={{ fill: "#6b7280" }}
                    tickFormatter={(value) => `د.م ${value}`}
                  />
                  <RechartsTooltip content={<RevenueTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.2}
                    strokeWidth={2}
                    name={t("charts.revenue")}
                  />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ stroke: "#3b82f6", strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5 }}
                    name={t("charts.bookings")}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Sport Distribution */}
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-0">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("charts.sportDistribution")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("charts.byReservation")}
              </p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sportDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    innerRadius={40}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                  >
                    {sportDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<PieTooltip />} />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{ paddingLeft: "20px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Additional Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reservations by Status */}
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("charts.reservationsByStatus")}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("charts.statusBreakdown")}
            </p>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {reservationsByStatus.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          STATUS_COLORS[
                            item.status as keyof typeof STATUS_COLORS
                          ] || "#6b7280",
                      }}
                    />
                    <span className="text-sm font-medium">{item.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{item.count}</span>
                    <span className="text-xs text-gray-500">
                      (
                      {(
                        (item.count / (dashboardData?.totalReservations || 1)) *
                        100
                      ).toFixed(1)}
                      %)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Top Stadiums */}
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("charts.topStadiums")}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("charts.byReservations")}
            </p>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {topStadiums.map((stadium, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <HiHome className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium truncate">
                      {stadium.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {stadium.reservations}
                    </span>
                    <span className="text-xs text-gray-500">
                      {t("charts.reservations")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Top Clubs */}
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("charts.topClubs")}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("charts.mostActive")}
            </p>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {topClubs.map((club, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <HiTrophy className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium truncate">
                      {club.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {club.reservations}
                    </span>
                    <span className="text-xs text-gray-500">
                      {t("charts.reservations")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reservations */}
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardHeader className="flex items-center justify-between pb-0">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("tables.recentReservations")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("tables.last24Hours")}
              </p>
            </div>
            <Button
              variant="light"
              size="sm"
              onPress={() => (window.location.href = "/dashboard/reservations")}
            >
              {t("actions.viewAll")}
            </Button>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <Table
                aria-label="Recent reservations table"
                removeWrapper
                classNames={{
                  base: "max-h-[400px] overflow-y-auto",
                  th: "bg-transparent text-gray-600 dark:text-gray-400",
                  td: "text-gray-900 dark:text-white",
                }}
              >
                <TableHeader>
                  <TableColumn>{t("tables.user")}</TableColumn>
                  <TableColumn>{t("tables.stadium")}</TableColumn>
                  <TableColumn>{t("tables.time")}</TableColumn>
                  <TableColumn>{t("tables.status")}</TableColumn>
                  <TableColumn>{t("tables.amount")}</TableColumn>
                </TableHeader>
                <TableBody>
                  {recentReservations.slice(0, 5).map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar size="sm" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {isRTL
                                ? reservation.user.fullNameAr
                                : reservation.user.fullNameFr}
                            </span>
                            <span className="text-xs text-gray-500">
                              {reservation.user.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {isRTL
                          ? reservation.stadium.nameAr
                          : reservation.stadium.nameFr}
                      </TableCell>
                      <TableCell>
                        <Tooltip
                          content={formatDate(reservation.startDateTime)}
                        >
                          <span className="cursor-help">
                            {formatRelativeTime(reservation.startDateTime)}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Badge
                          color={
                            reservation.status === "APPROVED"
                              ? "success"
                              : reservation.status === "PENDING"
                              ? "warning"
                              : reservation.status === "DECLINED"
                              ? "danger"
                              : "default"
                          }
                          variant="flat"
                        >
                          {reservation.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(reservation.sessionPrice)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardBody>
        </Card>

        {/* Recent Users */}
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardHeader className="flex items-center justify-between pb-0">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("tables.recentUsers")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("tables.newRegistrations")}
              </p>
            </div>
            <Button
              variant="light"
              size="sm"
              onPress={() => (window.location.href = "/dashboard/users")}
            >
              {t("actions.viewAll")}
            </Button>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <Table
                aria-label="Recent users table"
                removeWrapper
                classNames={{
                  base: "max-h-[400px] overflow-y-auto",
                  th: "bg-transparent text-gray-600 dark:text-gray-400",
                  td: "text-gray-900 dark:text-white",
                }}
              >
                <TableHeader>
                  <TableColumn>{t("tables.user")}</TableColumn>
                  <TableColumn>{t("tables.email")}</TableColumn>
                  <TableColumn>{t("tables.role")}</TableColumn>
                  <TableColumn>{t("tables.status")}</TableColumn>
                  <TableColumn>{t("tables.joined")}</TableColumn>
                </TableHeader>
                <TableBody>
                  {recentUsers.slice(0, 5).map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar size="sm" />
                          <span>
                            {isRTL ? user.fullNameAr : user.fullNameFr}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          color={
                            user.role === "ADMIN"
                              ? "danger"
                              : user.role === "CLUB"
                              ? "success"
                              : "default"
                          }
                          variant="flat"
                        >
                          {user.role}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Badge
                          color={user.approved ? "success" : "warning"}
                          variant="flat"
                        >
                          {user.approved
                            ? t("status.approved")
                            : t("status.pending")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatRelativeTime(user.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Custom Date Range Modal */}
      <Modal
        isOpen={showDateRangeModal}
        onClose={() => setShowDateRangeModal(false)}
        placement="center"
        className="z-99999"
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-lg font-semibold">
              {t("filters.customDateRange")}
            </h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("filters.startDate")}
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("filters.endDate")}
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={() => setShowDateRangeModal(false)}
            >
              {t("actions.cancel")}
            </Button>
            <Button
              color="primary"
              onPress={handleCustomDateRange}
              isDisabled={!customStartDate || !customEndDate}
            >
              {t("actions.apply")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Dashboard;