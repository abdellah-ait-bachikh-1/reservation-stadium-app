import { getTranslations } from "next-intl/server";
import { Button } from "@heroui/button";
import {
  getPagesHomeMetadataTranslations,
  getTypedGlobalTranslations,
} from "@/utils/i18n";
import { Metadata } from "next";
import { error } from "console";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LanguageSwitcher from "@/components/LanguageSwitcher";
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getPagesHomeMetadataTranslations();
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
  };
};
const HomePage = async () => {
  await new Promise((re) => setTimeout(re, 5000));
  const t = await getTypedGlobalTranslations();

  return (
    <div className="text-4xl space-y-4">
      {t("pages.home.hero.title")}
      <ThemeSwitcher />
      <LanguageSwitcher />
    </div>
  );
};

export default HomePage;
