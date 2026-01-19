import { LocaleEnumType } from "@/types";
import { ForgotPasswordFormData } from "@/types/auth";
import { getLocalizedValidationMessage } from "@/utils/validation";
import z from "zod";

export const createForgotPasswordFormDataValidationSchema = (
  locale: LocaleEnumType = "en"
) => {
  return z.object({
    email: z
      .string(getLocalizedValidationMessage("email.string", locale))
      .trim()
      .min(1, getLocalizedValidationMessage("email.invalid", locale))
      .email(getLocalizedValidationMessage("email.invalid", locale))
      .max(255, getLocalizedValidationMessage("email.max", locale)),
  });
};

export function validateForgotPasswordFormData(
  locale: LocaleEnumType = "en",
  forgotPasswordFormData: ForgotPasswordFormData
) {
  const result = createForgotPasswordFormDataValidationSchema(locale).safeParse(
    forgotPasswordFormData
  );
  if (!result.success) {
    return { data: null, validationErrors: result.error.flatten().fieldErrors };
  }
  return { data: result.data, validationErrors: null };
}