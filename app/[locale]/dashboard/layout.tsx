// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ locale: string }>;
// }): Promise<Metadata> {
//   const { locale } = await params;
//   const t = await getTypedTranslations();

import Aside from "@/components/dashboard/Aside";
import Header from "@/components/dashboard/Header";
import MainContentWithMargin from "@/components/dashboard/MainContentWithMargin";
import AsideContextProvider from "@/context/AsideContext";
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
    <AsideContextProvider>
      <div className="w-full  overflow-auto flex z-99997 bg-zinc-100 dark:bg-zinc-800 transition-all duration-300 ">
        <Aside />
        <MainContentWithMargin>
            <Header />
            <main className="flex-1 z-999 pt-20 transition-all">
              {children}
            </main>
        </MainContentWithMargin>
      </div>
    </AsideContextProvider>
  );
}
