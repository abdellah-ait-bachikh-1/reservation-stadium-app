"use client"
import { useState, useRef } from "react"
import type React from "react"

import { Input } from "@heroui/input"
import { Textarea } from "@heroui/input"
import { Button } from "@heroui/button"
import { Card, CardBody } from "@heroui/card"
import { useTypedTranslations } from "@/utils/i18n"
import { useLocale } from "next-intl"
import { LocaleEnumType } from "@/types"
import { useFormValidation } from "@/hooks/useFormValidation"
import { validateContactFormData } from "@/lib/validations/contact"
import { BsFillSendFill } from "react-icons/bs";

interface ContactFormData {
  name: string
  email: string
  phoneNumber: string
  subject: string
  message: string
}

const ContactForm = () => {
  const t = useTypedTranslations()
  const locale = useLocale() as LocaleEnumType
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    subject: "",
    message: "",
  })
  const [isPending, setIsPending] = useState(false)

  const {
    hasError,
    getErrorMessages,
    validateField,
    markAsTouched,
    validateForm,
    setErrorsState,
    touched,
    resetValidation,
  } = useFormValidation(validateContactFormData, locale)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof ContactFormData
  ) => {
    const value = e.target.value
    const updatedFormData = { ...formData, [field]: value }

    setFormData(updatedFormData)
    validateField(field, value, updatedFormData)

    if (!touched[field]) {
      markAsTouched(field)
    }
  }

  const handleBlur = (field: keyof ContactFormData) => {
    markAsTouched(field)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const isValid = validateForm(formData)
    if (!isValid) {
      Object.keys(formData).forEach((field) => markAsTouched(field))
      return
    }

    setIsPending(true)

    // Log the form data (no backend submission)
    console.log("[Contact Form] Form Data Submitted:", {
      timestamp: new Date().toISOString(),
      locale,
      ...formData,
    })

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Reset form
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
      subject: "",
      message: "",
    })
    resetValidation()
    setIsPending(false)

    // Show success feedback
    alert(t('pages.contact.form.successMessage'))
  }

  const ErrorMessages = ({ field }: { field: keyof ContactFormData }) => {
    const errorMessages = getErrorMessages(field)

    if (!errorMessages || errorMessages.length === 0) return null

    return (
      <div className="flex flex-col gap-0.5 mt-1">
        {errorMessages.map((message, index) => (
          <p key={`${field}-error-${index}`} className="text-tiny text-danger">
            • {message}
          </p>
        ))}
      </div>
    )
  }

  return (
    <Card className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-lg">
      <CardBody className="gap-6 p-8">
        <form className="flex flex-col w-full gap-5" onSubmit={handleSubmit}>
          {/* Name and Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              variant="flat"
              color={hasError("name") ? "danger" : "default"}
              label={t('pages.contact.form.labels.fullName')}
              placeholder={t('pages.contact.form.placeholders.fullName')}
              size="lg"
              fullWidth
              value={formData.name}
              onChange={(e) => handleChange(e, "name")}
              onBlur={() => handleBlur("name")}
              isInvalid={hasError("name")}
              errorMessage={<ErrorMessages field="name" />}
              classNames={{
                input: "text-base", 
              }}
              className="rtl:text-right"
            />

            <Input
              variant="flat"
              color={hasError("email") ? "danger" : "default"}
              label={t('pages.contact.form.labels.email')}
              placeholder={t('pages.contact.form.placeholders.email')}
              type="email"
              size="lg"
              fullWidth
              value={formData.email}
              onChange={(e) => handleChange(e, "email")}
              onBlur={() => handleBlur("email")}
              isInvalid={hasError("email")}
              errorMessage={<ErrorMessages field="email" />}
              classNames={{
                input: "text-base",
              }}
                            className="rtl:text-right"

            />
          </div>

          {/* Phone Number */}
          <Input
            variant="flat"
            color={hasError("phoneNumber") ? "danger" : "default"}
            label={t('pages.contact.form.labels.phone')}
            placeholder={t('pages.contact.form.placeholders.phone')}
            type="tel"
            size="lg"
            fullWidth
            value={formData.phoneNumber}
            onChange={(e) => handleChange(e, "phoneNumber")}
            onBlur={() => handleBlur("phoneNumber")}
            isInvalid={hasError("phoneNumber")}
            errorMessage={<ErrorMessages field="phoneNumber" />}
            classNames={{
              input: "text-base",
            }}
                          className="rtl:text-right"

          />

          {/* Subject */}
          <Input
            variant="flat"
            color={hasError("subject") ? "danger" : "default"}
            label={t('pages.contact.form.labels.subject')}
            placeholder={t('pages.contact.form.placeholders.subject')}
            size="lg"
            fullWidth
            value={formData.subject}
            onChange={(e) => handleChange(e, "subject")}
            onBlur={() => handleBlur("subject")}
            isInvalid={hasError("subject")}
            errorMessage={<ErrorMessages field="subject" />}
            classNames={{
              input: "text-base",
            }}
                          className="rtl:text-right"

          />

          {/* Message */}
          <Textarea
            variant="flat"
            color={hasError("message") ? "danger" : "default"}
            label={t('pages.contact.form.labels.message')}
            placeholder={t('pages.contact.form.placeholders.message')}
            size="lg"
            fullWidth
            minRows={6}
            value={formData.message}
            onChange={(e) => handleChange(e, "message")}
            onBlur={() => handleBlur("message")}
            isInvalid={hasError("message")}
            errorMessage={<ErrorMessages field="message" />}
            classNames={{
              input: "text-base",
              inputWrapper: "min-h-[200px]",
            }}
                          className="rtl:text-right"

          />

          {/* Submit Button */}
          <Button
            color="warning"
            variant="solid"
            fullWidth
            size="lg"
            type="submit"
            isLoading={isPending}
            isDisabled={Object.keys(formData).some((field) => hasError(field))}
            className="mt-2 font-semibold text-white"
            startContent={<BsFillSendFill/>}
          >
            {t('pages.contact.form.submitButton')}
          </Button>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 text-center">
            {t('pages.contact.form.note')}
          </p>
        </form>
      </CardBody>
    </Card>
  )
}

export default ContactForm