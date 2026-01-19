// app/actions/auth/forgot-password.ts
"use server";

import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { validateForgotPasswordFormData } from "@/lib/validations/forgot-password";
import { LocaleEnumType } from "@/types";
import { getLocalizedValidationMessage } from "@/utils/validation";
import { eq } from "drizzle-orm";
import { getLocale } from "next-intl/server";
import { v4 as uuidv4 } from "uuid";
import { addHours, format } from "date-fns";
import { sendEmail } from "@/services/email";
import { generatePasswordResetEmail } from "@/utils/email";
import { ForgotPasswordFormData } from "@/types/auth";

export async function forgotPassword({
  email,
}: ForgotPasswordFormData) {
  try {
    const locale = await getLocale();

    // Validate the form data
    const { data, validationErrors } = validateForgotPasswordFormData(
      locale as LocaleEnumType,
      { email }
    );
    
    if (validationErrors) {
      return { status: 400, validationErrors };
    }

    // Check if user exists
    const [user] = await db
      .select({ 
        id: users.id, 
        email: users.email, 
        name: users.name,
        preferredLocale: users.preferredLocale,
        isApproved: users.isApproved,
        emailVerifiedAt: users.emailVerifiedAt,
        deletedAt: users.deletedAt
      })
      .from(users)
      .where(eq(users.email, data.email));

    // Check different account states
    if (user) {
      if (user.deletedAt) {
        // Account is deleted
        return { 
          status: 400, 
          validationErrors: {
            email: [
              getLocalizedValidationMessage("auth.accountDeleted", locale as LocaleEnumType)
            ]
          }
        };
      }

      if (!user.emailVerifiedAt) {
        // Email not verified
        return { 
          status: 400, 
          validationErrors: {
            email: [
              getLocalizedValidationMessage("auth.accountNotVerified", locale as LocaleEnumType)
            ]
          }
        };
      }

      if (!user.isApproved) {
        // Account not approved by admin
        return { 
          status: 400, 
          validationErrors: {
            email: [
              getLocalizedValidationMessage("auth.accountNotApproved", locale as LocaleEnumType)
            ]
          }
        };
      }

      // All checks passed, generate reset token
      const resetToken = uuidv4();
      const resetTokenExpiresAt = addHours(new Date(), 1);
      const resetTokenExpiresAtStr = format(
        resetTokenExpiresAt,
        "yyyy-MM-dd HH:mm:ss"
      );

      // Update user with reset token
      await db
        .update(users)
        .set({
          verificationToken: resetToken,
          verificationTokenExpiresAt: resetTokenExpiresAtStr,
        })
        .where(eq(users.id, user.id));

      // Send reset email
      const emailTemplate = generatePasswordResetEmail({
        name: user.name,
        email: user.email,
        resetToken,
        locale: user.preferredLocale as "EN" | "FR" | "AR",
      });

      await sendEmail({
        to: user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });
    }

    // Always return success for security (even if user doesn't exist)
    return { status: 200, message: "passwordResetEmailSent" };

  } catch (error: any) {
    console.error("Forgot password error:", error);
    
    // Don't expose error details to client
    return { 
      status: 500, 
      message: "An error occurred. Please try again later." 
    };
  }
}