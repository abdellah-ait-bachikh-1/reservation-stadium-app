// validation-messages.ts

import { TLocale } from "./types";

export interface ValidationMessages {
  [key: string]: {
    [locale in TLocale]?: string;
  };
}

export const validationMessages: ValidationMessages = {
  // Arabic Full Name errors
  "fullNameAr.string": {
    en: "Arabic Full Name must be text",
    fr: "Le nom complet en arabe doit être du texte",
    ar: "يجب أن يكون الاسم الكامل بالعربية نصًا",
  },
  "fullNameAr.required": {
    en: "Arabic Full Name is required",
    fr: "Le nom complet en arabe est obligatoire",
    ar: "الاسم الكامل بالعربية مطلوب",
  },
  "fullNameAr.min": {
    en: "Arabic Full Name must be at least 2 characters",
    fr: "Le nom complet en arabe doit comporter au moins 2 caractères",
    ar: "يجب أن يكون الاسم الكامل بالعربية مكونًا من حرفين على الأقل",
  },
  "fullNameAr.max": {
    en: "Arabic Full Name is too long (max 100 characters)",
    fr: "Le nom complet en arabe est trop long (max 100 caractères)",
    ar: "الاسم الكامل بالعربية طويل جدًا (الحد الأقصى 100 حرف)",
  },
  "fullNameAr.regex": {
    en: "Arabic name can only contain Arabic characters and spaces",
    fr: "Le nom arabe ne peut contenir que des caractères arabes et des espaces",
    ar: "يمكن أن يحتوي الاسم العربي فقط على أحرف عربية ومسافات",
  },

  // French Full Name errors
  "fullNameFr.string": {
    en: "French Full Name must be text",
    fr: "Le nom complet en français doit être du texte",
    ar: "يجب أن يكون الاسم الكامل بالفرنسية نصًا",
  },
  "fullNameFr.required": {
    en: "French Full Name is required",
    fr: "Le nom complet en français est obligatoire",
    ar: "الاسم الكامل بالفرنسية مطلوب",
  },
  "fullNameFr.min": {
    en: "French Full Name must be at least 2 characters",
    fr: "Le nom complet en français doit comporter au moins 2 caractères",
    ar: "يجب أن يكون الاسم الكامل بالفرنسية مكونًا من حرفين على الأقل",
  },
  "fullNameFr.max": {
    en: "French Full Name is too long (max 100 characters)",
    fr: "Le nom complet en français est trop long (max 100 caractères)",
    ar: "الاسم الكامل بالفرنسية طويل جدًا (الحد الأقصى 100 حرف)",
  },
  "fullNameFr.regex": {
    en: "French name can only contain letters (including accented letters) and spaces",
    fr: "Le nom français ne peut contenir que des lettres (y compris les lettres accentuées) et des espaces",
    ar: "يمكن أن يحتوي الاسم الفرنسي فقط على أحرف (بما في ذلك الأحرف المنقوطة) ومسافات",
  },

  // Email errors
  "email.string": {
    en: "Email must be text",
    fr: "L'email doit être du texte",
    ar: "يجب أن يكون البريد الإلكتروني نصًا",
  },
  "email.invalid": {
    en: "Invalid email address",
    fr: "Adresse email invalide",
    ar: "عنوان بريد إلكتروني غير صالح",
  },
  "email.max": {
    en: "Email is too long (max 150 characters)",
    fr: "L'email est trop long (max 150 caractères)",
    ar: "البريد الإلكتروني طويل جدًا (الحد الأقصى 150 حرفًا)",
  },
  "email.exists": {
    en: "Email already exists",
    fr: "Cet email existe déjà",
    ar: "البريد الإلكتروني موجود بالفعل",
  },

  // Phone number errors
  "phoneNumber.string": {
    en: "Phone number must be text",
    fr: "Le numéro de téléphone doit être du texte",
    ar: "يجب أن يكون رقم الهاتف نصًا",
  },
  "phoneNumber.regex": {
    en: "Phone number must start with 0 or +212 and contain the correct number of digits",
    fr: "Le numéro de téléphone doit commencer par 0 ou +212 et contenir le bon nombre de chiffres",
    ar: "يجب أن يبدأ رقم الهاتف بـ 0 أو +212 ويحتوي على العدد الصحيح من الأرقام",
  },

  // Password errors
  "password.string": {
    en: "Password must be text",
    fr: "Le mot de passe doit être du texte",
    ar: "يجب أن تكون كلمة المرور نصًا",
  },
  "password.required": {
    en: "Password is required",
    fr: "Le mot de passe est obligatoire",
    ar: "كلمة المرور مطلوبة",
  },
  "password.min": {
    en: "Password must be at least 8 characters",
    fr: "Le mot de passe doit comporter au moins 8 caractères",
    ar: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل",
  },
  "password.max": {
    en: "Password is too long (max 100 characters)",
    fr: "Le mot de passe est trop long (max 100 caractères)",
    ar: "كلمة المرور طويلة جدًا (الحد الأقصى 100 حرف)",
  },

  // Confirm password errors
  "confirmPassword.string": {
    en: "Confirm password must be text",
    fr: "La confirmation du mot de passe doit être du texte",
    ar: "يجب أن يكون تأكيد كلمة المرور نصًا",
  },
  "confirmPassword.required": {
    en: "Confirm password is required",
    fr: "La confirmation du mot de passe est obligatoire",
    ar: "تأكيد كلمة المرور مطلوب",
  },
  "confirmPassword.match": {
    en: "Passwords do not match",
    fr: "Les mots de passe ne correspondent pas",
    ar: "كلمات المرور غير متطابقة",
  },
  "auth.invalidCredentials": {
    en: "Email or password is incorrect",
    fr: "L’email ou le mot de passe est incorrect",
    ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
  }, // Contact Form errors
  "contact.fullName.string": {
    en: "Full name must be text",
    fr: "Le nom complet doit être du texte",
    ar: "يجب أن يكون الاسم الكامل نصًا",
  },
  "contact.fullName.required": {
    en: "Full name is required",
    fr: "Le nom complet est obligatoire",
    ar: "الاسم الكامل مطلوب",
  },
  "contact.fullName.min": {
    en: "Full name must be at least 2 characters",
    fr: "Le nom complet doit comporter au moins 2 caractères",
    ar: "يجب أن يكون الاسم الكامل مكونًا من حرفين على الأقل",
  },
  "contact.fullName.max": {
    en: "Full name is too long (max 100 characters)",
    fr: "Le nom complet est trop long (max 100 caractères)",
    ar: "الاسم الكامل طويل جدًا (الحد الأقصى 100 حرف)",
  },
  "contact.fullName.regex": {
    en: "Full name can only contain letters, spaces, hyphens, and apostrophes",
    fr: "Le nom complet ne peut contenir que des lettres, espaces, traits d'union et apostrophes",
    ar: "يمكن أن يحتوي الاسم الكامل فقط على أحرف ومسافات وشرطات وعلامات اقتباس",
  },

  "contact.email.string": {
    en: "Email must be text",
    fr: "L'email doit être du texte",
    ar: "يجب أن يكون البريد الإلكتروني نصًا",
  },
  "contact.email.invalid": {
    en: "Invalid email address",
    fr: "Adresse email invalide",
    ar: "عنوان بريد إلكتروني غير صالح",
  },
  "contact.email.max": {
    en: "Email is too long (max 150 characters)",
    fr: "L'email est trop long (max 150 caractères)",
    ar: "البريد الإلكتروني طويل جدًا (الحد الأقصى 150 حرفًا)",
  },

  "contact.clubTeam.string": {
    en: "Club/Team name must be text",
    fr: "Le nom du club/équipe doit être du texte",
    ar: "يجب أن يكون اسم النادي/الفريق نصًا",
  },
  "contact.clubTeam.required": {
    en: "Club/Team name is required",
    fr: "Le nom du club/équipe est obligatoire",
    ar: "اسم النادي/الفريق مطلوب",
  },
  "contact.clubTeam.min": {
    en: "Club/Team name must be at least 2 characters",
    fr: "Le nom du club/équipe doit comporter au moins 2 caractères",
    ar: "يجب أن يكون اسم النادي/الفريق مكونًا من حرفين على الأقل",
  },
  "contact.clubTeam.max": {
    en: "Club/Team name is too long (max 100 characters)",
    fr: "Le nom du club/équipe est trop long (max 100 caractères)",
    ar: "اسم النادي/الفريق طويل جدًا (الحد الأقصى 100 حرف)",
  },

  "contact.subject.string": {
    en: "Subject must be text",
    fr: "Le sujet doit être du texte",
    ar: "يجب أن يكون الموضوع نصًا",
  },
  "contact.subject.required": {
    en: "Subject is required",
    fr: "Le sujet est obligatoire",
    ar: "الموضوع مطلوب",
  },

  "contact.message.string": {
    en: "Message must be text",
    fr: "Le message doit être du texte",
    ar: "يجب أن تكون الرسالة نصًا",
  },
  "contact.message.required": {
    en: "Message is required",
    fr: "Le message est obligatoire",
    ar: "الرسالة مطلوبة",
  },
  "contact.message.min": {
    en: "Message must be at least 10 characters",
    fr: "Le message doit comporter au moins 10 caractères",
    ar: "يجب أن تتكون الرسالة من 10 أحرف على الأقل",
  },
  "contact.message.max": {
    en: "Message is too long (max 2000 characters)",
    fr: "Le message est trop long (max 2000 caractères)",
    ar: "الرسالة طويلة جدًا (الحد الأقصى 2000 حرف)",
  },

  // Contact success/error messages
  "contact.success": {
    en: "Message sent successfully!",
    fr: "Message envoyé avec succès !",
    ar: "تم إرسال الرسالة بنجاح!",
  },
  "contact.emailWarning": {
    en: "Message sent, but email confirmation may be delayed",
    fr: "Message envoyé, mais la confirmation par email peut être retardée",
    ar: "تم إرسال الرسالة، ولكن قد يتأخر تأكيد البريد الإلكتروني",
  },
  "contact.emailSuccess": {
    en: "Email confirmation sent successfully",
    fr: "Confirmation par email envoyée avec succès",
    ar: "تم إرسال تأكيد البريد الإلكتروني بنجاح",
  },
};

// Utility function to get localized validation message
export function getLocalizedValidationMessage(
  key: string,
  locale: TLocale = "en"
): string {
  const message =
    validationMessages[key]?.[locale] ||
    validationMessages[key]?.en ||
    `Validation error: ${key}`;
  return message;
}
