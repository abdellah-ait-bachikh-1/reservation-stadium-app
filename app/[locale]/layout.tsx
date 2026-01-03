import type { Metadata } from "next";
import { Cause, Figtree, Manrope } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { LocaleEnumType, LocaleType } from "@/types";
import { getAppName, getDirection } from "@/utils";
import { HeroUIProvider } from "@heroui/system";
import { getTypedGlobalTranslations } from "@/utils/i18n";
import Providers from "@/components/providers/Providers";
import { ToastProvider } from "@heroui/toast";
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
    <html
      lang={locale}
      dir={getDirection(locale as LocaleType)}
      className="h-full overflow-y-auto z-99999"
      suppressHydrationWarning
    >
      <body
        className={`${cause.variable} z-99998  bg-linear-to-br from-amber-100 via-white to-amber-100 dark:from-stone-950 dark:via-stone-700 dark:to-stone-950 min-h-screen w-full bg-fixed`}
        suppressHydrationWarning
      >
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>

        <ToastProvider
          placement="top-center"
          regionProps={{ className: "z-99999999" }}
        />
      </body>
    </html>
  );
}
