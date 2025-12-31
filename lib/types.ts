import { Decimal } from "@prisma/client/runtime/client";
import { UserLocale, UserRole } from "./generated/prisma/enums";
import { User } from "./generated/prisma/client";

export type Theme = "light" | "dark" | "system";
export type TLocale = "fr" | "ar" | "en";
export type TPreferredLocale = User['preferredLocale']
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

//------------login
export type ForgotPasswordCredentials = Pick<RegisterCredentials, "email">;
export type ValidateForgotPasswordCredentialsErrorResult = Pick<
  ValidateRegisterCredentialsErrorResult,
  "email" 
>;
export type ValidateForgotPasswordCredentialsResult =
  | {
      data: null;
      validationErrors: ValidateForgotPasswordCredentialsErrorResult;
    }
  | { data: ForgotPasswordCredentials; validationErrors: null };

export type UserProfileCredentials = {
  fullNameAr: string;
  fullNameFr: string;
  email: string;
  phoneNumber: string;
  preferredLocale: UserLocale;
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


  export type ApiUser = {
    fullNameFr: string;
    fullNameAr: string;
    email: string;
    phoneNumber: string;
    preferredLocale: UserLocale;
    id: string;
    role: UserRole;
    club: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        nameAr: string;
        nameFr: string;
        addressFr: string;
        addressAr: string;
        monthlyFee: Decimal;
        paymentDueDay: number;
        userId: string;
        sportId: string;
    } | null;
    approved: boolean;
    verificationToken: string | null;
    emailVerifiedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}