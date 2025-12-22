"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@heroui/button";
import { HiBell, HiCheck, HiOutlineBell } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@heroui/badge";
import { useSafePositionScreen } from "@/hooks/useSafePositionScreen";
import { useTranslations } from "next-intl";

interface NotificationItem {
  id: string;
  type: "account" | "reservation" | "payment" | "system" | "email";
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: React.ReactNode;
  action?: () => void;
}

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Components.Dashboard.Notifications");
  
  // Use the position hook
  const { bellRef, dropdownRef, positionStyle, calculatePosition, refinePosition, isMobile } = useSafePositionScreen();

const [notifications, setNotifications] = useState<NotificationItem[]>([
  {
    id: "1",
    type: "account",
    title: "New Club Registration",
    message: "Al Ahly Club has submitted registration for approval",
    time: "2 min ago",
    read: false,
    icon: (
      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
        <span className="text-blue-600 dark:text-blue-400 font-bold">C</span>
      </div>
    ),
  },
  {
    id: "2",
    type: "reservation",
    title: "Reservation Request",
    message: "New booking request for Stadium 1 - Tomorrow 4:00 PM",
    time: "15 min ago",
    read: false,
    icon: (
      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
        <span className="text-green-600 dark:text-green-400 font-bold">B</span>
      </div>
    ),
  },
  {
    id: "3",
    type: "payment",
    title: "Payment Successful",
    message: "Monthly subscription payment received - $500.00",
    time: "1 hour ago",
    read: true,
    icon: (
      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
        <span className="text-purple-600 dark:text-purple-400 font-bold">$</span>
      </div>
    ),
  },
  {
    id: "4",
    type: "payment",
    title: "Payment Overdue",
    message: "Zamalek Club has overdue payment - Please follow up",
    time: "3 hours ago",
    read: false,
    icon: (
      <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <span className="text-red-600 dark:text-red-400 font-bold">!</span>
      </div>
    ),
  },
  {
    id: "5",
    type: "email",
    title: "Welcome Email Sent",
    message: "Account confirmation email delivered successfully",
    time: "5 hours ago",
    read: true,
    icon: (
      <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
        <span className="text-amber-600 dark:text-amber-400 font-bold">✉</span>
      </div>
    ),
  },
  {
    id: "6",
    type: "reservation",
    title: "Reservation Approved",
    message: "Your booking for Stadium 3 has been confirmed",
    time: "1 day ago",
    read: true,
    icon: (
      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
        <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
      </div>
    ),
  },
  {
    id: "7",
    type: "system",
    title: "System Maintenance",
    message: "Scheduled maintenance tonight at 2:00 AM",
    time: "2 days ago",
    read: true,
    icon: (
      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <span className="text-gray-600 dark:text-gray-400 font-bold">⚙</span>
      </div>
    ),
  },
  {
    id: "8",
    type: "account",
    title: "Profile Updated",
    message: "Your account profile information has been successfully updated",
    time: "3 days ago",
    read: true,
    icon: (
      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
        <span className="text-blue-600 dark:text-blue-400 font-bold">👤</span>
      </div>
    ),
  },
  {
    id: "9",
    type: "reservation",
    title: "Reservation Cancelled",
    message: "Your booking for Stadium 2 on Friday has been cancelled",
    time: "1 week ago",
    read: true,
    icon: (
      <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <span className="text-red-600 dark:text-red-400 font-bold">✕</span>
      </div>
    ),
  },
  {
    id: "10",
    type: "payment",
    title: "Refund Processed",
    message: "Your refund of $250 has been processed successfully",
    time: "1 week ago",
    read: true,
    icon: (
      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
        <span className="text-green-600 dark:text-green-400 font-bold">↶</span>
      </div>
    ),
  },
  {
    id: "11",
    type: "system",
    title: "New Feature Available",
    message: "Check out the new stadium booking features in your dashboard",
    time: "2 weeks ago",
    read: true,
    icon: (
      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
        <span className="text-indigo-600 dark:text-indigo-400 font-bold">🆕</span>
      </div>
    ),
  },
  {
    id: "12",
    type: "email",
    title: "Newsletter Sent",
    message: "Monthly sports club newsletter has been delivered to subscribers",
    time: "1 month ago",
    read: true,
    icon: (
      <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
        <span className="text-amber-600 dark:text-amber-400 font-bold">📰</span>
      </div>
    ),
  },
]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Format time with translation - parse the time string
  const formatTime = (timeString: string) => {
    // Example: "2 min ago" -> parse number and unit
    const match = timeString.match(/(\d+)\s+(\w+)\s+ago/);
    if (match) {
      const count = parseInt(match[1]);
      const unit = match[2].toLowerCase();
      
      switch(unit) {
        case 'min':
        case 'mins':
          return t('time.minutesAgo', { count });
        case 'hour':
        case 'hours':
          return t('time.hoursAgo', { count });
        case 'day':
        case 'days':
          return t('time.daysAgo', { count });
        case 'week':
        case 'weeks':
          return t('time.weeksAgo', { count });
        case 'month':
        case 'months':
          return t('time.monthsAgo', { count });
        default:
          return timeString;
      }
    }
    
    // For other formats like "Just now"
    if (timeString.toLowerCase().includes('just now')) {
      return t('time.justNow');
    }
    
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [bellRef]);

  // Recalculate position when dropdown opens
  useEffect(() => {
    if (isOpen) {
      // Calculate position immediately
      calculatePosition();
      
      // Refine after a small delay when DOM is updated
      const timer = setTimeout(() => {
        refinePosition();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, calculatePosition, refinePosition]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
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
      case "system":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Pre-calculate before opening
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
            {/* Backdrop for mobile */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
                onClick={() => setIsOpen(false)}
              />
            )}
            
            {/* Dropdown */}
            <motion.div
              key="notification-dropdown"
              ref={dropdownRef}
              initial={{ opacity: 0, scale: 0.7, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: -10 }}
              style={positionStyle}
              className={`
                bg-white dark:bg-gray-900 
                rounded-xl 
                shadow-2xl 
                border border-gray-200 dark:border-gray-700 
                overflow-hidden
                w-96
              `}
            >
              {/* Header */}
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

              {/* Notifications List */}
              <div className="max-h-80 md:max-h-96 overflow-y-auto overscroll-contain">
                {notifications.length === 0 ? (
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
                          {/* Icon */}
                          <div className="flex-shrink-0">
                            {notification.icon}
                          </div>

                          {/* Content */}
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

              {/* Footer */}
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                <Button
                  variant="light"
                  size="sm"
                  className="w-full text-sm"
                  onPress={() => {
                    setIsOpen(false);
                  }}
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