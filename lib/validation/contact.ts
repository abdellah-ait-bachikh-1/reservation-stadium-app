import z from "zod";
import { TLocale } from "@/lib/types";
import { getLocalizedValidationMessage } from "../validation-messages";

export interface ContactFormData {
  fullName: string;
  email: string;
  clubTeam: string;
  subject: string;
  message: string;
  locale: string;
}

export interface ValidateContactFormResult {
  data: ContactFormData | null;
  validationErrors: Record<string, string[]> | null;
}

export const createContactFormValidationSchema = (locale: TLocale = "en") => {
  return z.object({
    fullName: z
      .string(getLocalizedValidationMessage('contact.fullName.string', locale))
      .trim()
      .min(1, getLocalizedValidationMessage('contact.fullName.required', locale))
      .min(2, getLocalizedValidationMessage('contact.fullName.min', locale))
      .max(100, getLocalizedValidationMessage('contact.fullName.max', locale))
      .regex(
        /^[a-zA-ZÀ-ÿ\s'-]+$/,
        getLocalizedValidationMessage('contact.fullName.regex', locale)
      ),

    email: z
      .string(getLocalizedValidationMessage('contact.email.string', locale))
      .trim()
      .email(getLocalizedValidationMessage('contact.email.invalid', locale))
      .max(150, getLocalizedValidationMessage('contact.email.max', locale)),

    clubTeam: z
      .string(getLocalizedValidationMessage('contact.clubTeam.string', locale))
      .trim()
      .min(1, getLocalizedValidationMessage('contact.clubTeam.required', locale))
      .min(2, getLocalizedValidationMessage('contact.clubTeam.min', locale))
      .max(100, getLocalizedValidationMessage('contact.clubTeam.max', locale)),

    subject: z
      .string(getLocalizedValidationMessage('contact.subject.string', locale))
      .min(1, getLocalizedValidationMessage('contact.subject.required', locale)),

    message: z
      .string(getLocalizedValidationMessage('contact.message.string', locale))
      .trim()
      .min(1, getLocalizedValidationMessage('contact.message.required', locale))
      .min(10, getLocalizedValidationMessage('contact.message.min', locale))
      .max(2000, getLocalizedValidationMessage('contact.message.max', locale)),

    locale: z.string(),
  });
};

export function validateContactFormData(
  locale: TLocale = "en",
  formData: ContactFormData
): ValidateContactFormResult {
  const result = createContactFormValidationSchema(locale).safeParse(formData);
  
  if (!result.success) {
    return { 
      data: null, 
      validationErrors: result.error.flatten().fieldErrors as Record<string, string[]> 
    };
  }
  
  return { data: result.data, validationErrors: null };
}