"use server";

import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { eq, and, isNull, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { getMySQLDateTime } from "@/utils/index";

export async function resendVerification(userId: string) {
  const session = await getSession();
  
  if (!session || session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can resend verification");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    // Check if user exists and is not deleted
    const [user] = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      emailVerifiedAt: users.emailVerifiedAt,
      deletedAt: users.deletedAt
    }).from(users)
      .where(
        and(
          eq(users.id, userId),
          isNull(users.deletedAt)
        )
      );

    if (!user) {
      throw new Error("User not found or already deleted");
    }

    if (user.emailVerifiedAt) {
      throw new Error("User email is already verified");
    }

    // Generate new verification token
    const verificationToken = crypto.randomUUID();
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    const now = getMySQLDateTime();

    await db.update(users)
      .set({
        verificationToken,
        verificationTokenExpiresAt: getMySQLDateTime(verificationTokenExpiresAt),
        updatedAt: now
      })
      .where(eq(users.id, userId));

    // TODO: Send verification email with the new token
    // TODO: Create notification about verification email sent

    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/users/${userId}`);
    
    return {
      success: true,
      message: `Verification email resent to: ${user.email}`
    };
  } catch (error) {
    console.error("Resend verification error:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Failed to resend verification");
  }
}

export async function resendVerificationToUsers(userIds: string[]) {
  const session = await getSession();
  
  if (!session || session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can resend verification");
  }

  if (!userIds.length) {
    throw new Error("No users selected for verification resend");
  }

  try {
    // Check if users exist, are not deleted, and are not verified
    const existingUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      emailVerifiedAt: users.emailVerifiedAt,
      deletedAt: users.deletedAt
    }).from(users)
      .where(
        and(
          inArray(users.id, userIds),
          isNull(users.deletedAt),
          isNull(users.emailVerifiedAt)
        )
      );
    
    if (existingUsers.length === 0) {
      throw new Error("No unverified users found to resend verification");
    }

    const now = getMySQLDateTime();
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    const successIds: string[] = [];
    const failedIds: string[] = [];

    // Process each user
    for (const user of existingUsers) {
      try {
        const verificationToken = crypto.randomUUID();
        
        await db.update(users)
          .set({
            verificationToken,
            verificationTokenExpiresAt: getMySQLDateTime(verificationTokenExpiresAt),
            updatedAt: now
          })
          .where(eq(users.id, user.id));

        // TODO: Send verification email to user.email with verificationToken
        // TODO: Create notification for each user

        successIds.push(user.id);
      } catch (error) {
        console.error(`Failed to resend verification to user ${user.id}:`, error);
        failedIds.push(user.id);
      }
    }

    if (successIds.length === 0) {
      throw new Error("Failed to resend verification to any users");
    }

    revalidatePath("/dashboard/users");
    
    return {
      success: true,
      count: successIds.length,
      failedCount: failedIds.length,
      message: `Successfully resent verification to ${successIds.length} user(s)`,
      ...(failedIds.length > 0 && {
        warning: `Failed to resend verification to ${failedIds.length} user(s)`
      })
    };
  } catch (error) {
    console.error("Bulk resend verification error:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Failed to resend verification");
  }
}