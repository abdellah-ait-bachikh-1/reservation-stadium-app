import { LocaleType } from "@/types";
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async ({}) => {
  const suportedLocale = ["en", "fr", "ar"] as const;
  const store = await cookies();
  const cookieLocale = store.get("locale")?.value as LocaleType;
  const locale = suportedLocale.includes(cookieLocale || "")
    ? cookieLocale
    : "en";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
