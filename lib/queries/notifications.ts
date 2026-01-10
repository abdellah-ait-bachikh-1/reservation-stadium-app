// lib/notification-service.ts
import { users, notifications } from "@/drizzle/schema";
import { eq, desc, and, ne } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/drizzle/db";
import {
  InsertNotificationType,
  NotificationModelType,
  NotificationType,
} from "@/types/db";
import {
  getAllAdminUsersIds,
  getUserPreferredLocale,
  validateActorUserId,
  getAllUsersIds,
  userExists,
} from "../queries/user";
import { sendRealTimeNotification } from "@/services/notifications";

// Types
export interface NotificationData {
  type: NotificationType; // USER_CREATED, USER_APPROVED, RESERVATION_REQUESTED, etc.
  model: NotificationModelType; // USER, RESERVATION, PAYMENT, etc.
  referenceId: string;
  titleEn: string;
  titleFr: string;
  titleAr: string;
  messageEn: string;
  messageFr: string;
  messageAr: string;
  link?: string;
  metadata?: any;
  actorUserId?: string;
}

// 1️⃣ Get user's preferred locale

// 5️⃣ Store notification in database
// 5️⃣ Store notification in database - FIXED VERSION
export async function storeNotificationInDB(
  userId: string,
  data: NotificationData
) {
  // Check if user exists
  const exists = await userExists(userId);
  if (!exists) {
    throw new Error(`User with ID ${userId} not found`);
  }

  const notificationId = uuidv4();

  // Corrected data to insert - DO NOT include createdAt!
  const notificationData: InsertNotificationType = {
    id: notificationId,
    userId,
    type: data.type,
    model: data.model,
    referenceId: data.referenceId,
    titleEn: data.titleEn,
    titleFr: data.titleFr,
    titleAr: data.titleAr,
    messageEn: data.messageEn,
    messageFr: data.messageFr,
    messageAr: data.messageAr,
    link: data.link || null,
    metadata: data.metadata || null, // Pass JS object, Drizzle will handle JSON conversion
    actorUserId: await validateActorUserId(data.actorUserId),
    isRead: false,
    // DO NOT include createdAt - let the database use defaultNow()
  };

  console.log("🔍 Inserting notification data:", notificationData);

  try {
    // Insert into database
    await db.insert(notifications).values(notificationData);
    console.log("✅ Database insert successful");

    // Fetch the inserted notification
    const createdNotification = await db.query.notifications.findFirst({
      where: eq(notifications.id, notificationId),
    });

    if (!createdNotification) {
      throw new Error("Failed to create notification");
    }

    return createdNotification;
  } catch (error: any) {
    console.error("❌ Database insert error:", error);
    throw error;
  }
}
// 7️⃣ Send notification to specific user
export async function sendNotificationToUser(
  userId: string,
  data: NotificationData
): Promise<{ success: boolean; notificationId?: string; error?: string }> {
  try {
    // Step 1: Store in database
    const notification = await storeNotificationInDB(userId, data);

    // Step 2: Send real-time notification
    const sent = await sendRealTimeNotification(userId, notification.id, data);

    return {
      success: sent,
      notificationId: notification.id,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}
// 8️⃣ Send notification to multiple users (with silent skipping)
export async function sendNotificationToUsers(
  userIds: string[],
  data: NotificationData
): Promise<{
  success: boolean;
  results: Array<{
    userId: string;
    success: boolean;
    notificationId?: string;
    error?: string;
  }>;
}> {
  const results = [];

  // Filter out non-existent users first
  const validUsers: string[] = [];

  for (const userId of userIds) {
    try {
      const exists = await userExists(userId);
      if (exists) {
        validUsers.push(userId);
      } else {
        // Silently skip non-existent users
        results.push({
          userId,
          success: false,
          error: "User not found (silently skipped)",
        });
      }
    } catch (error: any) {
      // Silently skip errors too
      results.push({
        userId,
        success: false,
        error: error.message,
      });
    }
  }

  // Process valid users
  for (const userId of validUsers) {
    try {
      // Generate unique ID for each notification
      const notificationId = uuidv4();

      // Prepare notification data - DO NOT include createdAt!
      const notificationData: InsertNotificationType = {
        id: notificationId,
        userId,
        type: data.type,
        model: data.model,
        referenceId: data.referenceId,
        titleEn: data.titleEn,
        titleFr: data.titleFr,
        titleAr: data.titleAr,
        messageEn: data.messageEn,
        messageFr: data.messageFr,
        messageAr: data.messageAr,
        link: data.link || null,
        metadata: data.metadata || null,
        actorUserId: await validateActorUserId(data.actorUserId),
        isRead: false,
        // DO NOT include createdAt!
      };

      console.log(
        `🔍 Inserting notification for user ${userId}:`,
        notificationData
      );

      // Store in database
      await db.insert(notifications).values(notificationData);
      console.log(`✅ Notification inserted for user ${userId}`);

      // Send real-time (fire and forget)
      sendRealTimeNotification(userId, notificationId, data).catch(
        console.error
      );

      results.push({
        userId,
        success: true,
        notificationId,
      });
    } catch (error: any) {
      console.error(
        `❌ Error inserting notification for user ${userId}:`,
        error
      );
      results.push({
        userId,
        success: false,
        error: error.message,
      });
    }
  }

  return {
    success: results.some((r) => r.success),
    results,
  };
}
// 9️⃣ Send notification to all admins
export async function sendNotificationToAdmins(
  data: NotificationData
): Promise<{
  success: boolean;
  results: Array<{
    userId: string;
    success: boolean;
    notificationId?: string;
    error?: string;
  }>;
}> {
  // Get all admin users
  const adminUserIds = await getAllAdminUsersIds();

  // Send to all admins
  return await sendNotificationToUsers(adminUserIds, data);
}
// 🔟 Send notification to all users
export async function sendNotificationToAllUsers(
  data: NotificationData
): Promise<{
  success: boolean;
  results: Array<{
    userId: string;
    success: boolean;
    notificationId?: string;
    error?: string;
  }>;
}> {
  // Get all users
  const allUserIds = await getAllUsersIds();

  // Send to all users
  return await sendNotificationToUsers(allUserIds, data);
}

export async function getUserNotifications(userId: string) {
  // First get user with preferred locale
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      id: true,
      preferredLocale: true,
    },
  });

  if (!user) {
    return [];
  }

  // Then get notifications for this user
  const userNotifications = await db.query.notifications.findMany({
    where: eq(notifications.userId, userId),
    orderBy: [desc(notifications.createdAt)],
    limit: 50,
  });

  const locale = user.preferredLocale as "EN" | "FR" | "AR";

  // Transform notifications with user's preferred locale
  return userNotifications.map((notification) => {
    let title = "";
    let message = "";

    // Get localized title
    switch (locale) {
      case "EN":
        title = notification.titleEn;
        message = notification.messageEn;
        break;
      case "FR":
        title = notification.titleFr;
        message = notification.messageFr;
        break;
      case "AR":
        title = notification.titleAr;
        message = notification.messageAr;
        break;
      default:
        title = notification.titleEn;
        message = notification.messageEn;
    }

    return {
      id: notification.id,
      type: notification.type,
      title,
      message,
      link: notification.link,
      metadata: notification.metadata,
      read: notification.isRead,
      createdAt: notification.createdAt,
      localizedTitle: title,
      localizedMessage: message,
    };
  });
}

export const markOnNotificationAsRead = async (
  userId: string,
  notificationId: string
) => {
 return await db
    .update(notifications)
    .set({ isRead: true })
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, userId)
      )
    );
};

export const markAllNotificationAsReadForSpecificUser = async (
  userId: string
) => {
 return  await db
    .update(notifications)
    .set({ isRead: true })
    .where(
      and(eq(notifications.userId, userId), ne(notifications.isRead, true))
    );
};

export const getLimitedNotificationForUser =async(userId:string,limit:number)=>{
  return await db.query.notifications.findMany({
      where: eq(notifications.userId, userId),
      orderBy: [desc(notifications.createdAt)],
      limit: limit
    });
}