"use server";

import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { eq, and, isNull, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { getMySQLDateTime } from "@/utils/index";

export async function approveUser(userId: string) {
  const session = await getSession();
  
  if (!session || session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can approve users");
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
      throw new Error("User is already approved");
    }

    const now = getMySQLDateTime();

    // Update user approval status
    await db.update(users)
      .set({
        isApproved: true,
        updatedAt: now
      })
      .where(eq(users.id, userId));

    // TODO: Send approval notification email to user
    // TODO: Create notification for the user

    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/users/${userId}`);
    
    return {
      success: true,
      message: `Successfully approved user: ${user.name}`
    };
  } catch (error) {
    console.error("Approve user error:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Failed to approve user");
  }
}

export async function approveUsers(userIds: string[]) {
  const session = await getSession();
  
  if (!session || session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can approve users");
  }

  if (!userIds.length) {
    throw new Error("No users selected for approval");
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
      throw new Error("No pending users found to approve");
    }

    const now = getMySQLDateTime();

    // Approve all selected users
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

    // TODO: Send approval notification emails to all approved users
    // TODO: Create notifications for all approved users

    revalidatePath("/dashboard/users");
    
    return {
      success: true,
      count: existingUsers.length,
      message: `Successfully approved ${existingUsers.length} user(s)`
    };
  } catch (error) {
    console.error("Bulk approve users error:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Failed to approve users");
  }
}