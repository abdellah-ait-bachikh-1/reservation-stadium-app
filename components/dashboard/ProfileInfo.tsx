// components/dashboard/ProfileInfo.tsx
"use client";

import { useState, FormEvent } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";

interface FormErrors {
  [key: string]: string[];
}

interface ProfileFormData {
  fullNameFr: string;
  fullNameAr: string;
  email: string;
  phoneNumber: string;
  preferredLocale: "EN" | "FR" | "AR";
}

export default function ProfileInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    fullNameFr: "Admin Stadium",
    fullNameAr: "مدير النظام",
    email: "admin@stadium.com",
    phoneNumber: "0612345678",
    preferredLocale: "EN",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (field: keyof ProfileFormData, value: string) => {
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

    if (!formData.fullNameFr.trim() || formData.fullNameFr.length < 2) {
      newErrors.fullNameFr = ["French name must be at least 2 characters"];
    }

    if (!formData.fullNameAr.trim() || formData.fullNameAr.length < 2) {
      newErrors.fullNameAr = ["Arabic name must be at least 2 characters"];
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = ["Please enter a valid email address"];
    }

    const phoneRegex = /^[0-9]{10,}$/;
    if (!formData.phoneNumber.trim() || !phoneRegex.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = ["Phone number must be at least 10 digits"];
    }

    if (!["EN", "FR", "AR"].includes(formData.preferredLocale)) {
      newErrors.preferredLocale = ["Please select a valid language"];
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
      console.log("Updating profile with data:", formData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
            isInvalid={isFieldHasError("fullNameFr")}
            errorMessage={renderErrorMessages("fullNameFr")}
          />
          
          <Input
            label="Full Name (Arabic)"
            value={formData.fullNameAr}
            onValueChange={(value) => handleChange("fullNameAr", value)}
            variant="bordered"
            isDisabled={!isEditing}
            isInvalid={isFieldHasError("fullNameAr")}
            errorMessage={renderErrorMessages("fullNameAr")}
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
            isInvalid={isFieldHasError("email")}
            errorMessage={renderErrorMessages("email")}
          />
          
          <Input
            label="Phone Number"
            value={formData.phoneNumber}
            onValueChange={(value) => handleChange("phoneNumber", value)}
            variant="bordered"
            isDisabled={!isEditing}
            isInvalid={isFieldHasError("phoneNumber")}
            errorMessage={renderErrorMessages("phoneNumber")}
          />
        </div>

        <Select
          label="Preferred Language"
          selectedKeys={[formData.preferredLocale]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as "EN" | "FR" | "AR";
            handleChange("preferredLocale", selected);
          }}
          variant="bordered"
          isDisabled={!isEditing}
          isInvalid={isFieldHasError("preferredLocale")}
          errorMessage={renderErrorMessages("preferredLocale")}
        >
          <SelectItem key="EN" textValue="English">
            English
          </SelectItem>
          <SelectItem key="FR" textValue="Français">
            Français
          </SelectItem>
          <SelectItem key="AR" textValue="العربية">
            العربية
          </SelectItem>
        </Select>

        <div className="flex justify-end gap-3 pt-4">
          {isEditing ? (
            <>
              <Button
                color="danger"
                variant="flat"
                onPress={() => {
                  setIsEditing(false);
                  setErrors({});
                }}
                isDisabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                isLoading={isLoading}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              color="primary"
              onPress={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Role</p>
            <p className="font-medium">ADMIN</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Account Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <p className="font-medium">Approved</p>
            </div>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Email Verified</p>
            <p className="font-medium">Yes</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Member Since</p>
            <p className="font-medium">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}