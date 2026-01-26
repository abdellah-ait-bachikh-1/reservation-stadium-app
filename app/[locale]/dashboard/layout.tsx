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

import { cn } from "@heroui/theme";
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

// app/dashboard/layout.tsx
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
      <div className="relative w-full min-h-screen flex bg-zinc-50 dark:bg-zinc-800 overflow-hidden">
        <Aside />
        <MainContentWithMargin>
          <Header user={authenticatedUser} />
          <main className="flex-1 p-4 overflow-x-hidden overflow-y-auto">
            {children}
          </main>
        </MainContentWithMargin>
      </div>
    </AsideContextProvider>
  );
}