// lib/notification-service.ts
import { 
  users, 
  notifications, 
  type NotificationTypes,
  usersRelations,
  notificationsRelations, 
  InsertNotificationType
} from "@/drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { pusherServer } from "@/lib/pusher/server";
import { db } from "@/drizzle/db";

// Types
export interface NotificationData {
  type: NotificationTypes;
  model: "USER";
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
export async function getUserLocale(userId: string): Promise<"EN" | "FR" | "AR"> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      preferredLocale: true
    }
  });

  return user?.preferredLocale as "EN" | "FR" | "AR" || "FR";
}

// 2️⃣ Get all admin users
export async function getAllAdminUsers(): Promise<string[]> {
  const adminUsers = await db.query.users.findMany({
    where: eq(users.role, "ADMIN"),
    columns: {
      id: true
    }
  });

  return adminUsers.map(user => user.id);
}

// 3️⃣ Get all users (including admins)
export async function getAllUsers(): Promise<string[]> {
  const allUsers = await db.query.users.findMany({
    columns: {
      id: true
    }
  });

  return allUsers.map(user => user.id);
}

// 4️⃣ Check if user exists
export async function userExists(userId: string): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      id: true
    }
  });

  return !!user;
}

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
    actorUserId: data.actorUserId || null,
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
      where: eq(notifications.id, notificationId)
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

// 6️⃣ Send real-time notification via Pusher
export async function sendRealTimeNotification(
  userId: string,
  notificationId: string,
  data: NotificationData
) {
  try {
    // Get user's locale for localized content
    const userLocale = await getUserLocale(userId);
    
    // Prepare localized content based on user's locale
    const localizedTitle = data[`title${userLocale}` as keyof NotificationData] as string;
    const localizedMessage = data[`message${userLocale}` as keyof NotificationData] as string;
    
    // Prepare notification data for Pusher
    const pusherNotification = {
      id: notificationId,
      type: data.type,
      model: data.model,
      referenceId: data.referenceId,
      titleEn: data.titleEn,
      titleFr: data.titleFr,
      titleAr: data.titleAr,
      messageEn: data.messageEn,
      messageFr: data.messageFr,
      messageAr: data.messageAr,
      link: data.link,
      metadata: data.metadata,
      actorUserId: data.actorUserId,
      localizedTitle,
      localizedMessage,
      createdAt: new Date().toISOString(),
      read: false
    };

    // Send via Pusher
    await pusherServer.trigger(
      `private-user-${userId}`,
      "notification",
      pusherNotification
    );

    return true;
  } catch (error) {
    console.error(`Error sending real-time notification to user ${userId}:`, error);
    return false;
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
      notificationId: notification.id
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

// 8️⃣ Send notification to multiple users (BATCH version for better performance)
// lib/notification-service.ts
// ... (previous imports and types)

// 8️⃣ Send notification to multiple users (with silent skipping)
export async function sendNotificationToUsers(
  userIds: string[],
  data: NotificationData
): Promise<{ 
  success: boolean; 
  results: Array<{ userId: string; success: boolean; notificationId?: string; error?: string }>;
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
          error: "User not found (silently skipped)" 
        });
      }
    } catch (error: any) {
      // Silently skip errors too
      results.push({ 
        userId, 
        success: false, 
        error: error.message 
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
        actorUserId: data.actorUserId || null,
        isRead: false,
        // DO NOT include createdAt!
      };

      console.log(`🔍 Inserting notification for user ${userId}:`, notificationData);

      // Store in database
      await db.insert(notifications).values(notificationData);
      console.log(`✅ Notification inserted for user ${userId}`);
      
      // Send real-time (fire and forget)
      sendRealTimeNotification(userId, notificationId, data).catch(console.error);
      
      results.push({ 
        userId, 
        success: true, 
        notificationId 
      });
    } catch (error: any) {
      console.error(`❌ Error inserting notification for user ${userId}:`, error);
      results.push({ 
        userId, 
        success: false, 
        error: error.message 
      });
    }
  }

  return {
    success: results.some(r => r.success),
    results
  };
}


// 9️⃣ Send notification to all admins
export async function sendNotificationToAdmins(
  data: NotificationData
): Promise<{ 
  success: boolean; 
  results: Array<{ userId: string; success: boolean; notificationId?: string; error?: string }>;
}> {
  // Get all admin users
  const adminUserIds = await getAllAdminUsers();
  
  // Send to all admins
  return await sendNotificationToUsers(adminUserIds, data);
}

// 🔟 Send notification to all users
export async function sendNotificationToAllUsers(
  data: NotificationData
): Promise<{ 
  success: boolean; 
  results: Array<{ userId: string; success: boolean; notificationId?: string; error?: string }>;
}> {
  // Get all users
  const allUserIds = await getAllUsers();
  
  // Send to all users
  return await sendNotificationToUsers(allUserIds, data);
}


export async function getUserNotifications(userId: string) {
  // First get user with preferred locale
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      id: true,
      preferredLocale: true
    }
  });

  if (!user) {
    return [];
  }

  // Then get notifications for this user
  const userNotifications = await db.query.notifications.findMany({
    where: eq(notifications.userId, userId),
    orderBy: [desc(notifications.createdAt)],
    limit: 50
  });

  const locale = user.preferredLocale as "EN" | "FR" | "AR";

  // Transform notifications with user's preferred locale
  return userNotifications.map(notification => {
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
      localizedMessage: message
    };
  });
}

// Get users with details for dropdown
export async function getUsersWithDetails() {
  const usersList = await db.query.users.findMany({
    columns: {
      id: true,
      name: true,
      email: true,
      role: true,
      preferredLocale: true
    },
    orderBy: (users, { asc }) => [asc(users.name)]
  });

  return usersList;
}

// Get admins with details for dropdown
export async function getAdminsWithDetails() {
  const admins = await db.query.users.findMany({
    where: eq(users.role, "ADMIN"),
    columns: {
      id: true,
      name: true,
      email: true,
      preferredLocale: true
    },
    orderBy: (users, { asc }) => [asc(users.name)]
  });

  return admins;
}