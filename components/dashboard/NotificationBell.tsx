"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@heroui/button";
import { HiBell, HiCheck, HiOutlineBell } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@heroui/badge";
import { useSafePositionScreen } from "@/hooks/useSafePositionScreen";
import { useTranslations } from "next-intl";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/app/actions/notifications";

interface NotificationItem {
  id: string;
  type: "account" | "reservation" | "payment" | "system" | "email" | "club";
  title: string;
  message: string;
  time: string;
  read: boolean;
  metadata?: any;
  actorName?: string | null;
  actorNameAr?: string | null;
  actorEmail?: string | null;
  createdAt: Date;
}

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("Components.Dashboard.Notifications");

  // Use the position hook
  const {
    bellRef,
    dropdownRef,
    positionStyle,
    calculatePosition,
    refinePosition,
    isMobile,
  } = useSafePositionScreen();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Function to get icon based on notification type
  const getIconForType = (type: string) => {
    const colorMap: Record<
      string,
      { colorClass: string; textColorClass: string; symbol: string }
    > = {
      account: {
        colorClass: "bg-blue-100 dark:bg-blue-900/30",
        textColorClass: "text-blue-600 dark:text-blue-400",
        symbol: "A",
      },
      reservation: {
        colorClass: "bg-green-100 dark:bg-green-900/30",
        textColorClass: "text-green-600 dark:text-green-400",
        symbol: "R",
      },
      payment: {
        colorClass: "bg-purple-100 dark:bg-purple-900/30",
        textColorClass: "text-purple-600 dark:text-purple-400",
        symbol: "$",
      },
      system: {
        colorClass: "bg-gray-100 dark:bg-gray-900/30",
        textColorClass: "text-gray-600 dark:text-gray-400",
        symbol: "⚙",
      },
      email: {
        colorClass: "bg-amber-100 dark:bg-amber-900/30",
        textColorClass: "text-amber-600 dark:text-amber-400",
        symbol: "✉",
      },
      club: {
        colorClass: "bg-indigo-100 dark:bg-indigo-900/30",
        textColorClass: "text-indigo-600 dark:text-indigo-400",
        symbol: "C",
      },
    };

    const { colorClass, textColorClass, symbol } = colorMap[type] || {
      colorClass: "bg-gray-100 dark:bg-gray-900/30",
      textColorClass: "text-gray-600 dark:text-gray-400",
      symbol: "N",
    };

    return (
      <div
        className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center`}
      >
        <span className={`${textColorClass} font-bold`}>{symbol}</span>
      </div>
    );
  };

  // Fetch notifications from API
 const fetchNotifications = async () => {
  try {
    setIsLoading(true);
    setError(null);

    // احصل على اللغة الحالية
    const locale = document.documentElement.lang || 'en';
    
    const response = await fetch(`/api/notifications?locale=${locale}`);

    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }

    const data = await response.json();
    setNotifications(data.notifications || []);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    setError("Failed to load notifications");
    setNotifications([]);
  } finally {
    setIsLoading(false);
  }
};

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);
console.log(notifications)
  // Format time with translation - IMPROVED VERSION
  const formatTime = (timeString: string) => {
    // Handle different time string formats
      if (timeString.includes('قبل') || timeString.includes('دقيقة') || timeString.includes('ساعة')) {
    return timeString;
  }
    const timeAgoPattern = /(\d+)\s+(minute?|hour?|day?|week?|month?)\w*\s+ago/i;
    const match = timeString.match(timeAgoPattern);

    if (match) {
      const count = parseInt(match[1]);
      const unit = match[2].toLowerCase().replace(/s$/, ""); // Remove plural 's'

      const translationMap: Record<string, string> = {
        min: "time.minutesAgo",
        minute: "time.minutesAgo",
        hour: "time.hoursAgo",
        day: "time.daysAgo",
        week: "time.weeksAgo",
        month: "time.monthsAgo",
      };

      const translationKey = translationMap[unit];
      if (translationKey) {
        return t(translationKey, { count });
      }
    }

    // Handle "just now"
    if (timeString.toLowerCase().includes("just now")) {
      return t("time.justNow");
    }

    // Fallback to original string
    return timeString;
  };

  // Get translated notification type
  const getTranslatedType = (type: string) => {
    return t(`types.${type}`) || type;
  };

  // Pre-calculate position when component mounts
  useEffect(() => {
    calculatePosition();
  }, [calculatePosition]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        bellRef.current &&
        !bellRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [bellRef]);

  // Recalculate position when dropdown opens
  useEffect(() => {
    if (isOpen) {
      calculatePosition();
      const timer = setTimeout(() => refinePosition(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, calculatePosition, refinePosition]);

  // Mark single notification as read
  const markAsRead = async (id: string) => {
    const result = await markNotificationAsRead(id);
    if (!result.error) {
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    const result = await markAllNotificationsAsRead();
    if (!result.error) {
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
    }
  };

  const getTypeColor = (type: NotificationItem["type"]) => {
    switch (type) {
      case "account":
        return "bg-blue-500";
      case "reservation":
        return "bg-green-500";
      case "payment":
        return "bg-purple-500";
      case "email":
        return "bg-amber-500";
      case "club":
        return "bg-indigo-500";
      case "system":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      calculatePosition();
    }
  };

  return (
    <div className="relative" ref={bellRef}>
      <Badge
        content={unreadCount}
        color="danger"
        isInvisible={unreadCount === 0}
        shape="circle"
      >
        <Button
          isIconOnly
          variant="light"
          className="relative"
          onPress={handleBellClick}
        >
          {isOpen ? (
            <HiOutlineBell className="w-5 h-5" />
          ) : (
            <HiBell className="w-5 h-5" />
          )}
        </Button>
      </Badge>

      <AnimatePresence>
        {isOpen && (
          <>
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
                onClick={() => setIsOpen(false)}
              />
            )}

            <motion.div
              key="notification-dropdown"
              ref={dropdownRef}
              initial={{ opacity: 0, scale: 0.7, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: -10 }}
              style={positionStyle}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden w-96"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t("title")}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("unreadCount", { count: unreadCount })}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <Button
                    size="sm"
                    variant="flat"
                    className="text-xs"
                    onPress={markAllAsRead}
                  >
                    <HiCheck className="w-3 h-3 mr-1" />
                    {t("markAllRead")}
                  </Button>
                )}
              </div>

              <div className="max-h-80 md:max-h-96 overflow-y-auto overscroll-contain">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">
                      {t("loading")}
                    </p>
                  </div>
                ) : error ? (
                  <div className="p-8 text-center">
                    <p className="text-red-500 dark:text-red-400 mb-2">
                      {error}
                    </p>
                    <Button
                      size="sm"
                      variant="flat"
                      onPress={fetchNotifications}
                    >
                      {t("retry")}
                    </Button>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <HiOutlineBell className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {t("noNotifications")}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
                          notification.read
                            ? ""
                            : "bg-blue-50/50 dark:bg-blue-900/10"
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0">
                            {getIconForType(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div
                                  className={`w-2 h-2 rounded-full ${getTypeColor(
                                    notification.type
                                  )}`}
                                />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            {notification.actorName && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {t("from", { name: notification.actorName })}
                              </p>
                            )}
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTime(notification.time)}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  notification.read
                                    ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                    : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                }`}
                              >
                                {getTranslatedType(notification.type)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                <Button
                  variant="light"
                  size="sm"
                  className="w-full text-sm"
                  onPress={() => setIsOpen(false)}
                >
                  {t("viewAll")}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;