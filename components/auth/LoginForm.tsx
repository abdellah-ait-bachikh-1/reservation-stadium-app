"use client";
import { Link, useRouter } from "@/i18n/navigation";
import { LoginFormData } from "@/types/auth";
import { useTypedTranslations } from "@/utils/i18n";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useLocale } from "next-intl";
import { useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { validateLoginFormData } from "@/lib/validations/login";
import { LocaleEnumType } from "@/types";
import { useFormValidation } from "@/hooks/useFormValidation";
import { addToast } from "@heroui/toast";
import { signIn } from "next-auth/react";
import { getLocalizedValidationMessage } from "@/utils/validation";
const LoginForm = () => {
  const locale = useLocale();
  const t = useTypedTranslations();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const {
    hasError,
    getErrorMessages,
    validateField,
    markAsTouched,
    validateForm,
    setErrorsState,
    touched,
    errors,
    isBackendValidationError,
    setIsBackendValidationError,
  } = useFormValidation(validateLoginFormData, locale as LocaleEnumType);

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
    field: keyof LoginFormData
  ) => {
    const value = e.target.value;
    const updatedFormData = { ...formData, [field]: value };

    setFormData(updatedFormData);

    if (isBackendValidationError) {
      setErrorsState({});
      setIsBackendValidationError(false);
    }

    validateField(field, value, updatedFormData);

    if (!touched[field]) {
      markAsTouched(field);
    }
  };

  const handleBlur = (field: keyof LoginFormData) => {
    markAsTouched(field);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateForm(formData);

    if (!isValid) {
      Object.keys(formData).forEach((field) => markAsTouched(field));
      return;
    }

    setIsPending(true);
    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });
    if (!result?.ok) {
      setErrorsState({
        email: [
          getLocalizedValidationMessage(
            "auth.invalidCredentials",
            locale as LocaleEnumType
          ),
        ],
        password: [
          getLocalizedValidationMessage(
            "auth.invalidCredentials",
            locale as LocaleEnumType
          ),
        ],
      });
      setIsBackendValidationError(true);

      addToast({
        color: "danger",
        title: t("pages.auth.login.metadata.title"),
        description: t("common.toast.error.loginFailed"),
      });
    } else if (result?.ok) {
      setFormData({
        email: "",
        password: "",
      });
      setErrorsState({});
      router.push("/");
      addToast({
        color: "success",
        title: t("pages.auth.login.metadata.title"),
        description: t("common.toast.success.loggedIn"),
      });

    }
    setIsPending(false);
  };

  const ErrorMessages = ({ field }: { field: keyof LoginFormData }) => {
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

      <div className="flex items-center justify-between">
        <div className="text-xs text-default-600 ">
          <span>{t("pages.auth.login.dont_have_account")}</span>
          <Link
            hrefLang={locale}
            href={"/auth/register"}
            className="font-semibold hover:font-extrabold underline ml-1"
          >
            {t("common.actions.register")}
          </Link>
        </div>

        <div className="text-xs text-default-600">
          <span> {t("pages.auth.login.forgot_password")} </span>
          <Link
            hrefLang={locale}
            href={"/auth/forgot-password"}
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

export default LoginForm;
