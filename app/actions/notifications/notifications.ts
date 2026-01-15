"use server";

import { isAuthenticatedUserExistsInDB } from "@/lib/auth";
import { markAllNotificationAsReadForSpecificUser, markOnNotificationAsRead } from "@/lib/queries/notifications";
import { isErrorHasMessage } from "@/utils";

export async function markAllNotificationAsReadAction() {
  try {
    const user = await isAuthenticatedUserExistsInDB();
    if (!user) {
      return { success: false };
    }
    await markAllNotificationAsReadForSpecificUser(user.id);

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
    const user = await isAuthenticatedUserExistsInDB();
    if (!user) {
      return { success: false };
    }
    await markOnNotificationAsRead(user.id,notificationId);

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
