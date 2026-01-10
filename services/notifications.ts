import { pusherServer } from "@/lib/pusher/server";
import { NotificationData } from "@/lib/queries/notifications";
import { getUserPreferredLocale } from "@/lib/queries/user";


// 6️⃣ Send real-time notification via Pusher
export async function sendRealTimeNotification(
  userId: string,
  notificationId: string,
  data: NotificationData
) {
  try {
    // Get user's locale for localized content
    const userLocale = await getUserPreferredLocale(userId);

    // Prepare localized content based on user's locale
    const localizedTitle = data[
      `title${userLocale}` as keyof NotificationData
    ] as string;
    const localizedMessage = data[
      `message${userLocale}` as keyof NotificationData
    ] as string;

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
      read: false,
    };

    // Send via Pusher
    await pusherServer.trigger(
      `private-user-${userId}`,
      "notification",
      pusherNotification
    );

    return true;
  } catch (error) {
    console.error(
      `Error sending real-time notification to user ${userId}:`,
      error
    );
    return false;
  }
}
