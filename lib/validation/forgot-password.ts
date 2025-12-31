import z from "zod";
import {
  ForgotPasswordCredentials,
  TLocale,
  ValidateForgotPasswordCredentialsResult,
} from "../types";
import { getLocalizedValidationMessage } from "../validation-messages";

export const createForgotPAsswordValidationSchema = (
  locale: TLocale = "en"
) => {
  return z.object({
    email: z
      .string(getLocalizedValidationMessage("email.string", locale))
      .trim()
      .email(getLocalizedValidationMessage("email.invalid", locale))
      .max(150, getLocalizedValidationMessage("email.max", locale)),
  
  });
};
export function validateForgotPasswordCredentials(
  locale: TLocale = "en",
  forgotPasswordCredentials: ForgotPasswordCredentials
): ValidateForgotPasswordCredentialsResult {
  const result =
    createForgotPAsswordValidationSchema(locale).safeParse(
      forgotPasswordCredentials
    );
  if (!result.success) {
    return { data: null, validationErrors: result.error.flatten().fieldErrors };
  }
  return { data: result.data, validationErrors: null };
}
