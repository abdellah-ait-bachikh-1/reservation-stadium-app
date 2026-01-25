// components/dashboard/home/DashboardSkeleton.tsx
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { Select } from "@heroui/select";

export default function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-6">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-4 w-64 rounded-lg" />
        </div>
        <div className="flex items-center gap-4">
          <div className="w-32">
            <Select
              isDisabled
              className="opacity-50"
              placeholder=" "
            >
              <div />
            </Select>
          </div>
        </div>
      </div>

      {/* Quick Actions Skeleton */}
      <Card className="mb-6 shadow-sm">
        <CardHeader className="pb-0">
          <Skeleton className="h-6 w-48 rounded-lg" />
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-24 rounded-lg bg-gray-100 dark:bg-zinc-800 flex flex-col items-center justify-center gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-3 w-16 rounded-lg" />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="shadow-sm">
            <CardBody className="flex items-center justify-between p-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 rounded-lg" />
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-3 w-16 rounded-lg" />
              </div>
              <Skeleton className="w-12 h-12 rounded-lg" />
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Two Column Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Activity Skeleton */}
        <Card className="shadow-sm">
          <CardHeader className="pb-0 flex justify-between items-center">
            <Skeleton className="h-6 w-40 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-start gap-3 p-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-32 rounded-lg" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-full rounded-lg" />
                    <Skeleton className="h-3 w-24 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Upcoming Reservations Skeleton */}
        <Card className="shadow-sm">
          <CardHeader className="pb-0 flex justify-between items-center">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-32 rounded-lg" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-24 rounded-lg" />
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-3 w-16 rounded-lg" />
                      <Skeleton className="h-3 w-12 rounded-lg" />
                      <Skeleton className="h-3 w-20 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Charts Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Stadium Utilization Skeleton */}
        <Card className="shadow-sm">
          <CardHeader className="pb-0">
            <Skeleton className="h-6 w-40 rounded-lg mb-2" />
            <Skeleton className="h-4 w-64 rounded-lg" />
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24 rounded-lg" />
                    <Skeleton className="h-4 w-12 rounded-lg" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Reservations by Status Skeleton */}
        <Card className="shadow-sm">
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center">
              <div>
                <Skeleton className="h-6 w-48 rounded-lg mb-2" />
                <Skeleton className="h-4 w-56 rounded-lg" />
              </div>
              <Skeleton className="h-6 w-20 rounded-lg" />
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-72">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="text-center space-y-1">
                  <Skeleton className="h-3 w-24 mx-auto rounded-lg" />
                  <Skeleton className="h-6 w-16 mx-auto rounded-lg" />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Revenue Trends Skeleton */}
      <Card className="shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4">
            <div className="space-y-1">
              <Skeleton className="h-6 w-40 rounded-lg" />
              <Skeleton className="h-4 w-48 rounded-lg" />
            </div>
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </CardHeader>
        <CardBody>
          {/* Year-to-Date Cards Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20 rounded-lg" />
                    <Skeleton className="h-6 w-24 rounded-lg" />
                    <Skeleton className="h-3 w-16 rounded-lg" />
                  </div>
                  <Skeleton className="w-8 h-8 rounded-lg" />
                </div>
              </div>
            ))}
          </div>

          {/* Chart Skeleton */}
          <div className="h-80">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-4 w-32 rounded-lg" />
              <Skeleton className="h-4 w-24 rounded-lg" />
            </div>
            <Skeleton className="h-full w-full rounded-lg" />
          </div>

          {/* Legend Skeleton */}
          <div className="flex flex-wrap justify-center gap-4 mt-6 pt-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-32 rounded-full" />
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}