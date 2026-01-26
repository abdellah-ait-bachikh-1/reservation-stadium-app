import type { Metadata } from "next";
import { LocaleEnumType } from "@/types";
import { getAppName } from "@/utils";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { routing } from "@/i18n/routing";

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
  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return {
    title: {
      template: `%s | ${getAppName(locale as LocaleEnumType)}`,
      default: getAppName(locale as LocaleEnumType) || "Réservation des Stade",
    },
    description: messages?.pages?.home?.metadata?.description || "",
    keywords: messages?.pages?.home?.metadata?.keywords || "",
  };
}


export default async function PublicRoutesLocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>
}>) {
  await params
  return (
    <>
      <Header />
      <main className="flex-1 pt-20 z-99994 overflow-y-auto ">
        {children}
      </main>
      <Footer />
    </>
  );
}
