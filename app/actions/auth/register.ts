"use server";

import { validateRegisterFormData } from "@/lib/validations/register";
import { LocaleEnumType } from "@/types";
import { RegisterFormData } from "@/types/register";
import { isErrorHasMessage, wait } from "@/utils";
import { getLocale } from "next-intl/server";

export async function registerUser({
  name,
  email,
  phoneNumber,
  password,
  confirmPassword,
}: RegisterFormData) {
  try {
    const locale = await getLocale();
    const { data, validationErrors } = validateRegisterFormData(
      locale as LocaleEnumType,
      {
        name,
        email,
        phoneNumber,
        password,
        confirmPassword,
      }
    );
    if (validationErrors) {
      return { status: 400, validationErrors, data };
    }
    
    return { status: 201, validationErrors: null, data };
  } catch (error) {
    if (isErrorHasMessage(error)) {
      throw new Error(error.message);
    } else {
      throw new Error("unexpected error");
    }
  }
}
