import { locales } from "@/const";
import { getTypedGlobalTranslations } from "@/utils/i18n";
import { Metadata } from "next";
export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTypedGlobalTranslations();
 
  return {
    title: `${t("pages.stadiums.metadata.title")}`,
    description: t("pages.stadiums.metadata.description"),
    keywords: t("pages.stadiums.metadata.keywords"),
  };
}
const StadiumsPage = () => {
  return <div>StadiumsPage</div>;
};

export default StadiumsPage;
