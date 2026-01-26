// components/dashboard/home/sections/PendingUserApprovalsSection.tsx
"use client";

import { useTypedTranslations } from "@/utils/i18n";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  HiUser,
  HiPhone,
  HiMail,
  HiClock,
  HiCalendar,
  HiCheckCircle,
  HiArrowRight
} from "react-icons/hi";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface PendingUserApproval {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  emailVerifiedAt: string | null;
  timeAgo: string;
}

interface PendingUserApprovalsSectionProps {
  users: PendingUserApproval[];
}

export default function PendingUserApprovalsSection({ users }: PendingUserApprovalsSectionProps) {
  const t = useTypedTranslations();

  // Helper function to translate time strings
  const translateTimeString = (timeStr: string): string => {
    const patterns = [
      { regex: /(\d+)\s*minutes?\s*ago/i, translation: "minutesAgo" },
      { regex: /(\d+)\s*min\s*ago/i, translation: "minutesAgo" },
      { regex: /(\d+)\s*hours?\s*ago/i, translation: "hoursAgo" },
      { regex: /(\d+)\s*days?\s*ago/i, translation: "daysAgo" },
      { regex: /just\s*now/i, translation: "justNow" }
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

    return timeStr;
  };

  // Format date to local string
  const formatDate = (dateString: string | null) => {
    if (!dateString) return t("common.status.notVerified");
    try {
      const date = new Date(dateString);
      return format(date, "MMM dd, yyyy HH:mm");
    } catch (error) {
      return t("common.status.invalidDate");
    }
  };

  // Short date format for mobile
  const formatShortDate = (dateString: string | null) => {
    if (!dateString) return t("common.status.notVerified");
    try {
      const date = new Date(dateString);
      return format(date, "MMM dd HH:mm");
    } catch (error) {
      return t("common.status.invalidDate");
    }
  };

  return (
    <Card className="shadow-sm h-125 overflow-y-auto">
      <CardHeader className="pb-0 px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("pages.dashboard.home.pendingUserApprovals.title")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("pages.dashboard.home.pendingUserApprovals.subtitle")}
            </p>
          </div>
          <Button
            size="sm"
            variant="light"
            endContent={<HiArrowRight className="w-4 h-4 rtl:rotate-180" />}
            as="a"
            href="/dashboard/users?filter=pending"
            className="mt-2 sm:mt-0"
          >
            {t("pages.dashboard.home.pendingUserApprovals.viewAll")}
          </Button>
        </div>
      </CardHeader>
      <CardBody className="px-4 sm:px-6 pb-4 sm:pb-6">
        {users.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <HiUser className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm sm:text-base">{t("pages.dashboard.home.pendingUserApprovals.noUsers")}</p>
            <p className="text-xs sm:text-sm mt-2 max-w-xs mx-auto">
              {t("pages.dashboard.home.pendingUserApprovals.noUsersDescription")}
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {users.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {/* Mobile: Stacked layout, Desktop: Side by side */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 sm:p-3 rounded-full ${user.emailVerifiedAt ? 'bg-success-100 dark:bg-success-900/30 text-success-500' : 'bg-warning-100 dark:bg-warning-900/30 text-warning-500'}`}>
                      <HiUser className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                          {user.name}
                        </h3>
                        {user.emailVerifiedAt ? (
                          <Chip
                            size="sm"
                            variant="flat"
                            color="success"
                            className="w-fit"
                          >
                            <div className="flex items-center gap-1">
                              <HiCheckCircle className="w-3 h-3" />
                              <span className="text-xs">{t("common.status.verified")}</span>
                            </div>
                          </Chip>
                        ) : (
                          <Chip
                            size="sm"
                            variant="flat"
                            color="warning"
                            className="w-fit"
                          >
                            <div className="flex items-center gap-1">
                              <HiClock className="w-3 h-3" />
                              <span className="text-xs">{t("common.status.unverified")}</span>
                            </div>
                          </Chip>
                        )}
                      </div>
                      
                      {/* Contact info - responsive grid */}
                      <div className="grid grid-cols-1 gap-2 mb-3">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          <HiMail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          <HiPhone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{user.phoneNumber}</span>
                        </div>
                      </div>
                      
                      {/* Dates - responsive layout */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <HiCalendar className="w-3 h-3 flex-shrink-0" />
                          <div>
                            <span className="hidden sm:inline">{t("common.dates.created")}: {formatDate(user.createdAt)}</span>
                            <span className="sm:hidden">{t("common.dates.createdShort")}: {formatShortDate(user.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <HiCheckCircle className="w-3 h-3 flex-shrink-0" />
                          <div>
                            <span className="hidden sm:inline">{t("common.dates.emailVerified")}: {formatDate(user.emailVerifiedAt)}</span>
                            <span className="sm:hidden">{t("common.dates.emailVerifiedShort")}: {formatShortDate(user.emailVerifiedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Time ago chip */}
                  <div className="flex justify-between sm:flex-col sm:items-end gap-2 mt-2 sm:mt-0">
                    <Chip
                      size="sm"
                      variant="flat"
                      color={user.emailVerifiedAt ? "success" : "warning"}
                      className="h-6"
                    >
                      <div className="flex items-center gap-1">
                        <HiClock className="w-3 h-3" />
                        <span className="text-xs">{translateTimeString(user.timeAgo)}</span>
                      </div>
                    </Chip>
                    
                    {/* Action buttons - mobile: full width, desktop: compact */}
                    <div className="flex gap-2 sm:mt-2">
                      {!user.emailVerifiedAt && (
                        <Button
                          size="sm"
                          variant="flat"
                          color="secondary"
                          as="a"
                          href={`/dashboard/users/${user.id}/resend-verification`}
                          className="text-xs px-2 sm:px-3"
                        >
                          {t("common.actions.resendVerification")}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        as="a"
                        href={`/dashboard/users/${user.id}/approve`}
                        className="text-xs px-2 sm:px-3"
                      >
                        {t("common.actions.approve")}
                      </Button>
                    </div>
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