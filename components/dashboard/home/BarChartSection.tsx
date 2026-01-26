// components/dashboard/home/sections/BarChartSection.tsx
"use client";

import { useTypedTranslations } from "@/utils/i18n";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { HiCalendar, HiCheckCircle, HiClock, HiXCircle, HiCreditCard, HiExclamationCircle, HiCurrencyDollar } from "react-icons/hi";
import { convertCase } from "@/utils";
import { ReservationStatusType } from "@/types/db";

interface StadiumRevenue {
  id: string;
  name: string;
  totalRevenue: number;
  subscriptionRevenue: number;
  singleSessionRevenue: number;
  percentage: number;
}

interface ReservationStatusData {
  status: ReservationStatusType;
  count: number;
  color: string;
}

interface BarChartSectionProps {
  revenueByStadium: StadiumRevenue[];
  reservationsByStatus: ReservationStatusData[];
}

interface StadiumRevenueTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: StadiumRevenue;
    value: number;
    color: string;
  }>;
  label?: string;
}

interface StatusTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ReservationStatusData;
    value: number;
    color: string;
  }>;
  label?: string;
}

const StadiumRevenueTooltip = ({ active, payload }: StadiumRevenueTooltipProps) => {
  const t = useTypedTranslations();

  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-[180px] max-w-[280px] relative z-50">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: payload[0].color }}
          />
          <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
            {data.name}
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400 truncate mr-2">
              {t("pages.dashboard.home.charts.revenueByStadium.totalRevenue")}
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">
              {data.totalRevenue.toLocaleString()} MAD
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400 truncate mr-2">
              {t("pages.dashboard.home.charts.revenueByStadium.subscription")}
            </span>
            <span className="text-sm text-blue-600 dark:text-blue-400 whitespace-nowrap">
              {data.subscriptionRevenue.toLocaleString()} MAD
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400 truncate mr-2">
              {t("pages.dashboard.home.charts.revenueByStadium.singleSession")}
            </span>
            <span className="text-sm text-green-600 dark:text-green-400 whitespace-nowrap">
              {data.singleSessionRevenue.toLocaleString()} MAD
            </span>
          </div>
          <div className="pt-1 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 dark:text-gray-400 truncate mr-2">
                {t("pages.dashboard.home.charts.revenueByStadium.shareOfTotal")}
              </span>
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400 whitespace-nowrap">
                {data.percentage}% {t("pages.dashboard.home.charts.revenueByStadium.ofTotal")}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};
