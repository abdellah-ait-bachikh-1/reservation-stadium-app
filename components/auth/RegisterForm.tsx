"use client";
import { Link } from "@/i18n/navigation";
import { RegisterFormData } from "@/types/register";
import { wait } from "@/utils";
import { useTypedTranslations } from "@/utils/i18n";
import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useLocale } from "next-intl";
import { useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { cn } from "@heroui/theme";
import { validateRegisterFormData } from "@/lib/validations/register";
import { LocaleEnumType } from "@/types";
import { useFormValidation } from "@/hooks/useFormValidation";

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
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const {
    hasError,
    getErrorMessages,
    validateField,
    markAsTouched,
    validateForm,
    touched,
  } = useFormValidation(validateRegisterFormData, locale as LocaleEnumType);

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
    const value = e.target.value;
    const updatedFormData = { ...formData, [field]: value };

    setFormData(updatedFormData);

    validateField(field, value, updatedFormData);

    if (!touched[field]) {
      markAsTouched(field);
    }
  };

  const handleBlur = (field: keyof RegisterFormData) => {
    markAsTouched(field);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate entire form before submission
    const isValid = validateForm(formData);

    if (!isValid) {
      // Mark all fields as touched to show all errors
      Object.keys(formData).forEach((field) => markAsTouched(field));
      return;
    }

    console.log(formData);
    setIsPending(true);
    await wait();
    setIsPending(false);
  };

  // Helper component to render multiple error messages
  const ErrorMessages = ({ field }: { field: keyof RegisterFormData }) => {
    const errorMessages = getErrorMessages(field);

    if (!errorMessages || errorMessages.length === 0) return null;

    return (
      <div className="flex flex-col gap-0.5 mt-1">
        {errorMessages.map((message, index) => (
          <p key={`${field}-error-${index}`} className="text-tiny text-danger">
            • {message}
          </p>
        ))}
      </div>
    );
  };

  return (
    <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
        <div className="flex-1">
          <Input
            variant="flat"
            color={hasError("name") ? "danger" : "default"}
            label={t("common.inputs.labels.full_name")}
            size="sm"
            fullWidth
            value={formData.name}
            onChange={(e) => handleChange(e, "name")}
            onBlur={() => handleBlur("name")}
            isInvalid={hasError("name")}
            errorMessage={<ErrorMessages field="name" />}
          />
        </div>

        <div className="flex-1">
          <Input
            variant="flat"
            color={hasError("email") ? "danger" : "default"}
            label={t("common.inputs.labels.email")}
            size="sm"
            fullWidth
            value={formData.email}
            onChange={(e) => handleChange(e, "email")}
            onBlur={() => handleBlur("email")}
            isInvalid={hasError("email")}
            errorMessage={<ErrorMessages field="email" />}
          />
        </div>
      </div>

      <div>
        <Input
          variant="flat"
          color={hasError("phoneNumber") ? "danger" : "default"}
          label={t("common.inputs.labels.phoneNumber")}
          size="sm"
          type="tel"
          fullWidth
          value={formData.phoneNumber}
          onChange={(e) => handleChange(e, "phoneNumber")}
          onBlur={() => handleBlur("phoneNumber")}
          isInvalid={hasError("phoneNumber")}
          errorMessage={<ErrorMessages field="phoneNumber" />}
        />
      </div>

      {/* Password Input */}
      <div>
        <Input
          ref={passwordRef}
          variant="flat"
          color={hasError("password") ? "danger" : "default"}
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
          onBlur={() => handleBlur("password")}
          isInvalid={hasError("password")}
          errorMessage={<ErrorMessages field="password" />}
        />
      </div>

      {/* Confirm Password Input */}
      <div>
        <Input
          ref={confirmPasswordRef}
          variant="flat"
          color={hasError("confirmPassword") ? "danger" : "default"}
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
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
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
          onBlur={() => handleBlur("confirmPassword")}
          isInvalid={hasError("confirmPassword")}
          errorMessage={<ErrorMessages field="confirmPassword" />}
        />
      </div>

      <Alert
        color="warning"
        variant="faded"
        classNames={{
          base: cn([
            "bg-transparent",
            "border-1 border-default-200 dark:border-default-100",
            "relative ltr:before:content-[''] ltr:before:absolute ltr:before:z-10 rtl:before:content-[''] rtl:before:absolute rtl:before:z-10 rtl:after:content-[''] rtl:after:absolute rtl:after:z-10",
            "ltr:before:left-0 ltr:before:top-[-1px] ltr:before:bottom-[-1px] ltr:before:w-1 rtl:after:right-0 rtl:after:top-[-1px] rtl:after:bottom-[-1px] rtl:after:w-1",
            "ltr:rounded-l-none ltr:border-l-0 rtl:rounded-r-none rtl:border-r-0",
            "ltr:before:bg-warning rtl:after:bg-warning",
          ]),
        }}
        hideIcon
        description={
          <div className="flex flex-col gap-1 text-xs">
            <p className="text-tiny">
              - {t("pages.auth.register.instructions.name_requirement")}
            </p>
            <p className="text-tiny">
              - {t("pages.auth.register.instructions.phone_requirement")}
            </p>
            <p className="text-tiny">
              - {t("pages.auth.register.instructions.email_requirement")}
            </p>
            <p className="text-tiny">
              - {t("pages.auth.register.instructions.verification_process")}
            </p>
          </div>
        }
      />

      <div className="flex items-center justify-between">
        <div className="text-xs text-default-600 ">
          <span>{t("pages.auth.register.already_have_account")}</span>
          <Link
            hrefLang={locale}
            href={"/auth/login"}
            className="font-semibold hover:font-extrabold underline ml-1"
          >
            {t("common.actions.login")}
          </Link>
        </div>

        <div className="text-xs text-default-600">
          <span> {t("pages.auth.register.forgot_password")} </span>
          <Link
            hrefLang={locale}
            href={"/auth/login"}
            className="font-semibold hover:font-extrabold underline ml-1"
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
        isDisabled={Object.keys(formData).some((field) => hasError(field))}
      >
        {t("common.actions.save")}
      </Button>
    </form>
  );
};

export default RegisterForm;
