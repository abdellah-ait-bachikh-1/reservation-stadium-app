"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

const ForgotPasswordForm = () => {
  const t = useTranslations("Pages.ForgotPassword");

  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof formData
  ) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Forget Password Data:", formData);
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
            required
            placeholder="user@example.com"
          />
        </div>

        <div>
          <Button
            type="submit"
            color="warning"
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
