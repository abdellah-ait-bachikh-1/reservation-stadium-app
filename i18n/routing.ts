import { locales } from "@/const";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales,
  defaultLocale: "fr",
  localePrefix: "always",
});
