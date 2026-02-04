"use server";

import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { eq, and, isNull, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { getMySQLDateTime } from "@/utils/index";

export async function bulkUserAction(action: string, userIds: string[]) {
  const session = await getSession();
  
  if (!session || session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can perform bulk actions");
  }

  if (!userIds.length) {
    throw new Error("No users selected for bulk action");
  }

  const validActions = ["approve", "decline", "resendVerification"];
  
  if (!validActions.includes(action)) {
    throw new Error(`Invalid action: ${action}`);
  }

  try {
    const now = getMySQLDateTime();
    let result;

    switch (action) {
      case "approve":
        // Approve users
        await db.update(users)
          .set({
            isApproved: true,
            updatedAt: now
          })
          .where(
            and(
              inArray(users.id, userIds),
              isNull(users.deletedAt),
              eq(users.isApproved, false)
            )
          );

        // TODO: Send approval notification emails
        // TODO: Create notifications for approval

        result = {
          success: true,
          message: `Bulk approval completed for selected users`
        };
        break;

      case "decline":
        // Decline users (soft delete unapproved users)
        await db.update(users)
          .set({
            deletedAt: now,
            updatedAt: now
          })
          .where(
            and(
              inArray(users.id, userIds),
              isNull(users.deletedAt),
              eq(users.isApproved, false)
            )
          );

        // TODO: Send decline notification emails
        // TODO: Create notifications for decline

        result = {
          success: true,
          message: `Bulk decline completed for selected users`
        };
        break;

      case "resendVerification":
        // Resend verification to unverified users
        const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        
        for (const userId of userIds) {
          const verificationToken = crypto.randomUUID();
          
          await db.update(users)
            .set({
              verificationToken,
              verificationTokenExpiresAt: getMySQLDateTime(verificationTokenExpiresAt),
              updatedAt: now
            })
            .where(
              and(
                eq(users.id, userId),
                isNull(users.deletedAt),
                isNull(users.emailVerifiedAt)
              )
            );

          // TODO: Send verification email with token
          // TODO: Create notification for verification resend
        }

        result = {
          success: true,
          message: `Bulk verification resend completed for selected users`
        };
        break;

      default:
        throw new Error(`Unhandled action: ${action}`);
    }

    revalidatePath("/dashboard/users");
    return result;
  } catch (error) {
    console.error("Bulk action error:", error);
    throw error instanceof Error 
      ? error 
      : new Error(`Failed to perform bulk ${action} action`);
  }
}