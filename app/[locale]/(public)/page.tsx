import TestToast from "@/components/TestToast";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { locales } from "@/const";
import { getAppName } from "@/utils";
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
    title:`${t("pages.home.metadata.title")}`,
    description: t("pages.home.metadata.description"),
    keywords: t("pages.home.metadata.keywords"),
  };
}

const page = async () => {
  // throw new Error(" this is error from home page")
  const t = await getTypedGlobalTranslations();
  return (
    <div>
      <ThemeSwitcher />
      <TestToast />
      {new Array(100).fill(null).map((_, i) => (
        <div key={i}> {i} </div>
      ))}
      <div>sqdnqkjsdhj kssssssssssss ssss ssssssssssss sssssssssssssssssssssssss sssssssssssss ssssssssss ssssssssssssssssssssss</div>
    </div>
  );
};

export default page;
