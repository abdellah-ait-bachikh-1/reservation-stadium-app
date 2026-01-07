"use server";

import { SALT } from "@/const";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { validateRegisterFormData } from "@/lib/validations/register";
import { LocaleEnumType } from "@/types";
import { RegisterFormData } from "@/types/auth";
import { isErrorHasMessage, wait } from "@/utils";
import { getLocalizedValidationMessage } from "@/utils/validation";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { getLocale } from "next-intl/server";

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
    if (validationErrors) {
      return { status: 400, validationErrors };
    }
    const [isExistUser] = await db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.email, email));
    if (isExistUser) {
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

    const hashedPassword = await hash(data.password, SALT);
    await db.insert(users).values({
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: hashedPassword,
    });

    // importent send notification to all admins and create the notification -> notification type & title "REGISTER" content "nex user registred"

    return { status: 201, validationErrors: null };
  } catch (error) {
    if (isErrorHasMessage(error)) {
      throw new Error(error.message);
    } else {
      throw new Error("unexpected error");
    }
  }
}
