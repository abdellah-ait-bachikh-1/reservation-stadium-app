"use server";

import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { isErrorHasMessage } from "@/utils";
import { format } from "date-fns";

export async function verifyEmail(token: string) {
  try {
    if (!token) {
      return { status: 400, message: "Invalid verification token" };
    }

    const [user] = await db
      .select({
        id: users.id,
        verificationTokenExpiresAt: users.verificationTokenExpiresAt,
        emailVerifiedAt: users.emailVerifiedAt,
      })
      .from(users)
      .where(eq(users.verificationToken, token))
      .limit(1);

    if (!user) {
      return { status: 400, message: "Verification token not found" };
    }

    // Already verified
    if (user.emailVerifiedAt) {
      return { status: 200, message: "Email already verified" };
    }

    // Token missing
    if (!user.verificationTokenExpiresAt) {
      return { status: 400, message: "Verification token expired" };
    }

    const now = new Date();
    const expiresAt = new Date(user.verificationTokenExpiresAt);

    if (expiresAt < now) {
      return { status: 400, message: "Verification token expired" };
    }

    const nowStr = format(now, "yyyy-MM-dd HH:mm:ss");

    // Verify user
    await db
      .update(users)
      .set({
        emailVerifiedAt: nowStr,           // ✅ string
        verificationToken: null,
        verificationTokenExpiresAt: null,
      })
      .where(eq(users.id, user.id));

    return { status: 200, message: "Email verified successfully" };
  } catch (error) {
    if (isErrorHasMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Unexpected verification error");
  }
}
