import createMiddleware from "next-intl/middleware";
import { defineRouting } from "next-intl/routing";
import { locales } from "./const";

export const routing = defineRouting({
  locales,
  defaultLocale: "fr",
});

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
