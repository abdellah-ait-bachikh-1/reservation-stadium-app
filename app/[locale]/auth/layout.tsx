import { logoutUser } from "@/app/actions/auth/logout";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Sparkles } from "@/components/sparkles";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { isAuthenticatedUserExistsInDB } from "@/lib/auth";
import { LocaleEnumType } from "@/types";
import { getAppName } from "@/utils";
import { Metadata } from "next";
export const dynamic = 'force-dynamic';

// export function generateStaticParams() {
//   return routing.locales.map((locale) => ({ locale }));
// }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const authenticatedUser = await isAuthenticatedUserExistsInDB()
  if (authenticatedUser) {
    redirect({ locale: locale, href: "/" })
  }
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
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  await params;
  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col gap-6 p-5">
      <header className="flex items-center justif-center gap-4">
        <ThemeSwitcher placement="bottom" showArrow />
        <LanguageSwitcher placement="bottom" showArrow />
      </header>
      {children}

      <Sparkles
        density={400}
        speed={1.2}
        color='#ff9819'
        direction='top'
        className='absolute inset-x-0 bottom-0 h-full w-full -z-1'
      />
    </div>
  );
}
