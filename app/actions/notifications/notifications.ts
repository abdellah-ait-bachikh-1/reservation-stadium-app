"use server";

import { getSession } from "@/lib/auth";
import { markAllNotificationAsReadForSpecificUser, markOnNotificationAsRead } from "@/lib/queries/dashboard/notifications";
import { isErrorHasMessage } from "@/utils";

export async function markAllNotificationAsReadAction() {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return { success: false };
    }
    await markAllNotificationAsReadForSpecificUser(session.user.id);

    return { success: true };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    if (isErrorHasMessage(error)) {
      throw new Error(error.message);
    } else {
      throw new Error("Network Error");
    }
  }
}

export async function markOnNotificationAsReadAction(notificationId:string) {
  try {
   const session = await getSession();
    if (!session || !session.user) {
      return { success: false };
    }
    await markOnNotificationAsRead(session.user.id,notificationId);

    return { success: true };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    if (isErrorHasMessage(error)) {
      throw new Error(error.message);
    } else {
      throw new Error("Network Error");
    }
  }
}
