import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher/server";

export async function GET(request: NextRequest) {
  try {
    // Test if Pusher server is working
    const testResult = await pusherServer.trigger(
      'test-channel',
      'test-event',
      { message: 'Test from server' }
    );
    
    return NextResponse.json({
      success: true,
      message: "Pusher server is working",
      env: {
        appId: process.env.PUSHER_APP_ID ? "✓ Set" : "✗ Missing",
        key: process.env.PUSHER_KEY ? "✓ Set" : "✗ Missing",
        secret: process.env.PUSHER_SECRET ? "✓ Set" : "✗ Missing",
        cluster: process.env.PUSHER_CLUSTER || 'eu'
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      env: {
        appId: process.env.PUSHER_APP_ID ? "✓ Set" : "✗ Missing",
        key: process.env.PUSHER_KEY ? "✓ Set" : "✗ Missing",
        secret: process.env.PUSHER_SECRET ? "✓ Set" : "✗ Missing",
        cluster: process.env.PUSHER_CLUSTER || 'eu'
      }
    }, { status: 500 });
  }
}