"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import {
  RegisterCredentials,
  TLocale,
  ValidateRegisterCredentialsErrorResult,
} from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { validateRegisterCredentials } from "@/lib/validation/register";
import { isFieldHasError } from "@/lib/utils";
import { FaEye } from "react-icons/fa";
import { FiEyeOff } from "react-icons/fi";

const RegisterForm = () => {
  const t = useTranslations("Pages.Register");
  const locale = useLocale();
  const { isPending, register, validationErrors, setValidationErrors } =
    useAuth();

  const [formData, setFormData] = useState<RegisterCredentials>({
    fullNameAr: "",
    fullNameFr: "",
    email: "",
    password: "",
    phoneNumber: "",
    confirmPassword: "",
  });
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);

  const toggleVisibility = () => setIsVisiblePassword(!isVisiblePassword);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof formData
  ) => {
    const { value } = e.target;
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);
    const { validationErrors: newErrors } = validateRegisterCredentials(
      locale as TLocale,
      updatedFormData
    );

    setValidationErrors((prev) => {
      const merged = prev ? { ...prev } : {};

      if (!newErrors) return null;

      if (newErrors[field] && newErrors[field].length > 0) {
        merged[field] = newErrors[field];
      } else {
        delete merged[field];
      }

      Object.keys(newErrors).forEach((key) => {
        if (key !== field) {
          merged[key as keyof ValidateRegisterCredentialsErrorResult] =
            newErrors[key as keyof ValidateRegisterCredentialsErrorResult] ??
            [];
        }
      });

      return Object.keys(merged).length > 0 ? merged : null;
    });
  };
  console.log(validationErrors);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(formData);
    await register(formData);
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
      </div>

      {/* Form */}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-3">
            <Input
              id="fullNameAr"
              dir="rtl"
              name="fullNameAr"
              label={t("arabicName")}
              variant="bordered"
              value={formData.fullNameAr}
              onChange={(e) => handleChange(e, "fullNameAr")}
              isInvalid={isFieldHasError(validationErrors, "fullNameAr")}
              errorMessage={
                validationErrors &&
                (isFieldHasError(validationErrors, "fullNameAr")
                  ? validationErrors["fullNameAr"]?.map((item) => (
                      <p key={item}>- {item}</p>
                    ))
                  : null)
              }
            />
            <Input
              id="fullNameFr"
              dir="ltr"
              name="fullNameFr"
              label={t("frenchName")}
              variant="bordered"
              value={formData.fullNameFr}
              onChange={(e) => handleChange(e, "fullNameFr")}
              isInvalid={isFieldHasError(validationErrors, "fullNameFr")}
              errorMessage={
                validationErrors &&
                (isFieldHasError(validationErrors, "fullNameFr")
                  ? validationErrors["fullNameFr"]?.map((item) => (
                      <p key={item}>- {item}</p>
                    ))
                  : null)
              }
            />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-3">
            <Input
              id="email"
              name="email"
              label={t("email")}
              variant="bordered"
              value={formData.email}
              onChange={(e) => handleChange(e, "email")}
              fullWidth
              isInvalid={isFieldHasError(validationErrors, "email")}
              errorMessage={
                validationErrors &&
                (isFieldHasError(validationErrors, "email")
                  ? validationErrors["email"]?.map((item) => (
                      <p key={item}>- {item}</p>
                    ))
                  : null)
              }
            />
            <Input
              id="phoneNumber"
              name="phoneNumber"
              label={t("phone")}
              variant="bordered"
              value={formData.phoneNumber}
              onChange={(e) => handleChange(e, "phoneNumber")}
              isInvalid={isFieldHasError(validationErrors, "phoneNumber")}
              errorMessage={
                validationErrors &&
                (isFieldHasError(validationErrors, "phoneNumber")
                  ? validationErrors["phoneNumber"]?.map((item) => (
                      <p key={item}>- {item}</p>
                    ))
                  : null)
              }
            />
          </div>
          <Input
            id="password"
            name="password"
            label={t("password")}
            variant="bordered"
            value={formData.password}
            onChange={(e) => handleChange(e, "password")}
            isInvalid={isFieldHasError(validationErrors, "password")}
            errorMessage={
              validationErrors &&
              (isFieldHasError(validationErrors, "password")
                ? validationErrors["password"]?.map((item) => (
                    <p key={item}>- {item}</p>
                  ))
                : null)
            }
            type={isVisiblePassword ? "text" : "password"}
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-solid outline-transparent cursor-pointer"
                type="button"
                onClick={toggleVisibility}
              >
                {!isVisiblePassword ? (
                  <FaEye
                    size={18}
                    className="text-2xl text-default-400 pointer-events-none"
                  />
                ) : (
                  <FiEyeOff
                    size={18}
                    className="text-2xl text-default-400 pointer-events-none"
                  />
                )}
              </button>
            }
          />{" "}
          <Input
            id="confirmPassword"
            name="confirmPassword"
            label={t("confirmPassword")}
            variant="bordered"
            value={formData.confirmPassword}
            onChange={(e) => handleChange(e, "confirmPassword")}
            isInvalid={isFieldHasError(validationErrors, "confirmPassword")}
            errorMessage={
              validationErrors &&
              (isFieldHasError(validationErrors, "confirmPassword")
                ? validationErrors["confirmPassword"]?.map((item) => (
                    <p key={item}>- {item}</p>
                  ))
                : null)
            }
            type={isVisiblePassword ? "text" : "password"}
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-solid outline-transparent cursor-pointer"
                type="button"
                onClick={toggleVisibility}
              >
                {!isVisiblePassword ? (
                  <FaEye
                    size={18}
                    className="text-2xl text-default-400 pointer-events-none"
                  />
                ) : (
                  <FiEyeOff
                    size={18}
                    className="text-2xl text-default-400 pointer-events-none"
                  />
                )}
              </button>
            }
          />
        </div>

        <div className="flex items-center justify-end">
          <div className="text-sm">
            <Link
              href="/auth/forgot-password"
              className="font-medium text-gray-600 hover:text-gray-500 dark:text-gray-300"
            >
              {t("forgot")}
            </Link>
          </div>
        </div>

        <div>
          <Button
            type="submit"
            color="success"
            className="font-semibold"
            fullWidth
            variant="flat"
            isLoading={isPending}
          >
            {t("register")}
          </Button>
        </div>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-500">
        {t("loginPrompt")}
        <Link
          href="/auth/login"
          className="font-medium text-gray-600 hover:text-gray-500 dark:text-gray-300"
        >
          {t("signIn")}
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
