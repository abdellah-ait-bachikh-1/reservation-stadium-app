
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

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {" "}
      <header>dashboard header</header>
      {children}{" "}
    </>
  );
}
