"use server";

import { SALT } from "@/const";
import { db } from "@/drizzle/db";
import { users, NOTIFICATION_MODELS, notifications } from "@/drizzle/schema";
import { validateRegisterFormData } from "@/lib/validations/register";
import { LocaleEnumType } from "@/types";
import { convertCase, isErrorHasMessage } from "@/utils";
import { getLocalizedValidationMessage } from "@/utils/validation";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { getLocale } from "next-intl/server";
import { v4 as uuidv4 } from "uuid";
import { addDays, format } from "date-fns";
import { sendNotificationToAdmins } from "@/lib/queries/notifications";
import { RegisterFormData } from "@/types/auth";
import { sendEmail } from "@/services/email";
import { generateVerificationEmail } from "@/utils/email";

export async function registerUser({
  name,
  email,
  phoneNumber,
  password,
  confirmPassword,
}: RegisterFormData) {
  try {
    const locale = await getLocale();

    const { data, validationErrors } = validateRegisterFormData(
      locale as LocaleEnumType,
      {
        name,
        email,
        phoneNumber,
        password,
        confirmPassword,
      }
    );
    if (validationErrors) return { status: 400, validationErrors };

    const [existingUser] = await db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      return {
        status: 400,
        validationErrors: {
          email: [
            getLocalizedValidationMessage(
              "email.exists",
              locale as LocaleEnumType
            ),
          ],
        },
      };
    }

    // 4️⃣ Hash password
    const hashedPassword = await hash(data.password, SALT);

    // 5️⃣ Generate verification token and expiry
    const verificationToken = uuidv4();
    const verificationTokenExpiresAt = addDays(new Date(), 1);
    const verificationTokenExpiresAtStr = format(
      verificationTokenExpiresAt,
      "yyyy-MM-dd HH:mm:ss"
    ); // MySQL DATETIME

    // 6️⃣ Insert user (DB generates UUID)
    const insertData = {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: verificationTokenExpiresAtStr,
      preferredLocale: locale.toUpperCase() as "EN" | "FR" | "AR",
     
    };

    await db.insert(users).values(insertData);

    // 7️⃣ Retrieve the newly created user
    const [newUser] = await db
      .select({ id: users.id, name: users.name, email: users.email,preferredLocale:users.preferredLocale })
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (!newUser) throw new Error("Failed to retrieve created user");

    const userId = newUser.id;

    // 8️⃣ Send verification email
    const emailTemplate = generateVerificationEmail({
      name: data.name,
      email: data.email,
      verificationToken,
     locale: newUser.preferredLocale ,
    });

    sendEmail({
      to: data.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    }).catch((err) => console.warn("Email sending error:", err));

    // 9️⃣ Send notification to all admins
    sendNotificationToAdmins({
      type: "USER_CREATED",
      model: "USER",
      referenceId: userId,
      titleEn: "New User Registration",
      titleFr: "Nouvelle inscription d'utilisateur",
      titleAr: "تسجيل مستخدم جديد",
      messageEn: `A new user "${data.name}" has registered.`,
      messageFr: `Un nouvel utilisateur "${data.name}" s'est inscrit.`,
      messageAr: `المستخدم الجديد "${data.name}" قد سجل.`,
      link: `/dashboard/users/${userId}`,
      actorUserId: userId,
    }).catch((err) => console.warn("Admin notification error:", err));

    return { status: 201, validationErrors: null };
  } catch (error: any) {
    console.error("Registration error:", {
      message: error.message,
      cause: error.cause,
    });

    if (isErrorHasMessage(error)) throw new Error(error.message);
    throw new Error("Unexpected registration error");
  }
}
