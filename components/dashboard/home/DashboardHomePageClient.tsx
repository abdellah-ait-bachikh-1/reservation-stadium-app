// components/dashboard/DashboardHomePageClient.tsx
"use client";

import { useTypedTranslations } from "@/utils/i18n";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import { Select, SelectItem } from "@heroui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { 
  HiCalendar, 
  HiCash, 
  HiChartBar, 
  HiChartPie, 
  HiCheckCircle, 
  HiClock, 
  HiCollection, 
  HiCreditCard, 
  HiCurrencyDollar, 
  HiExclamation, 
  HiHome, 
  HiLibrary, 
  HiOfficeBuilding, 
  HiPlus, 
  HiTrendingUp, 
  HiUser, 
  HiUserGroup,
  HiArrowRight,
  HiArrowUp,
  HiArrowDown,
  HiCheck,
  HiX
} from "react-icons/hi";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";

interface StatCard {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "purple" | "orange" | "red" | "yellow";
  description: string;
}

interface RecentActivity {
  id: string;
  type: 'reservation' | 'payment' | 'subscription' | 'user' | 'club';
  title: string;
  description: string;
  time: string;
  status?: 'success' | 'pending' | 'warning';
}

interface UpcomingReservation {
  id: string;
  stadiumName: string;
  clubName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  amount?: number;
}

interface ChartData {
  month: string;
  value: number;
}

interface StadiumUtilization {
  name: string;
  usage: number;
}

interface DashboardData {
  stats: {
    totalReservations: number;
    activeReservations: number;
    pendingReservations: number;
    totalClubs: number;
    totalStadiums: number;
    totalUsers: number;
    totalRevenue: number;
    monthlyRevenue: number;
    subscriptions: number;
    overduePayments: number;
  };
  recentActivity: RecentActivity[];
  upcomingReservations: UpcomingReservation[];
  reservationsByMonth: ChartData[];
  revenueByMonth: ChartData[];
  stadiumUtilization: StadiumUtilization[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CLUB";
}

interface DashboardHomePageClientProps {
  user: User;
  initialData: DashboardData;
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

// Helper function to translate months
const useMonthTranslations = () => {
  const t = useTypedTranslations();
  
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
      // Full month names as fallback
    //   "January": t("common.months.full.january"),
    //   "February": t("common.months.full.february"),
    //   "March": t("common.months.full.march"),
    //   "April": t("common.months.full.april"),
    //   "May": t("common.months.full.may"),
    //   "June": t("common.months.full.june"),
    //   "July": t("common.months.full.july"),
    //   "August": t("common.months.full.august"),
    //   "September": t("common.months.full.september"),
    //   "October": t("common.months.full.october"),
    //   "November": t("common.months.full.november"),
    //   "December": t("common.months.full.december")
    };
    return monthMap[monthKey] || monthKey;
  };

  return { translateMonth };
};

