"use server";

import { sendPusherNotification, sendMultilingualPusherNotification } from '@/lib/pusher-server';

// دالة لإرسال إشعار جديد
export async function sendNotification({
  userId,
  type,
  title,
  message,
  data,
}: {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
}) {
  try {
    await sendPusherNotification({
      userId,
      type,
      title,
      message,
      data,
    });
    
    return { success: true, message: "Notification sent successfully" };
  } catch (error) {
    console.error("Error sending notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}

// دالة لإرسال إشعار متعدد اللغات
export async function sendMultilingualNotification({
  userId,
  type,
  translations,
  data,
}: {
  userId: string;
  type: string;
  translations: {
    titleEn: string;
    titleFr: string;
    titleAr: string;
    messageEn: string;
    messageFr: string;
    messageAr: string;
  };
  data?: any;
}) {
  try {
    await sendMultilingualPusherNotification({
      userId,
      type,
      translations,
      data,
    });
    
    return { success: true, message: "Multilingual notification sent successfully" };
  } catch (error) {
    console.error("Error sending multilingual notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}

// دالة لإرسال إشعار عند إنشاء حجز
export async function sendReservationNotification({
  userId,
  stadiumName,
  actorName,
  actorEmail,
}: {
  userId: string;
  stadiumName: string;
  actorName: string;
  actorEmail?: string;
}) {
  return sendMultilingualNotification({
    userId,
    type: "RESERVATION_REQUESTED",
    translations: {
      titleEn: "New Reservation Request",
      titleFr: "Nouvelle Demande de Réservation",
      titleAr: "طلب حجز جديد",
      messageEn: `New reservation request for ${stadiumName}`,
      messageFr: `Nouvelle demande de réservation pour ${stadiumName}`,
      messageAr: `طلب حجز جديد لـ ${stadiumName}`,
    },
    data: {
      stadiumName,
      actorName,
      actorEmail,
      timestamp: new Date().toISOString(),
      action: "view_reservation",
    },
  });
}

