import { getTranslations } from "next-intl/server";

const HomePage = async () => {
  const t = await getTranslations("pages.home");
  return <div className="text-4xl"> {t("title")}</div>;
};

export default HomePage;
