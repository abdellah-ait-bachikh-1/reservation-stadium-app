import { InsertUserType } from "@/drizzle/schema";

export type RegisterFormData = Pick<
  InsertUserType,
  "name" | "email" | "phoneNumber" | "password"
> & { confirmPassword: string };
