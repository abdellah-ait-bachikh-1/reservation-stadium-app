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

export const users = mysqlTable(
  "users",
  {
    id: char("id", { length: 36 })
      .primaryKey()
      .$default(() => uuidv4()),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 150 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    role: mysqlEnum(["ADMIN", "CLUBE"]).default("CLUBE").notNull(),
    phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
    preferredLocale: mysqlEnum(["EN", "FR", "AR"]).default("FR").notNull(),
    emailVerifiedAt: timestamp("email_verified_at"),
    verificationToken: varchar("verification_token", { length: 128 }),
    verificationTokenExpiresAt: timestamp("verification_token_expires_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => {
    return [
      index("role_index").on(table.role),
      index("deleted_at_index").on(table.deletedAt),
    ];
  }
);

export type UserType = typeof users.$inferSelect;
export type InsertUserType = typeof users.$inferInsert;
