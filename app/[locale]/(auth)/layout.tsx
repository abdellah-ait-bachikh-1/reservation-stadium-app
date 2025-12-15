import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";
import { Inter, Rubik } from "next/font/google";
import { Metadata } from "next";
import { APP_NAME } from "@/lib/const";
import { Providers } from "@/components/provider/Provider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@heroui/theme";
export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const appName = APP_NAME || "Stades Tan-Tan";

  return {
    title: `${messages.HomePage?.headTitle || "Home"} | ${appName}`,
    description:
      messages.HomePage?.metaDescription || "Stadium reservation platform",
    keywords: messages.HomePage?.keywords || "stadium, reservation, booking",
  };
}

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
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"}>
      <body
        className={cn(
          `${inter.className}`,

          "bg-linear-to-r from-amber-100 via-rose-100 to-red-200",
          "dark:bg-linear-to-br dark:from-gray-900 dark:via-slate-800 dark:to-slate-900",
          "transition-colors duration-500 ease-in-out bg-fixed h-screen "
        )}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers locale={locale}>
            <main className="flex h-full items-center justify-center">
              {children}
            </main>
            <ToastProvider placement="top-center" />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
