import { InsertUserType } from "./db";

export type RegisterFormData = Pick<
  InsertUserType,
  "name" | "email" | "phoneNumber" | "password"
> & { confirmPassword: string };

export type LoginFormData = Pick<InsertUserType, "email" | "password">;
