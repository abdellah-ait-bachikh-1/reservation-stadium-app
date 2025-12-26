import { getSession } from '@/auth';
import { isExistsAuthenticatedUserInApi } from '@/lib/data/auth';
import { pusherServer } from '@/lib/pusher-server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const user = await isExistsAuthenticatedUserInApi();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

    // قراءة البيانات كـ form-data
    const formData = await request.formData();
    const socket_id = formData.get('socket_id') as string;
    const channel_name = formData.get('channel_name') as string;

    // أو يمكنك قراءة البيانات من نص الطلب
    // const text = await request.text();
    // const params = new URLSearchParams(text);
    // const socket_id = params.get('socket_id');
    // const channel_name = params.get('channel_name');

    if (!socket_id || !channel_name) {
      console.log('Missing socket_id or channel_name:', { socket_id, channel_name });
      return NextResponse.json(
        { error: 'Missing socket_id or channel_name' },
        { status: 400 }
      );
    }

    // التحقق من أن المستخدم يحاول الاشتراك في قناته الخاصة فقط
    const userId = user.id;
    const expectedChannelName = `private-user-${userId}`;

    if (channel_name !== expectedChannelName) {
      console.log('Unauthorized channel access:', {
        channel_name,
        expectedChannelName,
        userId
      });
      return NextResponse.json(
        { error: 'Unauthorized channel access' },
        { status: 403 }
      );
    }

    console.log('Authorizing Pusher channel:', {
      socket_id,
      channel_name,
      userId,
      userName: user.fullNameFr
    });

    // إنشاء مصادقة Pusher
    const authResponse = pusherServer.authorizeChannel(
      socket_id,
      channel_name,
      {
        user_id: userId,
        user_info: {
          name: user.fullNameFr,
          email: user.email,
        },
      }
    );

    console.log('Pusher auth response generated');
    return NextResponse.json(authResponse);
  } catch (error) {
    console.error('Pusher auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}