// components/dashboard/home/sections/OverduePaymentsSection.tsx
"use client";

import { useTypedTranslations } from "@/utils/i18n";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { HiArrowRight, HiExclamationCircle, HiCurrencyDollar, HiCalendar } from "react-icons/hi";
import { motion } from "framer-motion";

interface OverduePayment {
  id: string;
  clubName: string;
  stadiumName: string;
  amount: number;
  dueDate: string;
  overdueDays: number;
  reservationSeriesId: string;
  userId: string;
}

interface OverduePaymentsSectionProps {
  payments: OverduePayment[];
}

export default function OverduePaymentsSection({ payments }: OverduePaymentsSectionProps) {
  const t = useTypedTranslations();

  // Get severity color based on overdue days
  const getSeverityColor = (days: number) => {
    if (days <= 7) return "warning";
    if (days <= 30) return "danger";
    return "danger"; // More than 30 days
  };

  const getSeverityText = (days: number) => {
    if (days <= 7) return t("pages.dashboard.home.overduePayments.recent");
    if (days <= 30) return t("pages.dashboard.home.overduePayments.overdue");
    return t("pages.dashboard.home.overduePayments.longOverdue");
  };

  return (
    <Card className="shadow-sm h-125 overflow-y-auto">
      <CardHeader className="pb-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <HiExclamationCircle className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("pages.dashboard.home.overduePayments.title")}
          </h2>
        </div>
        <Button
          size="sm"
          variant="light"
          endContent={<HiArrowRight className="w-4 h-4 rtl:rotate-180" />}
          as="a"
          href="/dashboard/payments?filter=overdue"
        >
          {t("pages.dashboard.home.overduePayments.viewAll")}
        </Button>
      </CardHeader>
      <CardBody>
        {payments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <HiCurrencyDollar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{t("pages.dashboard.home.overduePayments.noOverdue")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 rounded-lg border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-100/70 dark:hover:bg-red-900/20 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                      {payment.clubName}
                    </p>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={getSeverityColor(payment.overdueDays)}
                    >
                      {getSeverityText(payment.overdueDays)}
                    </Chip>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {payment.stadiumName}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <HiCurrencyDollar className="w-3 h-3" />
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        {payment.amount.toLocaleString()} {t("common.currency.symbol")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <HiCalendar className="w-3 h-3" />
                      <span>{payment.dueDate}</span>
                    </div>
                    <span className="text-xs font-medium text-red-600 dark:text-red-400">
                      {payment.overdueDays} {t("pages.dashboard.home.overduePayments.daysOverdue")}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="flat"
                  color="danger"
                  as="a"
                  href={`/dashboard/payments/${payment.id}`}
                >
                  {t("pages.dashboard.home.overduePayments.resolve")}
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}