// components/dashboard/home/sections/UpcomingReservationsSection.tsx
"use client";

import { useTypedTranslations } from "@/utils/i18n";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { HiArrowRight, HiCalendar } from "react-icons/hi";
import { motion } from "framer-motion";

interface UpcomingReservation {
  id: string;
  stadiumName: string;
  clubName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  amount?: number;
}

interface UpcomingReservationsSectionProps {
  reservations: UpcomingReservation[];
}

export default function UpcomingReservationsSection({ reservations }: UpcomingReservationsSectionProps) {
  const t = useTypedTranslations();

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  return (
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
        {reservations.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <HiCalendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{t("pages.dashboard.home.upcomingReservations.noReservations")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reservations.map((reservation) => (
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
  );
}