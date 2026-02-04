"use server";

import { db } from "@/drizzle/db";
import { 
  users, 
  clubs, 
  reservations, 
  reservationSeries,
  monthlySubscriptions,
  monthlyPayments,
  singleSessionPayments,
  
  notifications,
  passwordResetTokens
} from "@/drizzle/schema";
import {  inArray, and, isNull, not, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { getMySQLDateTime } from "@/utils/index";

/**
 * Helper function to get MySQL compatible datetime string
 */


/**
 * Soft delete users (mark as deleted)
 * This will cascade to related tables through foreign key constraints
 */
export async function softDeleteUsers(userIds: string[]) {
  const session = await getSession();
  
  if (!session || session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can delete users");
  }

  if (!userIds.length) {
    throw new Error("No users selected for deletion");
  }

  try {
    // Check if users exist and are not already deleted
    const existingUsers = await db.select({
      id: users.id,
      name: users.name,
      deletedAt: users.deletedAt
    }).from(users)
      .where(inArray(users.id, userIds));
    
    const validUsers = existingUsers.filter(user => !user.deletedAt);
    
    if (validUsers.length === 0) {
      throw new Error("No active users found to delete");
    }

    const now = getMySQLDateTime();

    // Soft delete users
    await db.update(users)
      .set({
        deletedAt: now,
        updatedAt: now
      })
      .where(
        and(
          inArray(users.id, validUsers.map(u => u.id)),
          isNull(users.deletedAt)
        )
      );

    // Soft delete related clubs
    await db.update(clubs)
      .set({
        deletedAt: now,
        updatedAt: now
      })
      .where(
        and(
          inArray(clubs.userId, validUsers.map(u => u.id)),
          isNull(clubs.deletedAt)
        )
      );

    // Soft delete related reservations
    await db.update(reservations)
      .set({
        deletedAt: now,
        updatedAt: now
      })
      .where(
        and(
          inArray(reservations.userId, validUsers.map(u => u.id)),
          isNull(reservations.deletedAt)
        )
      );

    revalidatePath("/dashboard/users");
    return { 
      success: true, 
      count: validUsers.length,
      message: `Successfully soft deleted ${validUsers.length} user(s)`
    };
  } catch (error) {
    console.error("Soft delete error:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Failed to soft delete users");
  }
}

/**
 * Permanently delete users and all related data
 * This will cascade through foreign key constraints
 */
export async function permanentDeleteUsers(userIds: string[]) {
  const session = await getSession();
  
  if (!session || session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can delete users");
  }

  if (!userIds.length) {
    throw new Error("No users selected for permanent deletion");
  }

  try {
    // Check if users exist
    const existingUsers = await db.select({
      id: users.id,
      name: users.name
    }).from(users)
      .where(inArray(users.id, userIds));
    
    if (existingUsers.length === 0) {
      throw new Error("No users found to delete");
    }

    // IMPORTANT: Delete in reverse order of dependencies to avoid foreign key constraint errors
    

    // 2. Delete single session payments
    await db.delete(singleSessionPayments)
      .where(inArray(singleSessionPayments.userId, userIds));
      
    // 3. Delete monthly payments
    await db.delete(monthlyPayments)
      .where(inArray(monthlyPayments.userId, userIds));

    // 4. Delete monthly subscriptions
    await db.delete(monthlySubscriptions)
      .where(inArray(monthlySubscriptions.userId, userIds));

    // 5. Delete reservation series
    await db.delete(reservationSeries)
      .where(inArray(reservationSeries.userId, userIds));

    // 6. Delete reservations
    await db.delete(reservations)
      .where(inArray(reservations.userId, userIds));

    // 7. Delete clubs
    await db.delete(clubs)
      .where(inArray(clubs.userId, userIds));

    // 8. Delete notifications
    await db.delete(notifications)
      .where(inArray(notifications.userId, userIds));

    // 9. Delete actor notifications
    await db.delete(notifications)
      .where(inArray(notifications.actorUserId, userIds));

    // 10. Delete password reset tokens
    await db.delete(passwordResetTokens)
      .where(inArray(passwordResetTokens.userId, userIds));

    // 11. Finally delete users
    await db.delete(users)
      .where(inArray(users.id, userIds));

    revalidatePath("/dashboard/users");
    
    return { 
      success: true, 
      count: existingUsers.length,
      message: `Permanently deleted ${existingUsers.length} user(s) and all related data`
    };
  } catch (error) {
    console.error("Permanent delete error:", error);
    
    // More specific error messages
    if (error instanceof Error) {
      if (error.message.includes("foreign key constraint")) {
        throw new Error("Cannot delete users with active related data. Try soft delete first.");
      }
      throw error;
    }
    
    throw new Error("Failed to permanently delete users");
  }
}

/**
 * Single user soft delete (convenience function)
 */
export async function softDeleteUser(userId: string) {
  return await softDeleteUsers([userId]);
}

/**
 * Single user permanent delete (convenience function)
 */
export async function permanentDeleteUser(userId: string) {
  return await permanentDeleteUsers([userId]);
}

/**
 * Restore soft-deleted users
 */
export async function restoreUsers(userIds: string[]) {
  const session = await getSession();
  
  if (!session || session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can restore users");
  }

  if (!userIds.length) {
    throw new Error("No users selected for restoration");
  }

  try {
    // Check if users are soft deleted
    const deletedUsers = await db.select({
      id: users.id,
      name: users.name
    }).from(users)
      .where(
        and(
          inArray(users.id, userIds),
          not(isNull(users.deletedAt))
        )
      );
    
    if (deletedUsers.length === 0) {
      throw new Error("No soft-deleted users found to restore");
    }

    const now = getMySQLDateTime();

    // Restore users
    await db.update(users)
      .set({
        deletedAt: null,
        updatedAt: now
      })
      .where(inArray(users.id, deletedUsers.map(u => u.id)));

    // Restore related clubs
    await db.update(clubs)
      .set({
        deletedAt: null,
        updatedAt: now
      })
      .where(inArray(clubs.userId, deletedUsers.map(u => u.id)));

    // Restore related reservations
    await db.update(reservations)
      .set({
        deletedAt: null,
        updatedAt: now
      })
      .where(inArray(reservations.userId, deletedUsers.map(u => u.id)));

    revalidatePath("/dashboard/users");
    return { 
      success: true, 
      count: deletedUsers.length,
      message: `Successfully restored ${deletedUsers.length} user(s)`
    };
  } catch (error) {
    console.error("Restore error:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Failed to restore users");
  }
}

/**
 * Single user restore (convenience function)
 */
export async function restoreUser(userId: string) {
  return await restoreUsers([userId]);
}