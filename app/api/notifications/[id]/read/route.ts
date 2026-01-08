// app/api/notifications/[id]/read/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/drizzle/db";
import { notifications } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const notificationId = params.id;
    const userId = session.user.id;

    // Mark notification as read
    await db.update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.id, notificationId),
          eq(notifications.userId, userId)
        )
      );

    return NextResponse.json({
      success: true,
      message: "Notification marked as read"
    });
    
  } catch (error: any) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to mark notification as read" 
      },
      { status: 500 }
    );
  }
}