// components/dashboard/ChangePassword.tsx
"use client";

import { useState, FormEvent } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

interface FormErrors {
  [key: string]: string[];
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (field: keyof PasswordFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const isFieldHasError = (field: string): boolean => {
    return !!errors[field] && errors[field].length > 0;
  };

  const renderErrorMessages = (field: string) => {
    if (!errors[field] || errors[field].length === 0) return null;
    
    return errors[field].map((error, index) => (
      <p key={index} className="text-red-600 dark:text-red-400 text-sm mt-1">
        - {error}
      </p>
    ));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = ["Current password is required"];
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = ["New password is required"];
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = ["Password must be at least 8 characters"];
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      newErrors.newPassword = ["Must contain at least one uppercase letter"];
    } else if (!/[a-z]/.test(formData.newPassword)) {
      newErrors.newPassword = ["Must contain at least one lowercase letter"];
    } else if (!/[0-9]/.test(formData.newPassword)) {
      newErrors.newPassword = ["Must contain at least one number"];
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = ["Please confirm your password"];
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = ["Passwords do not match"];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.log("Validation failed:", errors);
      return;
    }

    setIsLoading(true);
    try {
      console.log("Changing password with data:", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Password changed successfully");
      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
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
          label="Current Password"
          type={showPasswords.current ? "text" : "password"}
          value={formData.currentPassword}
          onValueChange={(value) => handleChange("currentPassword", value)}
          variant="bordered"
          isInvalid={isFieldHasError("currentPassword")}
          errorMessage={renderErrorMessages("currentPassword")}
          endContent={
            <button
              type="button"
              onClick={() => setShowPasswords(prev => ({...prev, current: !prev.current}))}
              className="focus:outline-none text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {showPasswords.current ? "🙈" : "👁️"}
            </button>
          }
        />

        <Input
          label="New Password"
          type={showPasswords.new ? "text" : "password"}
          value={formData.newPassword}
          onValueChange={(value) => handleChange("newPassword", value)}
          variant="bordered"
          isInvalid={isFieldHasError("newPassword")}
          errorMessage={renderErrorMessages("newPassword")}
          endContent={
            <button
              type="button"
              onClick={() => setShowPasswords(prev => ({...prev, new: !prev.new}))}
              className="focus:outline-none text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {showPasswords.new ? "🙈" : "👁️"}
            </button>
          }
        />

        <Input
          label="Confirm New Password"
          type={showPasswords.confirm ? "text" : "password"}
          value={formData.confirmPassword}
          onValueChange={(value) => handleChange("confirmPassword", value)}
          variant="bordered"
          isInvalid={isFieldHasError("confirmPassword")}
          errorMessage={renderErrorMessages("confirmPassword")}
          endContent={
            <button
              type="button"
              onClick={() => setShowPasswords(prev => ({...prev, confirm: !prev.confirm}))}
              className="focus:outline-none text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
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
          Change Password
        </Button>
      </div>

      <div className="mt-6 p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
        <p className="text-sm text-warning-800 dark:text-warning-200">
          <strong>Password Requirements:</strong>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>At least 8 characters long</li>
            <li>Contains at least one uppercase letter</li>
            <li>Contains at least one lowercase letter</li>
            <li>Contains at least one number</li>
          </ul>
        </p>
      </div>
    </form>
  );
}