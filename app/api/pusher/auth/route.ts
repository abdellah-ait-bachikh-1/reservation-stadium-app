import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher/server";

export async function POST(request: NextRequest) {
  try {
    
    const authenticatedUser = {
      id: "123",
      name: "Test User",
      email: "test@example.com"
    };
    
    // Read form data (Pusher sends form-encoded data)
    const formData = await request.formData();
    const socket_id = formData.get('socket_id') as string;
    const channel_name = formData.get('channel_name') as string;

    console.log("🔐 Pusher auth request:", {
      socket_id: socket_id?.substring(0, 10) + '...',
      channel_name,
      userId: authenticatedUser.id
    });

    // Validate required fields
    if (!socket_id || !channel_name) {
      return NextResponse.json(
        { error: 'Missing socket_id or channel_name' },
        { status: 400 }
      );
    }

    // Validate channel name (user can only subscribe to their own channel)
    const userId = authenticatedUser.id;
    const expectedChannelName = `private-user-${userId}`;

    if (channel_name !== expectedChannelName) {
      console.error("❌ Unauthorized channel access:", {
        requested: channel_name,
        expected: expectedChannelName
      });
      return NextResponse.json(
        { error: 'Unauthorized channel access' },
        { status: 403 }
      );
    }

    console.log("✅ Authorizing channel for user:", userId);

    // Create auth response (no session check for testing)
    const authResponse = pusherServer.authorizeChannel(
      socket_id,
      channel_name,
      {
        user_id: userId,
        user_info: {
          name: authenticatedUser.name,
          email: authenticatedUser.email,
        },
      }
    );

    console.log("✅ Auth successful");
    return NextResponse.json(authResponse);

  } catch (error: any) {
    console.error("❌ Pusher auth error:", error.message);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}