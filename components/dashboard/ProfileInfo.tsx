// components/dashboard/ProfileInfo.tsx
"use client";

import { useState, FormEvent, useEffect } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Skeleton } from "@heroui/skeleton";
import { useLocale, useTranslations } from "next-intl";
import {
  UserProfileCredentials,
  TLocale,
  ValidateUserProfileCredentialsErrorResult,
} from "@/lib/types";
import { validateUserProfileCredentials } from "@/lib/validation/profile";
import { isFieldHasError } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface ApiUser {
  fullNameFr: string;
  fullNameAr: string;
  email: string;
  phoneNumber: string;
  preferredLocale: TLocale;
  id: string;
  role: string;
  club: {
    id: string;
    nameAr: string;
    nameFr: string;
  } | null;
  approved: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
}

export default function ProfileInfo() {
  const locale = useLocale() as TLocale;
  const t = useTranslations("Pages.Dashboard.Profile.SettingsTabs.profileInfo");

  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [userData, setUserData] = useState<ApiUser | null>(null);

  // Form data state
  const [formData, setFormData] = useState<UserProfileCredentials>({
    fullNameFr: "",
    fullNameAr: "",
    email: "",
    phoneNumber: "",
    preferredLocale: locale || "en",
  });

  // Validation errors state
  const [validationErrors, setValidationErrors] =
    useState<ValidateUserProfileCredentialsErrorResult | null>(null);

  // Fetch user data on component mount
  useEffect(() => {
    if (status === "authenticated") {
      fetchUserData();
    }
  }, [status]);

  const fetchUserData = async () => {
    try {
      setIsFetching(true);
      const response = await fetch("/api/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const user: ApiUser = await response.json();
        setUserData(user);

        // Populate form data with user data
        setFormData({
          fullNameFr: user.fullNameFr || "",
          fullNameAr: user.fullNameAr || "",
          email: user.email || "",
          phoneNumber: user.phoneNumber || "",
          preferredLocale: user.preferredLocale.toLowerCase() as TLocale,
        });
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsFetching(false);
    }
  };

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

    setIsLoading(true);
    try {
      console.log("Submitting profile data:", formData);

      // Update API call
      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserData(updatedUser);
        console.log("Profile updated successfully");
        setIsEditing(false);
        setValidationErrors(null);

        // Refresh session if needed
        // await updateSession();
      } else {
        const error = await response.json();
        console.error("Failed to update profile:", error);
        // Handle API errors here
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValidationErrors(null);

    // Reset form to original user data
    if (userData) {
      setFormData({
        fullNameFr: userData.fullNameFr || "",
        fullNameAr: userData.fullNameAr || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
        preferredLocale: userData.preferredLocale || locale || "en",
      });
    }
  };

  // Loading skeleton
  if (isFetching) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-14 rounded-lg" />
          <Skeleton className="h-14 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-14 rounded-lg" />
          <Skeleton className="h-14 rounded-lg" />
        </div>
        <Skeleton className="h-14 rounded-lg" />
        <div className="flex justify-end gap-3 pt-4">
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 dark:text-gray-400">
          Please sign in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name (French)"
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
            label="Full Name (Arabic)"
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
            label="Email"
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
            label="Phone Number"
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
          label="Preferred Language"
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
          <SelectItem key="en" textValue="English">
            English
          </SelectItem>
          <SelectItem key="fr" textValue="Français">
            Français
          </SelectItem>
          <SelectItem key="ar" textValue="العربية">
            العربية
          </SelectItem>
        </Select>

        <div className="flex justify-end gap-3 pt-4">
          {isEditing ? (
            <>
              <Button
                color="danger"
                variant="flat"
                onPress={handleCancel}
                isDisabled={isLoading}
              >
                Cancel
              </Button>
              <Button color="primary" type="submit" isLoading={isLoading}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              color="primary"
              onPress={() => setIsEditing(true)}
              isDisabled={isFetching}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </form>

      {userData && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Role</p>
              <p className="font-medium">{userData.role || "USER"}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Account Status</p>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    userData.approved ? "bg-success" : "bg-warning"
                  }`}
                />
                <p className="font-medium">
                  {userData.approved ? "Approved" : "Pending"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Email Verified</p>
              <p className="font-medium">
                {userData.emailVerifiedAt ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Member Since</p>
              <p className="font-medium">
                {new Date(userData.createdAt).toLocaleDateString()}
              </p>
            </div>
            {userData.club && (
              <>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Club Name (Fr)
                  </p>
                  <p className="font-medium">{userData.club.nameFr}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Club Name (Ar)
                  </p>
                  <p className="font-medium">{userData.club.nameAr}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
