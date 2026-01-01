"use server";
import {
  errorMessages,
  getLocalizedError,
  getLocalizedSuccess,
} from "@/lib/api/locale";
import db from "@/lib/db";
import { ForgotPasswordCredentials, TLocale } from "@/lib/types";
import { isError } from "@/lib/utils";
import { getLocalizedValidationMessage } from "@/lib/validation-messages";
import { validateForgotPasswordCredentials } from "@/lib/validation/forgot-password";
import { randomBytes } from "crypto";
import { hash } from "bcryptjs";
import { sendNewPasswordToUserByEmail } from "@/services/email-smtp-service";
export async function resetPassword(
  locale: TLocale,
  formData: ForgotPasswordCredentials
) {
  try {
    const { data, validationErrors } = validateForgotPasswordCredentials(
      locale,
      formData
    );
    if (validationErrors) {
      return { statusCode: 400, validationErrors, data: null, message: null };
    }
    const existUser = await db.user.findUnique({
      where: { email: formData.email },
    });
    if (!existUser) {
      return {
        statusCode: 400,
        error: getLocalizedError(locale, "400") || errorMessages["en"]?.["400"],
        validationErrors: {
          email: [
            getLocalizedValidationMessage("email.notExist", locale as TLocale),
          ],
        },
        data: null,
      };
    }
    const randomPassword = randomBytes(6).toString("hex");
    console.log(randomPassword);
    const POWER_HASH = parseInt(process.env.POWER_HASH as string);
    const hashNewPassword = await hash(randomPassword, POWER_HASH);

    const updatedUser = await db.user.update({
      where: { email: data.email },
      data: { password: hashNewPassword },
    });
    await sendNewPasswordToUserByEmail(locale,data.email,randomPassword)

    return {
      statusCode: 200,
      error: null,
      validationErrors: null,
      data: null,
      message: getLocalizedSuccess(locale as TLocale, "200"),
    };
  } catch (error) {
    console.log(error);
    if (isError(error)) {
      return {
        statusCode: 500,
        validationErrors: null,
        data: null,
        error: getLocalizedError(locale, "500") || errorMessages["en"]?.["500"],
        message: null,
      };
    }
    return {
      statusCode: 500,
      validationErrors: null,
      data: null,
      error: getLocalizedError(locale, "500") || errorMessages["en"]?.["500"],
      message: null,
    };
  }
}
