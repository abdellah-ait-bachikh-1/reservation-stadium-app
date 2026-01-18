// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ locale: string }>;
// }): Promise<Metadata> {
//   const { locale } = await params;
//   const t = await getTypedTranslations();

import { logoutUser } from "@/app/actions/auth/logout";
import NotificationBell from "@/components/dashboard/NotificationBell";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { redirect } from "@/i18n/navigation";
import { apiLogout, isAuthenticatedUserExistsInDB } from "@/lib/auth";
export const dynamic = 'force-dynamic';
//   return {
//     title: {
//       template: `%s | ${getAppName(locale as LocaleEnumType)}`,
//       default: getAppName(locale as LocaleEnumType) || "Réservation des Stade",
//     },
//     description: t("pages.home.metadata.description"),
//     keywords: t("pages.home.metadata.keywords"),
//   };
// }

export default async function DashboardLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const authenticatedUser = await isAuthenticatedUserExistsInDB()

  if (!authenticatedUser) {
    await apiLogout()
    redirect({ locale: locale, href: "/auth/login" })
  }
  return (
    <>
      <header className="flex items-center gap-4 justify-center  fixed top-0 z-99999 w-screen">
        <NotificationBell /> <ThemeSwitcher /> <LanguageSwitcher />
      </header>
      <main className="mt-5">
        {children}
      </main>
    </>
  );
}