export default function DashboardHomePageClient({
  user,
  initialData,
  currentYear
}: DashboardHomePageClientProps) {
  const t = useTypedTranslations();
  const { translateMonth } = useMonthTranslations();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
   const translateTimeString = useMemo(() => {
  return (timeStr: string): string => {
    // Parse common time patterns
    const patterns = [
      { regex: /(\d+)\s*minutes?\s*ago/i, translation: "minutesAgo" },
      { regex: /(\d+)\s*min\s*ago/i, translation: "minutesAgo" },
      { regex: /(\d+)\s*hours?\s*ago/i, translation: "hoursAgo" },
      { regex: /(\d+)\s*days?\s*ago/i, translation: "daysAgo" },
      { regex: /(\d+)\s*weeks?\s*ago/i, translation: "weeksAgo" },
      { regex: /(\d+)\s*months?\s*ago/i, translation: "monthsAgo" },
      { regex: /(\d+)\s*years?\s*ago/i, translation: "yearsAgo" },
      { regex: /just\s*now/i, translation: "justNow" },
      { regex: /now/i, translation: "justNow" }
    ] as const;

    for (const pattern of patterns) {
      const match = timeStr.match(pattern.regex);
      if (match) {
        if (pattern.translation === "justNow") {
          return t("common.time.justNow");
        }
        const count = parseInt(match[1], 10);
        return t(`common.time.${pattern.translation}`, { count });
      }
    }

    // If no pattern matches, return the original string
    return timeStr;
  };
}, [t]);
  // Generate years for dropdown (current year and 4 previous years)
  const yearOptions = useMemo(() => {
    const years = [];
    for (let i = 0; i < 5; i++) {
      const year = currentYear - i;
      years.push(year);
    }
    return years;
  }, [currentYear]);

  // Filter data based on selected year (simulated) and translate months
  const filteredData = useMemo(() => {
    // In real app, this would fetch data for selected year
    // For now, we'll just modify some values based on year
    const yearMultiplier = selectedYear === currentYear ? 1 : (selectedYear / currentYear);
    
    return {
      ...initialData,
      stats: {
        ...initialData.stats,
        totalReservations: Math.round(initialData.stats.totalReservations * yearMultiplier),
        monthlyRevenue: Math.round(initialData.stats.monthlyRevenue * yearMultiplier),
        totalRevenue: Math.round(initialData.stats.totalRevenue * yearMultiplier),
      },
      reservationsByMonth: initialData.reservationsByMonth.map(item => ({
        ...item,
        month: translateMonth(item.month), // Translate month names
        value: Math.round(item.value * yearMultiplier)
      })),
      revenueByMonth: initialData.revenueByMonth.map(item => ({
        ...item,
        month: translateMonth(item.month), // Translate month names
        value: Math.round(item.value * yearMultiplier)
      }))
    };
  }, [selectedYear, initialData, currentYear, translateMonth]);

  // Prepare stat cards in the order you requested
  const statCards: StatCard[] = [
    // First row: Reservation stats
    {
      title: t("pages.dashboard.home.stats.totalReservations.title"),
      value: filteredData.stats.totalReservations.toLocaleString(),
      change: selectedYear === currentYear ? "+12%" : "historical",
      icon: <HiCalendar className="w-5 h-5" />,
      color: "blue",
      description: t("pages.dashboard.home.stats.totalReservations.description")
    },
    {
      title: t("pages.dashboard.home.stats.activeReservations.title"),
      value: filteredData.stats.activeReservations,
      change: "+5%",
      icon: <HiClock className="w-5 h-5" />,
      color: "green",
      description: t("pages.dashboard.home.stats.activeReservations.description")
    },
    {
      title: t("pages.dashboard.home.stats.pendingReservations.title"),
      value: filteredData.stats.pendingReservations,
      change: "-3",
      icon: <HiExclamation className="w-5 h-5" />,
      color: "yellow",
      description: t("pages.dashboard.home.stats.pendingReservations.description")
    },
    {
      title: t("pages.dashboard.home.stats.totalClubs.title"),
      value: filteredData.stats.totalClubs,
      change: "+8%",
      icon: <HiOfficeBuilding className="w-5 h-5" />,
      color: "purple",
      description: t("pages.dashboard.home.stats.totalClubs.description")
    },
    {
      title: t("pages.dashboard.home.stats.totalStadiums.title"),
      value: filteredData.stats.totalStadiums,
      change: "+2",
      icon: <HiHome className="w-5 h-5" />,
      color: "orange",
      description: t("pages.dashboard.home.stats.totalStadiums.description")
    },
    
    // Second row: User and financial stats
    {
      title: t("pages.dashboard.home.stats.totalUsers.title"),
      value: filteredData.stats.totalUsers,
      change: "+15%",
      icon: <HiUserGroup className="w-5 h-5" />,
      color: "red",
      description: t("pages.dashboard.home.stats.totalUsers.description")
    },
    {
      title: t("pages.dashboard.home.stats.totalRevenue.title"),
      value: `${filteredData.stats.totalRevenue.toLocaleString()} ${t("common.currency.symbol")}`,
      change: "+18%",
      icon: <HiCurrencyDollar className="w-5 h-5" />,
      color: "green",
      description: t("pages.dashboard.home.stats.totalRevenue.description")
    },
    {
      title: t("pages.dashboard.home.stats.monthlyRevenue.title"),
      value: `${filteredData.stats.monthlyRevenue.toLocaleString()} ${t("common.currency.symbol")} `,
      change: "+22%",
      icon: <HiTrendingUp className="w-5 h-5" />,
      color: "blue",
      description: t("pages.dashboard.home.stats.monthlyRevenue.description")
    },
    {
      title: t("pages.dashboard.home.stats.subscriptions.title"),
      value: filteredData.stats.subscriptions,
      change: "+4",
      icon: <HiCollection className="w-5 h-5" />,
      color: "purple",
      description: t("pages.dashboard.home.stats.subscriptions.description")
    },
    {
      title: t("pages.dashboard.home.stats.overduePayments.title"),
      value: filteredData.stats.overduePayments,
      change: "-2",
      icon: <HiCash className="w-5 h-5" />,
      color: "red",
      description: t("pages.dashboard.home.stats.overduePayments.description")
    }
  ];

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  // Get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'reservation': return <HiCalendar className="w-4 h-4" />;
      case 'payment': return <HiCash className="w-4 h-4" />;
      case 'subscription': return <HiCollection className="w-4 h-4" />;
      case 'user': return <HiUser className="w-4 h-4" />;
      case 'club': return <HiOfficeBuilding className="w-4 h-4" />;
      default: return <HiCheck className="w-4 h-4" />;
    }
  };

  // Get activity color
  const getActivityColor = (status?: string) => {
    switch (status) {
      case 'success': return 'success';
      case 'pending': return 'warning';
      case 'warning': return 'danger';
      default: return 'default';
    }
  };

  // Quick actions
  const quickActions = [
    {
      label: t("pages.dashboard.home.quickActions.createReservation"),
      icon: <HiPlus className="w-5 h-5" />,
      color: "primary" as const,
      href: "/dashboard/reservations/create"
    },
    {
      label: t("pages.dashboard.home.quickActions.addStadium"),
      icon: <HiHome className="w-5 h-5" />,
      color: "success" as const,
      href: "/dashboard/stadiums/create"
    },
    {
      label: t("pages.dashboard.home.quickActions.registerClub"),
      icon: <HiOfficeBuilding className="w-5 h-5" />,
      color: "warning" as const,
      href: "/dashboard/clubs/create"
    },
    {
      label: t("pages.dashboard.home.quickActions.viewPayments"),
      icon: <HiCreditCard className="w-5 h-5" />,
      color: "danger" as const,
      href: "/dashboard/payments"
    },
    {
      label: t("pages.dashboard.home.quickActions.sendNotification"),
      icon: <HiCollection className="w-5 h-5" />,
      color: "secondary" as const,
      href: "/dashboard/notifications"
    },
    {
      label: t("pages.dashboard.home.quickActions.generateReport"),
      icon: <HiChartBar className="w-5 h-5" />,
      color: "default" as const,
      href: "/dashboard/reports"
    }
  ];

  return (
    <div className="p-4 md:p-6">
      {/* Header with Year Filter */}
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
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("pages.dashboard.home.yearFilter.label")}:
            </span>
            <Select
              className="w-40"
              selectedKeys={[selectedYear.toString()]}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              label={t("pages.dashboard.home.yearFilter.selectYear")}
            >
              {yearOptions.map((year) => (
                <SelectItem key={year.toString()}>
                  {year === currentYear 
                    ? `${year} (${t("pages.dashboard.home.yearFilter.currentYear")})`
                    : year.toString()}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="mb-6 shadow-sm">
        <CardHeader className="pb-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("pages.dashboard.home.quickActions.title")}
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  fullWidth
                  color={action.color}
                  variant="flat"
                  className="h-24 flex flex-col gap-2"
                  as="a"
                  href={action.href}
                >
                  {action.icon}
                  <span className="text-xs font-medium">{action.label}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Stats Grid - First Row: Reservation & Club Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {statCards.slice(0, 5).map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="h-full hover:shadow-md transition-shadow duration-300">
              <CardBody className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl rtl:text-right font-bold text-gray-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                    {stat.change && (
                      <div className="flex items-center gap-1 mt-1">
                        {stat.change.startsWith('+') ? (
                          <HiArrowUp className="w-4 h-4 text-green-500" />
                        ) : stat.change.startsWith('-') ? (
                          <HiArrowDown className="w-4 h-4 text-red-500" />
                        ) : null}
                        <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-500'}`}>
                          {stat.change}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={`p-2 rounded-lg ${stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                      stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                      stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' :
                      stat.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' :
                      stat.color === 'red' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' :
                      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'
                    }`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  {stat.description}
                </p>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stats Grid - Second Row: User & Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {statCards.slice(5).map((stat, index) => (
          <motion.div
            key={index + 5}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (index + 5) * 0.05 }}
          >
            <Card className="h-full hover:shadow-md transition-shadow duration-300">
              <CardBody className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm rtl:text-right font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl rtl:text-right  font-bold text-gray-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                    {stat.change && (
                      <div className="flex items-center gap-1 mt-1">
                        {stat.change.startsWith('+') ? (
                          <HiArrowUp className="w-4 h-4 text-green-500" />
                        ) : stat.change.startsWith('-') ? (
                          <HiArrowDown className="w-4 h-4 text-red-500" />
                        ) : null}
                        <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-500'}`}>
                          {stat.change}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={`p-2 rounded-lg ${stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                      stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                      stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' :
                      stat.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' :
                      stat.color === 'red' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' :
                      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'
                    }`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  {stat.description}
                </p>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="shadow-sm">
          <CardHeader className="pb-0 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("pages.dashboard.home.recentActivity.title")}
            </h2>
            <Button
              size="sm"
              variant="light"
              endContent={<HiArrowRight className="w-4 h-4" />}
              as="a"
              href="/dashboard/activity"
            >
              {t("pages.dashboard.home.recentActivity.viewAll")}
            </Button>
          </CardHeader>
          <CardBody>
            {filteredData.recentActivity.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <HiCalendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{t("pages.dashboard.home.recentActivity.noActivity")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredData.recentActivity.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className={`p-2 rounded-full ${getActivityColor(activity.status)}-100 dark:${getActivityColor(activity.status)}-900/30 ${getActivityColor(activity.status)}-500`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-sm text-gray-900 dark:text-white">
                          {activity.title}
                        </p>
                        {activity.status && (
                          <Chip
                            size="sm"
                            variant="flat"
                            color={getActivityColor(activity.status)}
                          >
                            {activity.status === 'success' ? (
                              <HiCheck className="w-3 h-3" />
                            ) : activity.status === 'pending' ? (
                              <HiClock className="w-3 h-3" />
                            ) : (
                              <HiExclamation className="w-3 h-3" />
                            )}
                          </Chip>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
  {translateTimeString(activity.time)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Upcoming Reservations */}
        <Card className="shadow-sm">
          <CardHeader className="pb-0 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("pages.dashboard.home.upcomingReservations.title")}
            </h2>
            <Button
              size="sm"
              variant="light"
              endContent={<HiArrowRight className="w-4 h-4" />}
              as="a"
              href="/dashboard/reservations"
            >
              {t("pages.dashboard.home.upcomingReservations.viewAll")}
            </Button>
          </CardHeader>
          <CardBody>
            {filteredData.upcomingReservations.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <HiCalendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{t("pages.dashboard.home.upcomingReservations.noReservations")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredData.upcomingReservations.map((reservation) => (
                  <motion.div
                    key={reservation.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                          {reservation.stadiumName}
                        </p>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={getStatusColor(reservation.status)}
                        >
                          {reservation.status}
                        </Chip>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {reservation.clubName}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{reservation.date}</span>
                        <span>{reservation.time}</span>
                        {reservation.amount && (
                          <span className="font-semibold text-green-600">
                           {reservation.amount} {t("common.currency.symbol")}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Charts Section */}
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
              {filteredData.stadiumUtilization.map((stadium, index) => (
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
                  {t("pages.dashboard.home.charts.revenueByMonth.description")} - {selectedYear}
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
                  data={filteredData.revenueByMonth}
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
                    {filteredData.revenueByMonth.map((entry, index) => {
                      const maxValue = Math.max(...filteredData.revenueByMonth.map(m => m.value));
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
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
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
                  {Math.max(...filteredData.revenueByMonth.map(m => m.value)).toLocaleString()} {t("common.currency.symbol")}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("pages.dashboard.home.charts.avgMonthly")}
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {Math.round(filteredData.revenueByMonth.reduce((sum, m) => sum + m.value, 0) / filteredData.revenueByMonth.length).toLocaleString()} {t("common.currency.symbol")}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("pages.dashboard.home.charts.totalYear")} ({selectedYear})
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {filteredData.revenueByMonth.reduce((sum, m) => sum + m.value, 0).toLocaleString()} {t("common.currency.symbol")}
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
    </div>
  );
}