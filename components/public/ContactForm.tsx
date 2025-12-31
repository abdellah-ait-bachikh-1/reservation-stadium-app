"use client";

import { useState, FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { FaPaperPlane, FaUser, FaUsers } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import {
  ContactFormData,
  validateContactFormData,
} from "@/lib/validation/contact";
import { TLocale } from "@/lib/types";

interface ContactFormProps {
  locale: string;
}

interface FormErrors {
  [key: string]: string[];
}

const ContactForm = ({ locale }: ContactFormProps) => {
  const t = useTranslations("Pages.Contact");
  const tCommon = useTranslations("Common");

  // Form state (without checkbox fields)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    clubTeam: "",
    subject: "generalQuestion",
    message: "",
    locale: locale,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Subject options
  const subjectOptions = [
    {
      key: "stadiumBooking",
      label: t("form.fields.subject.options.stadiumBooking"),
    },
    {
      key: "facilityRental",
      label: t("form.fields.subject.options.facilityRental"),
    },
    { key: "partnership", label: t("form.fields.subject.options.partnership") },
    {
      key: "technicalIssue",
      label: t("form.fields.subject.options.technicalIssue"),
    },
    {
      key: "generalQuestion",
      label: t("form.fields.subject.options.generalQuestion"),
    },
    { key: "feedback", label: t("form.fields.subject.options.feedback") },
  ];

  const handleChange = (field: string, value: string) => {
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);

    // Real-time validation
    const { validationErrors: newErrors } = validateContactFormData(
      locale as TLocale,
      updatedFormData as ContactFormData
    );

    setErrors((prev) => {
      const merged = prev ? { ...prev } : {};

      if (!newErrors) return {};

      // Update errors for the changed field
      if (newErrors[field] && newErrors[field].length > 0) {
        merged[field] = newErrors[field];
      } else {
        delete merged[field];
      }

      // Keep other field errors
      Object.keys(newErrors).forEach((key) => {
        if (key !== field) {
          merged[key as string] = newErrors[key as string] ?? [];
        }
      });

      return Object.keys(merged).length > 0 ? merged : {};
    });
  };

  // Helper to check if field has error
  const isFieldHasError = (field: string): boolean => {
    return !!errors[field] && errors[field].length > 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors (400)
        if (response.status === 400) {
          setErrors(data.validationErrors || {});
          addToast({
            color: "danger",
            title: t("form.errorTitle") || "Validation Error",
            description:
              t("form.checkFieldsMessage") || "Please check the form fields",
          });
          return;
        }

        // Handle other errors
        addToast({
          color: "danger",
          title: tCommon("errorTitle") || "Error",
          description:
            data.message || tCommon("errorMessage") || "Something went wrong",
        });
        return;
      }

      // Success (201)
      addToast({
        color: "success",
        title: t("form.successMessage") || "Success",
        description:
          t("form.successDescription") ||
          "Your message has been sent successfully",
        timeout: 5000,
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        clubTeam: "",
        subject: "generalQuestion",
        message: "",
        locale: locale,
      });
      setErrors({});
    } catch (error) {
      console.error("Form submission error:", error);
      addToast({
        color: "danger",
        title: tCommon("errorTitle") || "Error",
        description: tCommon("errorMessage") || "Failed to submit the form",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to render error messages
  const renderErrorMessages = (field: string) => {
    if (!errors[field] || errors[field].length === 0) return null;

    return errors[field].map((error, index) => (
      <p key={index} className="text-red-600 dark:text-red-400 text-sm mt-1">
        - {error}
      </p>
    ));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            label={t("form.fields.fullName.label")}
            placeholder={t("form.fields.fullName.placeholder")}
            value={formData.fullName}
            onValueChange={(value) => handleChange("fullName", value)}
            isInvalid={isFieldHasError("fullName")}
            errorMessage={renderErrorMessages("fullName")}
            startContent={<FaUser className="w-4 h-4 text-gray-400" />}
            variant="bordered"
            size="lg"
            isRequired
          />
        </div>

        <div>
          <Input
            label={t("form.fields.email.label")}
            placeholder={t("form.fields.email.placeholder")}
            type="email"
            value={formData.email}
            onValueChange={(value) => handleChange("email", value)}
            isInvalid={isFieldHasError("email")}
            errorMessage={renderErrorMessages("email")}
            startContent={<MdEmail className="w-4 h-4 text-gray-400" />}
            variant="bordered"
            size="lg"
            isRequired
          />
        </div>
      </div>

      <div>
        <Input
          label={t("form.fields.clubTeam.label")}
          placeholder={t("form.fields.clubTeam.placeholder")}
          value={formData.clubTeam}
          onValueChange={(value) => handleChange("clubTeam", value)}
          isInvalid={isFieldHasError("clubTeam")}
          errorMessage={renderErrorMessages("clubTeam")}
          startContent={<FaUsers className="w-4 h-4 text-gray-400" />}
          variant="bordered"
          size="lg"
          isRequired
        />
      </div>

      <div>
        <Select
          label={t("form.fields.subject.label")}
          placeholder={t("form.fields.subject.placeholder")}
          selectedKeys={[formData.subject]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            handleChange("subject", selected);
          }}
          isInvalid={isFieldHasError("subject")}
          errorMessage={renderErrorMessages("subject")}
          variant="bordered"
          size="lg"
          isRequired
          classNames={{
            listboxWrapper: "dark:bg-slate-900",
            popoverContent: "dark:bg-slate-900",
          }}
        >
          {subjectOptions.map((option) => (
            <SelectItem key={option.key} textValue={option.label}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div>
        <Textarea
          label={t("form.fields.message.label")}
          placeholder={t("form.fields.message.placeholder")}
          value={formData.message}
          onValueChange={(value) => handleChange("message", value)}
          isInvalid={isFieldHasError("message")}
          errorMessage={renderErrorMessages("message")}
          minRows={6}
          variant="bordered"
          size="lg"
          isRequired
        />
      </div>

      {/* Display form-level errors */}
      {errors.form && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          {errors.form.map((error, index) => (
            <p key={index} className="text-red-600 dark:text-red-400 text-sm">
              {error}
            </p>
          ))}
        </div>
      )}

      <Button
        type="submit"
        color="primary"
        size="lg"
        className="w-full font-semibold"
        startContent={
          isSubmitting ? null : <FaPaperPlane className="w-5 h-5" />
        }
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        {isSubmitting ? t("form.submittingButton") : t("form.submitButton")}
      </Button>
    </form>
  );
};

export default ContactForm;
