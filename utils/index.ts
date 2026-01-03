import { LocaleType } from "@/types";
import { getLocale } from "next-intl/server";

export function isRtl(locale: LocaleType) {
  return locale === "ar";
}
export function getDirection(locale: LocaleType) {
  return isRtl(locale) ? "rtl" : "ltr";
}

export async function getServerLocale() {
  return await getLocale();
}
