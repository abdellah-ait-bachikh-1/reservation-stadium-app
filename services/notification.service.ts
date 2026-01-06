// services/notification.service.ts
import { pusherServer } from '@/lib/pusher/server';
import { db } from '@/drizzle/db';
import { notifications, NotificationTypes } from '@/drizzle/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// Type for locale
export type LocaleType = 'EN' | 'FR' | 'AR';

export interface NotificationContent {
  titleEn: string;
  titleFr: string;
  titleAr: string;
  messageEn: string;
  messageFr: string;
  messageAr: string;
}

export interface CreateNotificationParams {
  type: NotificationTypes;
  referenceId: string; // The ID of the record (user ID for now)
  userId: string; // Receiver ID
  actorUserId?: string; // Who triggered the notification
  metadata?: Record<string, any>;
  link?: string;
  customContent?: Partial<NotificationContent>;
}

// export class NotificationService {
//   // All notifications currently use USER model
//   private static typeToModelMap: Partial<Record<NotificationTypes, 'USER' | "RESERVATION" | "PAYMENT" | "SYSTEM">> = {
//     // User notifications
//     USER_CREATED: 'USER',
//     USER_APPROVED: 'USER',
//     USER_PROFILE_UPDATED: 'USER',
//     USER_PASSWORD_CHANGED: 'USER',
//     USER_EMAIL_VERIFIED: 'USER',
//     USER_DELETED: 'USER',
    
//     // Reservation notifications (using USER model for now)
//     RESERVATION_REQUESTED: 'RESERVATION',
//     RESERVATION_APPROVED: 'RESERVATION',
//     RESERVATION_DECLINED: 'RESERVATION',
//     RESERVATION_CANCELLED: 'RESERVATION',
//     RESERVATION_REMINDER: 'RESERVATION',
    
//     // Payment notifications (using USER model for now)
//     PAYMENT_RECEIVED: 'PAYMENT',
//     PAYMENT_OVERDUE: 'PAYMENT',
//     PAYMENT_FAILED: 'PAYMENT',
//     PAYMENT_REFUNDED: 'PAYMENT',
//     SUBSCRIPTION_PAYMENT: 'PAYMENT',
    
//     // System notifications (using USER model for now)
//     SYSTEM_MAINTENANCE: 'SYSTEM',
//     SYSTEM_UPDATE: 'SYSTEM',
//     SYSTEM_NEW_FEATURE: 'SYSTEM',
//     SYSTEM_ANNOUNCEMENT: 'SYSTEM',
    
//     // Admin notifications (using USER model for now)
//     ADMIN_NEW_USER: 'USER',
//     ADMIN_NEW_RESERVATION: 'USER',
//     ADMIN_PAYMENT_ALERT: 'USER',
//   };

// // Pre-defined notification templates
//   private static notificationTemplates: Record<NotificationTypes, NotificationContent> = {
//     // User notifications
//     USER_CREATED: {
//       titleEn: "User Created",
//       titleFr: "Utilisateur Créé",
//       titleAr: "تم إنشاء المستخدم",
//       messageEn: "Your account has been created successfully. Welcome!",
//       messageFr: "Votre compte a été créé avec succès. Bienvenue!",
//       messageAr: "تم إنشاء حسابك بنجاح. أهلاً بك!",
//     },
//     USER_APPROVED: {
//       titleEn: "User Approved",
//       titleFr: "Utilisateur Approuvé",
//       titleAr: "تمت الموافقة على المستخدم",
//       messageEn: "Your account has been approved by the administrator.",
//       messageFr: "Votre compte a été approuvé par l'administrateur.",
//       messageAr: "تمت الموافقة على حسابك من قبل المدير.",
//     },
//     USER_PROFILE_UPDATED: {
//       titleEn: "User Profile Updated",
//       titleFr: "Profil Utilisateur Mis à Jour",
//       titleAr: "تم تحديث ملف المستخدم",
//       messageEn: "Your profile has been updated successfully.",
//       messageFr: "Votre profil a été mis à jour avec succès.",
//       messageAr: "تم تحديث ملفك الشخصي بنجاح.",
//     },
//     USER_PASSWORD_CHANGED: {
//       titleEn: "User Password Changed",
//       titleFr: "Mot de Passe Utilisateur Modifié",
//       titleAr: "تم تغيير كلمة مرور المستخدم",
//       messageEn: "Your password has been changed successfully.",
//       messageFr: "Votre mot de passe a été modifié avec succès.",
//       messageAr: "تم تغيير كلمة المرور بنجاح.",
//     },
//     USER_EMAIL_VERIFIED: {
//       titleEn: "User Email Verified",
//       titleFr: "Email Utilisateur Vérifié",
//       titleAr: "تم التحقق من بريد المستخدم",
//       messageEn: "Your email address has been verified successfully.",
//       messageFr: "Votre adresse email a été vérifiée avec succès.",
//       messageAr: "تم التحقق من عنوان بريدك الإلكتروني بنجاح.",
//     },
//     USER_DELETED: {
//       titleEn: "User Deleted",
//       titleFr: "Utilisateur Supprimé",
//       titleAr: "تم حذف المستخدم",
//       messageEn: "Your account has been deleted.",
//       messageFr: "Votre compte a été supprimé.",
//       messageAr: "تم حذف حسابك.",
//     },

