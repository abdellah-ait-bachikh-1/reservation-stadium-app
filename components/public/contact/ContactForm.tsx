"use client"
import { useState } from "react"
import type React from "react"

import { Input } from "@heroui/input"
import { Textarea } from "@heroui/input"
import { Button } from "@heroui/button"
import { Card, CardBody } from "@heroui/card"
import { useLocale } from "next-intl"

interface ContactFormData {
  name: string
  email: string
  phoneNumber: string
  subject: string
  message: string
}

const ContactForm = () => {
  const locale = useLocale()
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    subject: "",
    message: "",
  })
  const [isPending, setIsPending] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof ContactFormData) => {
    const value = e.target.value
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleBlur = (field: keyof ContactFormData) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all fields as touched
    Object.keys(formData).forEach((field) => {
      setTouched((prev) => ({
        ...prev,
        [field]: true,
      }))
    })

    setIsPending(true)

    console.log("[Contact Form] Form Data Submitted:", {
      timestamp: new Date().toISOString(),
      locale,
      ...formData,
    })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Reset form
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
      subject: "",
      message: "",
    })
    setTouched({})
    setIsPending(false)

    // Show success feedback
    alert("Thank you for your message! We will get back to you soon. (Form data logged to console)")
  }

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const hasError = (field: keyof ContactFormData): boolean => {
    if (!touched[field]) return false

    if (!formData[field]) return true

    if (field === "email") {
      return !isValidEmail(formData[field])
    }

    if (field === "phoneNumber") {
      const phoneRegex = /^[\d\s\-+$$$$]{7,}$/
      return !phoneRegex.test(formData[field])
    }

    return false
  }

  const isFormValid = Object.keys(formData).every((field) => formData[field as keyof ContactFormData].trim() !== "")

  return (
    <Card className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-lg">
      <CardBody className="gap-6 p-8">
        <form className="flex flex-col w-full gap-5" onSubmit={handleSubmit}>
          {/* Name and Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              variant="flat"
              color={hasError("name") ? "danger" : "default"}
              label="Full Name"
              placeholder="Your full name"
              size="lg"
              fullWidth
              value={formData.name}
              onChange={(e) => handleChange(e, "name")}
              onBlur={() => handleBlur("name")}
              isInvalid={hasError("name")}
              errorMessage={hasError("name") && touched["name"] ? "Name is required" : undefined}
              classNames={{
                input: "text-base",
              }}
            />

            <Input
              variant="flat"
              color={hasError("email") ? "danger" : "default"}
              label="Email Address"
              placeholder="your.email@example.com"
              type="email"
              size="lg"
              fullWidth
              value={formData.email}
              onChange={(e) => handleChange(e, "email")}
              onBlur={() => handleBlur("email")}
              isInvalid={hasError("email")}
              errorMessage={hasError("email") && touched["email"] ? "Please enter a valid email address" : undefined}
              classNames={{
                input: "text-base",
              }}
            />
          </div>

          {/* Phone Number */}
          <Input
            variant="flat"
            color={hasError("phoneNumber") ? "danger" : "default"}
            label="Phone Number"
            placeholder="+1 (555) 123-4567"
            type="tel"
            size="lg"
            fullWidth
            value={formData.phoneNumber}
            onChange={(e) => handleChange(e, "phoneNumber")}
            onBlur={() => handleBlur("phoneNumber")}
            isInvalid={hasError("phoneNumber")}
            errorMessage={
              hasError("phoneNumber") && touched["phoneNumber"] ? "Please enter a valid phone number" : undefined
            }
            classNames={{
              input: "text-base",
            }}
          />

          {/* Subject */}
          <Input
            variant="flat"
            color={hasError("subject") ? "danger" : "default"}
            label="Subject"
            placeholder="What is this about?"
            size="lg"
            fullWidth
            value={formData.subject}
            onChange={(e) => handleChange(e, "subject")}
            onBlur={() => handleBlur("subject")}
            isInvalid={hasError("subject")}
            errorMessage={hasError("subject") && touched["subject"] ? "Subject is required" : undefined}
            classNames={{
              input: "text-base",
            }}
          />

          {/* Message */}
          <Textarea
            variant="flat"
            color={hasError("message") ? "danger" : "default"}
            label="Message"
            placeholder="Tell us more about your inquiry..."
            size="lg"
            fullWidth
            minRows={6}
            value={formData.message}
            onChange={(e) => handleChange(e, "message")}
            onBlur={() => handleBlur("message")}
            isInvalid={hasError("message")}
            errorMessage={hasError("message") && touched["message"] ? "Message is required" : undefined}
            classNames={{
              input: "text-base",
              inputWrapper: "min-h-[200px]",
            }}
          />

          {/* Submit Button */}
          <Button
            color="warning"
            variant="solid"
            fullWidth
            size="lg"
            type="submit"
            isLoading={isPending}
            isDisabled={!isFormValid || isPending}
            className="mt-2 font-semibold text-white"
          >
            Send Message
          </Button>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 text-center">
            We will respond to your inquiry as soon as possible, typically within 24 hours.
          </p>
        </form>
      </CardBody>
    </Card>
  )
}

export default ContactForm
