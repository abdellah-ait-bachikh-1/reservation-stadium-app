import PusherClient from 'pusher-js';

// إنشاء عميل Pusher للكلينت
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'mt1',
    authEndpoint: '/api/pusher/auth', // نقطة التوثيق
    // إزالة headers من auth لأن Pusher يضيفها تلقائياً
    forceTLS: true,
  }
);

// دالة محسنة لربط Pusher
export function setupPusher({
  userId,
  onNotification,
  onConnected,
  onError,
}: {
  userId: string;
  onNotification: (notification: any) => void;
  onConnected?: () => void;
  onError?: (error: any) => void;
}) {
  try {
    console.log('🔌 Attempting to setup Pusher for user:', userId);
    
    // الاشتراك في القناة الخاصة بالمستخدم
    const channel = pusherClient.subscribe(`private-user-${userId}`);

    // الاستماع للأحداث
    channel.bind('pusher:subscription_succeeded', () => {
      console.log(`✅ Connected to Pusher channel for user ${userId}`);
      onConnected?.();
    });

    channel.bind('notification', (data: any) => {
      console.log('📩 New notification received:', data);
      onNotification(data);
    });

    channel.bind('pusher:subscription_error', (error: any) => {
      console.error('❌ Pusher subscription error:', {
        message: error?.message,
        type: error?.type,
        code: error?.code,
        data: error?.data,
        fullError: error
      });
      onError?.(error);
    });

    // إضافة معالجة للأخطاء العامة
    pusherClient.connection.bind('error', (error: any) => {
      console.error('❌ Pusher connection error:', {
        message: error?.message,
        type: error?.type,
        code: error?.code,
        fullError: error
      });
      onError?.(error);
    });

    pusherClient.connection.bind('connected', () => {
      console.log('✅ Pusher client connected');
    });

    pusherClient.connection.bind('connecting', () => {
      console.log('🔄 Connecting to Pusher...');
    });

    pusherClient.connection.bind('disconnected', () => {
      console.log('🔌 Pusher disconnected');
    });

    // تنظيف الاشتراك عند الخروج
    return () => {
      console.log('🧹 Cleaning up Pusher connection for user:', userId);
      channel.unbind_all();
      channel.unsubscribe();
    };
  } catch (error) {
    console.error('❌ Error setting up Pusher:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      error
    });
    onError?.(error);
  }
}