// lib/validation/change-password.ts
import z from "zod";
import {
  ChangePasswordCredentials,
  TLocale,
  ValidateChangePasswordCredentialsResult,
} from "../types";
import { getLocalizedValidationMessage } from "../validation-messages";

export const createChangePasswordValidationSchema = (locale: TLocale = "en") => {
  return z
    .object({
      currentPassword: z
        .string(getLocalizedValidationMessage('password.string', locale))
        
        .min(1, getLocalizedValidationMessage('password.required', locale))
        .min(8, getLocalizedValidationMessage('password.min', locale))
        .max(100, getLocalizedValidationMessage('password.max', locale)),

      newPassword: z
        .string(getLocalizedValidationMessage('password.string', locale))
        
        .min(1, getLocalizedValidationMessage('password.required', locale))
        .min(8, getLocalizedValidationMessage('password.min', locale))
        .max(100, getLocalizedValidationMessage('password.max', locale))
        ,

      confirmPassword: z
        .string(getLocalizedValidationMessage('confirmPassword.string', locale))
        
        .min(1, getLocalizedValidationMessage('confirmPassword.required', locale)),
    })
    .refine(
      (data) => data.newPassword === data.confirmPassword,
      {
        message: getLocalizedValidationMessage('confirmPassword.match', locale),
        path: ['confirmPassword'],
      }
    )
    .refine(
      (data) => data.currentPassword !== data.newPassword,
      {
        message: getLocalizedValidationMessage('password.sameAsCurrent', locale),
        path: ['newPassword'],
      }
    );
};

export function validateChangePasswordCredentials(
  locale: TLocale = "en",
  credentials: ChangePasswordCredentials
): ValidateChangePasswordCredentialsResult {
  const result = createChangePasswordValidationSchema(locale).safeParse(credentials);
  if (!result.success) {
    return { data: null, validationErrors: result.error.flatten().fieldErrors };
  }
  return { data: result.data, validationErrors: null };
}