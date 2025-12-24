"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";

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
  HiCurrencyDollar,
  HiBuildingStorefront,
} from "react-icons/hi2";

// Add lucide-react for missing icons
import {
  Filter,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Building,
} from "lucide-react";

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
import { FaFutbol } from "react-icons/fa";
import { Link } from "@/i18n/navigation";

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
}

const Dashboard = () => {
  const locale = useLocale();
  const t = useTranslations("Pages.Dashboard.Home");
  const isRTL = locale === "ar";

  const [loading, setLoading] = useState(true);
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
  });

  // Build query string based on filters
  const buildQueryString = () => {
    const params = new URLSearchParams();

    if (filters.timeRange) params.set("timeRange", filters.timeRange);
    if (filters.year) params.set("year", filters.year);

    return params.toString();
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryString = buildQueryString();
      const response = await fetch(`/api/dashboard/home?${queryString}`, {
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
        const transformedData = transformRevenueData(
          data.revenueData,
          filters.timeRange,
          locale
        );
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
  const transformRevenueData = (
    data: RevenueData[],
    timeRange: string,
    locale: string
  ): RevenueData[] => {
    if (!data || data.length === 0) return [];

    return data.map((item, index) => {
      // Add time-based labels if needed
      if (timeRange === "day") {
        // For day view, show hours
        const hour = index * 2; // Assuming 12 data points for 24 hours
        return {
          ...item,
          month: `${hour}:00`, // Format as hour:00
        };
      } else if (timeRange === "week") {
        // For week view, show days of week
        const days =
          locale === "ar"
            ? [
                "الأحد",
                "الإثنين",
                "الثلاثاء",
                "الأربعاء",
                "الخميس",
                "الجمعة",
                "السبت",
              ]
            : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return {
          ...item,
          month: days[index % 7] || item.month,
        };
      }

      // For month or year, use the month names from API
      return item;
    });
  };

  // Get X-axis label based on time range
  const getXAxisLabel = () => {
    try {
      switch (filters.timeRange) {
        case "day":
          return t("charts.hours", { defaultValue: "Hours" });
        case "week":
          return t("charts.days", { defaultValue: "Days" });
        case "month":
          return t("charts.weeks", { defaultValue: "Weeks" });
        case "year":
          return t("charts.months", { defaultValue: "Months" });
        default:
          return t("charts.months", { defaultValue: "Months" });
      }
    } catch (error) {
      // Fallback to English labels if translation is missing
      switch (filters.timeRange) {
        case "day":
          return "Hours";
        case "week":
          return "Days";
        case "month":
          return "Weeks";
        case "year":
          return "Months";
        default:
          return "Months";
      }
    }
  };

  // Get chart subtitle based on filters
  const getChartSubtitle = () => {
    if (filters.year) {
      return `${t("filters.year")}: ${filters.year}`;
    }
    return t(`filters.${filters.timeRange}`);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filters.timeRange, filters.year]);

  // Apply year filter
  const handleYearChange = (year: string | null) => {
    setFilters((prev) => ({
      ...prev,
      year: year || null,
      timeRange: year ? "year" : prev.timeRange,
    }));
  };

  // Reset to default filters
  const handleResetFilters = () => {
    setFilters({
      timeRange: "year",
      year: new Date().getFullYear().toString(),
    });
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

 
  // Stats cards data with enhanced design
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
          icon: Users,
          color: " from-primary-400  to-primary-200 ",
          details: t("stats.activeUsers", { count: dashboardData.activeUsers }),
          trendIcon: HiArrowTrendingUp,
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
          icon: Calendar,
          color:"from-secondary-400  to-secondary-200  ",

          details: t("stats.pendingApproval", {
            count: dashboardData.pendingReservations,
          }),
          trendIcon:
            dashboardData.pendingReservations === 0
              ? HiArrowTrendingUp
              : HiArrowTrendingDown,
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
          icon: DollarSign,
          color: "from-success-400  to-success-200   ",
          details: t("stats.monthlyRevenue", {
            amount: formatCurrency(dashboardData.monthlyRevenue),
          }),
          trendIcon:
            dashboardData.monthlyRevenue > 0
              ? HiArrowTrendingUp
              : HiArrowTrendingDown,
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
          icon: Building,
          color:"from-warning-400 to-warning-200  ",
          details: t("stats.availability", { rate: "78%" }),
          trendIcon: HiArrowTrendingUp,
        },
      ]
    : [];

  // Colors for charts
  const COLORS = [
    "#3b82f6", // Primary
    "#10b981", // Success
    "#f59e0b", // Warning
    "#8b5cf6", // Secondary
    "#ef4444", // Danger
    "#6b7280", // Default
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
        <div className="bg-white  dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white mb-2">
            {filters.timeRange === "day"
              ? `${t("charts.time")}: ${label}`
              : label}
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
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
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

  // Custom Badge Component
  const Badge = ({
    children,
    color = "default",
    className = "",
    variant = "flat",
  }: {
    children: React.ReactNode;
    color?: "primary" | "success" | "warning" | "danger" | "default";
    className?: string;
    variant?: "flat" | "solid";
  }) => {
    const colorClasses = {
      primary:
        variant === "solid"
          ? "bg-blue-600 text-white"
          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      success:
        variant === "solid"
          ? "bg-green-600 text-white"
          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      warning:
        variant === "solid"
          ? "bg-amber-600 text-white"
          : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
      danger:
        variant === "solid"
          ? "bg-red-600 text-white"
          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      default:
        variant === "solid"
          ? "bg-gray-600 text-white"
          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${colorClasses[color]} ${className}`}
      >
        {children}
      </span>
    );
  };

  // Custom Chip Component
  const Chip = ({
    children,
    color = "default",
    size = "md",
    startContent,
    className = "",
  }: {
    children: React.ReactNode;
    color?: "primary" | "success" | "warning" | "danger" | "default";
    size?: "sm" | "md" | "lg";
    startContent?: React.ReactNode;
    className?: string;
  }) => {
    const sizeClasses = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-3 py-1 text-sm",
      lg: "px-4 py-2 text-base",
    };

    const colorClasses = {
      primary:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      success:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      warning:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
      danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    };

    return (
      <div
        className={`inline-flex items-center gap-1 rounded-full ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      >
        {startContent && <span>{startContent}</span>}
        <span>{children}</span>
      </div>
    );
  };

  // Render loading state
  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            <div className="h-4 w-64 mt-2 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="border border-gray-200 dark:border-gray-700 rounded-xl p-6"
            >
              <div className="space-y-4">
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                <div className="h-12 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          </div>
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
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <HiArrowPath className="w-4 h-4" />
            {t("actions.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`space-y-6 p-4 md:p-6 ${isRTL ? "rtl" : "ltr"} `}
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
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {new Date().toLocaleDateString(
                locale === "ar" ? "ar-MA" : "fr-FR",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Active Filter Display */}
          <Chip
            color="primary"
            startContent={<Filter className="w-3 h-3 mr-1" />}
          >
            {getActiveFilterLabel()}
          </Chip>

          {/* Time Range Selector */}
          <select
            value={filters.timeRange}
            onChange={(e) => {
              const selected = e.target.value;
              setFilters((prev) => ({
                ...prev,
                timeRange: selected,
                year: selected === "year" ? prev.year : null,
              }));
            }}
            className="min-w-32 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          >
            <option value="day">{t("filters.today")}</option>
            <option value="week">{t("filters.thisWeek")}</option>
            <option value="month">{t("filters.thisMonth")}</option>
            <option value="year">{t("filters.thisYear")}</option>
          </select>

          {/* Year Selector */}
          {filters.timeRange === "year" && (
            <select
              value={filters.year || ""}
              onChange={(e) => {
                const selected = e.target.value;
                handleYearChange(selected || null);
              }}
              className="min-w-32 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">{t("filters.currentYear")}</option>
              {availableYears.map((year) => (
                <option key={year.toString()} value={year.toString()}>
                  {year.toString()}
                </option>
              ))}
            </select>
          )}

          {/* Reset Filters Button */}
          {(filters.year !== new Date().getFullYear().toString() ||
            filters.timeRange !== "year") && (
            <button
              onClick={handleResetFilters}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              {t("filters.reset")}
            </button>
          )}

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            aria-label={t("actions.refresh")}
            className="p-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
          >
            <HiArrowPath className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Grid - Beautiful Redesign */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trendIcon;
          return (
            <div
              key={stat.id}
              className={`group relative overflow-hidden border-2 border-slate-200 dark:border-slate-600 bg-linear-to-br ${stat.color} rounded-xl p-6 transition-all duration-300 hover:border-opacity-80`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Title */}
                  <p className="text-sm font-medium text-white mb-3">
                    {stat.title}
                  </p>

                  {/* Main Value with large, bold display */}
                  <div className="flex items-baseline gap-3 mb-2">
                    <h3 className="text-3xl font-bold text-white tracking-tight text-shadow-2xs ">
                      {stat.value}
                    </h3>

                    {/* Change indicator with icon */}
                    <Chip
                      color={stat.isPositive ? "success" : "danger"}
                      size="sm"
                      startContent={
                        <TrendIcon
                          className={`w-3.5 h-3.5 ${
                            stat.isPositive
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        />
                      }
                    >
                      {stat.change}
                    </Chip>
                  </div>

                  {/* Details with subtle styling */}
                  <p className="text-xs text-white text-shadow-2xs mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    {stat.details}
                  </p>
                </div>

                {/* Icon in a circular container */}
                <div
                  className={`relative  ${isRTL ? "mr-4 ml-0" : "ml-4"}`}
                >
                  {/* Icon container */}
                  <div
                    className={`relative w-14 h-14 rounded-full  flex items-center justify-center group-hover:scale-105  transition-transform duration-300`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
{/* Main Charts Section */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Revenue Chart */}
  <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-950 rounded-xl p-6 transition-all duration-300">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-lg bg-amber-500 dark:bg-amber-600 flex items-center justify-center">
            <HiCurrencyDollar className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("charts.revenueTrend")}
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {getChartSubtitle()} • {getXAxisLabel()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Chip
          color="success"
          size="sm"
          startContent={<HiArrowUp className="w-3 h-3 mr-1" />}
        >
          {t("charts.growth")}:{" "}
          {dashboardData && dashboardData.monthlyRevenue > 0
            ? calculatePercentageChange(
                dashboardData.monthlyRevenue,
                dashboardData.totalRevenue - dashboardData.monthlyRevenue
              )
            : "0%"}
        </Chip>
      </div>
    </div>
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
              position: "insideBottom",
              offset: -5,
              style: { fill: "#6b7280", fontSize: 12 },
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
            stroke="url(#colorRevenue)"
            fill="url(#fillRevenue)"
            fillOpacity={0.3}
            strokeWidth={3}
            name={t("charts.revenue")}
          />
          <Line
            type="monotone"
            dataKey="bookings"
            stroke="url(#colorBookings)"
            strokeWidth={2}
            dot={{ stroke: "#3b82f6", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            name={t("charts.bookings")}
          />
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* Sport Distribution */}
  <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-950 rounded-xl p-6 transition-all duration-300">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-lg bg-green-500 dark:bg-green-600 flex items-center justify-center">
            <FaFutbol className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("charts.sportDistribution")}
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("charts.byReservation")}
        </p>
      </div>
    </div>
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={sportDistribution}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={85}
            innerRadius={45}
            paddingAngle={3}
            dataKey="value"
            nameKey="name"
          >
            {sportDistribution.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <RechartsTooltip content={<PieTooltip />} />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{
              paddingLeft: "20px",
              fontSize: "12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>

{/* Additional Insights Section */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Reservations by Status */}
  <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-950 rounded-xl p-6 transition-all duration-300">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-lg bg-blue-500 dark:bg-blue-600 flex items-center justify-center">
        <HiCalendar className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("charts.reservationsByStatus")}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("charts.statusBreakdown")}
        </p>
      </div>
    </div>
    <div className="space-y-4">
      {reservationsByStatus.map((item, index) => {
        const percentage = (
          (item.count / (dashboardData?.totalReservations || 1)) *
          100
        ).toFixed(1);
        const color =
          STATUS_COLORS[item.status as keyof typeof STATUS_COLORS] ||
          "#6b7280";

        return (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {item.count.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  ({percentage}%)
                </span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  </div>

  {/* Top Stadiums */}
  <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-950 rounded-xl p-6 transition-all duration-300">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-lg bg-gray-500 dark:bg-gray-600 flex items-center justify-center">
        <HiBuildingStorefront className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("charts.topStadiums")}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("charts.byReservations")}
        </p>
      </div>
    </div>
    <div className="space-y-4">
      {topStadiums.map((stadium, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gray-500 dark:bg-gray-600 flex items-center justify-center">
                <HiHome className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                  {index + 1}
                </span>
              </div>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white block">
                {stadium.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Stadium
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {stadium.reservations}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {t("charts.reservations")}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Top Clubs */}
  <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-950 rounded-xl p-6 transition-all duration-300">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-lg bg-amber-500 dark:bg-amber-600 flex items-center justify-center">
        <HiTrophy className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("charts.topClubs")}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("charts.mostActive")}
        </p>
      </div>
    </div>
    <div className="space-y-4">
      {topClubs.map((club, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-amber-500 dark:bg-amber-600 flex items-center justify-center">
                <HiTrophy className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-300">
                  {index + 1}
                </span>
              </div>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white block">
                {club.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Club
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {club.reservations}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {t("charts.reservations")}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

{/* Recent Activity */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Recent Reservations */}
  <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-950 rounded-xl p-6 transition-all duration-300">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-500 dark:bg-amber-600 flex items-center justify-center">
          <HiCalendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("tables.recentReservations")}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("tables.last24Hours")}
          </p>
        </div>
      </div>
      <Link
        href="/dashboard/reservations"
        className="px-3 py-2 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg transition-colors text-sm"
      >
        {t("actions.viewAll")}
      </Link>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              {t("tables.user")}
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              {t("tables.stadium")}
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              {t("tables.time")}
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              {t("tables.status")}
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              {t("tables.amount")}
            </th>
          </tr>
        </thead>
        <tbody>
          {recentReservations.slice(0, 5).map((reservation) => (
            <tr
              key={reservation.id}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {reservation.user.fullNameFr.charAt(0)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {isRTL
                        ? reservation.user.fullNameAr
                        : reservation.user.fullNameFr}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {reservation.user.email}
                    </span>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className="font-medium text-gray-900 dark:text-white">
                  {isRTL
                    ? reservation.stadium.nameAr
                    : reservation.stadium.nameFr}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="group relative">
                  <span className="cursor-help text-sm font-medium text-gray-700 dark:text-gray-300">
                    {formatRelativeTime(reservation.startDateTime)}
                  </span>
                  <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                    {formatDate(reservation.startDateTime)}
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
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
                  className="font-medium px-3 py-1"
                >
                  {reservation.status}
                </Badge>
              </td>
              <td className="py-3 px-4 font-bold text-amber-600 dark:text-amber-400">
                {formatCurrency(reservation.sessionPrice)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* Recent Users */}
  <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-950 rounded-xl p-6 transition-all duration-300">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-500 dark:bg-blue-600 flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("tables.recentUsers")}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("tables.newRegistrations")}
          </p>
        </div>
      </div>
      <Link
        href="/dashboard/users"
        className="px-3 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg transition-colors text-sm"
      >
        {t("actions.viewAll")}
      </Link>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              {t("tables.user")}
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              {t("tables.email")}
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              {t("tables.role")}
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              {t("tables.status")}
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              {t("tables.joined")}
            </th>
          </tr>
        </thead>
        <tbody>
          {recentUsers.slice(0, 5).map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {user.fullNameFr.charAt(0)}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {isRTL ? user.fullNameAr : user.fullNameFr}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.email}
                </span>
              </td>
              <td className="py-3 px-4">
                <Chip
                  color={
                    user.role === "ADMIN"
                      ? "danger"
                      : user.role === "CLUB"
                      ? "success"
                      : "default"
                  }
                  className="font-medium px-3 py-1"
                >
                  {user.role}
                </Chip>
              </td>
              <td className="py-3 px-4">
                <Badge
                  color={user.approved ? "success" : "warning"}
                  className="font-medium px-3 py-1"
                >
                  {user.approved
                    ? t("status.approved")
                    : t("status.pending")}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {formatRelativeTime(user.createdAt)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>
    </div>
  );
};

export default Dashboard;
