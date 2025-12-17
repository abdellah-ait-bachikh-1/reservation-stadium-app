"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

const LoginForm = () => {
  // Changed from "Pages.Register" to "Pages.Login"
  const t = useTranslations("Pages.Login");
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
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
  
  const handleCheckboxChange = (field: "remember", value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login Data:", formData);
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
            required
          />
          
          {/* Password field */}
          <Input
            id="password"
            name="password"
            type="password"
            label={t("password")}
            variant="bordered"
            value={formData.password}
            onChange={(e) => handleChange(e, "password")}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Checkbox
              onChange={(e) => handleChange(e, "remember")}
              isSelected={formData.remember}
              onValueChange={(value) => handleCheckboxChange("remember", value)}
            >
              {t("remember")}
            </Checkbox>
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
          >
            {t("signIn")}
          </Button>
        </div>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-500">
        {t("noAccount")}
        <Link
          href="/register"
          className="font-medium text-gray-600 hover:text-gray-500 dark:text-gray-300"
        >
          {t("register")}
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;