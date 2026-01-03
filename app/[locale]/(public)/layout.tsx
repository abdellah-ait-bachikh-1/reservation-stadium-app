import type { Metadata } from "next";
import { Cause } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { LocaleEnumType, LocaleType } from "@/types";
import { getAppName, getDirection } from "@/utils";
import { HeroUIProvider } from "@heroui/system";
import { getMessages } from "next-intl/server";

const cause = Cause({
  variable: "--font-cause",
  subsets: ["latin", "latin-ext"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // Specify weights you need
  display: "swap",
  preload: true,
});
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
 
  return {
    title: {
      template: `%s | ${getAppName(locale as LocaleEnumType)}`,
      default: getAppName(locale as LocaleEnumType) || "Réservation des Stade",
    },
    description:"",
    keywords: "",
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
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  return (
    <html lang={locale} dir={getDirection(locale as LocaleType)}>
      <body className={`${cause.variable}  antialiased `}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <HeroUIProvider locale={locale}>{children}</HeroUIProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
