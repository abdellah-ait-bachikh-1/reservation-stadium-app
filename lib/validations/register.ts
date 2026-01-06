import { LocaleEnumType } from "@/types";
import { RegisterFormData } from "@/types/auth";
import { getLocalizedValidationMessage } from "@/utils/validation";
import z from "zod";

export const createRegisterFormDataValidationSchema = (
  locale: LocaleEnumType = "fr"
) => {
  return z
    .object({
      name: z
        .string(getLocalizedValidationMessage("name.string", locale))
        .trim()
        .min(1, getLocalizedValidationMessage("name.required", locale))
        .min(3, getLocalizedValidationMessage("name.min", locale))
        .max(255, getLocalizedValidationMessage("name.max", locale))
        .regex(
          /^[a-zA-ZÀ-ÖØ-öø-ÿĀ-žḀ-ỿ\s\-\']+$/,
          getLocalizedValidationMessage("name.regex", locale)
        ),

      email: z
        .string(getLocalizedValidationMessage("email.string", locale))
        .trim()
        .email(getLocalizedValidationMessage("email.invalid", locale))
        .max(255, getLocalizedValidationMessage("email.max", locale)),

      phoneNumber: z
        .string(getLocalizedValidationMessage("phoneNumber.string", locale))
        .trim()
        .regex(
          /^(0[0-9]{9}|\+212[0-9]{9})$/,
          getLocalizedValidationMessage("phoneNumber.regex", locale)
        )
        .max(50, getLocalizedValidationMessage("phoneNumber.max", locale)),

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

export function validateRegisterFormData(
  locale: LocaleEnumType = "en",
  registerFormData: RegisterFormData
) {
  const result =
    createRegisterFormDataValidationSchema(locale).safeParse(registerFormData);
  if (!result.success) {
    return { data: null, validationErrors: result.error.flatten().fieldErrors };
  }
  return { data: result.data, validationErrors: null };
}
