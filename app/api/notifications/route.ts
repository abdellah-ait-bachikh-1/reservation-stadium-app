// app/api/notifications/route.ts (UPDATED)
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/drizzle/db";
import { notifications, users } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { getLimitedNotificationForUser } from "@/lib/queries/notifications";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20");

    // Get user's preferred locale
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        preferredLocale: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const locale = user.preferredLocale as "EN" | "FR" | "AR";

    // Get notifications for the user
    const userNotifications = await getLimitedNotificationForUser(
      userId,
      limit
    );

    // Transform with ONLY the user's locale
    const transformedNotifications = userNotifications.map((notification) => {
      // Get title and message based on user's locale
      let title = "";
      let message = "";

      switch (locale) {
        case "EN":
          title = notification.titleEn;
          message = notification.messageEn;
          break;
        case "FR":
          title = notification.titleFr;
          message = notification.messageFr;
          break;
        case "AR":
          title = notification.titleAr;
          message = notification.messageAr;
          break;
        default:
          title = notification.titleEn;
          message = notification.messageEn;
      }

      // Return ONLY the user's locale fields + essential data
      return {
        id: notification.id,
        type: notification.type,
        model: notification.model,
        referenceId: notification.referenceId,
        title, // Only localized title
        message, // Only localized message
        link: notification.link,
        metadata: notification.metadata,
        isRead: notification.isRead,
        userId: notification.userId,
        actorUserId: notification.actorUserId,
        createdAt: notification.createdAt,
        // Don't include titleEn, titleFr, titleAr, etc.
        // Only include what the frontend needs
      };
    });

    return NextResponse.json({
      success: true,
      data: transformedNotifications,
      total: transformedNotifications.length,
      limit,
      userLocale: locale,
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch notifications",
      },
      { status: 500 }
    );
  }
}
