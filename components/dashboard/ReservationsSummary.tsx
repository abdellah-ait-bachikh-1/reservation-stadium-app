// components/dashboard/ReservationsSummary.tsx
"use client";

import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Link } from "@/i18n/navigation";
import { button, cn } from "@heroui/theme";
import { MdKeyboardArrowRight } from "react-icons/md";

export default function ReservationsSummary() {
  const reservations = [
    {
      id: "1",
      startDateTime: new Date(),
      endDateTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      status: "APPROVED",
      stadium: {
        nameAr: "ملعب طانطان الأولمبي",
        nameFr: "Stade Olympique de Tan-Tan",
      },
    },
    {
      id: "2",
      startDateTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      endDateTime: new Date(Date.now() - 22 * 60 * 60 * 1000),
      status: "PENDING",
      stadium: {
        nameAr: "ملعب الشباب",
        nameFr: "Stade de la Jeunesse",
      },
    },
    {
      id: "3",
      startDateTime: new Date(Date.now() - 48 * 60 * 60 * 1000),
      endDateTime: new Date(Date.now() - 46 * 60 * 60 * 1000),
      status: "CANCELLED",
      stadium: {
        nameAr: "الملعب البلدي",
        nameFr: "Stade Municipal",
      },
    },
  ];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "PENDING":
        return "warning";
      case "CANCELLED":
        return "danger";
      default:
        return "default";
    }
  };

  if (reservations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          No reservations found
        </p>
        <Button
          color="primary"
          variant="flat"
          className="mt-4"
          as={Link}
          href="/dashboard/reservations"
        >
          Make a Reservation
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Custom Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                DATE
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                STADIUM
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                TIME
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                STATUS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {reservations.map((reservation) => (
              <tr 
                key={reservation.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatDate(reservation.startDateTime)}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {reservation.stadium?.nameFr}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {formatTime(reservation.startDateTime)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">to</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {formatTime(reservation.endDateTime)}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Chip
                    color={getStatusColor(reservation.status)}
                    size="sm"
                    variant="flat"
                    className="border-none"
                  >
                    {reservation.status}
                  </Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View All Button */}
      <div className="flex justify-end pt-2">
        <Link
          href="/dashboard/reservations"
          className={cn(
            "flex items-center gap-1 text-sm font-medium",
            "text-primary-600 dark:text-primary-400",
            "hover:text-primary-700 dark:hover:text-primary-300",
            "transition-colors"
          )}
        >
          View All Reservations
          <MdKeyboardArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}