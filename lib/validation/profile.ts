import z from "zod";
import {
  UserProfileCredentials,
  TLocale,
  ValidateUserProfileCredentialsResult,
} from "../types";
import { getLocalizedValidationMessage } from "../validation-messages";

export const createUserProfileValidationSchema = (
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

      preferredLocale: z
        .enum(["EN", "FR", "AR"])
        .refine(
          (val) => ["EN", "FR", "AR"].includes(val),
          {
            message: getLocalizedValidationMessage('preferredLocale.invalid', locale)
          }
        ),
    });
};

export function validateUserProfileCredentials(
  locale: TLocale = "en",
  profileCredentials: UserProfileCredentials
): ValidateUserProfileCredentialsResult {
  const result = createUserProfileValidationSchema(locale).safeParse(profileCredentials);
  if (!result.success) {
    return { data: null, validationErrors: result.error.flatten().fieldErrors };
  }
  return { data: result.data, validationErrors: null };
}