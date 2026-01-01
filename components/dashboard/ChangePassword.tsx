// components/dashboard/ChangePassword.tsx
"use client";

import { useState, FormEvent } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useLocale, useTranslations } from "next-intl";
import {
  ChangePasswordCredentials,
  TLocale,
  ValidateChangePasswordCredentialsErrorResult,
} from "@/lib/types";
import { validateChangePasswordCredentials } from "@/lib/validation/change-password";
import { isFieldHasError } from "@/lib/utils";
import { FaEye } from "react-icons/fa";
import { FiEyeOff } from "react-icons/fi";

export default function ChangePassword() {
  const locale = useLocale() as TLocale;
  const t = useTranslations(
    "Pages.Dashboard.Profile.SettingsTabs.changePassword"
  );

  const [isLoading, setIsLoading] = useState(false);
     const [isPassword,setIsPassword] = useState(true)


  // Form data state
  const [formData, setFormData] = useState<ChangePasswordCredentials>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Validation errors state
  const [validationErrors, setValidationErrors] =
    useState<ValidateChangePasswordCredentialsErrorResult | null>(null);

  // Handle input changes with real-time validation
  const handleChange = (
    field: keyof ChangePasswordCredentials,
    value: string
  ) => {
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);

    // Run validation on this field
    const { validationErrors: newErrors } = validateChangePasswordCredentials(
      locale,
      updatedFormData
    );

    // Update validation errors
    setValidationErrors((prev) => {
      const merged = prev ? { ...prev } : {};

      if (!newErrors) {
        delete merged[field];
        return Object.keys(merged).length > 0 ? merged : null;
      }

      if (newErrors[field] && newErrors[field].length > 0) {
        merged[field] = newErrors[field];
      } else {
        delete merged[field];
      }

      Object.keys(newErrors).forEach((key) => {
        if (key !== field) {
          merged[key as keyof ValidateChangePasswordCredentialsErrorResult] =
            newErrors[
              key as keyof ValidateChangePasswordCredentialsErrorResult
            ] ?? [];
        }
      });

      return Object.keys(merged).length > 0 ? merged : null;
    });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Final validation
    const { validationErrors: finalErrors } = validateChangePasswordCredentials(
      locale,
      formData
    );

    if (finalErrors) {
      setValidationErrors(finalErrors);
      console.log("Validation failed:", finalErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Just log the password data (don't log actual passwords in production!)
      console.log("Changing password with data:", {
        currentPassword: "***", // Don't log real passwords
        newPassword: "***", // Don't log real passwords
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Password changed successfully");

      // Reset form on success
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setValidationErrors(null);
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const toggleVisibility = () => setIsPassword(!isPassword);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label={t("currentPassword")}
          type={isPassword? "password" : "text"}
          value={formData.currentPassword}
          onValueChange={(value) => handleChange("currentPassword", value)}
          variant="bordered"
          isInvalid={isFieldHasError(validationErrors, "currentPassword")}
          errorMessage={
            validationErrors &&
            (isFieldHasError(validationErrors, "currentPassword")
              ? validationErrors["currentPassword"]?.map((item, index) => (
                  <p key={index} className="text-sm">
                    - {item}
                  </p>
                ))
              : null)
          }
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

        <Input
          label={t("newPassword")}
          type={isPassword ? "password" : "text"}
          value={formData.newPassword}
          onValueChange={(value) => handleChange("newPassword", value)}
          variant="bordered"
          isInvalid={isFieldHasError(validationErrors, "newPassword")}
          errorMessage={
            validationErrors &&
            (isFieldHasError(validationErrors, "newPassword")
              ? validationErrors["newPassword"]?.map((item, index) => (
                  <p key={index} className="text-sm">
                    - {item}
                  </p>
                ))
              : null)
          }
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

        <Input
          label={t("confirmPassword")}
          type={isPassword? "password" : "text"}
          value={formData.confirmPassword}
          onValueChange={(value) => handleChange("confirmPassword", value)}
          variant="bordered"
          isInvalid={isFieldHasError(validationErrors, "confirmPassword")}
          errorMessage={
            validationErrors &&
            (isFieldHasError(validationErrors, "confirmPassword")
              ? validationErrors["confirmPassword"]?.map((item, index) => (
                  <p key={index} className="text-sm">
                    - {item}
                  </p>
                ))
              : null)
          }
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

      <div className="pt-4">
        <Button color="primary" type="submit" isLoading={isLoading} fullWidth>
          {t("changePassword")}
        </Button>
      </div>

      <div className="mt-6 p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
        <div className="text-sm text-warning-800 dark:text-warning-200">
          <strong>{t("passwordRequirements")}:</strong>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>{t("requirementsList.minLength")}</li>
            <li>{t("requirementsList.uppercase")}</li>
            <li>{t("requirementsList.lowercase")}</li>
            <li>{t("requirementsList.number")}</li>
          </ul>
        </div>
      </div>
    </form>
  );
}
