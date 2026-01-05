import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { routing } from "@/i18n/routing";
import { LocaleEnumType } from "@/types";
import { getAppName } from "@/utils";
import { Metadata } from "next";
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
    description: messages.pages.home.metadata.description,
    keywords: messages.pages.home.metadata.keywords,
  };
}

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col gap-6 p-5">
      <header className="flex items-center justif-center gap-4">
        <ThemeSwitcher /> <LanguageSwitcher />
      </header>
      {children}
    </div>
  );
}
