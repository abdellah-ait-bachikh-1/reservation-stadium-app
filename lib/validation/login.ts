import z from "zod";
import {
  LoginCredentials,
  TLocale,
  ValidateLoginCredentialsResult,
} from "../types";
import { getLocalizedValidationMessage } from "../validation-messages";

export const createLoginCredentialsValidationSchema = (
  locale: TLocale = "en"
) => {
  return z.object({
    email: z
      .string(getLocalizedValidationMessage("email.string", locale))
      .trim()
      .email(getLocalizedValidationMessage("email.invalid", locale))
      .max(150, getLocalizedValidationMessage("email.max", locale)),
    password: z
      .string(getLocalizedValidationMessage("password.string", locale))
      .min(1, getLocalizedValidationMessage("password.required", locale))
      .min(8, getLocalizedValidationMessage("password.min", locale))
      .max(100, getLocalizedValidationMessage("password.max", locale)),
  });
};
export function validateLoginCredentials(
  locale: TLocale = "en",
  loginCredentials: LoginCredentials
): ValidateLoginCredentialsResult {
  const result =
    createLoginCredentialsValidationSchema(locale).safeParse(
      loginCredentials
    );
  if (!result.success) {
    return { data: null, validationErrors: result.error.flatten().fieldErrors };
  }
  return { data: result.data, validationErrors: null };
}

// export function validateClientLoginCredentials(
//   loginCredentials: LoginCredentials
// ): ValidateLoginCredentialsResult {
//   const result = loginCredentialsSchema.safeParse(loginCredentials);

//   if (!result.success) {
//     // Flatten all errors
//     const allErrors = result.error.flatten().fieldErrors;

//     // Create a new object with only the first error
//     const firstError: Record<string, string[]> = {};

//     // Find the first field with errors
//     for (const [field, errors] of Object.entries(allErrors)) {
//       if (errors && errors.length > 0) {
//         firstError[field] = [errors[0]]; // Only take the first error for this field
//         break; // Stop after first field with errors
//       }
//     }

//     return { data: null, validationErrors: firstError };
//   }

//   return { data: result.data, validationErrors: null };
// }
