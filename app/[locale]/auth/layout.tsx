import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { LocaleEnumType } from "@/types";
import { getAppName } from "@/utils";
import { getTypedGlobalTranslations } from "@/utils/i18n";

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

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>          <header>auth header</header>
 {children} </>;
}
