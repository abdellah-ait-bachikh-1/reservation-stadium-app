import { getSession } from '@/auth';

export async function authenticatePusherChannel(
  channelName: string,
  userId: string
): Promise<boolean> {
  try {
    // التحقق من أن المستخدم يحاول الاشتراك في قناته الخاصة فقط
    const expectedChannelName = `private-user-${userId}`;
    
    if (channelName !== expectedChannelName) {
      console.error(`Unauthorized Pusher channel access: ${channelName}`);
      return false;
    }
    
    const session = await getSession();
    
    if (!session || session.user.id !== userId) {
      console.error('User authentication failed for Pusher');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Pusher authentication error:', error);
    return false;
  }
}