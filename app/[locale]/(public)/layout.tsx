import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { LocaleEnumType } from "@/types";
import { getAppName } from "@/utils";
import { getTypedGlobalTranslations } from "@/utils/i18n";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";

import { routing } from "@/i18n/routing";
export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
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

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20 z-99994">{children}</main>
      <Footer />
    </>
  );
}
