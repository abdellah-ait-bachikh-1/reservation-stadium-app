"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import {
  TLocale,
  ValidateForgotPasswordCredentialsErrorResult,
} from "@/lib/types";
import { validateForgotPasswordCredentials } from "@/lib/validation/forgot-password";
import { isFieldHasError } from "@/lib/utils";
import { resetPassword } from "@/app/actions/forgotPassword";
import { addToast } from "@heroui/toast";
import { getLocalizedSuccess } from "@/lib/api/locale";

const ForgotPasswordForm = () => {
  const t = useTranslations("Pages.ForgotPassword");
  const locale = useLocale();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [fieldsError, setFieldsError] =
    useState<ValidateForgotPasswordCredentialsErrorResult | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof formData
  ) => {
    const { value } = e.target;
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);
    const { validationErrors } = validateForgotPasswordCredentials(
      locale as TLocale,
      updatedFormData
    );
    setFieldsError((prev) => {
      const merged = prev ? { ...prev } : {};

      if (!validationErrors) return null;

      if (validationErrors[field] && validationErrors[field].length > 0) {
        merged[field] = validationErrors[field];
      } else {
        delete merged[field];
      }

      Object.keys(validationErrors).forEach((key) => {
        if (key !== field) {
          merged[key as keyof ValidateForgotPasswordCredentialsErrorResult] =
            validationErrors[
              key as keyof ValidateForgotPasswordCredentialsErrorResult
            ] ?? [];
        }
      });

      return Object.keys(merged).length > 0 ? merged : null;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { statusCode, validationErrors, error ,message} = await resetPassword(
      locale as TLocale,
      formData
    );
    if (statusCode === 400) {
      addToast({ title: t("heading"), description: error, color: "danger" });
      setFieldsError(validationErrors);
    } else if (statusCode === 500) {
      addToast({ title: t("heading"), description: error, color: "danger" });
      setFieldsError(null);
    } else if (statusCode == 200) {
      addToast({
        title: t("heading"),
        description: message,
        color:"success"
      });
      setFieldsError(null);
    }
  };

  return (
    <div className="w-full md:w-160 lg:w-150 bg-white/40 dark:bg-gray-800/50 backdrop-blur-sm p-6 md:p-10 rounded-2xl flex flex-col gap-5">
      {/* Logo & Heading */}
      <div>
        <Image
          height={100}
          width={100}
          src="/logo.png"
          alt="Logo"
          className="mx-auto h-12 w-12"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {t("heading")}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {t("description")}
        </p>
      </div>

      {/* Form */}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          {/* Email field */}
          <Input
            id="email"
            name="email"
            type="email"
            label={t("email")}
            variant="bordered"
            value={formData.email}
            onChange={(e) => handleChange(e, "email")}
            isInvalid={isFieldHasError(fieldsError, "email")}
            errorMessage={
              fieldsError &&
              (isFieldHasError(fieldsError, "email")
                ? fieldsError["email"]?.map((item) => (
                    <p key={item}>- {item}</p>
                  ))
                : null)
            }
          />
        </div>

        <div>
          <Button
            type="submit"
            color="success"
            className="font-semibold"
            fullWidth
            variant="flat"
          >
            {t("resetButton")}
          </Button>
        </div>
      </form>

      {/* Links section */}
      <div className="space-y-2 mt-4">
        {/* Back to Login Link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-500">
          {t("rememberPassword")}{" "}
          <Link
            href="/auth/login"
            className="font-medium text-gray-600 hover:text-gray-500 dark:text-gray-300"
          >
            {t("signIn")}
          </Link>
        </p>

        {/* Register link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-500">
          {t("noAccount")}{" "}
          <Link
            href="/auth/register"
            className="font-medium text-gray-600 hover:text-gray-500 dark:text-gray-300"
          >
            {t("createAccount")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
