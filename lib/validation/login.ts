import z from "zod";
import { LoginCredentials, ValidateLoginCredentialsResult } from "../types";
export const loginCredentialsSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email adress")
    .max(100, "Email is too long"),

  password: z
    .string()
    .trim()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters") // Fixed: min 8, not 3
    .max(100, "Password is too long"),
});

export function validateLoginCredentials(
  loginCredentials: LoginCredentials
): ValidateLoginCredentialsResult {
  const result = loginCredentialsSchema.safeParse(loginCredentials);
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
