import { getTranslations } from "next-intl/server";
import { Button } from "@heroui/button";
const HomePage = async () => {
  const t = await getTranslations("pages.home");
  return (
    <div className="text-4xl">
      <Button>{t("title")}</Button>
    </div>
  );
};

export default HomePage;
