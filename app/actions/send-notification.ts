// app/actions/send-notification.ts (DEBUG VERSION)
"use server";

import { 
  sendNotificationToUser,
  sendNotificationToUsers,
  sendNotificationToAdmins,
  sendNotificationToAllUsers,
  type NotificationData
} from "@/lib/services/notification-service";

// Test notification data templates
const getTestNotificationData = (
  type: string,
  customMessage?: string,
  locale: "EN" | "FR" | "AR" = "FR"
): NotificationData => {
  const baseData: NotificationData = {
    type: type as any,
    model: "USER",
    referenceId: "test-" + Date.now(),
    titleEn: "Test Notification",
    titleFr: "Notification de Test",
    titleAr: "إشعار تجريبي",
    messageEn: customMessage || "This is a test notification in English.",
    messageFr: customMessage || "Ceci est une notification de test en français.",
    messageAr: customMessage || "هذا إشعار تجريبي باللغة العربية.",
    link: "/notifications",
    metadata: { test: true, timestamp: Date.now() },
    actorUserId: "system"
  };

  return baseData;
};

// Debug function to check if server action is working
export async function debugTest() {
  console.log("🔍 DEBUG: Server action called");
  return {
    success: true,
    message: "Server action is working",
    timestamp: new Date().toISOString()
  };
}

// Send to specific user - Silently skip if user doesn't exist
export async function sendToUser(
  userId: string,
  type: string,
  customMessage?: string,
  locale: "EN" | "FR" | "AR" = "FR"
) {
  console.log("🔍 sendToUser called with:", { userId, type, customMessage, locale });
  
  try {
    const data = getTestNotificationData(type, customMessage, locale);
    console.log("🔍 Notification data created:", data);
    
    const result = await sendNotificationToUser(userId, data);
    console.log("🔍 sendNotificationToUser result:", result);
    
    return {
      success: result.success,
      message: result.success 
        ? `Notification sent to user ${userId}`
        : `User ${userId} not found or error occurred`,
      data: result
    };
  } catch (error: any) {
    console.error("❌ sendToUser error:", error);
    return {
      success: false,
      message: error.message,
      error: error.toString()
    };
  }
}

// Send to multiple users - Silently skip non-existent users
export async function sendToUsers(
  userIds: string[],
  type: string,
  customMessage?: string,
  locale: "EN" | "FR" | "AR" = "FR"
) {
  console.log("🔍 sendToUsers called with:", { userIds, type, customMessage, locale });
  
  try {
    const data = getTestNotificationData(type, customMessage, locale);
    console.log("🔍 Notification data created:", data);
    
    const result = await sendNotificationToUsers(userIds, data);
    console.log("🔍 sendNotificationToUsers result:", result);
    
    // Filter results to show only successful ones
    const successful = result.results.filter(r => r.success);
    const failed = result.results.filter(r => !r.success);
    
    return {
      success: result.success,
      message: `Successfully sent to ${successful.length} out of ${userIds.length} users. ${failed.length} users skipped.`,
      data: {
        totalUsers: userIds.length,
        successful: successful.length,
        failed: failed.length,
        results: result.results
      }
    };
  } catch (error: any) {
    console.error("❌ sendToUsers error:", error);
    return {
      success: false,
      message: error.message,
      error: error.toString()
    };
  }
}

// Send to all admins
export async function sendToAllAdmins(
  type: string,
  customMessage?: string,
  locale: "EN" | "FR" | "AR" = "FR"
) {
  console.log("🔍 sendToAllAdmins called with:", { type, customMessage, locale });
  
  try {
    const data = getTestNotificationData(type, customMessage, locale);
    console.log("🔍 Notification data created:", data);
    
    const result = await sendNotificationToAdmins(data);
    console.log("🔍 sendNotificationToAdmins result:", result);
    
    const successful = result.results.filter(r => r.success);
    
    return {
      success: result.success,
      message: `Sent to ${successful.length} admin users`,
      data: {
        totalAdmins: result.results.length,
        successful: successful.length,
        results: result.results
      }
    };
  } catch (error: any) {
    console.error("❌ sendToAllAdmins error:", error);
    return {
      success: false,
      message: error.message,
      error: error.toString()
    };
  }
}

// Send to all users
export async function sendToAllUsers(
  type: string,
  customMessage?: string,
  locale: "EN" | "FR" | "AR" = "FR"
) {
  console.log("🔍 sendToAllUsers called with:", { type, customMessage, locale });
  
  try {
    const data = getTestNotificationData(type, customMessage, locale);
    console.log("🔍 Notification data created:", data);
    
    const result = await sendNotificationToAllUsers(data);
    console.log("🔍 sendNotificationToAllUsers result:", result);
    
    const successful = result.results.filter(r => r.success);
    
    return {
      success: result.success,
      message: `Sent to ${successful.length} out of ${result.results.length} users`,
      data: {
        totalUsers: result.results.length,
        successful: successful.length,
        results: result.results
      }
    };
  } catch (error: any) {
    console.error("❌ sendToAllUsers error:", error);
    return {
      success: false,
      message: error.message,
      error: error.toString()
    };
  }
}