//     // Reservation notifications
//     RESERVATION_REQUESTED: {
//       titleEn: "Reservation Requested",
//       titleFr: "Réservation Demandée",
//       titleAr: "تم طلب الحجز",
//       messageEn: "Your reservation has been submitted and is pending approval.",
//       messageFr: "Votre réservation a été soumise et est en attente d'approbation.",
//       messageAr: "تم تقديم حجزك وهو في انتظار الموافقة.",
//     },
//     RESERVATION_APPROVED: {
//       titleEn: "Reservation Approved",
//       titleFr: "Réservation Approuvée",
//       titleAr: "تمت الموافقة على الحجز",
//       messageEn: "Your reservation has been approved!",
//       messageFr: "Votre réservation a été approuvée!",
//       messageAr: "تمت الموافقة على حجزك!",
//     },
//     RESERVATION_DECLINED: {
//       titleEn: "Reservation Declined",
//       titleFr: "Réservation Refusée",
//       titleAr: "تم رفض الحجز",
//       messageEn: "Your reservation request has been declined.",
//       messageFr: "Votre demande de réservation a été refusée.",
//       messageAr: "تم رفض طلب الحجز الخاص بك.",
//     },
//     RESERVATION_CANCELLED: {
//       titleEn: "Reservation Cancelled",
//       titleFr: "Réservation Annulée",
//       titleAr: "تم إلغاء الحجز",
//       messageEn: "Your reservation has been cancelled.",
//       messageFr: "Votre réservation a été annulée.",
//       messageAr: "تم إلغاء حجزك.",
//     },
//     RESERVATION_REMINDER: {
//       titleEn: "Reservation Reminder",
//       titleFr: "Rappel de Réservation",
//       titleAr: "تذكير بالحجز",
//       messageEn: "You have an upcoming reservation tomorrow.",
//       messageFr: "Vous avez une réservation à venir demain.",
//       messageAr: "لديك حجز قادم غدًا.",
//     },

//     // Payment notifications
//     PAYMENT_RECEIVED: {
//       titleEn: "Payment Received",
//       titleFr: "Paiement Reçu",
//       titleAr: "تم استلام الدفع",
//       messageEn: "Your payment has been received successfully.",
//       messageFr: "Votre paiement a été reçu avec succès.",
//       messageAr: "تم استلام دفعتك بنجاح.",
//     },
//     PAYMENT_OVERDUE: {
//       titleEn: "Payment Overdue",
//       titleFr: "Paiement En Retard",
//       titleAr: "الدفع متأخر",
//       messageEn: "Your payment is overdue. Please make the payment as soon as possible.",
//       messageFr: "Votre paiement est en retard. Veuillez effectuer le paiement dès que possible.",
//       messageAr: "دفعك متأخر. يرجى السداد في أقرب وقت ممكن.",
//     },
//     PAYMENT_FAILED: {
//       titleEn: "Payment Failed",
//       titleFr: "Paiement Échoué",
//       titleAr: "فشل الدفع",
//       messageEn: "Your payment has failed. Please try again or contact support.",
//       messageFr: "Votre paiement a échoué. Veuillez réessayer ou contacter le support.",
//       messageAr: "فشلت عملية الدفع. يرجى المحاولة مرة أخرى أو الاتصال بالدعم.",
//     },
//     PAYMENT_REFUNDED: {
//       titleEn: "Payment Refunded",
//       titleFr: "Paiement Remboursé",
//       titleAr: "تم استرداد المبلغ",
//       messageEn: "Your payment has been refunded.",
//       messageFr: "Votre paiement a été remboursé.",
//       messageAr: "تم استرداد دفعتك.",
//     },
//     SUBSCRIPTION_PAYMENT: {
//       titleEn: "Subscription Payment",
//       titleFr: "Paiement d'Abonnement",
//       titleAr: "دفع الاشتراك",
//       messageEn: "Your monthly subscription payment has been processed.",
//       messageFr: "Le paiement de votre abonnement mensuel a été traité.",
//       messageAr: "تمت معالجة دفعة اشتراكك الشهري.",
//     },

