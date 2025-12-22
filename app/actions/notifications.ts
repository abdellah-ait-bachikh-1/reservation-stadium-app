// app/actions/notifications.ts
'use server';

import { getSession } from '@/auth';
import db from '@/lib/db';

import { revalidatePath } from 'next/cache';

// Mark a single notification as read
export async function markNotificationAsRead(notificationId: string) {
  try {
    const session = await getSession();
    
    if (!session?.user?.id) {
      return { error: 'Unauthorized' };
    }

    // Verify the notification belongs to the user
    const notification = await db.notification.findFirst({
      where: {
        id: notificationId,
        userId: session.user.id,
      },
    });

    if (!notification) {
      return { error: 'Notification not found' };
    }

    await db.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { error: 'Failed to mark notification as read' };
  }
}

// Mark all notifications as read
export async function markAllNotificationsAsRead() {
  try {
    const session = await getSession();
    
    if (!session?.user?.id) {
      return { error: 'Unauthorized' };
    }

    await db.notification.updateMany({
      where: {
        userId: session.user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    revalidatePath('/dashboard');
    return { success: true, message: 'All notifications marked as read' };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { error: 'Failed to mark all notifications as read' };
  }
}