import TestToast from "@/components/TestToast";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { getTypedGlobalTranslations } from "@/utils/i18n";

const page = async () => {
  // throw new Error(" this is error from home page")
  const t = await getTypedGlobalTranslations();
  return (
    <div>
      <ThemeSwitcher />
      <TestToast/>
      {new Array(100)
        .fill(null)
        .map((_, i) => (
          <div key={i}> {i} </div>
        ))}
      <div>sqdnqkjsdhjk</div>
    </div>
  );
};

export default page;
