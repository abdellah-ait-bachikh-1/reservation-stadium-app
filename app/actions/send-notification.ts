// app/actions/send-notification.ts
"use server";

import { pusherServer } from "@/lib/pusher/server";

export async function sendTestNotification({
  userId = "123",
  type,
  customMessage,
  locale = "FR"
}: {
  userId?: string;
  type: string;
  customMessage?: string;
  locale?: "EN" | "FR" | "AR";
}) {
  try {
    // Get messages based on locale
    const getMessage = (lang: "EN" | "FR" | "AR") => {
      const baseMessage = customMessage || "This is a test notification!";
      const prefix = {
        EN: "English: ",
        FR: "Français: ",
        AR: "العربية: "
      }[lang];
      return prefix + baseMessage;
    };

    const notificationData = {
      id: Date.now().toString(),
      type,
      model: "USER",
      referenceId: "test-ref-" + Date.now(),
      titleEn: "Test Notification EN",
      titleFr: "Test Notification FR",
      titleAr: "اختبار الإشعار",
      messageEn: getMessage("EN"),
      messageFr: getMessage("FR"),
      messageAr: getMessage("AR"),
      createdAt: new Date().toISOString(),
      read: false,
      userId,
      link: "/test",
      metadata: { 
        test: true, 
        timestamp: new Date().toISOString(),
        locale 
      }
    };

    // Send directly via Pusher without saving to DB
    await pusherServer.trigger(
      `private-user-${userId}`,
      'notification',
      notificationData
    );

    console.log(`✅ Test notification sent to user ${userId}`);
    
    return {
      success: true,
      message: `Notification sent to user ${userId}`,
      data: notificationData
    };
  } catch (error: any) {
    console.error("❌ Error sending test notification:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Pre-defined notification types
export async function sendSystemAnnouncement(userId: string = "123") {
  return sendTestNotification({
    userId,
    type: "SYSTEM_ANNOUNCEMENT",
    customMessage: "System announcement test message",
    locale: "EN"
  });
}

export async function sendReservationApproved(userId: string = "123") {
  return sendTestNotification({
    userId,
    type: "RESERVATION_APPROVED",
    customMessage: "Your reservation has been approved!",
    locale: "FR"
  });
}

export async function sendPaymentReceived(userId: string = "123") {
  return sendTestNotification({
    userId,
    type: "PAYMENT_RECEIVED",
    customMessage: "Your payment has been received successfully.",
    locale: "AR"
  });
}