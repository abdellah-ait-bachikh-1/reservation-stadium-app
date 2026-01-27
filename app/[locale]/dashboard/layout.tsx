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
import { getSession } from "@/lib/auth";

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

  const session = await getSession()
  if (!session || !session.user) {
    redirect({ locale: locale, href: "/" })
    return
  }

  return (
    <AsideContextProvider>
      <div className="flex w-full h-screen bg-zinc-50 dark:bg-zinc-800 overflow-hidden">
        <Aside userRole={session?.user?.role} />
        <MainContentWithMargin>
          <Header user={{
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            phoneNumber: session.user.phoneNumber,
            role: session.user.role,
            preferredLocale: session.user.preferredLocale,
            isApproved: session.user.isApproved,
            createdAt: session.user.createdAt,
            updatedAt: session.user.updatedAt,
            deletedAt: session.user.deletedAt,
            emailVerifiedAt: session.user.emailVerifiedAt
          }} />
          <main className="flex-1 overflow-y-auto p-4">
            {children}
          </main>
        </MainContentWithMargin>
      </div>
    </AsideContextProvider>
  );
}