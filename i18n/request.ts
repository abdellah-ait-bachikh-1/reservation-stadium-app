// i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { hasLocale } from "next-intl";
import { i18nConfig } from "./config";

export default getRequestConfig(async ({ requestLocale, }) => {
  const requested = await requestLocale;
  const locale =
    requested && hasLocale(routing.locales, requested)
      ? requested
      : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: i18nConfig.timeZone,
    formats: i18nConfig.formats,
  };
});
