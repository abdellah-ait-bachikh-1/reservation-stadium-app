import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher/server";
import { clearAuthCookies, getSession, isAuthenticatedUserTokenExistInDb } from "@/lib/auth";
import { isErrorHasMessage } from "@/utils";

export async function POST(request: NextRequest) {
  try {
    // Get the session
      const authUser = await isAuthenticatedUserTokenExistInDb(request);
      
          if (!authUser) {
            const response = NextResponse.json(
              { 
                success: false, 
                error: "Not authenticated",
                message: "User not found or session expired"
              },
              { status: 401 }
            );
            
            clearAuthCookies(response);
            return response;
          }

    const userId = authUser.id;
    const userName = authUser.name || "User";
    const userEmail = authUser.email || "";

    // Read form data
    const formData = await request.formData();
    const socket_id = formData.get('socket_id') as string;
    const channel_name = formData.get('channel_name') as string;

    // console.log("🔐 Pusher auth request:", {
    //   socket_id: socket_id?.substring(0, 10) + '...',
    //   channel_name,
    //   userId
    // });

    // Validate required fields
    if (!socket_id || !channel_name) {
      return NextResponse.json(
        { error: 'Missing socket_id or channel_name' },
        { status: 400 }
      );
    }

    // Validate channel name
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

    // console.log("✅ Authorizing channel for user:", userId);

    // Create auth response
    const authResponse = pusherServer.authorizeChannel(
      socket_id,
      channel_name,
      {
        user_id: userId,
        user_info: {
          name: userName,
          email: userEmail,
        },
      }
    );

    // console.log("✅ Auth successful");
    return NextResponse.json(authResponse);

  } catch (error: any) {
    console.error("❌ Pusher auth error:", error);
   if (isErrorHasMessage(error)) throw new Error(error.message);
       throw new Error("Unexpected registration error");
  }
}