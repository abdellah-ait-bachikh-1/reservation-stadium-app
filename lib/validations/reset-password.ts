import { LocaleEnumType } from "@/types";
import { ResetPasswordFormData } from "@/types/auth";
import { getLocalizedValidationMessage } from "@/utils/validation";
import z from "zod";

export const createResetPasswordFormDataValidationSchema = (
  locale: LocaleEnumType = "en"
) => {
  return z
    .object({
      password: z
        .string(getLocalizedValidationMessage("password.string", locale))
        .min(1, getLocalizedValidationMessage("password.required", locale))
        .min(8, getLocalizedValidationMessage("password.min", locale))
        .max(255, getLocalizedValidationMessage("password.max", locale)),

      confirmPassword: z
        .string(getLocalizedValidationMessage("confirmPassword.string", locale))
        .min(
          1,
          getLocalizedValidationMessage("confirmPassword.required", locale)
        ),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: getLocalizedValidationMessage("confirmPassword.match", locale),
      path: ["confirmPassword"],
    });
};

export function validateResetPasswordFormData(
  locale: LocaleEnumType = "en",
  resetPasswordFormData: ResetPasswordFormData
) {
  const result = createResetPasswordFormDataValidationSchema(locale).safeParse(
    resetPasswordFormData
  );
  if (!result.success) {
    return { data: null, validationErrors: result.error.flatten().fieldErrors };
  }
  return { data: result.data, validationErrors: null };
}