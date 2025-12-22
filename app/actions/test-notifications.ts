"use server";

import { getSession } from "@/auth";
import { sendPusherNotification } from "@/lib/pusher-server";
import db from "@/lib/db"; // استيراد Prisma client

export async function sendTestNotification({
  receiverId,
  type,
  customMessage,
}: {
  receiverId: string;
  type: string;
  customMessage?: string;
}) {
  try {
    // الحصول على بيانات المستخدم الحالي (المرسل)
    const session = await getSession();
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: "يجب تسجيل الدخول أولاً",
      };
    }

    const senderName = session.user.fullNameFr || "مستخدم النظام";
    const senderEmail = session.user.email || "system@example.com";

    // تحديد رسائل الإشعار بجميع اللغات
    const getNotificationTranslations = () => {
      const baseData = {
        senderName,
        senderEmail,
        senderId: session!.user!.id,
        timestamp: new Date().toISOString(),
      };

      switch (type) {
        case "reservation":
          return {
            dbType: "RESERVATION_REQUESTED" as const,
            translations: {
              titleEn: "New Reservation Request",
              titleFr: "Nouvelle Demande de Réservation",
              titleAr: "طلب حجز جديد",
              messageEn: customMessage || `New reservation request from ${senderName}`,
              messageFr: customMessage || `Nouvelle demande de réservation de ${senderName}`,
              messageAr: customMessage || `طلب حجز جديد من ${senderName}`,
            },
            metadata: {
              ...baseData,
              reservationId: `test-res-${Date.now()}`,
              stadiumName: "Test Stadium",
              date: new Date().toISOString(),
            },
          };

        case "payment":
          return {
            dbType: "PAYMENT_RECEIVED" as const,
            translations: {
              titleEn: "Payment Received",
              titleFr: "Paiement Reçu",
              titleAr: "تم استلام الدفع",
              messageEn: customMessage || `Payment received from ${senderName}`,
              messageFr: customMessage || `Paiement reçu de ${senderName}`,
              messageAr: customMessage || `تم استلام دفعة من ${senderName}`,
            },
            metadata: {
              ...baseData,
              amount: 500,
              currency: "MAD",
              paymentMethod: "Cash",
              receiptNumber: `REC-${Date.now()}`,
            },
          };

        case "club":
          return {
            dbType: "CLUB_REGISTRATION_SUBMITTED" as const,
            translations: {
              titleEn: "New Club Registration",
              titleFr: "Nouvelle Inscription de Club",
              titleAr: "تسجيل نادي جديد",
              messageEn: customMessage || `New club registration from ${senderName}`,
              messageFr: customMessage || `Nouvelle inscription de club de ${senderName}`,
              messageAr: customMessage || `تسجيل نادي جديد من ${senderName}`,
            },
            metadata: {
              ...baseData,
              clubName: "Test Club",
              sportType: "Football",
              registrationDate: new Date().toISOString(),
            },
          };

        case "system":
          return {
            dbType: "SYSTEM_ANNOUNCEMENT" as const,
            translations: {
              titleEn: "System Announcement",
              titleFr: "Annonce du Système",
              titleAr: "إعلان النظام",
              messageEn: customMessage || `Important system announcement`,
              messageFr: customMessage || `Annonce système importante`,
              messageAr: customMessage || `إعلان مهم من إدارة النظام`,
            },
            metadata: {
              ...baseData,
              announcementType: "system_update",
              priority: "medium",
            },
          };

        case "account":
          return {
            dbType: "ACCOUNT_UPDATED" as const,
            translations: {
              titleEn: "Account Updated",
              titleFr: "Compte Mis à Jour",
              titleAr: "تم تحديث الحساب",
              messageEn: customMessage || `Account updated by ${senderName}`,
              messageFr: customMessage || `Compte mis à jour par ${senderName}`,
              messageAr: customMessage || `تم تحديث حساب بواسطة ${senderName}`,
            },
            metadata: {
              ...baseData,
              updateType: "profile_update",
              updatedFields: ["Personal Information"],
            },
          };

        default:
          return {
            dbType: "SYSTEM_NOTIFICATION" as const,
            translations: {
              titleEn: "Test Notification",
              titleFr: "Notification de Test",
              titleAr: "إشعار اختباري",
              messageEn: customMessage || `This is a test notification from ${senderName}`,
              messageFr: customMessage || `Ceci est une notification de test de ${senderName}`,
              messageAr: customMessage || `هذا إشعار اختباري من ${senderName}`,
            },
            metadata: baseData,
          };
      }
    };

    const notificationContent = getNotificationTranslations();

    // الخطوة 1: حفظ الإشعار في قاعدة البيانات بجميع اللغات
    const savedNotification = await db.notification.create({
      data: {
        type: notificationContent.dbType,
        // حفظ جميع الترجمات
        titleEn: notificationContent.translations.titleEn,
        titleFr: notificationContent.translations.titleFr,
        titleAr: notificationContent.translations.titleAr,
        messageEn: notificationContent.translations.messageEn,
        messageFr: notificationContent.translations.messageFr,
        messageAr: notificationContent.translations.messageAr,
        isRead: false,
        userId: receiverId, // المستلم
        actorUserId: session.user.id, // المرسل
        metadata: notificationContent.metadata,
      },
    });

    console.log("💾 Notification saved to DB with all languages:", {
      id: savedNotification.id,
      type: savedNotification.type,
      receiverId,
    });

    // الخطوة 2: الحصول على لغة المستلم من قاعدة البيانات
    const receiver = await db.user.findUnique({
      where: { id: receiverId },
      select: { preferredLocale: true }
    });

    const receiverLocale = receiver?.preferredLocale?.toLowerCase() || 'ar';
    
    // تحديد النص المناسب للغة
    let titleForPusher = notificationContent.translations.titleEn;
    let messageForPusher = notificationContent.translations.messageEn;

    if (receiverLocale === 'fr') {
      titleForPusher = notificationContent.translations.titleFr;
      messageForPusher = notificationContent.translations.messageFr;
    } else if (receiverLocale === 'ar') {
      titleForPusher = notificationContent.translations.titleAr;
      messageForPusher = notificationContent.translations.messageAr;
    }

    // الخطوة 3: إرسال الإشعار عبر Pusher باللغة المناسبة
    await sendPusherNotification({
      userId: receiverId,
      type: notificationContent.dbType,
      title: titleForPusher,
      message: messageForPusher,
      data: {
        ...notificationContent.metadata,
        notificationId: savedNotification.id,
        // إرسال جميع الترجمات للكلينت للاستخدام الفوري
        translations: notificationContent.translations,
        receiverLocale: receiverLocale,
      },
    });

    console.log("✅ Test notification sent and saved:", {
      from: session.user.id,
      to: receiverId,
      type: notificationContent.dbType,
      savedId: savedNotification.id,
      receiverLocale,
      time: new Date().toISOString(),
    });

    return {
      success: true,
      message: `تم إرسال الإشعار بنجاح إلى المستخدم ${receiverId.substring(0, 8)}...`,
      notificationId: savedNotification.id,
      receiverLocale,
    };
  } catch (error) {
    console.error("❌ Error sending test notification:", error);
    
    return {
      success: false,
      message: `فشل إرسال الإشعار: ${error instanceof Error ? error.message : "خطأ غير معروف"}`,
    };
  }
}