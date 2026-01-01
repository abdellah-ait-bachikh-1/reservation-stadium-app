"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LoginCredentials,
  TLocale,
  ValidateLoginCredentialsErrorResult,
} from "@/lib/types";
import { validateLoginCredentials } from "@/lib/validation/login";
import { isFieldHasError } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { getLocalizedValidationMessage } from "@/lib/validation-messages";
import { FaEye } from "react-icons/fa";
import { FiEyeOff } from "react-icons/fi";

const LoginForm = () => {
  const router = useRouter();
  const t = useTranslations("Pages.Login");
  const locale = useLocale();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    // remember: false,
  });
  const [validationErrors, setValidationErrors] =
    useState<ValidateLoginCredentialsErrorResult | null>(null);
  const [isPending, setIsPending] = useState(false);
    const [isPassword,setIsPassword] = useState(true)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof formData
  ) => {
    const { value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: type === "checkbox" ? checked : value,
    }));
    setValidationErrors(null);
  };

  // const handleCheckboxChange = (field: "remember", value: boolean) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [field]: value,
  //   }));
  // };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsPending(true);
  setValidationErrors(null);

  // 1️⃣ Client-side validation
  const { data, validationErrors } = validateLoginCredentials(
    locale as TLocale,
    formData
  );

  if (validationErrors) {
    setValidationErrors(validationErrors);
    setIsPending(false);
    return;
  }

  // 2️⃣ NextAuth sign-in
  const result = await signIn("credentials", {
    ...data,
    redirect: false,
  });

  // 3️⃣ Invalid credentials
  if (!result?.ok) {
    setValidationErrors({
      email: [
        getLocalizedValidationMessage(
          "auth.invalidCredentials",
          locale as TLocale
        ),
      ],
      password: [getLocalizedValidationMessage(
          "auth.invalidCredentials",
          locale as TLocale
        ),],
    });
    setIsPending(false);
    return;
  }

  // 4️⃣ Success
  router.push("/");
};
  const toggleVisibility = () => setIsPassword(!isPassword);

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
        {/* Add optional description */}
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

          {/* Password field */}
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
             type={isPassword ?  "password":"text" }
                        endContent={
                          <button
                            aria-label="toggle password visibility"
                            className="focus:outline-solid outline-transparent cursor-pointer"
                            type="button"
                            onClick={toggleVisibility}
                          >
                            {isPassword ? (
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

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* <Checkbox
              onChange={(e) => handleChange(e, "remember")}
              isSelected={formData.remember}
              onValueChange={(value) => handleCheckboxChange("remember", value)}
            >
              {t("remember")}
            </Checkbox> */}
          </div>
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
            {t("signIn")}
          </Button>
        </div>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-500">
        {t("noAccount")}
        <Link
          href="/auth/register"
          className="font-medium text-gray-600 hover:text-gray-500 dark:text-gray-300"
        >
          {t("register")}
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
