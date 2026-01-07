import { routing } from "@/i18n/routing";

export type LocaleType = (typeof routing.locales)[number];
export type LocaleEnumType = "en" | "fr" | "ar"