//     // System notifications
//     SYSTEM_MAINTENANCE: {
//       titleEn: "System Maintenance",
//       titleFr: "Maintenance du Système",
//       titleAr: "صيانة النظام",
//       messageEn: "The system will be down for maintenance. Please save your work.",
//       messageFr: "Le système sera en maintenance. Veuillez sauvegarder votre travail.",
//       messageAr: "سيكون النظام متوقفًا للصيانة. يرجى حفظ عملك.",
//     },
//     SYSTEM_UPDATE: {
//       titleEn: "System Update",
//       titleFr: "Mise à Jour du Système",
//       titleAr: "تحديث النظام",
//       messageEn: "A system update has been applied with new features and improvements.",
//       messageFr: "Une mise à jour du système a été appliquée avec de nouvelles fonctionnalités et améliorations.",
//       messageAr: "تم تطبيق تحديث للنظام بميزات وتحسينات جديدة.",
//     },
//     SYSTEM_NEW_FEATURE: {
//       titleEn: "New Feature Available",
//       titleFr: "Nouvelle Fonctionnalité Disponible",
//       titleAr: "ميزة جديدة متاحة",
//       messageEn: "Check out our new feature that makes reservation easier!",
//       messageFr: "Découvrez notre nouvelle fonctionnalité qui facilite la réservation!",
//       messageAr: "تحقق من ميزتنا الجديدة التي تجعل الحجز أسهل!",
//     },
//     SYSTEM_ANNOUNCEMENT: {
//       titleEn: "System Announcement",
//       titleFr: "Annonce du Système",
//       titleAr: "إعلان النظام",
//       messageEn: "Please read this important announcement regarding our services.",
//       messageFr: "Veuillez lire cette annonce importante concernant nos services.",
//       messageAr: "يرجى قراءة هذا الإعلان المهم فيما يتعلق بخدماتنا.",
//     },

//     // Admin notifications
//     ADMIN_NEW_USER: {
//       titleEn: "New User Registered",
//       titleFr: "Nouvel Utilisateur Inscrit",
//       titleAr: "مستخدم جديد مسجل",
//       messageEn: "A new user has registered on the platform.",
//       messageFr: "Un nouvel utilisateur s'est inscrit sur la plateforme.",
//       messageAr: "سجل مستخدم جديد على المنصة.",
//     },
//     ADMIN_NEW_RESERVATION: {
//       titleEn: "New Reservation Request",
//       titleFr: "Nouvelle Demande de Réservation",
//       titleAr: "طلب حجز جديد",
//       messageEn: "A new reservation request has been submitted.",
//       messageFr: "Une nouvelle demande de réservation a été soumise.",
//       messageAr: "تم تقديم طلب حجز جديد.",
//     },
//     ADMIN_PAYMENT_ALERT: {
//       titleEn: "Payment Requires Attention",
//       titleFr: "Paiement Nécessite une Attention",
//       titleAr: "الدفع يتطلب الاهتمام",
//       messageEn: "A payment requires your attention. Please review it.",
//       messageFr: "Un paiement nécessite votre attention. Veuillez l'examiner.",
//       messageAr: "الدفع يتطلب اهتمامك. يرجى مراجعته.",
//     },
//   };

//   /**
//    * Get localized title and message based on user's preferred locale
//    */
//   static getLocalizedContent(
//     content: NotificationContent,
//     locale: LocaleType
//   ): { title: string; message: string } {
//     switch (locale) {
//       case 'FR':
//         return {
//           title: content.titleFr,
//           message: content.messageFr,
//         };
//       case 'AR':
//         return {
//           title: content.titleAr,
//           message: content.messageAr,
//         };
//       case 'EN':
//       default:
//         return {
//           title: content.titleEn,
//           message: content.messageEn,
//         };
//     }
//   }

