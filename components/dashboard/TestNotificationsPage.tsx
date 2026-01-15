// app/test-notifications/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox } from "@heroui/checkbox";
import {
  HiBell,
  HiCheckCircle,
  HiXCircle,
  HiCog,
  HiUsers,
  HiUserGroup,
  HiGlobe,
  HiRefresh,
  HiUser,
} from "react-icons/hi";
import { motion } from "framer-motion";

// Import server actions (for mutations)
import {
  sendToUser,
  sendToUsers,
  sendToAllAdmins,
  sendToAllUsers,
} from "@/app/actions/notifications/send-notification";

type Selection = "all" | Set<string>;

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  preferredLocale: "EN" | "FR" | "AR";
}

export default function TestNotificationsPage() {
  const [selectedUserIds, setSelectedUserIds] = useState<Selection>(new Set());
  const [notificationType, setNotificationType] = useState<Selection>(
    new Set(["SYSTEM_ANNOUNCEMENT"])
  );
  const [customMessage, setCustomMessage] = useState("");
  const [locale, setLocale] = useState<Selection>(new Set(["FR"]));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  // User lists from database via API
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allAdmins, setAllAdmins] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const notificationTypes = [
    { value: "USER_CREATED", label: "User Created", icon: "👤" },
    { value: "USER_APPROVED", label: "User Approved", icon: "✅" },
    { value: "RESERVATION_REQUESTED", label: "Reservation Requested", icon: "📅" },
    { value: "RESERVATION_APPROVED", label: "Reservation Approved", icon: "👍" },
    { value: "RESERVATION_DECLINED", label: "Reservation Declined", icon: "👎" },
    { value: "PAYMENT_RECEIVED", label: "Payment Received", icon: "💰" },
    { value: "PAYMENT_FAILED", label: "Payment Failed", icon: "❌" },
    { value: "SYSTEM_MAINTENANCE", label: "System Maintenance", icon: "🔧" },
    { value: "SYSTEM_ANNOUNCEMENT", label: "System Announcement", icon: "📢" },
    { value: "SYSTEM_UPDATE", label: "System Update", icon: "🔄" },
    { value: "ADMIN_NEW_USER", label: "Admin: New User", icon: "👥" },
    { value: "ADMIN_NEW_RESERVATION", label: "Admin: New Reservation", icon: "📋" },
  ];

  const localeOptions = [
    { value: "EN", label: "English 🇬🇧" },
    { value: "FR", label: "Français 🇫🇷" },
    { value: "AR", label: "العربية 🇸🇦" },
  ];

  // Load users from API on component mount
  useEffect(() => {
    loadUsersFromAPI();
  }, []);

  const loadUsersFromAPI = async () => {
    setLoadingUsers(true);
    try {
      // Fetch all users
      const usersResponse = await fetch('/api/dashboard/users?type=all');
      const usersData = await usersResponse.json();

      if (usersData.success) {
        setAllUsers(usersData.data);
      } else {
        throw new Error(usersData.error);
      }

      // Fetch admin users
      const adminsResponse = await fetch('/api/dashboard/users?type=admins');
      const adminsData = await adminsResponse.json();

      if (adminsData.success) {
        setAllAdmins(adminsData.data);
      } else {
        throw new Error(adminsData.error);
      }

    } catch (error) {
      console.error("Error loading users from API:", error);
      setResult({
        success: false,
        error: "Failed to load users from database. Check console for details."
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const getFirstValue = (selection: Selection): string => {
    if (selection === "all") return "";
    if (selection instanceof Set) {
      return Array.from(selection)[0] || "";
    }
    return "";
  };

  const currentNotificationType = getFirstValue(notificationType);
  const currentLocale = getFirstValue(locale) as "EN" | "FR" | "AR";

  // Filter users based on search query
  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle sending notification using server action
  // Handle sending notification using server action
  // Handle sending notification using server action
  const handleSendNotification = async (recipientType: string) => {
    setLoading(true);
    setResult(null);

    try {
      let result;
      const userIds = Array.from(selectedUserIds instanceof Set ? selectedUserIds : []);

      switch (recipientType) {
        case "specific_user":
          if (userIds.length === 0) {
            throw new Error("Please select at least one user");
          }

          if (userIds.length === 1) {
            result = await sendToUser(
              userIds[0],
              currentNotificationType,
              customMessage,
              currentLocale
            );
          } else {
            result = await sendToUsers(
              userIds,
              currentNotificationType,
              customMessage,
              currentLocale
            );
          }
          break;

        case "all_admins":
          result = await sendToAllAdmins(
            currentNotificationType,
            customMessage,
            currentLocale
          );
          break;

        case "all_users":
          result = await sendToAllUsers(
            currentNotificationType,
            customMessage,
            currentLocale
          );
          break;

        default:
          throw new Error("Invalid recipient type");
      }

      setResult(result);

      // Add to history - Use type assertions
      setHistory((prev) => [
        {
          id: Date.now(),
          type: recipientType,
          notificationType: currentNotificationType,
          count: (result.data as any)?.successful ||
            (userIds.length === 1 ? (result.success ? 1 : 0) : 0) ||
            1,
          total: (result.data as any)?.totalUsers ||
            (result.data as any)?.totalAdmins ||
            userIds.length ||
            0,
          time: new Date().toLocaleTimeString(),
          success: result.success,
          message: result.message,
        },
        ...prev.slice(0, 9),
      ]);
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || "An error occurred"
      });
    } finally {
      setLoading(false);
    }
  };

  // Select all filtered users
  const selectAllFiltered = () => {
    const newSet = new Set<string>();
    filteredUsers.forEach(user => newSet.add(user.id));
    setSelectedUserIds(newSet);
  };

  // Clear all selected users
  const clearAllSelected = () => {
    setSelectedUserIds(new Set());
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <HiBell className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Advanced Notification Tester
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Send real-time notifications to users from your database
                </p>
              </div>
            </div>
            <Button
              color="primary"
              variant="flat"
              onPress={loadUsersFromAPI}
              isLoading={loadingUsers}
              startContent={<HiRefresh className="w-4 h-4" />}
            >
              Refresh Users
            </Button>
          </div>

          {/* Database Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-blue-50 dark:bg-blue-900/20">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Total Users</p>
                    <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                      {allUsers.length}
                    </p>
                  </div>
                  <HiUsers className="w-8 h-8 text-blue-500" />
                </div>
              </CardBody>
            </Card>
            <Card className="bg-green-50 dark:bg-green-900/20">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 dark:text-green-300">Admin Users</p>
                    <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                      {allAdmins.length}
                    </p>
                  </div>
                  <HiUserGroup className="w-8 h-8 text-green-500" />
                </div>
              </CardBody>
            </Card>
            <Card className="bg-purple-50 dark:bg-purple-900/20">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-700 dark:text-purple-300">Selected Users</p>
                    <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                      {selectedUserIds instanceof Set ? selectedUserIds.size : 0}
                    </p>
                  </div>
                  <HiUser className="w-8 h-8 text-purple-500" />
                </div>
              </CardBody>
            </Card>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notification Configuration */}
            <Card className="shadow-lg">
              <CardHeader className="border-b dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <HiCog className="w-5 h-5 text-blue-500" />
                  <h2 className="text-xl font-semibold">Notification Configuration</h2>
                </div>
              </CardHeader>
              <CardBody className="space-y-6">
                {/* Notification Type */}
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                    Notification Type
                  </label>
                  <Select
                    selectedKeys={notificationType}
                    onSelectionChange={(keys) => {
                      if (keys === "all") {
                        setNotificationType("all");
                      } else {
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
                </div>

                {/* Language */}
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
                </div>

                {/* Custom Message */}
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
                  <p className="text-xs text-gray-500 mt-2">
                    This message will be shown in all languages
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Recipient Selection */}
            <Card className="shadow-lg">
              <CardHeader className="border-b dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <HiUsers className="w-5 h-5 text-green-500" />
                  <h2 className="text-xl font-semibold">Recipient Selection</h2>
                </div>
              </CardHeader>
              <CardBody className="space-y-6">
                {/* Search and selection controls */}
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search users by name, email, or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                      startContent={<HiUser className="w-4 h-4 text-gray-400" />}
                    />
                    <Button
                      size="sm"
                      variant="flat"
                      onPress={selectAllFiltered}
                      isDisabled={filteredUsers.length === 0}
                    >
                      Select All
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      color="danger"
                      onPress={clearAllSelected}
                    >
                      Clear All
                    </Button>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>
                      Showing {filteredUsers.length} of {allUsers.length} users
                      {searchQuery && ` matching "${searchQuery}"`}
                    </p>
                    <p className="mt-1">
                      Selected: {selectedUserIds instanceof Set ? selectedUserIds.size : 0} user(s)
                    </p>
                  </div>
                </div>

                {/* Specific Users List */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Send to Specific Users</h3>
                  {loadingUsers ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-gray-500 dark:text-gray-400">Loading users from database...</p>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                      <HiUsers className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">
                        {searchQuery ? "No users found matching your search" : "No users found in database"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${selectedUserIds instanceof Set && selectedUserIds.has(user.id)
                              ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                        >
                          <Checkbox
                            isSelected={selectedUserIds instanceof Set && selectedUserIds.has(user.id)}
                            onValueChange={(isSelected) => {
                              const newSet = new Set(selectedUserIds instanceof Set ? selectedUserIds : []);
                              if (isSelected) {
                                newSet.add(user.id);
                              } else {
                                newSet.delete(user.id);
                              }
                              setSelectedUserIds(newSet);
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">{user.name}</p>
                              <span className={`px-2 py-1 text-xs rounded-full ${user.role === "ADMIN"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                }`}>
                                {user.role}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {user.email}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-gray-500">ID: {user.id.substring(0, 8)}...</span>
                              <span className="text-xs text-gray-500">Locale: {user.preferredLocale}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    color="primary"
                    variant="flat"
                    isLoading={loading}
                    onPress={() => handleSendNotification("specific_user")}
                    className="w-full mt-4"
                    isDisabled={selectedUserIds instanceof Set && selectedUserIds.size === 0}
                  >
                    Send to Selected Users ({selectedUserIds instanceof Set ? selectedUserIds.size : 0})
                  </Button>
                </div>

                <div className="border-t dark:border-gray-700 pt-6">
                  {/* Send to Admins */}
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Send to All Admins</h3>
                    <div className="mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <HiUserGroup className="w-4 h-4" />
                        <span>Will send to all {allAdmins.length} users with ADMIN role:</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {allAdmins.slice(0, 5).map(admin => (
                          <span
                            key={admin.id}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-full"
                            title={`${admin.name} (${admin.email})`}
                          >
                            {admin.name}
                          </span>
                        ))}
                        {allAdmins.length > 5 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-full">
                            +{allAdmins.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      color="warning"
                      variant="flat"
                      isLoading={loading}
                      onPress={() => handleSendNotification("all_admins")}
                      className="w-full"
                      startContent={<HiUserGroup className="w-5 h-5" />}
                      isDisabled={allAdmins.length === 0}
                    >
                      Send to All Admins ({allAdmins.length})
                    </Button>
                  </div>

                  {/* Send to All Users */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Send to All Users</h3>
                    <div className="mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <HiGlobe className="w-4 h-4" />
                        <span>Will send to all {allUsers.length} users (including {allAdmins.length} admins):</span>
                      </div>
                    </div>
                    <Button
                      color="danger"
                      variant="flat"
                      isLoading={loading}
                      onPress={() => handleSendNotification("all_users")}
                      className="w-full"
                      startContent={<HiGlobe className="w-5 h-5" />}
                      isDisabled={allUsers.length === 0}
                    >
                      Send to All Users ({allUsers.length})
                    </Button>
                  </div>
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
                  <div className={`p-4 rounded-lg ${result.success ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
                    <div className="flex items-start gap-3">
                      {result.success ? (
                        <HiCheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      ) : (
                        <HiXCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                      )}
                      <div>
                        <h3 className={`font-semibold ${result.success ? "text-green-800 dark:text-green-300" : "text-red-800 dark:text-red-300"}`}>
                          {result.success ? "✅ Success!" : "❌ Failed"}
                        </h3>
                        <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                          {result.message || result.error}
                        </p>
                        {result.success && result.data && (
                          <div className="mt-3">
                            <details className="text-xs bg-white dark:bg-gray-800 p-2 rounded">
                              <summary className="cursor-pointer font-medium">View Details</summary>
                              <pre className="mt-2 overflow-x-auto max-h-40">
                                {JSON.stringify(result.data, null, 2)}
                              </pre>
                            </details>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <HiBell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No test results yet. Send a notification to see results here.</p>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* History Card */}
            <Card className="shadow-lg">
              <CardHeader className="border-b dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Recent Tests</h2>
                  {history.length > 0 && (
                    <Button
                      size="sm"
                      variant="light"
                      onPress={() => setHistory([])}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardBody>
                {history.length > 0 ? (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div key={item.id} className={`p-3 rounded-lg border ${item.success ? "border-green-200 dark:border-green-800" : "border-red-200 dark:border-red-800"}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {item.type === "specific_user" ? "👤" :
                                item.type === "all_admins" ? "👥" :
                                  "🌍"}
                            </span>
                            <div>
                              <p className="font-medium text-sm">{item.notificationType}</p>
                              <p className="text-xs text-gray-500">
                                {item.type === "specific_user" ? "Specific Users" :
                                  item.type === "all_admins" ? "All Admins" :
                                    "All Users"}
                              </p>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs ${item.success ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"}`}>
                            {item.success ? `${item.count}/${item.total}` : "Failed"}
                          </div>
                        </div>
                        {item.message && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                            {item.message}
                          </p>
                        )}
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
                          {item.time}
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
                  💡 How It Works
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-2">
                  <li>• <strong>GET Requests:</strong> Users fetched via API route (/api/users)</li>
                  <li>• <strong>POST Requests:</strong> Notifications sent via server actions</li>
                  <li>• <strong>Silent Skipping:</strong> Non-existent users are skipped without errors</li>
                  <li>• <strong>Real Database:</strong> All users shown exist in your database</li>
                  <li className="mt-3 font-semibold">✅ {allUsers.length} real users loaded from database</li>
                  <li className="font-semibold">✅ Non-existent users are silently skipped</li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}