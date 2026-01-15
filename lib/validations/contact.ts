import { LocaleEnumType } from "@/types";
import { getLocalizedValidationMessage } from "@/utils/validation";
import z from "zod";

export interface ContactFormData {
  name: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
}

export const createContactFormDataValidationSchema = (
  locale: LocaleEnumType = "fr"
) => {
  return z.object({
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

    subject: z
      .string(getLocalizedValidationMessage("subject.string", locale))
      .trim()
      .min(1, getLocalizedValidationMessage("subject.required", locale))
      .min(3, getLocalizedValidationMessage("subject.min", locale))
      .max(255, getLocalizedValidationMessage("subject.max", locale)),

    message: z
      .string(getLocalizedValidationMessage("message.string", locale))
      .trim()
      .min(1, getLocalizedValidationMessage("message.required", locale))
      .min(10, getLocalizedValidationMessage("message.min", locale))
      .max(5000, getLocalizedValidationMessage("message.max", locale)),
  });
};

export function validateContactFormData(
  locale: LocaleEnumType = "en",
  contactFormData: ContactFormData
) {
  const result = createContactFormDataValidationSchema(locale).safeParse(contactFormData);
  if (!result.success) {
    return { data: null, validationErrors: result.error.flatten().fieldErrors };
  }
  return { data: result.data, validationErrors: null };
}