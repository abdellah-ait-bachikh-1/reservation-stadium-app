import { LocaleEnumType } from "@/types";
import { LoginFormData } from "@/types/auth";
import { getLocalizedValidationMessage } from "@/utils/validation";
import z from "zod";

export const createLoginFormDataValidationSchema = (
  locale: LocaleEnumType = "fr"
) => {
  return z.object({
    email: z
      .string(getLocalizedValidationMessage("email.string", locale))
      .trim()
      .email(getLocalizedValidationMessage("email.invalid", locale))
      .max(255, getLocalizedValidationMessage("email.max", locale)),
    password: z
      .string(getLocalizedValidationMessage("password.string", locale))
      .min(1, getLocalizedValidationMessage("password.required", locale))
      .min(8, getLocalizedValidationMessage("password.min", locale))
      .max(255, getLocalizedValidationMessage("password.max", locale)),
  });
};

export function validateLoginFormData(
  locale: LocaleEnumType = "en",
  loginFormData: LoginFormData
) {
  const result =
    createLoginFormDataValidationSchema(locale).safeParse(loginFormData);
  if (!result.success) {
    return { data: null, validationErrors: result.error.flatten().fieldErrors };
  }
  return { data: result.data, validationErrors: null };
}
