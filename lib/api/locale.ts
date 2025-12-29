import { cookies } from "next/headers";
import { routing } from "@/i18n/routing";
import { TLocale } from "../types";

export async function getLocaleFromNextIntlCookie(): Promise<TLocale> {
  try {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get("NEXT_LOCALE")?.value;
    if (cookieValue && isTLocale(cookieValue)) {
      return cookieValue;
    }
    return (routing.defaultLocale as TLocale) || "en";
  } catch (error) {
    console.error("Error getting locale from cookie:", error);
    return "en" as TLocale;
  }
}

// Type guard for TLocale
function isTLocale(value: string): value is TLocale {
  return ["fr", "ar", "en"].includes(value);
}

// Localized error messages - Simplified
export const errorMessages: Record<TLocale, Record<string, string>> = {
  en: {
    // HTTP Status Codes
    "200": "Success",
    "201": "Created",
    "204": "No Content",

    "400": "Please check your inputs and try again",
    "401": "Unauthorized access",
    "402": "Payment Required",
    "403": "Forbidden",
    "404": "Resource not found",
    "405": "Method Not Allowed",
    "408": "Request Timeout",
    "409": "Conflict",
    "410": "Gone",
    "413": "Payload Too Large",
    "415": "Unsupported Media Type",
    "422": "Unprocessable Entity",
    "429": "Too Many Requests",

    "500": "Internal Server Error",
    "501": "Not Implemented",
    "502": "Bad Gateway",
    "503": "Service Unavailable",
    "504": "Gateway Timeout",

    // Network Errors
    NETWORK_ERROR:
      "Network connection failed. Please check your internet connection",
    NETWORK_TIMEOUT: "Request timed out. Please try again",
    NETWORK_OFFLINE: "You are offline. Please check your internet connection",
    NETWORK_BLOCKED:
      "Network request blocked. Please check your firewall or security settings",

    // Client-side Errors
    CLIENT_VALIDATION: "Please check the entered information",
    CLIENT_AUTH_EXPIRED: "Session expired. Please log in again",
    CLIENT_AUTH_INVALID: "Invalid authentication. Please log in again",
    CLIENT_PERMISSION_DENIED:
      "You don't have permission to perform this action",
    CLIENT_DATA_MISSING: "Required information is missing",
    CLIENT_DATA_INVALID: "Invalid data provided",
    CLIENT_FORMAT_ERROR: "Data format is incorrect",

    // Server-side Errors
    SERVER_DATABASE: "Database error. Please try again later",
    SERVER_FILESYSTEM: "File system error",
    SERVER_EXTERNAL_SERVICE: "External service error",
    SERVER_CONFIGURATION: "Server configuration error",

    // Business Logic Errors
    USER_NOT_FOUND: "User not found",
    USER_EXISTS: "User already exists",
    EMAIL_EXISTS: "Email already registered",
    PHONE_EXISTS: "Phone number already registered",
    INVALID_CREDENTIALS: "Invalid email or password",
    ACCOUNT_LOCKED: "Account is temporarily locked",
    ACCOUNT_DISABLED: "Account is disabled",
    EMAIL_NOT_VERIFIED: "Email not verified",
    PHONE_NOT_VERIFIED: "Phone number not verified",

    PRODUCT_NOT_FOUND: "Product not found",
    PRODUCT_OUT_OF_STOCK: "Product is out of stock",
    ORDER_NOT_FOUND: "Order not found",
    PAYMENT_FAILED: "Payment failed",
    PAYMENT_INSUFFICIENT: "Insufficient funds",
    PAYMENT_DECLINED: "Payment declined",

    // File & Upload Errors
    FILE_TOO_LARGE: "File is too large",
    FILE_INVALID_TYPE: "Invalid file type",
    FILE_CORRUPTED: "File is corrupted",
    FILE_UPLOAD_FAILED: "File upload failed",
    FILE_NOT_FOUND: "File not found",

    // System Errors
    SYSTEM_MAINTENANCE: "System under maintenance. Please try again later",
    SYSTEM_OVERLOAD: "System is overloaded. Please try again later",
    SYSTEM_UPDATE: "System update in progress",

    // Generic Errors
    UNKNOWN_ERROR: "An unexpected error occurred",
    OPERATION_FAILED: "Operation failed. Please try again",
    REQUEST_FAILED: "Request failed. Please try again",
    VALIDATION_ERROR: "Validation failed",

    // Security Errors
    SECURITY_CSRF: "Security validation failed",
    SECURITY_RATE_LIMIT: "Too many attempts. Please try again later",
    SECURITY_SUSPICIOUS: "Suspicious activity detected",
  },

  fr: {
    // HTTP Status Codes
    "200": "Succès",
    "201": "Créé",
    "204": "Pas de contenu",

    "400": "Veuillez vérifier vos saisies et réessayer",
    "401": "Accès non autorisé",
    "402": "Paiement requis",
    "403": "Interdit",
    "404": "Ressource non trouvée",
    "405": "Méthode non autorisée",
    "408": "Délai de requête expiré",
    "409": "Conflit",
    "410": "Disparu",
    "413": "Charge trop importante",
    "415": "Type de média non supporté",
    "422": "Entité non traitable",
    "429": "Trop de requêtes",

    "500": "Erreur Interne du Serveur",
    "501": "Non implémenté",
    "502": "Passerelle incorrecte",
    "503": "Service indisponible",
    "504": "Délai de passerelle expiré",

    // Network Errors
    NETWORK_ERROR:
      "Échec de la connexion réseau. Vérifiez votre connexion internet",
    NETWORK_TIMEOUT: "Délai de requête expiré. Veuillez réessayer",
    NETWORK_OFFLINE: "Vous êtes hors ligne. Vérifiez votre connexion internet",
    NETWORK_BLOCKED:
      "Requête réseau bloquée. Vérifiez votre pare-feu ou paramètres de sécurité",

    // Business Logic Errors
    USER_NOT_FOUND: "Utilisateur non trouvé",
    USER_EXISTS: "L'utilisateur existe déjà",
    EMAIL_EXISTS: "L'email est déjà enregistré",
    INVALID_CREDENTIALS: "Email ou mot de passe invalide",
    ACCOUNT_LOCKED: "Compte temporairement verrouillé",

    // Generic
    UNKNOWN_ERROR: "Une erreur inattendue s'est produite",
    OPERATION_FAILED: "Opération échouée. Veuillez réessayer",
  },

  ar: {
    // HTTP Status Codes
    "200": "نجاح",
    "201": "تم الإنشاء",
    "204": "لا يوجد محتوى",

    "400": "يرجى التحقق من المدخلات والمحاولة مرة أخرى",
    "401": "وصول غير مصرح به",
    "402": "الدفع مطلوب",
    "403": "محظور",
    "404": "الملف المطلوب غير موجود",
    "405": "الطريقة غير مسموح بها",
    "408": "انتهت مهلة الطلب",
    "409": "تعارض",
    "410": "ذهب",
    "413": "الحمولة كبيرة جدًا",
    "415": "نوع الوسائط غير مدعوم",
    "422": "كيان غير قابل للمعالجة",
    "429": "طلبات كثيرة جدًا",

    "500": "خطأ داخلي في الخادم",
    "501": "غير منفذ",
    "502": "بوابة غير صالحة",
    "503": "الخدمة غير متاحة",
    "504": "انتهت مهلة البوابة",

    // Network Errors
    NETWORK_ERROR:
      "فشل في اتصال الشبكة. يرجى التحقق من اتصال الإنترنت الخاص بك",
    NETWORK_TIMEOUT: "انتهت مهلة الطلب. يرجى المحاولة مرة أخرى",
    NETWORK_OFFLINE:
      "أنت غير متصل بالإنترنت. يرجى التحقق من اتصال الإنترنت الخاص بك",
    NETWORK_BLOCKED:
      "تم حظر طلب الشبكة. يرجى التحقق من جدار الحماية أو إعدادات الأمان",

    // Business Logic Errors
    USER_NOT_FOUND: "المستخدم غير موجود",
    USER_EXISTS: "المستخدم موجود بالفعل",
    EMAIL_EXISTS: "البريد الإلكتروني مسجل بالفعل",
    INVALID_CREDENTIALS: "بريد إلكتروني أو كلمة مرور غير صالحة",
    ACCOUNT_LOCKED: "الحساب مؤقتًا مغلق",

    // Generic
    UNKNOWN_ERROR: "حدث خطأ غير متوقع",
    OPERATION_FAILED: "فشلت العملية. يرجى المحاولة مرة أخرى",
  },
};

