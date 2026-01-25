// components/dashboard/home/sections/BarChartSection.tsx
"use client";

import { useTypedTranslations } from "@/utils/i18n";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { HiCalendar, HiCheckCircle, HiClock, HiXCircle, HiCreditCard, HiExclamationCircle } from "react-icons/hi";
import { convertCase } from "@/utils";
import { ReservationStatusType } from "@/types/db";

interface StadiumUtilization {
  name: string;
  usage: number;
}

interface ReservationStatusData {
  status: ReservationStatusType;
  count: number;
  color: string;
}

interface BarChartSectionProps {
  stadiumUtilization: StadiumUtilization[];
  reservationsByStatus: ReservationStatusData[];
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ReservationStatusData;
    value: number;
    color: string;
  }>;
  label?: string;
}

const StatusTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  const t = useTypedTranslations();

  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    // Use convertCase for all statuses - it will handle "PAID" correctly
    const statusKey = convertCase(data.status, "lower");
    
    return (
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: data.color }}
          />
          <p className="font-semibold text-gray-900 dark:text-white">
            {t(`common.status.${statusKey}`)}
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t("pages.dashboard.home.charts.reservationsByStatus.count")}
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
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
  stadiumUtilization, 
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
  
  // Filter stadium utilization to show only those with usage > 0
  const cleanStadiumData = stadiumUtilization.filter(stadium => stadium.usage > 0);

  // Format Y-axis values
  const formatYAxis = (value: number) => {
    if (isNaN(value) || value === 0) return "0";
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  // Get status icon
  const getStatusIcon = (status: ReservationStatusType) => {
    switch(status) {
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
            {cleanStadiumData.length > 0 ? (
              cleanStadiumData.map((stadium, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
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
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  {t("pages.dashboard.home.charts.stadiumUtilization.noData")}
                </p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Reservations by Status Bar Chart */}
      <Card className="shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
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
        <CardBody>
          {reservationStatusData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {t("pages.dashboard.home.charts.reservationsByStatus.noData")}
              </p>
            </div>
          ) : (
            <>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={reservationStatusData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
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
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
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
              <div className="flex flex-wrap justify-center gap-4 mt-6">
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