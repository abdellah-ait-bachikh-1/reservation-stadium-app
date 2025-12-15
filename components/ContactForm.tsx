"use client";

import { useState, FormEvent } from "react";
import { useTranslations } from "next-intl";
import {Input,Textarea,} from "@heroui/input"
import {Select, SelectItem} from "@heroui/select"
import {Checkbox} from "@heroui/checkbox"
import {Accordion} from "@heroui/accordion"

import { 
  FaPaperPlane,
  FaUser,
  FaUsers,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Button } from "@heroui/button";

interface ContactFormProps {
  locale: string;
}

const ContactForm = ({ locale }: ContactFormProps) => {
  const t = useTranslations("Pages.Contact");
  
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    clubTeam: "",
    subject: "generalQuestion",
    message: "",
    urgent: false,
    newsletter: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Subject options
  const subjectOptions = [
    { key: "stadiumBooking", label: t("form.fields.subject.options.stadiumBooking") },
    { key: "facilityRental", label: t("form.fields.subject.options.facilityRental") },
    { key: "partnership", label: t("form.fields.subject.options.partnership") },
    { key: "technicalIssue", label: t("form.fields.subject.options.technicalIssue") },
    { key: "generalQuestion", label: t("form.fields.subject.options.generalQuestion") },
    { key: "feedback", label: t("form.fields.subject.options.feedback") },
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t("form.fields.fullName.error");
    }
    
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("form.fields.email.error");
    }
    
    if (!formData.clubTeam.trim()) {
      newErrors.clubTeam = t("form.fields.clubTeam.error");
    }
    
    if (!formData.subject) {
      newErrors.subject = t("form.fields.subject.error");
    }
    
    if (!formData.message.trim() || formData.message.trim().length < 20) {
      newErrors.message = t("form.fields.message.error");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real app, you would send this to your backend
      console.log("Form submitted:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        clubTeam: "",
        subject: "generalQuestion",
        message: "",
        urgent: false,
        newsletter: true
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: t("form.errorMessage") });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="inline-block p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
          <FaCheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t("form.successMessage")}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Our municipal team will contact you shortly.
        </p>
        <Button
          color="success"
          variant="flat"
          onPress={() => setIsSuccess(false)}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  // Form state
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label={t("form.fields.fullName.label")}
          placeholder={t("form.fields.fullName.placeholder")}
          value={formData.fullName}
          onValueChange={(value) => handleInputChange("fullName", value)}
          isInvalid={!!errors.fullName}
          errorMessage={errors.fullName}
          startContent={<FaUser className="w-4 h-4 text-gray-400" />}
          variant="bordered"
          size="lg"
          isRequired
        />
        
        <Input
          label={t("form.fields.email.label")}
          placeholder={t("form.fields.email.placeholder")}
          type="email"
          value={formData.email}
          onValueChange={(value) => handleInputChange("email", value)}
          isInvalid={!!errors.email}
          errorMessage={errors.email}
          startContent={<MdEmail className="w-4 h-4 text-gray-400" />}
          variant="bordered"
          size="lg"
          isRequired
        />
      </div>
      
      <Input
        label={t("form.fields.clubTeam.label")}
        placeholder={t("form.fields.clubTeam.placeholder")}
        value={formData.clubTeam}
        onValueChange={(value) => handleInputChange("clubTeam", value)}
        isInvalid={!!errors.clubTeam}
        errorMessage={errors.clubTeam}
        startContent={<FaUsers className="w-4 h-4 text-gray-400" />}
        variant="bordered"
        size="lg"
        isRequired
      />
      
      <Select
        label={t("form.fields.subject.label")}
        placeholder={t("form.fields.subject.placeholder")}
        selectedKeys={[formData.subject]}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string;
          handleInputChange("subject", selected);
        }}
        isInvalid={!!errors.subject}
        errorMessage={errors.subject}
        variant="bordered"
        size="lg"
        isRequired
      >
        {subjectOptions.map((option) => (
          <SelectItem key={option.key} textValue={option.label}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
      
      <Textarea
        label={t("form.fields.message.label")}
        placeholder={t("form.fields.message.placeholder")}
        value={formData.message}
        onValueChange={(value) => handleInputChange("message", value)}
        isInvalid={!!errors.message}
        errorMessage={errors.message}
        minRows={6}
        variant="bordered"
        size="lg"
        isRequired
      />
      
      <div className="flex flex-col gap-2">
        <Checkbox
          isSelected={formData.urgent}
          onValueChange={(checked) => handleInputChange("urgent", checked)}
          color="warning"
          size="lg"
        >
          <div className="flex items-center gap-2">
            <FaExclamationTriangle className="w-4 h-4 text-amber-600" />
            <span className="font-medium">
        {t("form.urgentCheckbox")}
            </span>
          </div>
        </Checkbox>
        
     
      </div>
      
      {errors.submit && (
        <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-xl border border-red-200 dark:border-red-800">
          <p className="text-red-700 dark:text-red-400 font-medium">
            {errors.submit}
          </p>
        </div>
      )}
      
      <Button
        type="submit"
        color="primary"
        size="lg"
        className="w-full font-semibold"
        startContent={isSubmitting ? null : <FaPaperPlane className="w-5 h-5" />}
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        {isSubmitting ? t("form.submittingButton") : t("form.submitButton")}
      </Button>
    </form>
  );
};

export default ContactForm;