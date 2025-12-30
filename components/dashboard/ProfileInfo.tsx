// components/dashboard/ProfileInfo.tsx
"use client";

import { useState, FormEvent, useEffect } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { useLocale, useTranslations } from "next-intl";
import {
  UserProfileCredentials,
  TLocale,
  ValidateUserProfileCredentialsErrorResult,
} from "@/lib/types";
import { validateUserProfileCredentials } from "@/lib/validation/profile";
import { isFieldHasError } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { UserProfile } from "./SettingsTabs";
import { addToast } from "@heroui/toast";
// import { UserProfile } from "@/app/[locale]/(admin)/dashboard/profile/[id]/page";

export default function ProfileInfo({ user }: { user: UserProfile }) {
  const locale = useLocale() as TLocale;
  const t = useTranslations("Pages.Dashboard.Profile.SettingsTabs.profileInfo");

  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Form data state
  const [formData, setFormData] = useState<UserProfileCredentials>({
    fullNameFr: user.fullNameFr,
    fullNameAr: user.fullNameAr,
    email: user.email,
    phoneNumber: user.phoneNumber,
    preferredLocale: user.preferredLocale,
  });

  // Validation errors state
  const [validationErrors, setValidationErrors] =
    useState<ValidateUserProfileCredentialsErrorResult | null>(null);

  // Handle input changes with real-time validation
  const handleChange = (field: keyof UserProfileCredentials, value: string) => {
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);

    // Run validation on this field
    const { validationErrors: newErrors } = validateUserProfileCredentials(
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
          merged[key as keyof ValidateUserProfileCredentialsErrorResult] =
            newErrors[key as keyof ValidateUserProfileCredentialsErrorResult] ??
            [];
        }
      });

      return Object.keys(merged).length > 0 ? merged : null;
    });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Final validation
    const { validationErrors: finalErrors } = validateUserProfileCredentials(
      locale,
      formData
    );

    if (finalErrors) {
      setValidationErrors(finalErrors);
      console.log("Validation failed:", finalErrors);
      return;
    }

    setIsPending(true);
    try {
      console.log("Submitting profile data:", formData);

      // Update API call

      const response = await fetch("/api/dashboard/profile/info", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      console.log(responseData);
      if (response.status === 400) {
        setValidationErrors(responseData.validationErrors);
        addToast({
          title: "",
          description: responseData.message,
          color: "danger",
        });
        // Refresh session if needed
        // await updateSession();
      } else if (response.status === 200) {
        addToast({
          title: "dsdsds",
          description: responseData.message,
          color: "success",
        });
      } else {
        const error = await response.json();
        console.error("Failed to update profile:", error);
        // Handle API errors here
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsPending(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValidationErrors(null);

    // Reset form to original user data
    if (user) {
      setFormData({
        fullNameFr: user.fullNameFr || "",
        fullNameAr: user.fullNameAr || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        preferredLocale: user.preferredLocale || locale || "en",
      });
    }
  };

  // Loading skeleton

  // Not authenticated
  // Not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 dark:text-gray-400">{t("signInPrompt")}</p>
      </div>
    );
  }
console.log({user})
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t("fullNameFr")}
            value={formData.fullNameFr}
            onValueChange={(value) => handleChange("fullNameFr", value)}
            variant="bordered"
            isDisabled={!isEditing}
            isInvalid={isFieldHasError(validationErrors, "fullNameFr")}
            errorMessage={
              validationErrors &&
              (isFieldHasError(validationErrors, "fullNameFr")
                ? validationErrors["fullNameFr"]?.map((item, index) => (
                    <p key={index} className="text-sm">
                      - {item}
                    </p>
                  ))
                : null)
            }
          />

          <Input
            label={t("fullNameAr")}
            value={formData.fullNameAr}
            onValueChange={(value) => handleChange("fullNameAr", value)}
            variant="bordered"
            isDisabled={!isEditing}
            isInvalid={isFieldHasError(validationErrors, "fullNameAr")}
            errorMessage={
              validationErrors &&
              (isFieldHasError(validationErrors, "fullNameAr")
                ? validationErrors["fullNameAr"]?.map((item, index) => (
                    <p key={index} className="text-sm">
                      - {item}
                    </p>
                  ))
                : null)
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t("email")}
            type="email"
            value={formData.email}
            onValueChange={(value) => handleChange("email", value)}
            variant="bordered"
            isDisabled={!isEditing}
            isInvalid={isFieldHasError(validationErrors, "email")}
            errorMessage={
              validationErrors &&
              (isFieldHasError(validationErrors, "email")
                ? validationErrors["email"]?.map((item, index) => (
                    <p key={index} className="text-sm">
                      - {item}
                    </p>
                  ))
                : null)
            }
          />

          <Input
            label={t("phoneNumber")}
            value={formData.phoneNumber}
            onValueChange={(value) => handleChange("phoneNumber", value)}
            variant="bordered"
            isDisabled={!isEditing}
            isInvalid={isFieldHasError(validationErrors, "phoneNumber")}
            errorMessage={
              validationErrors &&
              (isFieldHasError(validationErrors, "phoneNumber")
                ? validationErrors["phoneNumber"]?.map((item, index) => (
                    <p key={index} className="text-sm">
                      - {item}
                    </p>
                  ))
                : null)
            }
          />
        </div>

        <Select
          label={t("preferredLocale")}
          selectedKeys={[formData.preferredLocale]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as TLocale;
            handleChange("preferredLocale", selected);
          }}
          variant="bordered"
          isDisabled={!isEditing}
          isInvalid={isFieldHasError(validationErrors, "preferredLocale")}
          errorMessage={
            validationErrors &&
            (isFieldHasError(validationErrors, "preferredLocale")
              ? validationErrors["preferredLocale"]?.map((item, index) => (
                  <p key={index} className="text-sm">
                    - {item}
                  </p>
                ))
              : null)
          }
        >
          <SelectItem key="EN" textValue="English">
            {t("language.en")}
          </SelectItem>
          <SelectItem key="FR" textValue="Français">
            {t("language.fr")}
          </SelectItem>
          <SelectItem key="AR" textValue="العربية">
            {t("language.ar")}
          </SelectItem>
        </Select>

        <div className="flex justify-end gap-3 pt-4">
          {isEditing ? (
            <>
              <Button
                color="danger"
                variant="flat"
                onPress={handleCancel}
                isDisabled={isPending}
              >
                {t("cancel")}
              </Button>
              <Button color="primary" type="submit" isLoading={isPending}>
                {t("saveChanges")}
              </Button>
            </>
          ) : (
            <Button
              color="primary"
              onPress={() => setIsEditing(true)}
              isDisabled={isPending}
            >
              {t("editProfile")}
            </Button>
          )}
        </div>
      </form>

      {user && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4">
            {t("accountInformation")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">{t("role")}</p>
              <p className="font-medium">
                {" "}
                {t(`roles.${user.role}` as any) || user.role || "USER"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">
                {t("accountStatus")}
              </p>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    user.approved ? "bg-success" : "bg-warning"
                  }`}
                />
                <p className="font-medium">
                  {user.approved ? t("approved") : t("pending")}
                </p>
              </div>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">
                {t("emailVerified")}
              </p>
              <p className="font-medium">
                {user.emailVerifiedAt ? t("yes") : t("no")}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">
                {t("memberSince")}
              </p>
              <p className="font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            {user.club && (
              <>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    {t("clubNameFr")}
                  </p>
                  <p className="font-medium">{user.club.nameFr}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    {t("clubNameAr")}
                  </p>
                  <p className="font-medium">{user.club.nameAr}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
