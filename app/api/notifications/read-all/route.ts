// app/api/notifications/read-all/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/drizzle/db";
import { notifications } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Mark all notifications as read for this user
    await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, userId));

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read"
    });
    
  } catch (error: any) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to mark all notifications as read" 
      },
      { status: 500 }
    );
  }
}