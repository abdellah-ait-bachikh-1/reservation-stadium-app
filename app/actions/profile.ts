// actions/user.ts
"use server";

import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const updateProfileSchema = z.object({
  fullNameFr: z.string().min(2),
  fullNameAr: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().min(10),
  preferredLocale: z.enum(["EN", "FR", "AR"]),
});

export async function updateUserProfile(userId: string, data: z.infer<typeof updateProfileSchema>) {
  try {
    // Validate data
    const validatedData = updateProfileSchema.parse(data);
    
    // Check if email is already taken by another user
    const existingUser = await db.user.findFirst({
      where: {
        email: validatedData.email,
        id: { not: userId },
      },
    });
    
    if (existingUser) {
      return { success: false, error: "Email is already taken" };
    }
    
    // Update user
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: validatedData,
    });
    
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function changePassword(userId: string, data: {
  currentPassword: string;
  newPassword: string;
}) {
  try {
    // Get user with password
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });
    
    if (!user) {
      return { success: false, error: "User not found" };
    }
    
    // Verify current password
    const isValid = await bcrypt.compare(data.currentPassword, user.password);
    
    if (!isValid) {
      return { success: false, error: "Current password is incorrect" };
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    
    // Update password
    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);
    return { success: false, error: "Failed to change password" };
  }
}



const updateClubSchema = z.object({
  nameFr: z.string().min(2),
  nameAr: z.string().min(2),
  addressFr: z.string().min(5),
  addressAr: z.string().min(5),
  monthlyFee: z.number().positive(),
  paymentDueDay: z.number().min(1).max(31),
});

export async function updateClubInfo(clubId: string, data: z.infer<typeof updateClubSchema>) {
  try {
    const validatedData = updateClubSchema.parse(data);
    
    const updatedClub = await db.club.update({
      where: { id: clubId },
      data: validatedData,
    });
    
    return { success: true, club: updatedClub };
  } catch (error) {
    console.error("Error updating club info:", error);
    return { success: false, error: "Failed to update club information" };
  }
}