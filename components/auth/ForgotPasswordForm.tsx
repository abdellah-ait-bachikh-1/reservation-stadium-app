"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { useTypedTranslations } from "@/utils/i18n";
import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useLocale } from "next-intl";
import { useState } from "react";
import { LocaleEnumType } from "@/types";
import { useFormValidation } from "@/hooks/useFormValidation";
import { addToast } from "@heroui/toast";
import { cn } from "@heroui/theme";
import { ForgotPasswordFormData } from "@/types/auth";
import { validateForgotPasswordFormData } from "@/lib/validations/forgot-password";
import { forgotPassword } from "@/app/actions/auth/forgot-password";



const ForgotPasswordForm = () => {
    const locale = useLocale();
    const t = useTypedTranslations();
    const [formData, setFormData] = useState<ForgotPasswordFormData>({
        email: "",
    });
    const [isPending, setIsPending] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter();

    const {
        hasError,
        getErrorMessages,
        validateField,
        markAsTouched,
        validateForm,
        setErrorsState,
        touched,
    } = useFormValidation(validateForgotPasswordFormData, locale as LocaleEnumType);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: keyof ForgotPasswordFormData
    ) => {
        const value = e.target.value;
        const updatedFormData = { ...formData, [field]: value };

        setFormData(updatedFormData);
        validateField(field, value, updatedFormData);

        if (!touched[field]) {
            markAsTouched(field);
        }
    };

    const handleBlur = (field: keyof ForgotPasswordFormData) => {
        markAsTouched(field);
    };

 // In your ForgotPasswordForm component

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const isValid = validateForm(formData);
  if (!isValid) {
    Object.keys(formData).forEach((field) => markAsTouched(field));
    return;
  }

  setIsPending(true);

  try {
    // Call the server action
    const result = await forgotPassword(formData);
    
    if (result.status === 400 && result.validationErrors) {
      setErrorsState(result.validationErrors);
      
      // Show specific error toast based on the message
      const errorMessage = result.validationErrors.email?.[0] || "";
      
      if (errorMessage.includes("deleted") || 
          errorMessage.includes("supprimé") || 
          errorMessage.includes("حذف")) {
        addToast({
          color: "danger",
          title: t("pages.auth.forgotPassword.metadata.title"),
          description: t("common.toast.error.accountDeleted"),
        });
      } else if (errorMessage.includes("verified") || 
                 errorMessage.includes("vérifié") || 
                 errorMessage.includes("مفعل")) {
        addToast({
          color: "warning",
          title: t("pages.auth.forgotPassword.metadata.title"),
          description: t("common.toast.error.accountNotVerified"),
        });
      } else if (errorMessage.includes("approved") || 
                 errorMessage.includes("approuvé") || 
                 errorMessage.includes("معتمد")) {
        addToast({
          color: "warning",
          title: t("pages.auth.forgotPassword.metadata.title"),
          description: t("common.toast.error.accountNotApproved"),
        });
      } else {
        addToast({
          color: "danger",
          title: t("pages.auth.forgotPassword.metadata.title"),
          description: t("common.toast.error.resetPasswordFailed"),
        });
      }
    } else if (result.status === 200) {
      // Success case
      setIsSubmitted(true);
      addToast({
        color: "success",
        title: t("pages.auth.forgotPassword.metadata.title"),
        description: t("common.toast.success.passwordResetEmailSent"),
        timeout: 5000,
      });
      
      // Reset form
      setFormData({ email: "" });
      setErrorsState({});
    }
  } catch (error: any) {
    console.error("Form submission error:", error);
    addToast({
      color: "danger",
      title: t("pages.auth.forgotPassword.metadata.title"),
      description: t("common.toast.error.resetPasswordFailed"),
    });
  } finally {
    setIsPending(false);
  }
};
    const ErrorMessages = ({ field }: { field: keyof ForgotPasswordFormData }) => {
        const errorMessages = getErrorMessages(field);

        if (!errorMessages || errorMessages.length === 0) return null;

        return (
            <div className="flex flex-col gap-0.5 mt-1">
                {errorMessages.map((message, index) => (
                    <p key={`${field}-error-${index}`} className="text-tiny text-danger">
                        • {message}
                    </p>
                ))}
            </div>
        );
    };

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center gap-6 w-full">
                <Alert
                    color="success"
                    variant="faded"
                    classNames={{
                        base: cn([
                            "bg-transparent",
                            "border-1 border-default-200 dark:border-default-100",
                            "relative ltr:before:content-[''] ltr:before:absolute ltr:before:z-10 rtl:before:content-[''] rtl:before:absolute rtl:before:z-10 rtl:after:content-[''] rtl:after:absolute rtl:after:z-10",
                            "ltr:before:left-0 ltr:before:top-[-1px] ltr:before:bottom-[-1px] ltr:before:w-1 rtl:after:right-0 rtl:after:top-[-1px] rtl:after:bottom-[-1px] rtl:after:w-1",
                            "ltr:rounded-l-none ltr:border-l-0 rtl:rounded-r-none rtl:border-r-0",
                            "ltr:before:bg-success rtl:after:bg-success",
                        ]),
                    }}
                    hideIcon
                    description={
                        <div className="flex flex-col gap-2">
                            <p className="font-medium">
                                {t("pages.auth.forgotPassword.success.title")}
                            </p>
                            <p className="text-sm">
                                {t("pages.auth.forgotPassword.success.description")}
                            </p>
                        </div>
                    }
                />

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Button
                        color="default"
                        variant="flat"
                        fullWidth
                        size="lg"
                        onPress={() => setIsSubmitted(false)}
                    >
                        {t("common.actions.tryAgain")}
                    </Button>

                    <Button
                        color="success"
                        variant="flat"
                        fullWidth
                        size="lg"
                        onPress={() => router.push("/auth/login")}
                    >
                        {t("common.actions.backToLogin")}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit}>


            <Input
                variant="flat"
                color={hasError("email") ? "danger" : "default"}
                label={t("common.inputs.labels.email")}
                size="sm"
                fullWidth
                value={formData.email}
                onChange={(e) => handleChange(e, "email")}
                onBlur={() => handleBlur("email")}
                isInvalid={hasError("email")}
                errorMessage={<ErrorMessages field="email" />}
                placeholder="example@email.com"
            />
            <Alert
                color="warning"
                variant="faded"
                classNames={{
                    base: cn([
                        "bg-transparent",
                        "border-1 border-default-200 dark:border-default-100",
                        "relative ltr:before:content-[''] ltr:before:absolute ltr:before:z-10 rtl:before:content-[''] rtl:before:absolute rtl:before:z-10 rtl:after:content-[''] rtl:after:absolute rtl:after:z-10",
                        "ltr:before:left-0 ltr:before:top-[-1px] ltr:before:bottom-[-1px] ltr:before:w-1 rtl:after:right-0 rtl:after:top-[-1px] rtl:after:bottom-[-1px] rtl:after:w-1",
                        "ltr:rounded-l-none ltr:border-l-0 rtl:rounded-r-none rtl:border-r-0",
                        "ltr:before:bg-warning rtl:after:bg-warning",
                    ]),
                }}
                hideIcon
                description={
                    <p className="text-sm">
                        {t("pages.auth.forgotPassword.instructions")}
                    </p>
                }
            />
            <div className="flex items-center justify-between">
                <div className="text-xs text-default-600">
                    <span>{t("pages.auth.forgotPassword.remember_password")}</span>
                    <Link
                        hrefLang={locale}
                        href={"/auth/login"}
                        className="font-semibold hover:font-extrabold underline ml-1"
                    >
                        {t("common.actions.login")}
                    </Link>
                </div>

                <div className="text-xs text-default-600">
                    <span>{t("pages.auth.forgotPassword.no_account")}</span>
                    <Link
                        hrefLang={locale}
                        href={"/auth/register"}
                        className="font-semibold hover:font-extrabold underline ml-1"
                    >
                        {t("common.actions.register")}
                    </Link>
                </div>
            </div>

            <Button
                color="success"
                variant="flat"
                fullWidth
                size="lg"
                type="submit"
                isLoading={isPending}
                isDisabled={Object.keys(formData).some((field) => hasError(field))}
            >
                {t("common.actions.resetPassword")}
            </Button>
        </form>
    );
};

export default ForgotPasswordForm;