import ThemeSwitcher from "@/components/ThemeSwitcher";
import { getTypedGlobalTranslations } from "@/utils/i18n";

const page = async () => {
  // throw new Error(" this is error from home page")
  const t = await getTypedGlobalTranslations();
  return <div>
    <ThemeSwitcher/>
  </div>;
};

export default page;
