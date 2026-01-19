import { LocaleEnumType } from "@/types";

export const validationMessages = {
  en: {
    name: {
      string: "Full name must be a string",
      required: "Full name is required",
      min: "Full name must be at least 2 characters",
      max: "Full name cannot exceed 255 characters",
      regex: "Full name must be in French (only letters and spaces)",
    },
    email: {
      string: "Email must be a string",
      invalid: "Please enter a valid email address",
      max: "Email cannot exceed 255 characters",
      exists: "Email already exists. Please choose another one",
      notExists: "Email not found. Please create an account first",
    },
    phoneNumber: {
      string: "Phone number must be a string",
      regex: "Phone number must start with +212 or 0 followed by 9 digits",
      max: "Phone number cannot exceed 50 characters",
    },
    password: {
      string: "Password must be a string",
      required: "Password is required",
      min: "Password must be at least 8 characters",
      max: "Password cannot exceed 255 characters",
    },
    confirmPassword: {
      string: "Confirm password must be a string",
      required: "Please confirm your password",
      match: "Passwords do not match",
    },
    auth: {
      invalidCredentials:
        "Email or password is incorrect, or your email is not verified, or your account is not approved by admin, or has been deleted",
         emailRequired: "Email is required",
      emailInvalid: "Invalid email format",
      accountNotVerified: "Your account email is not verified yet. Please check your inbox.",
      accountNotApproved: "Your account is pending admin approval. Please contact support.",
      accountDeleted: "This account has been deleted. Please contact support.",
      invalidToken: "Invalid or expired reset link. Please request a new password reset.",
      expiredToken: "This password reset link has expired. Please request a new one.",
    },
    subject: {
      string: "Subject must be a string",
      required: "Subject is required",
      min: "Subject must be at least 3 characters",
      max: "Subject cannot exceed 255 characters",
    },
    message: {
      string: "Message must be a string",
      required: "Message is required",
      min: "Message must be at least 10 characters",
      max: "Message cannot exceed 5000 characters",
    },
  },
  fr: {
    name: {
      string: "Le nom complet doit être une chaîne de caractères",
      required: "Le nom complet est requis",
      min: "Le nom complet doit comporter au moins 2 caractères",
      max: "Le nom complet ne peut pas dépasser 255 caractères",
      regex:
        "Le nom complet doit être en français (uniquement des lettres et des espaces)",
    },
    email: {
      string: "L'email doit être une chaîne de caractères",
      invalid: "Veuillez entrer une adresse email valide",
      max: "L'email ne peut pas dépasser 255 caractères",
      exists: "Cet email existe déjà. Veuillez en choisir un autre",
      notExists: "Email non trouvé. Veuillez d'abord créer un compte",
    },
    phoneNumber: {
      string: "Le numéro de téléphone doit être une chaîne de caractères",
      regex:
        "Le numéro de téléphone doit commencer par +212 ou 0 suivi de 9 chiffres",
      max: "Le numéro de téléphone ne peut pas dépasser 50 caractères",
    },
    password: {
      string: "Le mot de passe doit être une chaîne de caractères",
      required: "Le mot de passe est requis",
      min: "Le mot de passe doit comporter au moins 8 caractères",
      max: "Le mot de passe ne peut pas dépasser 255 caractères",
    },
    confirmPassword: {
      string:
        "La confirmation du mot de passe doit être une chaîne de caractères",
      required: "Veuillez confirmer votre mot de passe",
      match: "Les mots de passe ne correspondent pas",
    },
    auth: {
      invalidCredentials:
        "Email ou mot de passe incorrect, ou votre email n'est pas vérifié, ou votre compte n'est pas approuvé par l'administrateur, ou a été supprimé",
          emailRequired: "L'email est requis",
      emailInvalid: "Format d'email invalide",
      accountNotVerified: "Votre compte n'est pas encore vérifié. Veuillez vérifier votre boîte de réception.",
      accountNotApproved: "Votre compte est en attente d'approbation par l'admin. Veuillez contacter le support.",
      accountDeleted: "Ce compte a été supprimé. Veuillez contacter le support.",
         invalidToken: "Lien de réinitialisation invalide ou expiré. Veuillez demander une nouvelle réinitialisation de mot de passe.",
      expiredToken: "Ce lien de réinitialisation de mot de passe a expiré. Veuillez en demander un nouveau.",
    },
    subject: {
      string: "Le sujet doit être une chaîne de caractères",
      required: "Le sujet est requis",
      min: "Le sujet doit comporter au moins 3 caractères",
      max: "Le sujet ne peut pas dépasser 255 caractères",
    },
    message: {
      string: "Le message doit être une chaîne de caractères",
      required: "Le message est requis",
      min: "Le message doit comporter au moins 10 caractères",
      max: "Le message ne peut pas dépasser 5000 caractères",
    },
  },
  ar: {
    name: {
      string: "الاسم الكامل يجب أن يكون نصًا",
      required: "الاسم الكامل مطلوب",
      min: "الاسم الكامل يجب أن يكون على الأقل حرفين",
      max: "الاسم الكامل لا يمكن أن يتجاوز 255 حرفًا",
      regex: "الاسم الكامل يجب أن يكون بالفرنسية (أحرف ومسافات فقط)",
    },
    email: {
      string: "البريد الإلكتروني يجب أن يكون نصًا",
      invalid: "الرجاء إدخال عنوان بريد إلكتروني صالح",
      max: "البريد الإلكتروني لا يمكن أن يتجاوز 255 حرفًا",
      exists: "البريد الإلكتروني موجود مسبقًا. الرجاء اختيار بريد آخر",
      notExists: "البريد الإلكتروني غير موجود. الرجاء إنشاء حساب أولاً",
    },
    phoneNumber: {
      string: "رقم الهاتف يجب أن يكون نصًا",
      regex: "رقم الهاتف يجب أن يبدأ بـ +212 أو 0 متبوعًا بـ 9 أرقام",
      max: "رقم الهاتف لا يمكن أن يتجاوز 50 حرفًا",
    },
    password: {
      string: "كلمة المرور يجب أن تكون نصًا",
      required: "كلمة المرور مطلوبة",
      min: "كلمة المرور يجب أن تكون على الأقل 8 أحرف",
      max: "كلمة المرور لا يمكن أن تتجاوز 255 حرفًا",
    },
    confirmPassword: {
      string: "تأكيد كلمة المرور يجب أن يكون نصًا",
      required: "الرجاء تأكيد كلمة المرور",
      match: "كلمات المرور غير متطابقة",
    },
    auth: {
      invalidCredentials:
        "البريد الإلكتروني أو كلمة المرور غير صحيحة، أو بريدك الإلكتروني غير مفعل، أو حسابك غير معتمد من قبل المسؤول، أو تم حذفه",
          emailRequired: "البريد الإلكتروني مطلوب",
      emailInvalid: "صيغة البريد الإلكتروني غير صالحة",
      accountNotVerified: "حسابك الإلكتروني غير مفعل بعد. الرجاء التحقق من صندوق الوارد.",
      accountNotApproved: "حسابك في انتظار موافقة المسؤول. الرجاء الاتصال بالدعم.",
      accountDeleted: "تم حذف هذا الحساب. الرجاء الاتصال بالدعم.",
       invalidToken: "رابط إعادة التعيين غير صالح أو منتهي الصلاحية. الرجاء طلب إعادة تعيين كلمة مرور جديدة.",
      expiredToken: "انتهت صلاحية رابط إعادة تعيين كلمة المرور هذا. الرجاء طلب رابط جديد.",
    },
    subject: {
      string: "الموضوع يجب أن يكون نصًا",
      required: "الموضوع مطلوب",
      min: "الموضوع يجب أن يكون على الأقل 3 أحرف",
      max: "الموضوع لا يمكن أن يتجاوز 255 حرفًا",
    },
    message: {
      string: "الرسالة يجب أن تكون نصًا",
      required: "الرسالة مطلوبة",
      min: "الرسالة يجب أن تكون على الأقل 10 أحرف",
      max: "الرسالة لا يمكن أن تتجاوز 5000 حرفًا",
    },
  },
} as const;

// Extract types from the validationMessages
export type ValidationMessages = typeof validationMessages;
export type LocaleMessages = ValidationMessages[keyof ValidationMessages];
export type ValidationField = keyof ValidationMessages["en"];
export type FieldMessageKeys<T extends ValidationField> =
  keyof ValidationMessages["en"][T];

// Helper type to get message key
export type ValidationMessageKey = `${ValidationField}.${string}`;

export const getLocalizedValidationMessage = (
  key: ValidationMessageKey,
  locale: LocaleEnumType = "en",
): string => {
  const [field, messageType] = key.split(".") as [ValidationField, string];

  const messages = validationMessages[locale];

  // Type-safe access with proper casting
  const fieldMessages = messages[field] as Record<string, string>;

  if (!fieldMessages || !fieldMessages[messageType]) {
    // Fallback to English if translation not found
    const enMessages = validationMessages.en;
    const enFieldMessages = enMessages[field] as Record<string, string>;
    return enFieldMessages[messageType] || `Validation error: ${key}`;
  }

  return fieldMessages[messageType];
};
