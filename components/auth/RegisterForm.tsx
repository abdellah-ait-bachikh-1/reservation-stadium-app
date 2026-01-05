"use client";
import { useTypedTranslations } from "@/utils/i18n";
import { Input } from "@heroui/input";
const RegisterForm = () => {
    const t = useTypedTranslations()
  return (
    <form className="flex flex-col w-full gap-2">
      <Input variant="faded" label={t('inputs.labels.name')}  />
    </form>
  );
};

export default RegisterForm;
