import { sql } from "drizzle-orm";
import {
  char,
  index,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { v4 as uuidv4 } from "uuid";

//--------------------- Enums -----------------------
export const USER_ROLES = mysqlEnum(["ADMIN", "CLUBE"]);
export const USER_PREFERRED_LOCALE = mysqlEnum(["EN", "FR", "AR"]);

//--------------------- Tables -----------------------

export const users = mysqlTable(
  "users",
  {
    id: char("id", { length: 36 })
      .primaryKey()
      .$default(() => uuidv4()),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    role: USER_ROLES.default("CLUBE").notNull(),
    phoneNumber: varchar("phone_number", { length: 50 }).notNull(),
    preferredLocale: USER_PREFERRED_LOCALE.default("FR").notNull(),
    emailVerifiedAt: timestamp("email_verified_at", { mode: "string" }),
    verificationToken: varchar("verification_token", { length: 255 }),
    verificationTokenExpiresAt: timestamp("verification_token_expires_at", {
      mode: "string",
    }),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
  },
  (table) => {
    return [
      index("role_index").on(table.role),
      index("deleted_at_index").on(table.deletedAt),
    ];
  }
);

//--------------------- Types -----------------------

export type UserType = typeof users.$inferSelect;
export type InsertUserType = typeof users.$inferInsert;
export type UserRoleType = "ADMIN" | "CLUBE";
export type UserPreferredLocaleType = "FR" | "EN" | "AR";
