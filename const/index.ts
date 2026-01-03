export const locales = ["en", "fr", "ar"];
export const APP_NAMES = {
  en: process.env.EN_APP_NAME || "Reservation Stadiums",
  fr: process.env.FR_APP_NAME || "Réservation des Stade",
  ar: process.env.AR_APP_NAME || "حجز الملاعب",
} as const;
