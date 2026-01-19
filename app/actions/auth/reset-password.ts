// app/actions/auth/reset-password.ts
"use server";

import { SALT } from "@/const";
import { db } from "@/drizzle/db";
import { users, passwordResetTokens } from "@/drizzle/schema";
import { LocaleEnumType } from "@/types";
import { getLocalizedValidationMessage } from "@/utils/validation";
import { eq, and, isNull } from "drizzle-orm";
import { getLocale } from "next-intl/server";
import { hash } from "bcryptjs";
import { isAfter, format } from "date-fns";
import { validateResetPasswordFormData } from "@/lib/validations/reset-password";

export async function resetPassword({
  token,
  password,
  confirmPassword,
}: {
  token: string | undefined;
  password: string;
  confirmPassword: string;
}) {
  try {
    const locale = await getLocale();

    // Validate the form data
    const { data, validationErrors } = validateResetPasswordFormData(
      locale as LocaleEnumType,
      { password, confirmPassword }
    );
    
    if (validationErrors) {
      return { status: 400, validationErrors };
    }

    // Check if token is provided
    if (!token) {
      return { 
        status: 400, 
        validationErrors: {
          password: [
            getLocalizedValidationMessage("auth.invalidToken", locale as LocaleEnumType)
          ]
        }
      };
    }

    // Find the reset token with user info
    const [resetTokenRecord] = await db
      .select({
        token: passwordResetTokens.token,
        userId: passwordResetTokens.userId,
        expiresAt: passwordResetTokens.expiresAt,
        usedAt: passwordResetTokens.usedAt,
        user: {
          id: users.id,
          isApproved: users.isApproved,
          emailVerifiedAt: users.emailVerifiedAt,
          deletedAt: users.deletedAt
        }
      })
      .from(passwordResetTokens)
      .innerJoin(users, eq(passwordResetTokens.userId, users.id))
      .where(
        and(
          eq(passwordResetTokens.token, token),
          isNull(passwordResetTokens.usedAt)
        )
      )
      .limit(1);

    if (!resetTokenRecord) {
      return { 
        status: 400, 
        validationErrors: {
          password: [
            getLocalizedValidationMessage("auth.invalidToken", locale as LocaleEnumType)
          ]
        }
      };
    }

    // Check if token is expired
    if (isAfter(new Date(), new Date(resetTokenRecord.expiresAt))) {
      // Delete expired token
      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.token, token));
        
      return { 
        status: 400, 
        validationErrors: {
          password: [
            getLocalizedValidationMessage("auth.expiredToken", locale as LocaleEnumType)
          ]
        }
      };
    }

    // Check account status
    if (resetTokenRecord.user.deletedAt) {
      return { 
        status: 400, 
        validationErrors: {
          password: [
            getLocalizedValidationMessage("auth.accountDeleted", locale as LocaleEnumType)
          ]
        }
      };
    }

    if (!resetTokenRecord.user.emailVerifiedAt) {
      return { 
        status: 400, 
        validationErrors: {
          password: [
            getLocalizedValidationMessage("auth.accountNotVerified", locale as LocaleEnumType)
          ]
        }
      };
    }

    if (!resetTokenRecord.user.isApproved) {
      return { 
        status: 400, 
        validationErrors: {
          password: [
            getLocalizedValidationMessage("auth.accountNotApproved", locale as LocaleEnumType)
          ]
        }
      };
    }

    // Hash new password
    const hashedPassword = await hash(data.password, SALT);
    
    // Format current date for MySQL DATETIME
    const now = new Date();
    const formattedNow = format(now, "yyyy-MM-dd HH:mm:ss");

    // Update user password
    await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: formattedNow,
      })
      .where(eq(users.id, resetTokenRecord.userId));

    // Mark token as used
    await db
      .update(passwordResetTokens)
      .set({
        usedAt: formattedNow,
      })
      .where(eq(passwordResetTokens.token, token));

    // Delete any other unused tokens for this user
    await db
      .delete(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.userId, resetTokenRecord.userId),
          isNull(passwordResetTokens.usedAt)
        )
      );

    return { status: 200, message: "passwordReset" };

  } catch (error: any) {
    console.error("Reset password error:", error);
    
    return { 
      status: 500, 
      message: "An error occurred. Please try again later." 
    };
  }
}