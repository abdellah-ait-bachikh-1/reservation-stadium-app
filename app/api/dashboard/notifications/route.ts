// api/notifications/route.ts
import { getSession } from '@/auth';
import { getLocaleFromNextIntlCookie } from '@/lib/api/locale';
import {
  formatTimeAgo,
  mapNotificationType,
  getLocalizedText,
  getActorName,
} from '@/lib/api/utils';
import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // الخطوة 1: الحصول على لغة المستخدم من قاعدة البيانات (الأولوية)
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { preferredLocale: true }
    });

    let locale: 'en' | 'fr' | 'ar' = 'ar'; // الافتراضي
    
    if (user?.preferredLocale) {
      // تحويل EN/FR/AR إلى en/fr/ar
      locale = user.preferredLocale.toLowerCase() as 'en' | 'fr' | 'ar';
    } else {
      // إذا لم تكن اللغة مضبوطة، استخدم الكوكي
      locale = await getLocaleFromNextIntlCookie();
    }

    console.log('Using locale for notifications:', { 
      userId: session.user.id, 
      dbLocale: user?.preferredLocale,
      finalLocale: locale 
    });

    const limit = 20;

    const [notifications, unreadCount] = await Promise.all([
      db.notification.findMany({
        where: { userId: session.user.id },
        select: {
          id: true,
          type: true,
          titleEn: true,
          titleFr: true,
          titleAr: true,
          messageEn: true,
          messageFr: true,
          messageAr: true,
          isRead: true,
          metadata: true,
          createdAt: true,
          actor: {
            select: {
              fullNameFr: true,
              fullNameAr: true,
              email: true,
              preferredLocale: true, // إضافة preferredLocale
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      db.notification.count({
        where: {
          userId: session.user.id,
          isRead: false,
        },
      }),
    ]);

    const formattedNotifications = notifications.map((notification) => {
      // استخدام اللغة التي حددناها
      const { title, message } = getLocalizedText(notification, locale);

      return {
        id: notification.id,
        type: mapNotificationType(notification.type),
        title,
        message,
        time: formatTimeAgo(notification.createdAt, locale),
        read: notification.isRead,
        metadata: notification.metadata,
        actorName: getActorName(notification.actor, locale),
        actorEmail: notification.actor?.email || null,
        createdAt: notification.createdAt,
        // إضافة اللغة المستخدمة للتصحيح
        _locale: locale,
      };
    });

    return NextResponse.json({
      notifications: formattedNotifications,
      unreadCount,
      total: notifications.length,
      userLocale: locale, // إرسال اللغة المستخدمة
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}