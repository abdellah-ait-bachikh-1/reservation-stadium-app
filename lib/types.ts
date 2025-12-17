export type Theme = "light" | "dark" | "system";
export type TLocale = "fr" | "ar" | "en";

// register
export type RegisterCredentials = {
  fullNameAr: string;
  fullNameFr: string;
  email: string;
  password: string;
  phoneNumber: string;
  confirmPassword:string
};

export type ValidateRegisterCredentialsErrorResult = Partial<Record<
  keyof RegisterCredentials,
  string[]
>>;

export type ValidateRegisterCredentialsResult =
  | {
      data: null;
      validationErrors: ValidateRegisterCredentialsErrorResult;
    }
  | { data: RegisterCredentials; validationErrors: null };
