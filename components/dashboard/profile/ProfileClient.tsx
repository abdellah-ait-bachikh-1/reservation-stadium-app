"use client";

import { useState } from "react";
import { useTypedTranslations } from "@/utils/i18n";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Spinner } from "@heroui/spinner";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Divider } from "@heroui/divider";
import {
  HiPencil,
  HiSave,
  HiX,
  HiShieldCheck,
  HiUser,
  HiLockClosed,
  HiPhone,
  HiMail,
  HiCheckCircle,
  HiExclamationCircle,
} from "react-icons/hi";
import { UserProfileData } from "@/types/profile";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CLUB";
}

interface ProfileClientProps {
  user: User;
  profileData: UserProfileData;
  locale: string;
}

export default function ProfileClient({
  user,
  profileData,
  locale,
}: ProfileClientProps) {
  const t = useTypedTranslations();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: profileData.user.name,
    email: profileData.user.email,
    phoneNumber: profileData.user.phoneNumber,
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profileData.user.name,
      email: profileData.user.email,
      phoneNumber: profileData.user.phoneNumber,
    });
    setIsEditing(false);
  };

  const handlePasswordSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to change password
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Failed to change password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
            <Spinner size="lg" color="primary" />
            <p className="text-gray-600 dark:text-gray-400">
              {t("common.loading")}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {t("pages.dashboard.profile.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t("pages.dashboard.profile.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <Button
                color="danger"
                variant="flat"
                startContent={<HiX className="w-4 h-4" />}
                onPress={handleCancel}
                isDisabled={isLoading}
              >
                {t("common.actions.cancel")}
              </Button>
              <Button
                color="primary"
                startContent={<HiSave className="w-4 h-4" />}
                onPress={handleSave}
                isLoading={isLoading}
              >
                {t("common.actions.save")}
              </Button>
            </>
          ) : (
            <Button
              color="primary"
              variant="flat"
              startContent={<HiPencil className="w-4 h-4" />}
              onPress={() => setIsEditing(true)}
            >
              {t("common.actions.edit")}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Summary */}
        <div className="lg:col-span-1">
          <Card className="shadow-sm">
            <CardBody className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar
                  src="/api/placeholder/150/150"
                  className="w-32 h-32 text-large border-4 border-white dark:border-zinc-800 shadow-lg"
                  name={user.name}
                />
                <div className="absolute bottom-0 right-0">
                  <Chip
                    color={user.role === "ADMIN" ? "primary" : "secondary"}
                    variant="shadow"
                    startContent={<HiShieldCheck className="w-3 h-3" />}
                    size="sm"
                  >
                    {user.role}
                  </Chip>
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2 mt-1">
                  <HiMail className="w-4 h-4" />
                  {user.email}
                </p>
              </div>

              <Divider className="my-2" />

              <div className="w-full space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t("pages.dashboard.profile.status")}
                  </span>
                  <Chip color="success" variant="flat" size="sm">
                    {t("common.status.active")}
                  </Chip>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t("pages.dashboard.profile.emailVerified")}
                  </span>
                  {profileData.user.emailVerifiedAt ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <HiCheckCircle className="w-4 h-4" />
                      <span className="text-sm">{t("common.yes")}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-amber-600">
                      <HiExclamationCircle className="w-4 h-4" />
                      <span className="text-sm">{t("common.no")}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t("pages.dashboard.profile.memberSince")}
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {new Date(profileData.user.createdAt).toLocaleDateString(locale)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t("pages.dashboard.profile.lastUpdated")}
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {new Date(profileData.user.updatedAt).toLocaleDateString(locale)}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Change Password Card */}
          <Card className="shadow-sm mt-6">
            <CardHeader className="flex items-center gap-2">
              <HiLockClosed className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("pages.dashboard.profile.changePassword")}
              </h3>
            </CardHeader>
            <CardBody>
              {isChangingPassword ? (
                <div className="space-y-4">
                  <Input
                    type="password"
                    label={t("pages.dashboard.profile.currentPassword")}
                    value={passwordData.currentPassword}
                    onValueChange={(value) => handlePasswordChange("currentPassword", value)}
                    isRequired
                    isDisabled={isLoading}
                  />
                  <Input
                    type="password"
                    label={t("pages.dashboard.profile.newPassword")}
                    value={passwordData.newPassword}
                    onValueChange={(value) => handlePasswordChange("newPassword", value)}
                    isRequired
                    isDisabled={isLoading}
                  />
                  <Input
                    type="password"
                    label={t("pages.dashboard.profile.confirmPassword")}
                    value={passwordData.confirmPassword}
                    onValueChange={(value) => handlePasswordChange("confirmPassword", value)}
                    isRequired
                    isDisabled={isLoading}
                  />
                  <div className="flex gap-2 pt-2">
                    <Button
                      fullWidth
                      color="danger"
                      variant="flat"
                      onPress={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      isDisabled={isLoading}
                    >
                      {t("common.actions.cancel")}
                    </Button>
                    <Button
                      fullWidth
                      color="primary"
                      onPress={handlePasswordSave}
                      isLoading={isLoading}
                    >
                      {t("common.actions.save")}
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  fullWidth
                  color="primary"
                  variant="flat"
                  startContent={<HiLockClosed className="w-4 h-4" />}
                  onPress={() => setIsChangingPassword(true)}
                  isDisabled={isLoading || isEditing}
                >
                  {t("pages.dashboard.profile.changePassword")}
                </Button>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right Column - Profile Details */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <HiUser className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("pages.dashboard.profile.personalInfo")}
                </h3>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <HiUser className="w-4 h-4" />
                      {t("pages.dashboard.profile.name")}
                    </div>
                  </label>
                  <Input
                    value={formData.name}
                    onValueChange={(value) => handleInputChange("name", value)}
                    isRequired
                    placeholder={t("pages.dashboard.profile.enterName")}
                    isDisabled={!isEditing || isLoading}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <HiMail className="w-4 h-4" />
                      {t("pages.dashboard.profile.email")}
                    </div>
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onValueChange={(value) => handleInputChange("email", value)}
                    isRequired
                    placeholder={t("pages.dashboard.profile.enterEmail")}
                    isDisabled={!isEditing || isLoading}
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <HiPhone className="w-4 h-4" />
                      {t("pages.dashboard.profile.phoneNumber")}
                    </div>
                  </label>
                  <Input
                    type="tel"
                    value={formData.phoneNumber}
                    onValueChange={(value) => handleInputChange("phoneNumber", value)}
                    placeholder={t("pages.dashboard.profile.enterPhone")}
                    isDisabled={!isEditing || isLoading}
                  />
                </div>

                {/* Read-only Language Display */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <span>🌐</span>
                      {t("pages.dashboard.profile.preferredLanguage")}
                    </div>
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <Chip color="primary" variant="flat" size="sm">
                        {profileData.user.preferredLocale}
                      </Chip>
                      <span className="text-gray-900 dark:text-white">
                        {profileData.user.preferredLocale === "EN" 
                          ? t("common.languages.en")
                          : profileData.user.preferredLocale === "FR"
                          ? t("common.languages.fr")
                          : t("common.languages.ar")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Display (Read-only) */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("pages.dashboard.profile.role")}
                </label>
                <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Chip
                      color={user.role === "ADMIN" ? "primary" : "secondary"}
                      variant="flat"
                      startContent={<HiShieldCheck className="w-3 h-3" />}
                    >
                      {user.role}
                    </Chip>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {user.role === "ADMIN" 
                        ? t("pages.dashboard.profile.adminDescription")
                        : t("pages.dashboard.profile.clubDescription")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Actions for Admins */}
              {user.role === "ADMIN" && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    {t("pages.dashboard.profile.accountActions")}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      color="warning"
                      variant="flat"
                      fullWidth
                      startContent={<HiExclamationCircle className="w-4 h-4" />}
                      onPress={() => {
                        // TODO: Implement resend verification email
                      }}
                      isDisabled={isLoading || isEditing || isChangingPassword}
                    >
                      {t("pages.dashboard.profile.resendVerification")}
                    </Button>
                    <Button
                      color="danger"
                      variant="flat"
                      fullWidth
                      startContent={<HiLockClosed className="w-4 h-4" />}
                      onPress={() => {
                        // TODO: Implement session management
                      }}
                      isDisabled={isLoading || isEditing || isChangingPassword}
                    >
                      {t("pages.dashboard.profile.manageSessions")}
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}