import type { Metadata } from "next";
import { Cause, Figtree, Manrope } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { LocaleEnumType, LocaleType } from "@/types";
import { getAppName, getDirection } from "@/utils";
import { HeroUIProvider } from "@heroui/system";
import { getTypedGlobalTranslations } from "@/utils/i18n";
import Providers from "@/components/providers/Providers";

const cause = Figtree({
  variable: "--font-cause",
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
  const t = await getTypedGlobalTranslations();

  return {
    title: {
      template: `%s | ${getAppName(locale as LocaleEnumType)}`,
      default: getAppName(locale as LocaleEnumType) || "Réservation des Stade",
    },
    description: t("pages.home.metadata.description"),
    keywords: t("pages.home.metadata.keywords"),
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = (await import(`../../messages/${locale}.json`)).default;
  return (
    <html lang={locale} dir={getDirection(locale as LocaleType)}>
      <body className={`${cause.variable}  antialiased `}>
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
