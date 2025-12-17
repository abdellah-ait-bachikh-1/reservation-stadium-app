import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Rubik } from "next/font/google";
import { Providers } from "@/components/provider/Provider";

import { cn } from "@heroui/theme";
import { APP_NAMES } from "@/lib/const";
import { Metadata } from "next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { TLocale } from "@/lib/types";
export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const inter = Rubik({
  subsets: ["latin"],
  display: "swap",
});
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  return {
    title: {
      template: `%s | ${APP_NAMES[locale as TLocale] || "Tan-Tan Stades"}`,
      default: APP_NAMES[locale as TLocale] || "Tan-Tan Stades",
    },
    description: messages.Pages.Register.metaDescription,
    keywords: messages.Pages.Register.keywords,
  };
};

export default async function LocaleAuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  const isRTL = locale === "ar";

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"} suppressHydrationWarning>
      <body
        className={cn(
          `${inter.className}`,
          "bg-linear-to-r from-[#FFEFBA] to-[#ffecec] ",
          "dark:bg-linear-to-br dark:from-gray-950 dark:via-slate-800 dark:to-slate-950",
          "transition-colors duration-500 ease-in-out bg-fixed min-h-screen  text-black dark:text-white"
        )}
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers locale={locale}>
            <main className="flex min-h-screen items-center justify-center gap-3 flex-col">
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <ThemeSwitcher />
              </div>
              {children}
            </main>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
