"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { RegisterCredentials } from "@/lib/types";

const RegisterForm = () => {
  const t = useTranslations("Pages.Register");
  const [formData, setFormData] = useState<RegisterCredentials>({
    fullNameAr: "",
    fullNameFr: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof formData
  ) => {
    const { value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: type === "checkbox" ? checked : value,
    }));
  };
 
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
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
          <Input
            id="fullNameAr"
            dir="rtl"
            name="fullNameAr"
            label={t("arabicName")}
            variant="bordered"
            value={formData.fullNameAr}
            onChange={(e) => handleChange(e, "fullNameAr")}
          />
          <Input
            id="fullNameFr"
            dir="ltr"
            name="fullNameFr"
            label={t("frenchName")}
            variant="bordered"
            value={formData.fullNameFr}
            onChange={(e) => handleChange(e, "fullNameFr")}
          />
          <Input
            id="email"
            name="email"
            label={t("email")}
            variant="bordered"
            value={formData.email}
            onChange={(e) => handleChange(e, "email")}
          />
          <Input
            id="password"
            name="password"
            label={t("password")}
            variant="bordered"
            value={formData.password}
            onChange={(e) => handleChange(e, "password")}
          />
          <Input
            id="phoneNumber"
            name="phoneNumber"
            label={t("phone")}
            variant="bordered"
            value={formData.phoneNumber}
            onChange={(e) => handleChange(e, "phoneNumber")}
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
