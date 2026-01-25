// components/dashboard/home/sections/StatsGridSection.tsx
import { getTypedTranslations } from "@/utils/i18n";
import { Card, CardBody } from "@heroui/card";
import {
  HiCalendar,
  HiClock,
  HiExclamation,
  HiOfficeBuilding,
  HiHome,
  HiUserGroup,
  HiCollection,
  HiCash,
  HiArrowUp,
  HiArrowDown,
  HiCheckCircle,
  HiUsers,
  HiTicket,
  HiChartBar
} from "react-icons/hi";

interface Stats {
  totalReservations: number;
  activeReservations: number;
  pendingReservations: number;
  totalClubs: number;
  totalStadiums: number;
  totalUsers: number;
  subscriptions: number;
  overduePayments: number;
  // Removed: totalRevenue and monthlyRevenue
}

interface StatsGridSectionProps {
  stats: Stats;
  currentYear: number;
}

export default async function StatsGridSection({ stats }: StatsGridSectionProps) {
  const t = await getTypedTranslations();

  // Prepare stat cards - Focus on OPERATIONAL metrics only
  // Removed all revenue-related stats (they're now in RevenueTrendsChart)
  const statCards = [
    // First row: Core operational stats
    {
      title: t("pages.dashboard.home.stats.totalReservations.title"),
      value: stats.totalReservations.toLocaleString(),
      change: "+12%",
      icon: <HiCalendar className="w-5 h-5" />,
      color: "blue",
      description: t("pages.dashboard.home.stats.totalReservations.description")
    },
    {
      title: t("pages.dashboard.home.stats.activeReservations.title"),
      value: stats.activeReservations,
      change: "+5%",
      icon: <HiClock className="w-5 h-5" />,
      color: "green",
      description: t("pages.dashboard.home.stats.activeReservations.description")
    },
    {
      title: t("pages.dashboard.home.stats.pendingReservations.title"),
      value: stats.pendingReservations,
      change: "-3",
      icon: <HiExclamation className="w-5 h-5" />,
      color: "yellow",
      description: t("pages.dashboard.home.stats.pendingReservations.description")
    },
    {
      title: t("pages.dashboard.home.stats.totalClubs.title"),
      value: stats.totalClubs,
      change: "+8%",
      icon: <HiOfficeBuilding className="w-5 h-5" />,
      color: "purple",
      description: t("pages.dashboard.home.stats.totalClubs.description")
    },
    {
      title: t("pages.dashboard.home.stats.totalStadiums.title"),
      value: stats.totalStadiums,
      change: "+2",
      icon: <HiHome className="w-5 h-5" />,
      color: "orange",
      description: t("pages.dashboard.home.stats.totalStadiums.description")
    },

    // Second row: User management and subscription stats
    {
      title: t("pages.dashboard.home.stats.totalUsers.title"),
      value: stats.totalUsers,
      change: "+15%",
      icon: <HiUserGroup className="w-5 h-5" />,
      color: "cyan",
      description: t("pages.dashboard.home.stats.totalUsers.description")
    },
    {
      title: t("pages.dashboard.home.stats.subscriptions.title"),
      value: stats.subscriptions,
      change: "+4",
      icon: <HiCollection className="w-5 h-5" />,
      color: "indigo",
      description: t("pages.dashboard.home.stats.subscriptions.description")
    },
    {
      title: t("pages.dashboard.home.stats.overduePayments.title"),
      value: stats.overduePayments,
      change: "-2",
      icon: <HiCash className="w-5 h-5" />,
      color: "red",
      description: t("pages.dashboard.home.stats.overduePayments.description")
    },
    {
      title: t("pages.dashboard.home.stats.avgUtilization.title"),
      value: "78%",
      change: "+5%",
      icon: <HiChartBar className="w-5 h-5" />,
      color: "teal",
      description: t("pages.dashboard.home.stats.avgUtilization.description")
    },
    {
      title: t("pages.dashboard.home.stats.completionRate.title"),
      value: "94%",
      change: "+3%",
      icon: <HiCheckCircle className="w-5 h-5" />,
      color: "emerald",
      description: t("pages.dashboard.home.stats.completionRate.description")
    }
  ];

  return (
    <>
      {/* First Row - 5 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {statCards.slice(0, 5).map((stat, index) => (
          <Card key={index} className="h-full hover:shadow-md transition-shadow duration-300">
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
                    stat.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600' :
                      stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' :
                        stat.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' :
                          stat.color === 'red' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' :
                            stat.color === 'cyan' ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600' :
                              stat.color === 'indigo' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' :
                                stat.color === 'teal' ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600' :
                                  'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                  }`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                {stat.description}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Second Row - 5 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {statCards.slice(5).map((stat, index) => (
          <Card key={index + 5} className="h-full hover:shadow-md transition-shadow duration-300">
            <CardBody className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm rtl:text-right font-medium text-gray-600 dark:text-gray-400">
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
                    stat.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600' :
                      stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' :
                        stat.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' :
                          stat.color === 'red' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' :
                            stat.color === 'cyan' ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600' :
                              stat.color === 'indigo' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' :
                                stat.color === 'teal' ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600' :
                                  'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                  }`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                {stat.description}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>
    </>
  );
}