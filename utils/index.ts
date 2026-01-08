import { APP_NAMES } from "@/const";
import { LocaleEnumType, LocaleType } from "@/types";
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

export function getAppName(locale: LocaleEnumType) {
  return APP_NAMES[locale] || "Réservation des Stade";
}

export function convertCase<T extends string>(
  value: T,
  params: "lower" | "upper"
): T extends Uppercase<T>
  ? Lowercase<T>
  : T extends Lowercase<T>
  ? Uppercase<T>
  : T extends string
  ? typeof params extends "lower"
    ? Lowercase<T>
    : Uppercase<T>
  : never {
  if (params === "lower") {
    return value.toLowerCase() as any;
  } else {
    return value.toUpperCase() as any;
  }
}

export const wait = async (s: number = 2000) => {
  return await new Promise((res) => setTimeout(res, s));
};

export const isErrorHasMessage = (error: unknown): error is Error => {
  return (
    error instanceof Error ||
    (!!error &&
      typeof error === "object" &&
      "message" in error &&
      typeof (error as any).message === "string")
  );
};