//   /**
//    * Create and send a notification (all use USER model for now)
//    */
//   static async createNotification(params: CreateNotificationParams) {
//     const {
//       type,
//       referenceId,
//       userId,
//       actorUserId,
//       metadata,
//       link,
//       customContent
//     } = params;

//     // Get template content
//     const template = this.notificationTemplates[type];
//     const content: NotificationContent = {
//       ...template,
//       ...customContent,
//     };

//     // All notifications use USER model for now
//     const model = 'USER' as const;
//     const notificationId = uuidv4();

//     // Create notification in database (MySQL doesn't support .returning())
//     await db.insert(notifications).values({
      
//       type,
//       model,
//       referenceId,
//       titleEn: content.titleEn,
//       titleFr: content.titleFr,
//       titleAr: content.titleAr,
//       messageEn: content.messageEn,
//       messageFr: content.messageFr,
//       messageAr: content.messageAr,
//       userId,
//       actorUserId,
//       metadata,
//       link: link || this.generateDefaultLink(type, referenceId),
//       isRead: false,
//     });

//     // Fetch the created notification to get all fields
//     const [notification] = await db.select()
//       .from(notifications)
//       .where(eq(notifications.id, notificationId))
//       .limit(1);

//     if (!notification) {
//       throw new Error('Failed to create notification');
//     }

//     // Send real-time notification via Pusher
//     await pusherServer.trigger(
//       `private-user-${userId}`,
//       'notification',
//       notification
//     );

//     return notification;
//   }

//   /**
//    * Generate default link based on notification type
//    */
//   private static generateDefaultLink(type: NotificationTypes, referenceId: string): string {
//     const linkMap: Record<string, string | null> = {
//       // User notifications
//       USER_CREATED: `/dashboard/users/${referenceId}`,
//       USER_APPROVED: `/dashboard/users/${referenceId}`,
//       USER_PROFILE_UPDATED: `/dashboard/users/${referenceId}/edit`,
//       USER_PASSWORD_CHANGED: `/dashboard/settings/security`,
//       USER_EMAIL_VERIFIED: `/settings/account`,
//       USER_DELETED: `/`,
      
//       // Reservation notifications
//       RESERVATION_REQUESTED: `/dashboard/reservations/${referenceId}`,
//       RESERVATION_APPROVED: `/dashboard/reservations/${referenceId}`,
//       RESERVATION_DECLINED: `/dashboard/reservations/${referenceId}`,
//       RESERVATION_CANCELLED: `/dashboard/reservations`,
//       RESERVATION_REMINDER: `/dashboard/reservations/${referenceId}`,
      
//       // Payment notifications
//       PAYMENT_RECEIVED: `/dashboard/payments/${referenceId}`,
//       PAYMENT_OVERDUE: `/dashboard/payments/${referenceId}`,
//       PAYMENT_FAILED: `/dashboard/payments/${referenceId}`,
//       PAYMENT_REFUNDED: `/dashboard/payments/${referenceId}`,
//       SUBSCRIPTION_PAYMENT: `/dashboard/subscriptions`,
      
//       // System notifications
//       SYSTEM_MAINTENANCE: null,
//       SYSTEM_UPDATE: null,
//       SYSTEM_NEW_FEATURE: null,
//       SYSTEM_ANNOUNCEMENT: null,
      
//       // Admin notifications
//       ADMIN_NEW_USER: `/dashboard/users/${referenceId}`,
//       ADMIN_NEW_RESERVATION: `/dashboard/reservations/${referenceId}`,
//       ADMIN_PAYMENT_ALERT: `/dashboard/payments/${referenceId}`,
//     };

//     return linkMap[type] || '/dashboard/notifications';
//   }

//   /**
//    * One-to-One: Send notification to a specific user
//    */
//   static async sendToOneUser(
//     receiverId: string,
//     type: NotificationTypes,
//     referenceId: string,
//     metadata?: Record<string, any>,
//     actorUserId?: string,
//     link?: string,
//     customContent?: Partial<NotificationContent>
//   ) {
//     return this.createNotification({
//       type,
//       referenceId,
//       userId: receiverId,
//       actorUserId,
//       metadata,
//       link,
//       customContent,
//     });
//   }

