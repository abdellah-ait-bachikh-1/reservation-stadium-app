"use server";

import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { isErrorHasMessage } from "@/utils";
import { format } from "date-fns";

export async function verifyEmail(token: string) {
  try {
    console.log("🔍 verifyEmail called with token:", token);
    
    if (!token) {
      console.log("❌ No token provided");
      return { status: 404, message: "Invalid verification token" };
    }

    console.log("📋 Looking for user with token:", token);
    
    const [user] = await db
      .select({
        id: users.id,
        verificationTokenExpiresAt: users.verificationTokenExpiresAt,
        emailVerifiedAt: users.emailVerifiedAt,
        verificationToken: users.verificationToken, // Add this for debugging
        email: users.email, // Add this for debugging
      })
      .from(users)
      .where(eq(users.verificationToken, token))
      .limit(1);

    console.log("📊 User found:", user);

    if (!user) {
      console.log("❌ No user found with this token");
      
      // Let's check if the token exists in any user (for debugging)
      const allUsers = await db
        .select({
          id: users.id,
          email: users.email,
          verificationToken: users.verificationToken,
        })
        .from(users)
        .limit(5);
      
      console.log("📋 First 5 users with tokens:", allUsers.filter(u => u.verificationToken));
      
      return { status: 400, message: "Verification token not found" };
    }

    // Already verified
    if (user.emailVerifiedAt) {
      console.log("✅ Email already verified for:", user.email);
      return { status: 200, message: "Email already verified" };
    }

    // Token missing
    if (!user.verificationTokenExpiresAt) {
      console.log("❌ No expiration date for token");
      return { status: 400, message: "Verification token expired" };
    }

    const now = new Date();
    const expiresAt = new Date(user.verificationTokenExpiresAt);
    
    console.log("⏰ Token expires at:", expiresAt);
    console.log("⏰ Current time:", now);

    if (expiresAt < now) {
      console.log("❌ Token expired");
      return { status: 400, message: "Verification token expired" };
    }

    const nowStr = format(now, "yyyy-MM-dd HH:mm:ss");

    console.log("✅ Verifying email for user:", user.email);
    
    // Verify user
    await db
      .update(users)
      .set({
        emailVerifiedAt: nowStr,
        verificationToken: null,
        verificationTokenExpiresAt: null,
      })
      .where(eq(users.id, user.id));

    console.log("✅ Email verified successfully!");
    
    return { status: 200, message: "Email verified successfully" };
  } catch (error) {
    console.error("🔥 Error in verifyEmail:", error);
    if (isErrorHasMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Unexpected verification error");
  }
}