
import { routing } from "@/i18n/routing";
export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}


// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ locale: string }>;
// }): Promise<Metadata> {
//   const { locale } = await params;
//   const t = await getTypedTranslations();

//   return {
//     title: {
//       template: `%s | ${getAppName(locale as LocaleEnumType)}`,
//       default: getAppName(locale as LocaleEnumType) || "Réservation des Stade",
//     },
//     description: t("pages.home.metadata.description"),
//     keywords: t("pages.home.metadata.keywords"),
//   };
// }

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>          <header>auth header</header>
 {children} </>;
}
