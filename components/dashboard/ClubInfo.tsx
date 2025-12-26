// components/dashboard/ClubInfo.tsx
"use client";

import { useState, FormEvent, useEffect } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";

interface FormErrors {
  [key: string]: string[];
}

interface ClubFormData {
  nameFr: string;
  nameAr: string;
  addressFr: string;
  addressAr: string;
  monthlyFee: string;
  paymentDueDay: string;
}

export default function ClubInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ClubFormData>({
    nameFr: "Club de Football Tan-Tan",
    nameAr: "نادي كرة القدم طانطان",
    addressFr: "Rue Mohammed V, Tan-Tan",
    addressAr: "شارع محمد الخامس، طانطان",
    monthlyFee: "1000",
    paymentDueDay: "5",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!isEditing) {
      setFormData({
        nameFr: "Club de Football Tan-Tan",
        nameAr: "نادي كرة القدم طانطان",
        addressFr: "Rue Mohammed V, Tan-Tan",
        addressAr: "شارع محمد الخامس، طانطان",
        monthlyFee: "1000",
        paymentDueDay: "5",
      });
      setErrors({});
    }
  }, [isEditing]);

  const handleChange = (field: keyof ClubFormData, value: string) => {
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

    if (!formData.nameFr.trim() || formData.nameFr.length < 2) {
      newErrors.nameFr = ["French name must be at least 2 characters"];
    }

    if (!formData.nameAr.trim() || formData.nameAr.length < 2) {
      newErrors.nameAr = ["Arabic name must be at least 2 characters"];
    }

    if (!formData.addressFr.trim() || formData.addressFr.length < 5) {
      newErrors.addressFr = ["French address must be at least 5 characters"];
    }

    if (!formData.addressAr.trim() || formData.addressAr.length < 5) {
      newErrors.addressAr = ["Arabic address must be at least 5 characters"];
    }

    const monthlyFeeNum = parseFloat(formData.monthlyFee);
    if (isNaN(monthlyFeeNum) || monthlyFeeNum <= 0) {
      newErrors.monthlyFee = ["Monthly fee must be a positive number"];
    }

    const dueDayNum = parseInt(formData.paymentDueDay, 10);
    if (isNaN(dueDayNum) || dueDayNum < 1 || dueDayNum > 31) {
      newErrors.paymentDueDay = ["Payment due day must be between 1 and 31"];
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
      console.log("Updating club info with data:", {
        ...formData,
        monthlyFee: parseFloat(formData.monthlyFee),
        paymentDueDay: parseInt(formData.paymentDueDay, 10),
      });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Club information updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating club info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Club Name (French)"
            value={formData.nameFr}
            onValueChange={(value) => handleChange("nameFr", value)}
            variant="bordered"
            isDisabled={!isEditing}
            isInvalid={isFieldHasError("nameFr")}
            errorMessage={renderErrorMessages("nameFr")}
          />
          
          <Input
            label="Club Name (Arabic)"
            value={formData.nameAr}
            onValueChange={(value) => handleChange("nameAr", value)}
            variant="bordered"
            isDisabled={!isEditing}
            isInvalid={isFieldHasError("nameAr")}
            errorMessage={renderErrorMessages("nameAr")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Address (French)"
            value={formData.addressFr}
            onValueChange={(value) => handleChange("addressFr", value)}
            variant="bordered"
            isDisabled={!isEditing}
            isInvalid={isFieldHasError("addressFr")}
            errorMessage={renderErrorMessages("addressFr")}
          />
          
          <Input
            label="Address (Arabic)"
            value={formData.addressAr}
            onValueChange={(value) => handleChange("addressAr", value)}
            variant="bordered"
            isDisabled={!isEditing}
            isInvalid={isFieldHasError("addressAr")}
            errorMessage={renderErrorMessages("addressAr")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Monthly Fee (MAD)"
            type="number"
            step="0.01"
            value={formData.monthlyFee}
            onValueChange={(value) => handleChange("monthlyFee", value)}
            variant="bordered"
            isDisabled={!isEditing}
            isInvalid={isFieldHasError("monthlyFee")}
            errorMessage={renderErrorMessages("monthlyFee")}
          />
          
          <Input
            label="Payment Due Day (1-31)"
            type="number"
            min="1"
            max="31"
            value={formData.paymentDueDay}
            onValueChange={(value) => handleChange("paymentDueDay", value)}
            variant="bordered"
            isDisabled={!isEditing}
            isInvalid={isFieldHasError("paymentDueDay")}
            errorMessage={renderErrorMessages("paymentDueDay")}
          />
        </div>

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
              Edit Club Info
            </Button>
          )}
        </div>
      </form>

      <Divider />

      <div>
        <h3 className="text-lg font-medium mb-4">Club Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Club ID</p>
            <p className="font-medium font-mono">club-12345</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Created</p>
            <p className="font-medium">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}