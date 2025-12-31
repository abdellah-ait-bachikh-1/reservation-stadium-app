"use server";
import { errorMessages, getLocalizedError, getLocalizedSuccess } from "@/lib/api/locale";
import db from "@/lib/db";
import { ForgotPasswordCredentials, TLocale } from "@/lib/types";
import { isError } from "@/lib/utils";
import { getLocalizedValidationMessage } from "@/lib/validation-messages";
import { validateForgotPasswordCredentials } from "@/lib/validation/forgot-password";
import { randomBytes } from "crypto";

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
      return { statusCode: 400, validationErrors, data: null, 
        message:null
      };
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
    return {
        statusCode: 200,
        error: null,
        validationErrors: null,
        data: null,
        message:getLocalizedSuccess(locale as TLocale, "200")
      }; 
  } catch (error) {
    console.log(error);
    if (isError(error)) {
      return {
        statusCode: 500,
        validationErrors: null,
        data: null,
        error: getLocalizedError(locale, "500") || errorMessages["en"]?.["500"],
        message:null
      };
    }
    return {
      statusCode: 500,
      validationErrors: null,
      data: null,
      error: getLocalizedError(locale, "500") || errorMessages["en"]?.["500"],
      message:null
    };
  }
}
