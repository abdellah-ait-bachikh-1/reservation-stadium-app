// components/dashboard/home/sections/RecentActivitySection.tsx
"use client";

import { useTypedTranslations } from "@/utils/i18n";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  HiCalendar,
  HiCash,
  HiCollection,
  HiUser,
  HiOfficeBuilding,
  HiCheck,
  HiClock,
  HiExclamation,
  HiArrowRight
} from "react-icons/hi";
import { motion } from "framer-motion";

interface RecentActivity {
  id: string;
  type: 'reservation' | 'payment' | 'subscription' | 'user' | 'club';
  title: string;
  description: string;
  time: string;
  status?: 'success' | 'pending' | 'warning';
}

interface RecentActivitySectionProps {
  activities: RecentActivity[];
}

export default function RecentActivitySection({ activities }: RecentActivitySectionProps) {
  const t = useTypedTranslations();

  // Helper function to translate time strings
  const translateTimeString = (timeStr: string): string => {
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

    return timeStr;
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

  return (
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
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <HiCalendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{t("pages.dashboard.home.recentActivity.noActivity")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
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
  );
}