const StatusTooltip = ({ active, payload }: StatusTooltipProps) => {
  const t = useTypedTranslations();

  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const statusKey = convertCase(data.status, "lower");

    return (
      <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-[150px] max-w-[220px] relative z-50">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: data.color }}
          />
          <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
            {t(`common.status.${statusKey}`)}
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400 truncate mr-2">
              {t("pages.dashboard.home.charts.reservationsByStatus.count")}
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">
              {data.count.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function BarChartSection({
  revenueByStadium,
  reservationsByStatus,
}: BarChartSectionProps) {
  const t = useTypedTranslations();

  // Use reservation status data from props
  const reservationStatusData = reservationsByStatus || [];

  // Calculate totals
  const totalReservations = reservationStatusData.reduce((sum, item) => sum + item.count, 0);
  const approvedPercentage = reservationStatusData.length > 0
    ? Math.round(
      (reservationStatusData.find(item => item.status === "APPROVED")?.count || 0) / totalReservations * 100
    )
    : 0;

  // Filter and sort stadium revenue data
  const cleanStadiumData = (revenueByStadium || [])
    .filter(stadium => stadium.totalRevenue > 0)
    .sort((a, b) => b.totalRevenue - a.totalRevenue) // Sort by revenue descending
    .slice(0, 5); // Show only top 5 stadiums

  // Calculate total revenue for percentage calculation
  const totalAllStadiumRevenue = cleanStadiumData.reduce((sum, stadium) => sum + stadium.totalRevenue, 0);

  // Get color based on revenue tier
  const getRevenueColor = (revenue: number, maxRevenue: number): string => {
    if (maxRevenue === 0) return '#3B82F6'; // Default blue if no data
    const percentage = (revenue / maxRevenue) * 100;

    if (percentage >= 80) return '#10B981'; // Green for top 20%
    if (percentage >= 60) return '#F59E0B'; // Yellow for 20-40%
    if (percentage >= 40) return '#3B82F6'; // Blue for 40-60%
    if (percentage >= 20) return '#8B5CF6'; // Purple for 60-80%
    return '#EF4444'; // Red for bottom 20%
  };

  // Find max revenue for color scaling
  const maxRevenue = cleanStadiumData.length > 0
    ? Math.max(...cleanStadiumData.map(stadium => stadium.totalRevenue))
    : 0;

  // Format currency
  const formatCurrency = (value: number): string => {
    return `${value.toLocaleString()} MAD`;
  };

  // Format Y-axis values for reservations chart
  const formatYAxis = (value: number) => {
    if (isNaN(value) || value === 0) return "0";
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  // Get status icon
  const getStatusIcon = (status: ReservationStatusType) => {
    switch (status) {
      case "APPROVED":
        return <HiCheckCircle className="w-4 h-4 text-green-500" />;
      case "PENDING":
        return <HiClock className="w-4 h-4 text-amber-500" />;
      case "DECLINED":
        return <HiXCircle className="w-4 h-4 text-red-500" />;
      case "CANCELLED":
        return <HiXCircle className="w-4 h-4 text-gray-500" />;
      case "PAID":
        return <HiCreditCard className="w-4 h-4 text-blue-500" />;
      case "UNPAID":
        return <HiExclamationCircle className="w-4 h-4 text-pink-500" />;
      default:
        return <HiCalendar className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* LEFT: Revenue by Stadium - Horizontal Bar Chart */}
     <Card className="shadow-sm">
        <CardHeader className="pb-0 px-0">
          <div className="flex justify-between items-center px-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("pages.dashboard.home.charts.revenueByStadium.title")}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("pages.dashboard.home.charts.revenueByStadium.description")}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <HiCurrencyDollar className="w-4 h-4 text-green-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {cleanStadiumData.length} {t("pages.dashboard.home.charts.revenueByStadium.stadiums")}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-0">
          {cleanStadiumData.length === 0 ? (
            <div className="text-center py-8 px-4">
              <p className="text-gray-500 dark:text-gray-400">
                {t("pages.dashboard.home.charts.revenueByStadium.noData")}
              </p>
            </div>
          ) : (
            <>
              {/* Horizontal Bar Chart for Stadium Revenue */}
              <div className="h-72 w-full px-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={cleanStadiumData}
                    layout="vertical"
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                      horizontal={true}
                      vertical={false}
                      strokeOpacity={0.5}
                    />
                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      tickFormatter={formatCurrency}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      width={80}
                      tickFormatter={(value) => {
                        // Truncate long stadium names
                        if (value.length > 15) {
                          return value.substring(0, 12) + '...';
                        }
                        return value;
                      }}
                    />
                    <Tooltip
                      content={<StadiumRevenueTooltip />}
                      wrapperStyle={{ outline: 'none' }}
                      position={{ y: 0 }}
                    />
                    <Bar
                      dataKey="totalRevenue"
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                    >
                      {cleanStadiumData.map((entry, index) => (
                        <Cell
                          key={`stadium-revenue-cell-${index}`}
                          fill={getRevenueColor(entry.totalRevenue, maxRevenue)}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue Summary */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 px-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("pages.dashboard.home.charts.revenueByStadium.totalRevenue")}
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(totalAllStadiumRevenue)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("pages.dashboard.home.charts.revenueByStadium.topStadium")}
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {cleanStadiumData[0]?.name.split(' ')[0] || 'N/A'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("pages.dashboard.home.charts.revenueByStadium.avgPerStadium")}
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                    {cleanStadiumData.length > 0
                      ? formatCurrency(totalAllStadiumRevenue / cleanStadiumData.length)
                      : '0 MAD'}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      {/* RIGHT: Reservations by Status Bar Chart */}
      <Card className="shadow-sm">
        <CardHeader className="pb-0 px-0">
          <div className="flex justify-between items-center px-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("pages.dashboard.home.charts.reservationsByStatus.title")}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("pages.dashboard.home.charts.reservationsByStatus.description")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <HiCalendar className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {totalReservations.toLocaleString()} {t("pages.dashboard.home.charts.reservationsByStatus.total")}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-0">
          {reservationStatusData.length === 0 ? (
            <div className="text-center py-8 px-4">
              <p className="text-gray-500 dark:text-gray-400">
                {t("pages.dashboard.home.charts.reservationsByStatus.noData")}
              </p>
            </div>
          ) : (
            <>
              <div className="h-72 w-full px-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={reservationStatusData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                      vertical={false}
                      strokeOpacity={0.5}
                    />
                    <XAxis
                      dataKey="status"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      dy={10}
                      tickFormatter={(value: ReservationStatusType) => {
                        const statusKey = convertCase(value, "lower");
                        return t(`common.status.${statusKey}`);
                      }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      tickFormatter={formatYAxis}
                      dx={-10}
                    />
                    <Tooltip
                      content={<StatusTooltip />}
                      cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                      wrapperStyle={{ outline: 'none' }}
                      position={{ y: 0 }}
                    />
                    <Bar
                      dataKey="count"
                      radius={[4, 4, 0, 0]}
                      barSize={32}
                    >
                      {reservationStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 px-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("pages.dashboard.home.charts.reservationsByStatus.totalReservations")}
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {totalReservations.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("pages.dashboard.home.charts.reservationsByStatus.approvalRate")}
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {approvedPercentage}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("pages.dashboard.home.charts.reservationsByStatus.pending")}
                  </p>
                  <p className="text-lg font-bold text-amber-600">
                    {reservationStatusData.find(item => item.status === "PENDING")?.count || 0}
                  </p>
                </div>
              </div>

              {/* Status Legend */}
              <div className="flex flex-wrap justify-center gap-4 mt-6 px-4">
                {reservationStatusData.map((status) => {
                  const statusKey = convertCase(status.status, "lower");

                  return (
                    <div key={status.status} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <div className="flex items-center gap-1">
                        {getStatusIcon(status.status)}
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {t(`common.status.${statusKey}`)}
                        </span>
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">
                          ({Math.round((status.count / totalReservations) * 100)}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}