"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

const RegisterForm = () => {
  const t = useTranslations("Pages.Register");
  const [formData, setFormData] = useState({
    fullNameAr: "",
    fullNameFr: "",
    email: "",
    password: "",
    phoneNumber: "",
    remember: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
      <form className="mt-8 space-y-6" action="#" method="POST">
        <div className="flex flex-col gap-4">
          <Input
            id="fullNameAr"
            dir="rtl"
            name="fullNameAr"
            label={t("arabicName")}
            variant="bordered"
            value={formData.fullNameAr}
            onChange={handleChange}
          />
          <Input
            id="fullNameFr"
            dir="ltr"
            name="fullNameFr"
            label={t("frenchName")}
            variant="bordered"
            value={formData.fullNameFr}
            onChange={handleChange}
          />
          <Input
            id="email"
            name="email"
            label={t("email")}
            variant="bordered"
          />
          <Input
            id="password"
            name="password"
            label={t("password")}
            variant="bordered"
            value={formData.password}
            onChange={handleChange}
          />
          <Input
            id="phoneNumber"
            name="phoneNumber"
            label={t("phone")}
            variant="bordered"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Checkbox checked={formData.remember} onChange={handleChange}>
              {t("remember")}
            </Checkbox>
          </div>
          <div className="text-sm">
            <Link
              href="#"
              className="font-medium text-gray-600 hover:text-gray-500 dark:text-gray-300"
            >
              {t("forgot")}
            </Link>
          </div>
        </div>

        <div>
          <Button
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
        {t("loginPrompt")}{" "}
        <Link
          href="/login"
          className="font-medium text-gray-600 hover:text-gray-500 dark:text-gray-300"
        >
          {t("signIn")}
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
