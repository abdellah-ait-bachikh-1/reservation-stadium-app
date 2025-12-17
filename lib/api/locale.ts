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
    "500": "Internal Server Error",
    "400": "Please check your inputs and try again",
    "401": "Unauthorized access",
    "404": "Resource not found",
  },
  fr: {
    "500": "Erreur Interne du Serveur",
    "400": "Veuillez vérifier vos saisies et réessayer",
    "401": "Accès non autorisé",
    "404": "Ressource non trouvée",
  },
  ar: {
    "500": "خطأ داخلي في الخادم",
    "400": "يرجى التحقق من المدخلات والمحاولة مرة أخرى",
    "401": "وصول غير مصرح به",
    "404": "الملف المطلوب غير موجود",
  },
};

// Helper to get localized error message
export function getLocalizedError(locale: TLocale, errorCode: string): string {
  return errorMessages[locale]?.[errorCode] || errorMessages.en[errorCode];
}


export const successMessages: Record<TLocale, Record<string, string>> = {
  en: {
    "200": "Operation completed successfully",
    "201": "Resource created successfully",
    "202": "Request accepted for processing",
    "204": "Resource deleted successfully",
    "register": "Registration completed successfully",
    "login": "Login successful",
    "logout": "Logout successful",
    "update": "Update completed successfully",
  },
  fr: {
    "200": "Opération terminée avec succès",
    "201": "Ressource créée avec succès",
    "202": "Demande acceptée pour traitement",
    "204": "Ressource supprimée avec succès",
    "register": "Inscription terminée avec succès",
    "login": "Connexion réussie",
    "logout": "Déconnexion réussie",
    "update": "Mise à jour terminée avec succès",
  },
  ar: {
    "200": "تمت العملية بنجاح",
    "201": "تم إنشاء المورد بنجاح",
    "202": "تم قبول الطلب للمعالجة",
    "204": "تم حذف المورد بنجاح",
    "register": "تم التسجيل بنجاح",
    "login": "تم تسجيل الدخول بنجاح",
    "logout": "تم تسجيل الخروج بنجاح",
    "update": "تم التحديث بنجاح",
  },
};
export function getLocalizedSuccess(locale: TLocale, successCode: string): string {
  return successMessages[locale]?.[successCode] || successMessages.en[successCode];
}