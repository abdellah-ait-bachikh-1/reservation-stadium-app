import { locales } from "@/const";
import { LocaleType } from "@/types";
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async ({}) => {
  const store = await cookies();
  const cookieLocale = store.get("NEXT_LOCALE")?.value as LocaleType;
  const locale = locales.includes(cookieLocale || "") ? cookieLocale : "fr";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
