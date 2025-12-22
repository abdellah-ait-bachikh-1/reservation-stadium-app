import { getSession } from '@/auth';
import { getLocaleFromNextIntlCookie } from '@/lib/api/locale';
import {
  formatTimeAgo,
  mapNotificationType,
  getRequestLocale,
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

    const locale = await getLocaleFromNextIntlCookie();
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
      };
    });

    return NextResponse.json({
      notifications: formattedNotifications,
      unreadCount,
      total: notifications.length,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}