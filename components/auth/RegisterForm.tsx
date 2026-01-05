"use client";
import { InsertUserType } from "@/drizzle/schema";
import { Link } from "@/i18n/navigation";
import { RegisterFormData } from "@/types/register";
import { wait } from "@/utils";
import { useTypedTranslations } from "@/utils/i18n";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useLocale } from "next-intl";
import { useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterForm = () => {
  const locale = useLocale();
  const t = useTypedTranslations();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldsError, setFieldsError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const handleTogglePassword = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    inputRef: React.RefObject<HTMLInputElement>
  ) => {
    const input = inputRef.current;
    const cursorPosition = input?.selectionStart || 0;

    setter((prev) => !prev);

    setTimeout(() => {
      if (input && input.selectionStart !== null) {
        input.focus();
        input.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 10);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof RegisterFormData
  ) => {
    const updatedFormData = { ...formData, [field]: e.target.value };
    setFormData(updatedFormData);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    setIsPending(true);
    await wait();
    setIsPending(false);
  };
  return (
    <form className="flex flex-col w-full gap-2" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2">
        <Input
          variant="flat"
          color="default"
          label={t("common.inputs.labels.full_name")}
          size="sm"
          fullWidth
          value={formData.name}
          onChange={(e) => handleChange(e, "name")}
        />
        <Input
          variant="flat"
          color="default"
          label={t("common.inputs.labels.email")}
          size="sm"
          fullWidth
          value={formData.email}
          onChange={(e) => handleChange(e, "email")}
        />
      </div>

      <Input
        variant="flat"
        color="default"
        label={t("common.inputs.labels.phoneNumber")}
        size="sm"
        type="tel"
        fullWidth
        value={formData.phoneNumber}
        onChange={(e) => handleChange(e, "phoneNumber")}
      />

      {/* Password Input */}
      <Input
        ref={passwordRef}
        variant="flat"
        color="default"
        label={t("common.inputs.labels.password")}
        size="sm"
        fullWidth
        type={showPassword ? "text" : "password"}
        endContent={
          <button
            type="button"
            onClick={() =>
              handleTogglePassword(
                setShowPassword,
                passwordRef as React.RefObject<HTMLInputElement>
              )
            }
            className="focus:outline-none cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <FaEyeSlash className="w-5 h-5 text-gray-500" />
            ) : (
              <FaEye className="w-5 h-5 text-gray-500" />
            )}
          </button>
        }
        value={formData.password}
        onChange={(e) => handleChange(e, "password")}
      />

      {/* Confirm Password Input */}
      <Input
        ref={confirmPasswordRef}
        variant="flat"
        color="default"
        label={t("common.inputs.labels.confirm_password")}
        size="sm"
        fullWidth
        type={showConfirmPassword ? "text" : "password"}
        endContent={
          <button
            type="button"
            onClick={() =>
              handleTogglePassword(
                setShowConfirmPassword,
                confirmPasswordRef as React.RefObject<HTMLInputElement>
              )
            }
            className="focus:outline-none cursor-pointer"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? (
              <FaEyeSlash className="w-5 h-5 text-gray-500" />
            ) : (
              <FaEye className="w-5 h-5 text-gray-500" />
            )}
          </button>
        }
        value={formData.confirmPassword}
        onChange={(e) => handleChange(e, "confirmPassword")}
      />
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="text-xs text-default-600 ">
            <span>{t("pages.auth.register.already_have_account")}</span>
            <Link
              hrefLang={locale}
              href={"/auth/login"}
              className="font-semibold hover:font-extrabold underline"
            >
              {t("common.actions.login")}
            </Link>
          </div>

          <div className="text-xs  text-default-600">
            <span> {t("pages.auth.register.forgot_password")} </span>
            <Link
              hrefLang={locale}
              href={"/auth/login"}
              className="font-semibold hover:font-extrabold underline"
            >
              {t("common.actions.reset")}
            </Link>
          </div>
        </div>

        <Button
          color="success"
          variant="flat"
          fullWidth
          size="lg"
          type="submit"
          isLoading={isPending}
        >
          {t("common.actions.save")}
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;
