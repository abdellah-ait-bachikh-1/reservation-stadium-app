import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages, setRequestLocale } from "next-intl/server";

import { Rubik } from "next/font/google";
import { Metadata } from "next";
import { APP_NAME, APP_NAMES } from "@/lib/const";
import { Providers } from "@/components/provider/Provider";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { cn } from "@heroui/theme";
import { TLocale } from "@/lib/types";
export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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
      default: `${APP_NAMES[locale as TLocale] || "Tan-Tan Stades"}`,
    },
    description: messages.Pages.Register.metaDescription,
    keywords: messages.Pages.Register.keywords,
  };
};
const inter = Rubik({
  subsets: ["latin"],
  display: "swap",
});

export default async function LocaleLayout({
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
          "bg-linear-to-br from-[#FFEFBA] via-[#fffbfb] to-[#FFEFBA]",
          "dark:bg-linear-to-br dark:from-gray-950 dark:via-slate-700 dark:to-slate-950",
          "transition-colors duration-500 ease-in-out bg-fixed min-h-screen max-h-fit overflow-y-auto pt-24 z-99999 text-black dark:text-white"
        )}
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers locale={locale}>
            <Header />
            <main className="min-h-[calc(100vh-96px)]  z-99">{children}</main>
            <Footer locale={locale} />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
