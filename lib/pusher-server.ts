import PusherServer from 'pusher';

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER || 'mt1',
  useTLS: true,
});

// دالة مساعدة لإرسال إشعارات Pusher
export async function sendPusherNotification({
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
    // Trigger event إلى قناة المستخدم الخاصة
    await pusherServer.trigger(
      `private-user-${userId}`, // اسم القناة الخاصة بالمستخدم
      'notification', // اسم الحدث
      {
        id: Date.now().toString(), // ID مؤقت
        type,
        title,
        message,
        data,
        createdAt: new Date().toISOString(),
        read: false,
      }
    );
    
    console.log(`✅ Pusher notification sent to user ${userId}`);
  } catch (error) {
    console.error('❌ Error sending Pusher notification:', error);
  }
}

// دالة لإرسال إشعارات متعددة اللغات
export async function sendMultilingualPusherNotification({
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
    await pusherServer.trigger(
      `private-user-${userId}`,
      'notification',
      {
        id: Date.now().toString(),
        type,
        translations, // أرسل جميع الترجمات
        data,
        createdAt: new Date().toISOString(),
        read: false,
      }
    );
  } catch (error) {
    console.error('❌ Error sending multilingual Pusher notification:', error);
  }
}