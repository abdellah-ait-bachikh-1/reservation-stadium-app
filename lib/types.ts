export type Theme = "light" | "dark" | "system";
export type TLocale = "fr" | "ar" | "en";

// -----------register
export type RegisterCredentials = {
  fullNameAr: string;
  fullNameFr: string;
  email: string;
  password: string;
  phoneNumber: string;
  confirmPassword: string;
};
export type ValidateRegisterCredentialsErrorResult = Partial<
  Record<keyof RegisterCredentials, string[]>
>;
export type ValidateRegisterCredentialsResult =
  | {
      data: null;
      validationErrors: ValidateRegisterCredentialsErrorResult;
    }
  | { data: RegisterCredentials; validationErrors: null };

//------------login
export type LoginCredentials = Pick<RegisterCredentials, "email" | "password">;
export type ValidateLoginCredentialsErrorResult = Pick<
  ValidateRegisterCredentialsErrorResult,
  "email" | "password"
>;
export type ValidateLoginCredentialsResult =
  | {
      data: null;
      validationErrors: ValidateLoginCredentialsErrorResult;
    }
  | { data: LoginCredentials; validationErrors: null };

export type UserProfileCredentials = {
  fullNameAr: string;
  fullNameFr: string;
  email: string;
  phoneNumber: string;
  preferredLocale: TLocale;
};

export type ValidateUserProfileCredentialsErrorResult = Partial<
  Record<keyof UserProfileCredentials, string[]>
>;

export type ValidateUserProfileCredentialsResult =
  | {
      data: null;
      validationErrors: ValidateUserProfileCredentialsErrorResult;
    }
  | { data: UserProfileCredentials; validationErrors: null };


  export type ChangePasswordCredentials = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

//change password
export type ValidateChangePasswordCredentialsErrorResult = Partial<
  Record<keyof ChangePasswordCredentials, string[]>
>;

export type ValidateChangePasswordCredentialsResult =
  | {
      data: null;
      validationErrors: ValidateChangePasswordCredentialsErrorResult;
    }
  | { data: ChangePasswordCredentials; validationErrors: null };
