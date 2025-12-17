"use client";
import { useRouter } from "@/i18n/navigation";
import {
  RegisterCredentials,
  ValidateRegisterCredentialsErrorResult,
} from "@/lib/types";
import { isError } from "@/lib/utils";
import { addToast } from "@heroui/toast";
import { useTranslations } from "next-intl";
// import { useRouter } from "next/navigation";
import { createContext, Dispatch, SetStateAction, useState } from "react";

export type AuthContext = {
  register: (formData: RegisterCredentials) => Promise<void>;
  isPending: boolean;
  validationErrors: null | ValidateRegisterCredentialsErrorResult;
  setValidationErrors: Dispatch<
    SetStateAction<Partial<Record<keyof RegisterCredentials, string[]>> | null>
  >;
};

export const authContext = createContext<AuthContext | null>(null);

export const AuthContextProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const t = useTranslations("Pages.Register");
  const [validationErrors, setValidationErrors] =
    useState<null | ValidateRegisterCredentialsErrorResult>(null);
  const register = async (formData: RegisterCredentials) => {
    setIsPending(true);
    setValidationErrors(null);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.status === 400) {
        addToast({
          color: "danger",
          title: t("headTitle"),
          description: data.message,
        });
        setValidationErrors(data.validationErrors);
      } else if (response.status === 500) {
        addToast({
          color: "danger",
          title: t("headTitle"),
          description: data.message,
        });
      } else if (response.status === 201) {
        addToast({
          color: "success",
          title: t("headTitle"),
          description: data.message,
        });
        setValidationErrors(null);
        router.push("/auth/login");
      }
    } catch (error) {
      console.log(error);
      setValidationErrors(null);

      if (isError(error)) {
        addToast({
          color: "danger",
          title: t("headTitle"),
          description: error.message,
        });
      } else {
        addToast({
          color: "danger",
          title: t("headTitle"),
          description: t("networkError"),
        });
      }
    } finally {
      setIsPending(false);
    }
  };
  return (
    <authContext.Provider
      value={{ isPending, register, validationErrors, setValidationErrors }}
    >
      {children}
    </authContext.Provider>
  );
};
