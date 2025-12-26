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

export default function ChangePassword() {
  const locale = useLocale() as TLocale;
  const t = useTranslations("Pages.Dashboard.Profile.SettingsTabs.changePassword");
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
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
  const handleChange = (field: keyof ChangePasswordCredentials, value: string) => {
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
            newErrors[key as keyof ValidateChangePasswordCredentialsErrorResult] ?? [];
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label={t("currentPassword")}
          type={showPasswords.current ? "text" : "password"}
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
              type="button"
              onClick={() => setShowPasswords(prev => ({...prev, current: !prev.current}))}
              className="focus:outline-none text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label={showPasswords.current ? t("hidePassword") : t("showPassword")}
            >
              {showPasswords.current ? "🙈" : "👁️"}
            </button>
          }
        />

        <Input
          label={t("newPassword")}
          type={showPasswords.new ? "text" : "password"}
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
              type="button"
              onClick={() => setShowPasswords(prev => ({...prev, new: !prev.new}))}
              className="focus:outline-none text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label={showPasswords.new ? t("hidePassword") : t("showPassword")}
            >
              {showPasswords.new ? "🙈" : "👁️"}
            </button>
          }
        />

        <Input
          label={t("confirmPassword")}
          type={showPasswords.confirm ? "text" : "password"}
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
              type="button"
              onClick={() => setShowPasswords(prev => ({...prev, confirm: !prev.confirm}))}
              className="focus:outline-none text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label={showPasswords.confirm ? t("hidePassword") : t("showPassword")}
            >
              {showPasswords.confirm ? "🙈" : "👁️"}
            </button>
          }
        />
      </div>

      <div className="pt-4">
        <Button
          color="primary"
          type="submit"
          isLoading={isLoading}
          fullWidth
        >
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