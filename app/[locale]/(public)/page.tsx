import { getTranslations } from "next-intl/server";
import { Button } from "@heroui/button";
import { getPagesHomeTranslations, getTypedGlobalTranslations } from "@/utils/i18n";
const HomePage = async () => {
  const t = await getPagesHomeTranslations();
  
  return (
    <div className="text-4xl">
      <Button>{t("title")}</Button>
    </div>
  );
};

export default HomePage;