//   /**
//    * One-to-Many: Send notification to multiple specific users
//    */
//   static async sendToManyUsers(
//     receiverIds: string[],
//     type: NotificationTypes,
//     referenceId: string,
//     metadata?: Record<string, any>,
//     actorUserId?: string,
//     link?: string,
//     customContent?: Partial<NotificationContent>
//   ) {
//     const notificationPromises = receiverIds.map(async (userId) => {
//       return this.createNotification({
//         type,
//         referenceId,
//         userId,
//         actorUserId,
//         metadata,
//         link,
//         customContent,
//       });
//     });

//     const results = await Promise.allSettled(notificationPromises);
    
//     return results
//       .filter((result): result is PromiseFulfilledResult<Awaited<ReturnType<typeof this.createNotification>>> => 
//         result.status === 'fulfilled'
//       )
//       .map(result => result.value);
//   }

//   /**
//    * Get notifications for a specific user with locale
//    */
//   static async getUserNotifications(
//     userId: string,
//     locale: LocaleType = 'FR',
//     limit: number = 20,
//     offset: number = 0
//   ) {
//     const userNotifications = await db.select()
//       .from(notifications)
//       .where(eq(notifications.userId, userId))
//       .orderBy(desc(notifications.createdAt))
//       .limit(limit)
//       .offset(offset);

//     // Localize the notifications
//     return userNotifications.map(notification => {
//       const localized = this.getLocalizedContent(
//         {
//           titleEn: notification.titleEn,
//           titleFr: notification.titleFr,
//           titleAr: notification.titleAr,
//           messageEn: notification.messageEn,
//           messageFr: notification.messageFr,
//           messageAr: notification.messageAr,
//         },
//         locale
//       );

//       return {
//         ...notification,
//         title: localized.title,
//         message: localized.message,
//       };
//     });
//   }

//   /**
//    * Mark notification as read
//    */
//   static async markAsRead(notificationId: string, userId: string) {
//     await db.update(notifications)
//       .set({ isRead: true })
//       .where(
//         and(
//           eq(notifications.id, notificationId),
//           eq(notifications.userId, userId)
//         )
//       );

//     // Notify client via Pusher
//     await pusherServer.trigger(
//       `private-user-${userId}`,
//       'notification-read',
//       { notificationId }
//     );
//   }

//   /**
//    * Mark all notifications as read for a user
//    */
//   static async markAllAsRead(userId: string) {
//     await db.update(notifications)
//       .set({ isRead: true })
//       .where(eq(notifications.userId, userId));

//     // Notify client via Pusher
//     await pusherServer.trigger(
//       `private-user-${userId}`,
//       'notification-read',
//       { all: true }
//     );
//   }

//   /**
//    * Get unread notifications count for a user
//    */
//   static async getUnreadCount(userId: string): Promise<number> {
//     const [result] = await db.select({ count: sql<number>`count(*)` })
//       .from(notifications)
//       .where(
//         and(
//           eq(notifications.userId, userId),
//           eq(notifications.isRead, false)
//         )
//       );

//     return result?.count || 0;
//   }

//   /**
//    * Delete a notification
//    */
//   static async deleteNotification(notificationId: string, userId: string) {
//     await db.delete(notifications)
//       .where(
//         and(
//           eq(notifications.id, notificationId),
//           eq(notifications.userId, userId)
//         )
//       );
//   }

//   /**
//    * Helper function to create dynamic content with placeholders
//    */
//   static createDynamicContent(
//     baseContent: NotificationContent,
//     placeholders: Record<string, string>
//   ): NotificationContent {
//     const replacePlaceholders = (text: string): string => {
//       let result = text;
//       Object.entries(placeholders).forEach(([key, value]) => {
//         result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
//       });
//       return result;
//     };

//     return {
//       titleEn: replacePlaceholders(baseContent.titleEn),
//       titleFr: replacePlaceholders(baseContent.titleFr),
//       titleAr: replacePlaceholders(baseContent.titleAr),
//       messageEn: replacePlaceholders(baseContent.messageEn),
//       messageFr: replacePlaceholders(baseContent.messageFr),
//       messageAr: replacePlaceholders(baseContent.messageAr),
//     };
//   }
// }