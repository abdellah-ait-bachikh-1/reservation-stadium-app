// components/dashboard/home/sections/StatsGridSection.tsx
import {  useTypedTranslations } from "@/utils/i18n";
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
  newClubsThisMonth: number;
  newUsersThisMonth: number;
  newClubsThisYear: number; // ADDED: Year-filtered new clubs
  newUsersThisYear: number; // ADDED: Year-filtered new users
  avgUtilization: number;
  completionRate: number;
  changes?: {
    totalReservationsChange?: string;
    activeReservationsChange?: string;
    pendingReservationsChange?: string;
    totalClubsChange?: string;
    totalStadiumsChange?: string;
    totalUsersChange?: string;
    subscriptionsChange?: string;
    overduePaymentsChange?: string;
    avgUtilizationChange?: string;
    completionRateChange?: string;
    newClubsChange?: string;
    newUsersChange?: string;
  };
}

interface StatsGridSectionProps {
  stats: Stats;
  currentYear: number;
}

export default  function StatsGridSection({ stats, currentYear }: StatsGridSectionProps) {
  const t =  useTypedTranslations();

  // Prepare stat cards with dynamic changes
  const statCards = [
    // Core operational stats - Now 6 cards for even distribution
    {
      title: t("pages.dashboard.home.stats.totalReservations.title"),
      value: stats.totalReservations.toLocaleString(),
      change: stats.changes?.totalReservationsChange || "", // Dynamic from backend
      icon: <HiCalendar className="w-5 h-5" />,
      color: "blue",
      description: t("pages.dashboard.home.stats.totalReservations.description", { year: currentYear })
    },
    {
      title: t("pages.dashboard.home.stats.activeReservations.title"),
      value: stats.activeReservations.toLocaleString(),
      change: stats.changes?.activeReservationsChange || "", // Dynamic from backend
      icon: <HiClock className="w-5 h-5" />,
      color: "green",
      description: t("pages.dashboard.home.stats.activeReservations.description", { year: currentYear })
    },
    {
      title: t("pages.dashboard.home.stats.pendingReservations.title"),
      value: stats.pendingReservations.toLocaleString(),
      change: stats.changes?.pendingReservationsChange || "", // Dynamic from backend
      icon: <HiExclamation className="w-5 h-5" />,
      color: "yellow",
      description: t("pages.dashboard.home.stats.pendingReservations.description", { year: currentYear })
    },
    {
      title: t("pages.dashboard.home.stats.totalClubs.title"),
      value: stats.totalClubs.toLocaleString(),
      change: stats.changes?.totalClubsChange || "", // Dynamic from backend
      icon: <HiOfficeBuilding className="w-5 h-5" />,
      color: "purple",
      description: t("pages.dashboard.home.stats.totalClubs.description", { year: currentYear })
    },
    {
      title: t("pages.dashboard.home.stats.totalStadiums.title"),
      value: stats.totalStadiums.toLocaleString(),
      change: stats.changes?.totalStadiumsChange || "", // Dynamic from backend
      icon: <HiHome className="w-5 h-5" />,
      color: "orange",
      description: t("pages.dashboard.home.stats.totalStadiums.description") // ALL TIME
    },
    {
      title: t("pages.dashboard.home.stats.totalUsers.title"),
      value: stats.totalUsers.toLocaleString(),
      change: stats.changes?.totalUsersChange || "", // Dynamic from backend
      icon: <HiUserGroup className="w-5 h-5" />,
      color: "cyan",
      description: t("pages.dashboard.home.stats.totalUsers.description") // ALL TIME
    },

    // User management and subscription stats - Now 6 cards for even distribution
    {
      title: t("pages.dashboard.home.stats.subscriptions.title"),
      value: stats.subscriptions.toLocaleString(),
      change: stats.changes?.subscriptionsChange || "", // Dynamic from backend
      icon: <HiCollection className="w-5 h-5" />,
      color: "indigo",
      description: t("pages.dashboard.home.stats.subscriptions.description")
    },
    {
      title: t("pages.dashboard.home.stats.overduePayments.title"),
      value: stats.overduePayments.toLocaleString(),
      change: stats.changes?.overduePaymentsChange || "", // Dynamic from backend
      icon: <HiCash className="w-5 h-5" />,
      color: "red",
      description: t("pages.dashboard.home.stats.overduePayments.description", { year: currentYear })
    },
    {
      title: t("pages.dashboard.home.stats.avgUtilization.title"),
      value: `${stats.avgUtilization}%`,
      change: stats.changes?.avgUtilizationChange || "", // Dynamic from backend
      icon: <HiChartBar className="w-5 h-5" />,
      color: "teal",
      description: t("pages.dashboard.home.stats.avgUtilization.description", { year: currentYear })
    },
    {
      title: t("pages.dashboard.home.stats.completionRate.title"),
      value: `${stats.completionRate}%`,
      change: stats.changes?.completionRateChange || "", // Dynamic from backend
      icon: <HiCheckCircle className="w-5 h-5" />,
      color: "emerald",
      description: t("pages.dashboard.home.stats.completionRate.description", { year: currentYear })
    },
    // Added two more cards to make it 6 per row - NOW YEAR-FILTERED
    {
      title: t("pages.dashboard.home.stats.newClubs.title"),
      value: stats.newClubsThisYear.toLocaleString(), // CHANGED: Use year-filtered data
      change: stats.changes?.newClubsChange || "", // Dynamic from backend
      icon: <HiOfficeBuilding className="w-5 h-5" />,
      color: "pink",
      description: t("pages.dashboard.home.stats.newClubs.description", { year: currentYear })
    },
    {
      title: t("pages.dashboard.home.stats.newUsers.title"),
      value: stats.newUsersThisYear.toLocaleString(), // CHANGED: Use year-filtered data
      change: stats.changes?.newUsersChange || "", // Dynamic from backend
      icon: <HiUserGroup className="w-5 h-5" />,
      color: "amber",
      description: t("pages.dashboard.home.stats.newUsers.description", { year: currentYear })
    }
  ];

  // Rest of the component remains the same...
  return (
    <>
      {/* First Row - 6 cards for even distribution */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {statCards.slice(0, 6).map((stat, index) => (
          <Card key={index} className="h-full hover:shadow-md transition-shadow duration-300">
            <CardBody className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 rtl:text-right">
                    {stat.title}
                  </p>
                  <p className="text-2xl  font-bold text-gray-900 dark:text-white mt-2 rtl:text-right">
                    {stat.value}
                  </p>
                  {stat.change && (
                    <div className="flex items-center gap-1 mt-1">
                      {stat.change.startsWith('+') ? (
                        <HiArrowUp className="w-4 h-4 text-green-500" />
                      ) : stat.change.startsWith('-') ? (
                        <HiArrowDown className="w-4 h-4 text-red-500" />
                      ) : null}
                      <span className={`text-xs font-medium rtl:text-right ${stat.change.startsWith('+') ? 'text-green-600' : stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-500'}`}>
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
                  stat.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' :
                  stat.color === 'pink' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600' :
                  'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                  }`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 rtl:text-right">
                {stat.description}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Second Row - 6 cards for even distribution */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {statCards.slice(6).map((stat, index) => (
          <Card key={index + 6} className="h-full hover:shadow-md transition-shadow duration-300">
            <CardBody className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm rtl:text-right font-medium text-gray-600 dark:text-gray-400rtl:text-right">
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
                      <span className={`text-xs font-medium rtl:text-right ${stat.change.startsWith('+') ? 'text-green-600' : stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-500'}`}>
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
                  stat.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' :
                  stat.color === 'pink' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600' :
                  'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                  }`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 rtl:text-right">
                {stat.description}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>
    </>
  );
}