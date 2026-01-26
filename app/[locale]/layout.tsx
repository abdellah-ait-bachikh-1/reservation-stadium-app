import type { Metadata } from "next";
import { Rubik } from "next/font/google";

import { LocaleEnumType, LocaleType } from "@/types";
import { getAppName, getDirection, isRtl } from "@/utils";

import Providers from "@/components/providers/Providers";
import { ToastProvider } from "@heroui/toast";
import { setRequestLocale } from "next-intl/server";
const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    title: {
      template: `%s | ${getAppName(locale as LocaleEnumType)}`,
      default: getAppName(locale as LocaleEnumType) || "Réservation des Stade",
    },
    description: messages?.pages?.home?.metadata?.description || "",
    keywords: messages?.pages?.home?.metadata?.keywords || "",
  };
}

export default async function LocaleRootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = (await import(`../../messages/${locale}.json`)).default;
  return (
    <html
      lang={locale}
      dir={getDirection(locale as LocaleType)}
      className={`h-full  ${rubik.variable}  `}
      suppressHydrationWarning
    >
      <body
        className={`${rubik.className}  relative z-99998  bg-linear-to-br from-amber-200/60 via-white to-amber-200/60 dark:from-black dark:via-neutral-700 dark:to-black  w-full bg-fixed `}
        suppressHydrationWarning
        style={{ direction: getDirection(locale as LocaleType) }}

      >
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>

        <ToastProvider
          placement="top-center"
          regionProps={{ className: "z-99999999" }}
          toastOffset={10}
        />
      </body>
    </html>
  );
}
