// app/test-notifications/page.tsx
"use client";

import { useState, useMemo } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import {
  HiBell,
  HiCheckCircle,
  HiXCircle,
  HiPaperAirplane,
  HiClock,
  HiCash,
  HiCog,
} from "react-icons/hi";
import { motion } from "framer-motion";

// Import the server actions
import {
  sendTestNotification,
  sendSystemAnnouncement,
  sendReservationApproved,
  sendPaymentReceived,
} from "@/app/actions/send-notification";

// Define Selection type for HeroUI
type Selection = "all" | Set<string>;

export default function TestNotificationsPage() {
  const [userId, setUserId] = useState("123");
  const [notificationType, setNotificationType] = useState<Selection>(
    new Set(["SYSTEM_ANNOUNCEMENT"])
  );
  const [customMessage, setCustomMessage] = useState("");
  const [locale, setLocale] = useState<Selection>(new Set(["FR"]));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  const notificationTypes = [
    { value: "USER_CREATED", label: "User Created", icon: "👤" },
    { value: "USER_APPROVED", label: "User Approved", icon: "✅" },
    {
      value: "RESERVATION_REQUESTED",
      label: "Reservation Requested",
      icon: "📅",
    },
    {
      value: "RESERVATION_APPROVED",
      label: "Reservation Approved",
      icon: "👍",
    },
    {
      value: "RESERVATION_DECLINED",
      label: "Reservation Declined",
      icon: "👎",
    },
    { value: "PAYMENT_RECEIVED", label: "Payment Received", icon: "💰" },
    { value: "PAYMENT_FAILED", label: "Payment Failed", icon: "❌" },
    { value: "SYSTEM_MAINTENANCE", label: "System Maintenance", icon: "🔧" },
    { value: "SYSTEM_ANNOUNCEMENT", label: "System Announcement", icon: "📢" },
    { value: "SYSTEM_UPDATE", label: "System Update", icon: "🔄" },
    { value: "ADMIN_NEW_USER", label: "Admin: New User", icon: "👥" },
    {
      value: "ADMIN_NEW_RESERVATION",
      label: "Admin: New Reservation",
      icon: "📋",
    },
  ];

  const localeOptions = [
    { value: "EN", label: "English 🇬🇧" },
    { value: "FR", label: "Français 🇫🇷" },
    { value: "AR", label: "العربية 🇸🇦" },
  ];

  // Helper to get first value from Selection
  const getFirstValue = (selection: Selection): string => {
    if (selection === "all") return "";
    if (selection instanceof Set) {
      return Array.from(selection)[0] || "";
    }
    return "";
  };

  // Get current values for display
  const currentNotificationType = useMemo(
    () => getFirstValue(notificationType),
    [notificationType]
  );

  const currentLocale = useMemo(() => getFirstValue(locale), [locale]);

  const handleSendTest = async () => {
    setLoading(true);
    setResult(null);

    const selectedType = currentNotificationType;
    const selectedLocale = currentLocale as "EN" | "FR" | "AR";

    try {
      const result = await sendTestNotification({
        userId,
        type: selectedType,
        customMessage,
        locale: selectedLocale,
      });

      setResult(result);

      // Add to history
      setHistory((prev) => [
        {
          id: Date.now(),
          type: selectedType,
          userId,
          time: new Date().toLocaleTimeString(),
          success: result.success,
        },
        ...prev.slice(0, 9),
      ]);
    } catch (error) {
      setResult({ success: false, error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSend = async (action: () => Promise<any>, type: string) => {
    setLoading(true);
    setResult(null);

    try {
      const result = await action();
      setResult(result);

      setHistory((prev) => [
        {
          id: Date.now(),
          type,
          userId: "123",
          time: new Date().toLocaleTimeString(),
          success: result.success,
        },
        ...prev.slice(0, 9),
      ]);
    } catch (error) {
      setResult({ success: false, error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <HiBell className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Notification Tester
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Send real-time notifications to test your Pusher implementation
          </p>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 Currently testing with static user ID: <strong>123</strong>
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Test Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Custom Test Card */}
            <Card className="shadow-lg">
              <CardHeader className="border-b dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <HiPaperAirplane className="w-5 h-5 text-blue-500" />
                  <h2 className="text-xl font-semibold">
                    Custom Notification Test
                  </h2>
                </div>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                      User ID
                    </label>
                    <Input
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="Enter user ID"
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Default: 123 (static test user)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                      Language
                    </label>
                    <Select
                      selectedKeys={locale}
                      onSelectionChange={(keys) => {
                        if (keys === "all") {
                          setLocale("all");
                        } else {
                          // Convert Set<Key> to Set<string>
                          const stringSet = new Set<string>();
                          keys.forEach((key) => stringSet.add(String(key)));
                          setLocale(stringSet);
                        }
                      }}
                      className="w-full"
                      label="Select Language"
                    >
                      {localeOptions.map((loc) => (
                        <SelectItem key={loc.value}>{loc.label}</SelectItem>
                      ))}
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Selected: {currentLocale}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                    Notification Type
                  </label>
                  <Select
                    selectedKeys={notificationType}
                    onSelectionChange={(keys) => {
                      // Convert SharedSelection to your Selection type
                      if (keys === "all") {
                        setNotificationType("all");
                      } else {
                        // Convert Set<Key> to Set<string>
                        const stringSet = new Set<string>();
                        keys.forEach((key) => stringSet.add(String(key)));
                        setNotificationType(stringSet);
                      }
                    }}
                    className="w-full"
                    label="Select Notification Type"
                  >
                    {notificationTypes.map((type) => (
                      <SelectItem key={type.value}>
                        <div className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {currentNotificationType}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                    Custom Message (Optional)
                  </label>
                  <Textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Enter a custom message for the notification..."
                    className="w-full"
                    minRows={3}
                  />
                </div>

                <Button
                  color="primary"
                  isLoading={loading}
                  onPress={handleSendTest}
                  className="w-full"
                  startContent={<HiBell className="w-5 h-5" />}
                >
                  Send Test Notification
                </Button>
              </CardBody>
            </Card>

            {/* Quick Test Buttons */}
            <Card className="shadow-lg">
              <CardHeader className="border-b dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <HiCog className="w-5 h-5 text-green-500" />
                  <h2 className="text-xl font-semibold">Quick Tests</h2>
                </div>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                    color="success"
                    variant="flat"
                    onPress={() =>
                      handleQuickSend(
                        sendSystemAnnouncement,
                        "SYSTEM_ANNOUNCEMENT"
                      )
                    }
                    isLoading={loading}
                    startContent={<HiCog className="w-5 h-5" />}
                  >
                    System Announcement
                  </Button>

                  <Button
                    color="warning"
                    variant="flat"
                    onPress={() =>
                      handleQuickSend(
                        sendReservationApproved,
                        "RESERVATION_APPROVED"
                      )
                    }
                    isLoading={loading}
                    startContent={<HiClock className="w-5 h-5" />}
                  >
                    Reservation Approved
                  </Button>

                  <Button
                    color="primary"
                    variant="flat"
                    onPress={() =>
                      handleQuickSend(sendPaymentReceived, "PAYMENT_RECEIVED")
                    }
                    isLoading={loading}
                    startContent={<HiCash className="w-5 h-5" />}
                  >
                    Payment Received
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right Column: Results & History */}
          <div className="space-y-6">
            {/* Result Card */}
            <Card className="shadow-lg">
              <CardHeader className="border-b dark:border-gray-700">
                <h2 className="text-xl font-semibold">Test Result</h2>
              </CardHeader>
              <CardBody>
                {result ? (
                  <div
                    className={`p-4 rounded-lg ${
                      result.success
                        ? "bg-green-50 dark:bg-green-900/20"
                        : "bg-red-50 dark:bg-red-900/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {result.success ? (
                        <HiCheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      ) : (
                        <HiXCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                      )}
                      <div>
                        <h3
                          className={`font-semibold ${
                            result.success
                              ? "text-green-800 dark:text-green-300"
                              : "text-red-800 dark:text-red-300"
                          }`}
                        >
                          {result.success ? "✅ Success!" : "❌ Failed"}
                        </h3>
                        <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                          {result.success ? result.message : result.error}
                        </p>
                        {result.success && result.data && (
                          <div className="mt-3 text-xs bg-white dark:bg-gray-800 p-2 rounded">
                            <pre className="overflow-x-auto">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <HiBell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>
                      No test results yet. Send a notification to see results
                      here.
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* History Card */}
            <Card className="shadow-lg">
              <CardHeader className="border-b dark:border-gray-700">
                <h2 className="text-xl font-semibold">Recent Tests</h2>
              </CardHeader>
              <CardBody>
                {history.length > 0 ? (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg border ${
                          item.success
                            ? "border-green-200 dark:border-green-800"
                            : "border-red-200 dark:border-red-800"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {notificationTypes.find(
                                (t) => t.value === item.type
                              )?.icon || "🔔"}
                            </span>
                            <span className="font-medium text-sm truncate">
                              {notificationTypes.find(
                                (t) => t.value === item.type
                              )?.label || item.type}
                            </span>
                          </div>
                          <div
                            className={`px-2 py-1 rounded-full text-xs ${
                              item.success
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {item.success ? "Success" : "Failed"}
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                          <span>User: {item.userId}</span>
                          <span>{item.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No test history yet.</p>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Info Card */}
            <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardBody>
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                  💡 Testing Guide
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• Open this page and your main app side-by-side</li>
                  <li>• Click any test button</li>
                  <li>• Watch the notification appear instantly in your app</li>
                  <li>• No page refresh needed!</li>
                  <li className="font-semibold mt-2">Current User ID: 123</li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                📡 Pusher Status
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Server:{" "}
                <span className="text-green-600 font-medium">Connected</span>
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                🔔 Test User
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ID:{" "}
                <code className="bg-gray-200 dark:bg-gray-700 px-2 rounded">
                  123
                </code>
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                🎯 Channel
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <code className="bg-gray-200 dark:bg-gray-700 px-2 rounded">
                  private-user-123
                </code>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
