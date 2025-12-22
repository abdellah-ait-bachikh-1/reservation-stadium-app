"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@heroui/button";
import { HiBell, HiCheck, HiOutlineBell } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@heroui/badge";
import { useSafePositionScreen } from "@/hooks/useSafePositionScreen";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/app/actions/notifications";
import { setupPusher } from "@/lib/pusher-client";

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

// دالة مساعدة لإنشاء ID فريد
const generateId = () => `pusher-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  // في NotificationBell.tsx بعد useState مباشرة
const safeTranslate = (key: string, fallback: string) => {
  try {
    const translation = t(key);
    return translation;
  } catch (error) {
    console.warn(`Translation missing for key: ${key}, using fallback: ${fallback}`);
    return fallback;
  }
};
  const t = useTranslations("Components.Dashboard.Notifications");
  const { data: session } = useSession();

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
      const locale = document.documentElement.lang || "en";

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

  // دالة معالجة الإشعار الجديد من Pusher
  const handleNewNotification = useCallback((notificationData: any) => {
    console.log("📩 Processing new push notification:", notificationData);
  
  // الحصول على اللغة الحالية من المتصفح أو استخدام اللغة من البيانات
  let currentLocale = document.documentElement.lang || "ar";
  
  // إذا كانت البيانات تحتوي على لغة المستلم، استخدمها
  if (notificationData.data?.receiverLocale) {
    currentLocale = notificationData.data.receiverLocale;
  }
  
  // استخدام الترجمات المرسلة أو الترجمة المناسبة
  let title = notificationData.title;
  let message = notificationData.message;
  
  if (notificationData.data?.translations) {
    switch (currentLocale) {
      case "fr":
        title = notificationData.data.translations.titleFr || title;
        message = notificationData.data.translations.messageFr || message;
        break;
      case "ar":
        title = notificationData.data.translations.titleAr || title;
        message = notificationData.data.translations.messageAr || message;
        break;
      default: // en
        title = notificationData.data.translations.titleEn || title;
        message = notificationData.data.translations.messageEn || message;
    }
  }
  
    const newNotification: NotificationItem = {
      id: notificationData.id || generateId(),
      type: notificationData.type.toLowerCase() as NotificationItem["type"],
      title,
      message,
      time: "just now",
      read: false,
      metadata: notificationData.data || notificationData.metadata,
      actorName: notificationData.data?.actorName || notificationData.actorName,
      actorEmail: notificationData.data?.actorEmail || notificationData.actorEmail,
      createdAt: new Date(notificationData.createdAt || new Date()),
    };

    console.log("📥 Adding new notification:", newNotification);

    // إضافة الإشعار الجديد في الأعلى مع إزالة الإشعارات القديمة إذا تجاوزت الحد
    setNotifications((prev) => {
      const newNotifications = [newNotification, ...prev];
      // حفظ فقط آخر 50 إشعار
      return newNotifications.slice(0, 50);
    });

    // إظهار إشعار سطح المكتب (إذا كان مدعوماً)
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        const notification = new Notification(title, {
          body: message,
          icon: "/favicon.ico",
          tag: "notification",
          silent: false,
        });

        // عند النقر على الإشعار، افتح dropdown الإشعارات
        notification.onclick = () => {
          window.focus();
          setIsOpen(true);
        };

        // إغلاق الإشعار تلقائياً بعد 5 ثواني
        setTimeout(() => notification.close(), 5000);
      } catch (error) {
        console.error("Error showing desktop notification:", error);
      }
    }

    // تشغيل صوت للإشعار
    // playNotificationSound();
  }, []);

  // دالة لتشغيل صوت الإشعار
//   const playNotificationSound = () => {
//     try {
//       const audio = new Audio("/sounds/notification.mp3");
//       audio.volume = 0.3;
//       audio.play().catch(console.error);
//     } catch (error) {
//       console.error("Error playing notification sound:", error);
//     }
//   };

  // طلب إذن إشعارات سطح المكتب
  const requestNotificationPermission = () => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }
  };

  // إعداد Pusher عندما يتوفر session
  useEffect(() => {
    if (!session?.user?.id) {
      console.log("⏳ Waiting for user session...");
      return;
    }

    console.log("🔌 Setting up Pusher for user:", session.user.id);
    setConnectionStatus("connecting");

    // طلب إذن الإشعارات
    requestNotificationPermission();

    const cleanup = setupPusher({
      userId: session.user.id,
      onNotification: handleNewNotification,
      onConnected: () => {
        console.log("✅ Pusher connected successfully");
        setConnectionStatus("connected");
      },
      onError: (error) => {
        console.error("❌ Pusher error:", error);
        setConnectionStatus("disconnected");
      },
    });

    return () => {
      console.log("🧹 Cleaning up Pusher connection");
      cleanup?.();
      setConnectionStatus("disconnected");
    };
  }, [session?.user?.id, handleNewNotification]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Format time with translation
  const formatTime = (timeString: string) => {
    // Handle Arabic time strings
    if (
      timeString.includes("قبل") ||
      timeString.includes("دقيقة") ||
      timeString.includes("ساعة")
    ) {
      return timeString;
    }
    
    const timeAgoPattern = /(\d+)\s+(minute?|hour?|day?|week?|month?)\w*\s+ago/i;
    const match = timeString.match(timeAgoPattern);

    if (match) {
      const count = parseInt(match[1]);
      const unit = match[2].toLowerCase().replace(/s$/, "");

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
// في NotificationBell.tsx
// Get translated notification type
const getTranslatedType = (type: string) => {
  // تحويل الأنواع من Pusher إلى أسماء بسيطة
  const typeMapping: Record<string, string> = {
    'reservation_requested': 'reservation',
    'reservation_approved': 'reservation',
    'reservation_declined': 'reservation',
    'reservation_cancelled': 'reservation',
    'payment_received': 'payment',
    'payment_overdue': 'payment',
    'payment_failed': 'payment',
    'account_approved': 'account',
    'account_rejected': 'account',
    'account_created': 'account',
    'club_registration_submitted': 'club',
    'club_registration_approved': 'club',
    'club_registration_rejected': 'club',
    'system_maintenance': 'system',
    'system_update': 'system',
    'new_feature': 'system',
    'announcement': 'system',
    'email_sent': 'email',
    'email_verified': 'email',
    'welcome_email': 'email',
  };
  
  const simpleType = typeMapping[type] || type;
  
  try {
    const translation = t(`types.${simpleType}`);
    return translation || simpleType;
  } catch (error) {
    console.warn(`Translation not found for type: ${type} (mapped to: ${simpleType})`);
    return simpleType;
  }
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
      // تحديث الإشعارات عند فتح القائمة
      fetchNotifications();
    }
  };

  return (
    <div className="relative" ref={bellRef}>
      {/* مؤشر حالة الاتصال */}
      <div className="absolute -top-1 -right-1 z-10">
        <div
          className={`w-3 h-3 rounded-full ${
            connectionStatus === "connected"
              ? "bg-green-500 animate-pulse"
              : connectionStatus === "connecting"
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
          title={
            connectionStatus === "connected"
              ? "Connected to real-time notifications"
              : connectionStatus === "connecting"
              ? "Connecting to real-time notifications..."
              : "Real-time notifications disconnected"
          }
        />
      </div>

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
          aria-label="Notifications"
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
              className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden w-96 z-50"
            >
              {/* Header with connection status */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {t("title")}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        connectionStatus === "connected"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : connectionStatus === "connecting"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {connectionStatus === "connected"
                        ? "Live"
                        : connectionStatus === "connecting"
                        ? "Connecting..."
                        : "Offline"}
                    </span>
                  </div>
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
                    {connectionStatus !== "connected" && (
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                        {t("realtimeDisabled")}
                      </p>
                    )}
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
                        } ${notification.id.startsWith("pusher-") ? "border-l-4 border-l-blue-500" : ""}`}
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
                                {notification.id.startsWith("pusher-") && (
                                  <span className="ml-2 text-xs text-blue-500 animate-pulse">
                                    ●
                                  </span>
                                )}
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

              {/* Footer */}
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-2 px-2">
                  <span>
                    {connectionStatus === "connected"
                      ? "Live updates enabled"
                      : "Real-time updates disabled"}
                  </span>
                  <span>{notifications.length} total</span>
                </div>
                <Button
                  variant="light"
                  size="sm"
                  className="w-full text-sm"
                  onPress={() => setIsOpen(false)}
                >
{safeTranslate("close", "Close")}
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