// Helper to get localized error message
export function getLocalizedError(
  locale: TLocale,
  errorCode: keyof (typeof errorMessages)[TLocale]
): string {
  return errorMessages[locale]?.[errorCode] || errorMessages.en[errorCode];
}

export const successMessages: Record<TLocale, Record<string, string>> = {
  en: {
    "200": "Operation completed successfully",
    "201": "Resource created successfully",
    "202": "Request accepted for processing",
    "204": "Resource deleted successfully",
    register: "Registration completed successfully",
    login: "Login successful",
    logout: "Logout successful",
    update: "Update completed successfully",
  },
  fr: {
    "200": "Opération terminée avec succès",
    "201": "Ressource créée avec succès",
    "202": "Demande acceptée pour traitement",
    "204": "Ressource supprimée avec succès",
    register: "Inscription terminée avec succès",
    login: "Connexion réussie",
    logout: "Déconnexion réussie",
    update: "Mise à jour terminée avec succès",
  },
  ar: {
    "200": "تمت العملية بنجاح",
    "201": "تم إنشاء المورد بنجاح",
    "202": "تم قبول الطلب للمعالجة",
    "204": "تم حذف المورد بنجاح",
    register: "تم التسجيل بنجاح",
    login: "تم تسجيل الدخول بنجاح",
    logout: "تم تسجيل الخروج بنجاح",
    update: "تم التحديث بنجاح",
  },
};
export function getLocalizedSuccess(
  locale: TLocale,
  successCode: string
): string {
  return (
    successMessages[locale]?.[successCode] || successMessages.en[successCode]
  );
}

export const emailWarningMessages: Record<TLocale, Record<string, string>> = {
  en: {
    verification_not_sent:
      "User created, but verification email could not be sent. Please request a new verification email.",
    verification_sent: "Verification email sent successfully",
  },
  fr: {
    verification_not_sent:
      "Utilisateur créé, mais l'email de vérification n'a pas pu être envoyé. Veuillez demander un nouvel email de vérification.",
    verification_sent: "Email de vérification envoyé avec succès",
  },
  ar: {
    verification_not_sent:
      "تم إنشاء المستخدم، ولكن تعذر إرسال بريد التحقق. يرجى طلب بريد تحقق جديد.",
    verification_sent: "تم إرسال بريد التحقق بنجاح",
  },
};

export function getLocalizedEmailWarning(locale: TLocale): string {
  return (
    emailWarningMessages[locale]?.verification_not_sent ||
    emailWarningMessages.en.verification_not_sent
  );
}

export function getLocalizedEmailSuccess(locale: TLocale): string {
  return (
    emailWarningMessages[locale]?.verification_sent ||
    emailWarningMessages.en.verification_sent
  );
}
