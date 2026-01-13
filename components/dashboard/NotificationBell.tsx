"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@heroui/button";
import { HiBell, HiCheck, HiOutlineBell } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@heroui/badge";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { disconnectPusher, pusherClient } from "@/lib/pusher/client";
import { useSafePositionScreen } from "@/hooks/useSafePositionScreen";
import { useTypedTranslations } from "@/utils/i18n";
import { NotificationType, UserPreferredLocaleType } from "@/types/db";
import { markAllNotificationAsReadAction, markOnNotificationAsReadAction } from "@/app/actions/notifications/notifications";
import { isErrorHasMessage } from "@/utils";
import { addToast } from "@heroui/toast";
import { FaCheck, FaCheckDouble, FaEbay, FaEye } from "react-icons/fa";
import { Tooltip } from "@heroui/tooltip"
interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  model: string;
  referenceId: string;
  link?: string;
  metadata?: any;
  createdAt: Date;
  localizedTitle?: string;
  localizedMessage?: string;
}

const NotificationBell = () => {
  const locale = useLocale();
  const t = useTypedTranslations();
  const { data: session, status } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");
  const {
    bellRef: safeBallRef,
    dropdownRef: safeDropDownRef,
    positionStyle,
    calculatePosition,
    refinePosition,
  } = useSafePositionScreen(() => setIsOpen(false));
  const bellRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Format relative time
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMinutes > 0) return `${diffMinutes}m ago`;
    return "just now";
  };



  // Transform API response to NotificationItem
  // In your NotificationBell component
  // Transform API response to NotificationItem (SIMPLIFIED)
  const transformNotification = (notification: any): NotificationItem => {
    return {
      id: notification.id,
      type: notification.type,
      title: notification.title, // Already localized from API
      message: notification.message, // Already localized from API
      time: formatRelativeTime(notification.createdAt),
      read: notification.isRead,
      model: notification.model || "USER",
      referenceId: notification.referenceId,
      link: notification.link || undefined,
      metadata: notification.metadata || undefined,
      createdAt: new Date(notification.createdAt),
      localizedTitle: notification.title, // Same as title
      localizedMessage: notification.message, // Same as message
    };
  };

  // Handle new notification from Pusher
  // Remove the getLocalizedContent function or keep it only for Pusher
  // Handle new notification from Pusher (UPDATED)
  const handleNewNotification = useCallback((notificationData: any) => {
    // console.log("📩 New notification received:", notificationData);

    const newNotification: NotificationItem = {
      id: notificationData.id,
      type: notificationData.type,
      title: notificationData.localizedTitle || notificationData.titleEn, // Use localized if available
      message: notificationData.localizedMessage || notificationData.messageEn, // Use localized if available
      time: "just now",
      read: false,
      model: notificationData.model,
      referenceId: notificationData.referenceId,
      link: notificationData.link,
      metadata: notificationData.metadata,
      createdAt: new Date(notificationData.createdAt),
      localizedTitle:
        notificationData.localizedTitle || notificationData.titleEn,
      localizedMessage:
        notificationData.localizedMessage || notificationData.messageEn,
    };

    // console.log("📥 Adding to UI:", newNotification);

    // Add new notification at the top
    setNotifications((prev) => {
      const newNotifications = [newNotification, ...prev];
      // Keep only last 20 notifications in the bell
      return newNotifications.slice(0, 20);
    });

    // Show browser notification if permission granted
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        const notification = new Notification(newNotification.title, {
          body: newNotification.message,
          icon: "/favicon.ico",
          tag: "notification",
          silent: false,
        });

        notification.onclick = () => {
          window.focus();
          setIsOpen(true);
        };

        setTimeout(() => notification.close(), 5000);
      } catch (error) {
        console.error("Error showing desktop notification:", error);
      }
    }
  }, []); // Remove locale dependency

  // Fetch notifications from API
  // Fetch notifications from API
  const fetchNotifications = async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/dashboard/notifications?limit=20`);

      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // API already returns localized data, no need to transform with locale
        const transformedNotifications = data.data.map(
          (notification: any) => transformNotification(notification) // No locale parameter needed
        );

        setNotifications(transformedNotifications);
        setInitialLoad(true);
      } else {
        throw new Error(data.error || "Failed to fetch notifications");
      }
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      const { success } = await markOnNotificationAsReadAction(id)

      if (success) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          )
        );
        addToast({ title: t('common.notifications.title'), description: t('common.notifications.markOneAsRead'), color: "primary" })

      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      if (isErrorHasMessage(error)) {
        throw new Error(error.message)
      } else {
        throw new Error("network Error")

      }
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const { success } = await markAllNotificationAsReadAction()
      if (success) {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, read: true }))
        );
        addToast({ title: t('common.notifications.title'), description: t('common.notifications.markAllRead'), color: "primary" })
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
      if (isErrorHasMessage(error)) {
        throw new Error(error.message)
      } else {
        throw new Error("network Error")

      }
    }
  };

  // Setup Pusher connection
  useEffect(() => {
    // Wait for session to be available
    if (status === "loading" || !session?.user?.id) {
      return;
    }

    const userId = session.user.id;

    // console.log("🔌 Setting up Pusher for user:", userId);
    setConnectionStatus("connecting");

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Load initial notifications
    if (!initialLoad) {
      fetchNotifications();
    }

    // Subscribe to channel using your working pattern
    const channel = pusherClient.subscribe(`private-user-${userId}`);

    // Bind events
    channel.bind("pusher:subscription_succeeded", () => {
      // console.log(`✅ Connected to Pusher channel for user ${userId}`);
      setConnectionStatus("connected");
    });

    channel.bind("notification", (data: any) => {
      // console.log("📩 New notification received:", data);
      handleNewNotification(data);
    });

    channel.bind("pusher:subscription_error", (error: any) => {
      console.error("❌ Pusher subscription error:", error);
      setConnectionStatus("disconnected");
    });

    // Connection listeners
    pusherClient.connection.bind("connected", () => {
      // console.log("✅ Pusher client connected");
    });

    pusherClient.connection.bind("connecting", () => {
      // console.log("🔄 Connecting to Pusher...");
    });

    pusherClient.connection.bind("disconnected", () => {
      console.log("🔌 Pusher disconnected");
      setConnectionStatus("disconnected");
    });

    pusherClient.connection.bind("error", (error: any) => {
      console.error("❌ Pusher connection error:", error);
      setConnectionStatus("disconnected");
    });

    // Cleanup
    return () => {
      console.log("🧹 Cleaning up Pusher connection for user:", userId);
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [session, status, locale, handleNewNotification, initialLoad]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen && !initialLoad) {
      fetchNotifications();
    }
  }, [isOpen, initialLoad]);

  useEffect(() => {
    if (isOpen) {
      calculatePosition();
      // Small delay to ensure the dropdown is rendered before refining
      setTimeout(() => refinePosition(), 100);
    }
  }, [isOpen, calculatePosition, refinePosition]);

  if (status === "loading") {
    return (
      <Button
        isIconOnly
        variant="light"
        className="relative"
        aria-label="Notifications"
        isLoading
      />
    );
  }
  if (!session?.user) {
    return null;
  }

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Get icon for notification type
  const getIconForType = (type: string) => {
    const colorMap: Record<string, { bg: string; text: string; icon: string }> =
    {
      USER: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-600 dark:text-blue-400",
        icon: "👤",
      },
      RESERVATION: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-600 dark:text-green-400",
        icon: "📅",
      },
      PAYMENT: {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-600 dark:text-purple-400",
        icon: "💰",
      },
      SYSTEM: {
        bg: "bg-zinc-100 dark:bg-zinc-900/30",
        text: "text-gray-600 dark:text-gray-400",
        icon: "⚙",
      },
      EMAIL: {
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-600 dark:text-amber-400",
        icon: "✉",
      },
      CLUB: {
        bg: "bg-indigo-100 dark:bg-indigo-900/30",
        text: "text-indigo-600 dark:text-indigo-400",
        icon: "🏆",
      },
      ADMIN: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-600 dark:text-red-400",
        icon: "🛡",
      },
    };

    const config = colorMap[type.split("_")[0]] || {
      bg: "bg-zinc-100 dark:bg-zinc-900/30",
      text: "text-gray-600 dark:text-gray-400",
      icon: "🔔",
    };

    return (
      <div
        className={`w-8 h-8 rounded-full ${config.bg} flex items-center justify-center`}
      >
        <span className={`${config.text} text-sm`}>{config.icon}</span>
      </div>
    );
  };

  // Get type color for badge
  const getTypeColor = (type: string) => {
    switch (type.split("_")[0]) {
      case "USER":
        return "bg-blue-500";
      case "RESERVATION":
        return "bg-green-500";
      case "PAYMENT":
        return "bg-purple-500";
      case "EMAIL":
        return "bg-amber-500";
      case "CLUB":
        return "bg-indigo-500";
      case "SYSTEM":
        return "bg-zinc-500";
      case "ADMIN":
        return "bg-red-500";
      default:
        return "bg-zinc-500";
    }
  };

  // Handle bell click
  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen && !initialLoad) {
      fetchNotifications();
    }
  };

  // Handle notification click (mark as read and navigate)
  const handleNotificationClick = (notification: NotificationItem) => {
    // markAsRead(notification.id);

    if (notification.link) {
      window.location.href = notification.link;
    }

    setIsOpen(false);
  };

  return (
    <div className="relative" ref={safeBallRef}>
      <Badge
        content={unreadCount}
        color="danger"
        isInvisible={unreadCount === 0}
        shape="circle"
      >
        <Button
          isIconOnly
          variant="flat"
          size="sm"
          radius="lg"
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
            {/* Dropdown */}
            <motion.div
              key="notification-dropdown"
              ref={safeDropDownRef}
              initial={{ opacity: 0, scale: 0.7, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: -10 }}
              style={positionStyle}
              className="bg-white absolute top-9 dark:bg-zinc-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden w-96 max-w-[calc(100vw-2rem)] z-50"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {t("common.notifications.title")}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${connectionStatus === "connected"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : connectionStatus === "connecting"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                    >
                      {connectionStatus === "connected"
                        ? t("common.notifications.live")
                        : connectionStatus === "connecting"
                          ? t("common.notifications.connecting")
                          : t("common.notifications.offline")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {unreadCount} {t("common.notifications.unread")}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <Tooltip
                    content={t("common.notifications.markAllRead")}
                    placement="bottom"
                    showArrow
                    color="foreground"
                  >
                    <Button
                      size="sm"
                      variant="flat"
                      className="text-xs"
                      radius="lg"
                      onPress={markAllAsRead}
                      isIconOnly
                    >
                      <FaCheckDouble className="w-3 h-3" />
                    </Button>
                  </Tooltip>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-80 md:max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">
                      {t("common.notifications.loading")}
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
                      {t("common.notifications.retry")}
                    </Button>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <HiOutlineBell className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {t("common.notifications.noNotifications")}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`group p-4 relative hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer ${notification.read ? "" : "bg-blue-50/50 dark:bg-blue-900/10"
                          }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 relative">
                            {getIconForType(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {notification.localizedTitle || notification.title}
                              </h4>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                              {notification.localizedMessage || notification.message}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {notification.time}
                              </span>
                              <span className="text-xs px-2 py-1 rounded-full bg-zinc-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400">
                                {notification.type.replace(/_/g, " ").toLowerCase()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* This button is positioned relative to the entire notification card */}
                        {!notification.read && (
                          <Tooltip color="foreground"
                            content={t('common.notifications.markOneAsRead')} placement="bottom" showArrow>
                            <Button
                              size="sm"
                              variant="flat"
                              className="text-xs absolute top-3 right-3"
                              radius="lg"
                              onPress={() => markAsRead(notification.id)}
                              isIconOnly
                            >
                              <FaCheck className="w-3 h-3" />
                            </Button>

                          </Tooltip>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center bg-zinc-50 dark:bg-zinc-800/50">
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-2 px-2">
                  <span>
                    {notifications.length} {t("common.notifications.total")}{" "}
                    (last 20)
                  </span>
                  <Button
                    variant="light"
                    size="sm"
                    onPress={() =>
                      (window.location.href = "/dashboard/notifications")
                    }
                  >
                    {t("common.notifications.viewAll")}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
