import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {
 
  LocaleType,
} from "@/services/notification.service";

export async function GET(request: NextRequest) {
  try {
    // check the user if authenticated
    const session = { user: { id: "123" } };
    const searchParams = request.nextUrl.searchParams;
    const locale = (searchParams.get("locale") || "FR") as LocaleType;
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    // const notifications = await NotificationService.getUserNotifications(
    //   session.user.id,
    //   locale,
    //   limit,
    //   offset
    // );
     const notifications: any[] = [];
    return NextResponse.json({
      success: true,
      notifications,
      total: notifications.length,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
