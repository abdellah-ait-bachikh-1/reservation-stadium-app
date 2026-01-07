import { sql } from "drizzle-orm";
import {
  boolean,
  char,
  index,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { v4 as uuidv4 } from "uuid";

//--------------------- Enums -----------------------

//--------------------- User Enums -----------------------
export const USER_ROLES = mysqlEnum("role", ["ADMIN", "CLUB"]);
export const USER_PREFERRED_LOCALE = mysqlEnum("preferred_locale", [
  "EN",
  "FR",
  "AR",
]);

//--------------------- Notification Enums -----------------------
export const notificationModelValues = ["USER"] as const;
export const NOTIFICATION_MODELS = mysqlEnum("model", notificationModelValues);

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
    role: USER_ROLES.default("CLUB").notNull(),
    phoneNumber: varchar("phone_number", { length: 50 }).notNull(),
    isApproved: boolean("is_approved").default(false) ,
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

export const notificationTypes = [
  // User model notifications
  "USER_CREATED",
  "USER_APPROVED",
  "USER_PROFILE_UPDATED",
  "USER_PASSWORD_CHANGED",
  "USER_EMAIL_VERIFIED",
  "USER_DELETED",

  // Reservation related (will use USER model for now)
  "RESERVATION_REQUESTED",
  "RESERVATION_APPROVED",
  "RESERVATION_DECLINED",
  "RESERVATION_CANCELLED",
  "RESERVATION_REMINDER",

  // Payment related (will use USER model for now)
  "PAYMENT_RECEIVED",
  "PAYMENT_OVERDUE",
  "PAYMENT_FAILED",
  "PAYMENT_REFUNDED",
  "SUBSCRIPTION_PAYMENT",

  // System notifications
  "SYSTEM_MAINTENANCE",
  "SYSTEM_UPDATE",
  "SYSTEM_NEW_FEATURE",
  "SYSTEM_ANNOUNCEMENT",

  // Admin notifications
  "ADMIN_NEW_USER",
  "ADMIN_NEW_RESERVATION",
  "ADMIN_PAYMENT_ALERT",
] as const;

export const notifications = mysqlTable(
  "notifications",
  {
    id: char("id", { length: 36 })
      .primaryKey()
      .$default(() => uuidv4()),

    type: varchar("type", { length: 50 })
      .$type<(typeof notificationTypes)[number]>()
      .notNull(),

    model: NOTIFICATION_MODELS.notNull(), // Which model this notification belongs to

    // For now, all notifications will reference USER model
    // In the future, this could be reservationId, paymentId, etc.
    referenceId: char("reference_id", { length: 36 }).notNull(), // ID of the related record

    // Multi-language titles
    titleEn: varchar("title_en", { length: 255 }).notNull(),
    titleFr: varchar("title_fr", { length: 255 }).notNull(),
    titleAr: varchar("title_ar", { length: 255 }).notNull(),

    // Multi-language messages
    messageEn: text("message_en").notNull(),
    messageFr: text("message_fr").notNull(),
    messageAr: text("message_ar").notNull(),

    // Navigation
    link: varchar("link", { length: 500 }), // URL to navigate when clicked

    // Status
    isRead: boolean("is_read").default(false).notNull(),

    // User relations
    userId: char("user_id", { length: 36 }).notNull(), // Receiver ID
    actorUserId: char("actor_user_id", { length: 36 }), // Who performed the action

    // Metadata
    metadata: json("metadata"), // For additional dynamic data

    // Timestamps
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
  },
  (table) => {
    return [
      index("user_id_idx").on(table.userId),
      index("model_idx").on(table.model),
      index("reference_id_idx").on(table.referenceId),
      index("is_read_idx").on(table.isRead),
      index("created_at_idx").on(table.createdAt),
      index("type_idx").on(table.type),
      index("actor_user_id_idx").on(table.actorUserId),
    ];
  }
);

//--------------------- Types -----------------------

export type UserType = typeof users.$inferSelect;
export type InsertUserType = typeof users.$inferInsert;
export type UserRoleType = "ADMIN" | "CLUB";
export type UserPreferredLocaleType = "FR" | "EN" | "AR";

export type NotificationType = typeof notifications.$inferSelect;
export type InsertNotificationType = typeof notifications.$inferInsert;
export type NotificationTypes = (typeof notificationTypes)[number];
export type NotificationModels = (typeof notificationModelValues)[number];
