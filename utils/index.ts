import { LocaleType } from "@/types";

export function isRtl(locale: LocaleType) {
  return locale === "ar";
}
export function getDirection(locale: LocaleType) {
  return isRtl(locale) ? "rtl" : "ltr";
}
