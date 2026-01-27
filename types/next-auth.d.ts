// types/next-auth.d.ts
import NextAuth from "next-auth";
import { UserPreferredLocaleType } from "./db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      phoneNumber: string;
      createdAt: string;
      role: "ADMIN" | "CLUB";
      deletedAt: string | null;
      emailVerifiedAt: string | null;
      isApproved: boolean;
      preferredLocale: UserPreferredLocaleType;
      updatedAt: string;
    } | null;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "CLUB";
    phoneNumber: string;
    createdAt: string;
    deletedAt: string | null;
    emailVerifiedAt: string | null;
    isApproved: boolean;
    preferredLocale: UserPreferredLocaleType;
    updatedAt: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
    createdAt?: string;
    role?: "ADMIN" | "CLUB";
    deletedAt?: string | null;
    emailVerifiedAt?: string | null;
    isApproved?: boolean;
    preferredLocale?: UserPreferredLocaleType;
    updatedAt?: string;
    exp?: number;
    iat?: number;
    isInvalid?: boolean;
  }
}