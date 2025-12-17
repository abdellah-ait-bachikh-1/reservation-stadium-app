import z from "zod";
import {
  RegisterCredentials,
  TLocale,
  ValidateRegisterCredentialsResult,
} from "../types";
import { Locale } from "next-intl";
import { getLocalizedValidationMessage } from "../validation-messages";

export const createRegisterCredentialsValidationSchema = (
  locale: TLocale = "en"
) => {
  return z
    .object({
      fullNameAr: z
        .string(getLocalizedValidationMessage('fullNameAr.string', locale))
        .trim()
        .min(1, getLocalizedValidationMessage('fullNameAr.required', locale))
        .min(2, getLocalizedValidationMessage('fullNameAr.min', locale))
        .max(100, getLocalizedValidationMessage('fullNameAr.max', locale))
        .regex(
          /^[\u0600-\u06FF\s]+$/,
          getLocalizedValidationMessage('fullNameAr.regex', locale)
        ),

      fullNameFr: z
        .string(getLocalizedValidationMessage('fullNameFr.string', locale))
        .trim()
        .min(1, getLocalizedValidationMessage('fullNameFr.required', locale))
        .min(2, getLocalizedValidationMessage('fullNameFr.min', locale))
        .max(100, getLocalizedValidationMessage('fullNameFr.max', locale))
        .regex(
          /^[a-zA-ZÀ-ÿ\s]+$/, // Removed hyphen and apostrophe
          getLocalizedValidationMessage('fullNameFr.regex', locale)
        ),

      email: z
        .string(getLocalizedValidationMessage('email.string', locale))
        .trim()
        .email(getLocalizedValidationMessage('email.invalid', locale))
        .max(150, getLocalizedValidationMessage('email.max', locale)),

      phoneNumber: z
        .string(getLocalizedValidationMessage('phoneNumber.string', locale))
        .trim()
        .regex(
          /^(0[0-9]{9}|\+212[0-9]{9})$/,
          getLocalizedValidationMessage('phoneNumber.regex', locale)
        ),

      password: z
        .string(getLocalizedValidationMessage('password.string', locale))
        .min(1, getLocalizedValidationMessage('password.required', locale))
        .min(8, getLocalizedValidationMessage('password.min', locale))
        .max(100, getLocalizedValidationMessage('password.max', locale)),

      confirmPassword: z
        .string(getLocalizedValidationMessage('confirmPassword.string', locale))
        .min(1, getLocalizedValidationMessage('confirmPassword.required', locale)),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: getLocalizedValidationMessage('confirmPassword.match', locale),
      path: ["confirmPassword"],
    });
};
export function validateRegisterCredentials(locale:TLocale="en",
  registerCredentials: RegisterCredentials
): ValidateRegisterCredentialsResult {
  const result = createRegisterCredentialsValidationSchema(locale).safeParse(registerCredentials);
  if (!result.success) {
    return { data: null, validationErrors: result.error.flatten().fieldErrors };
  }
  return { data: result.data, validationErrors: null };
}
