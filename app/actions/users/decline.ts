"use server";

import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { eq, and, isNull, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { getMySQLDateTime } from "@/utils/index";

// In declineUser.ts - fix the decline function
export async function declineUser(userId: string) {
  const session = await getSession();
  
  if (!session || session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can decline users");
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
      isApproved: users.isApproved,
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

    if (user.isApproved) {
      throw new Error("Cannot decline an already approved user. Use delete instead.");
    }

    // For declining, we'll soft delete the user since they're not approved yet
    const now = getMySQLDateTime();

    await db.update(users)
      .set({
        deletedAt: now,
        updatedAt: now
      })
      .where(eq(users.id, userId));

    // TODO: Send decline notification email to user
    // TODO: Create notification for the decline action

    revalidatePath("/dashboard/users");
    
    return {
      success: true,
      message: `Successfully declined user: ${user.name}`
    };
  } catch (error) {
    console.error("Decline user error:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Failed to decline user");
  }
}

export async function declineUsers(userIds: string[]) {
  const session = await getSession();
  
  if (!session || session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can decline users");
  }

  if (!userIds.length) {
    throw new Error("No users selected for decline");
  }

  try {
    // Check if users exist and are not already approved
    const existingUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      isApproved: users.isApproved,
      deletedAt: users.deletedAt
    }).from(users)
      .where(
        and(
          inArray(users.id, userIds),
          isNull(users.deletedAt),
          eq(users.isApproved, false)
        )
      );
    
    if (existingUsers.length === 0) {
      throw new Error("No pending users found to decline");
    }

    const now = getMySQLDateTime();

    // Soft delete all declined users
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

    // TODO: Send decline notification emails to all declined users
    // TODO: Create notifications for all declined users

    revalidatePath("/dashboard/users");
    
    return {
      success: true,
      count: existingUsers.length,
      message: `Successfully declined ${existingUsers.length} user(s)`
    };
  } catch (error) {
    console.error("Bulk decline users error:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Failed to decline users");
  }
}