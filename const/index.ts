import { UserPreferredLocaleType } from "@/types/db";

export const locales = ["en", "fr", "ar"];
export const LOCALES: UserPreferredLocaleType[] = ["FR", "EN", "AR"] as const;

export const APP_NAMES = {
  en: process.env.EN_APP_NAME || "Reservation Stadiums",
  fr: process.env.FR_APP_NAME || "Réservation des Stade",
  ar: process.env.AR_APP_NAME || "حجز الملاعب",
} as const;

export const SALT = parseInt(process.env.SALT as string);

export const AUTH_SECRET =  process.env.AUTH_SECRET