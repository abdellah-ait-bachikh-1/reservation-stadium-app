import { PaymentDueDay } from "@/types/db";
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  char,
  decimal,
  index,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  smallint,
} from "drizzle-orm/mysql-core";

//--------------------- Enums -----------------------

export const USER_ROLES = mysqlEnum("role", ["ADMIN", "CLUB"]);
export const USER_PREFERRED_LOCALE = mysqlEnum("preferred_locale", [
  "EN",
  "FR",
  "AR",
]);

export const notificationModelValues = ["USER"] as const;
export const NOTIFICATION_MODELS = mysqlEnum("model", notificationModelValues);
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
export const RESERVATION_STATUS = mysqlEnum("status", [
  "PENDING",
  "APPROVED",
  "DECLINED",
  "CANCELLED",
  "PAID",
  "UNPAID",
]);
export const PAYMENT_TYPE = mysqlEnum("payment_type", [
  "SINGLE_SESSION",
  "MONTHLY_SUBSCRIPTION",
]);
export const BILLING_TYPE = mysqlEnum("billing_type", [
  "PER_SESSION",
  "MONTHLY_SUBSCRIPTION",
]);

//--------------------- Tables -----------------------

export const users = mysqlTable(
  "users",
  {
    id: char("id", { length: 36 })
      .primaryKey()
      .default(sql`(UUID())`)
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    role: USER_ROLES.default("CLUB").notNull(),
    phoneNumber: varchar("phone_number", { length: 50 }).notNull(),
    isApproved: boolean("is_approved").default(false),
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

export const clubs = mysqlTable(
  "clubs",
  {
    id: char("id", { length: 36 })
      .primaryKey()
      .default(sql`(UUID())`)
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    adress: varchar("adress", { length: 255 }),
    monthlyFee: decimal("monthly_fee", { precision: 10, scale: 2 }),
    paymentDueDay: smallint("payment_due_day", {
      unsigned: true,
    }).$type<PaymentDueDay>(),
    userId: char("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sportId: char("sport_id", { length: 36 }).references(() => sports.id, {
      onDelete: "set null",
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
      index("user_id_index").on(table.userId),
      index("sport_id_index").on(table.sportId),
      index("name_index").on(table.name),
      index("user_id_sport_id_index").on(table.userId, table.sportId),
    ];
  }
);

export const sports = mysqlTable("sports", {
  id: char("id", { length: 36 })
    .primaryKey()
    .default(sql`(UUID())`)
    .notNull(),
  nameAr: varchar("name_ar", { length: 255 }).notNull().unique(),
  nameFr: varchar("name_fr", { length: 255 }).notNull().unique(),
  icon: varchar("icon", { length: 255 }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .defaultNow()
    .onUpdateNow()
    .notNull(),
  deletedAt: timestamp("deleted_at", { mode: "string" }),
});

export const notifications = mysqlTable(
  "notifications",
  {
    id: char("id", { length: 36 })
      .primaryKey()
      .default(sql`(UUID())`)
      .notNull(),

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
    link: varchar("link", { length: 255 }), // URL to navigate when clicked

    // Status
    isRead: boolean("is_read").default(false).notNull(),

    // User relations
    userId: char("user_id", { length: 36 }) // Receiver ID
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    actorUserId: char("actor_user_id", { length: 36 }) // Who performed the action
      .references(() => users.id, { onDelete: "cascade" }),

    // Metadata
    metadata: json("metadata"), // For additional dynamic data

    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
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

export const stadiums = mysqlTable(
  "stadiums",
  {
    id: char("id", { length: 36 })
      .primaryKey()
      .default(sql`(UUID())`)
      .notNull(),
    name: varchar("name_ar", { length: 255 }).notNull().unique(),
    adress: varchar("adress", { length: 255 }).notNull(),
    googleMapsUrl: varchar("googleMapUrl", { length: 500 }),
    monthlyPrice: decimal("monthly_price", { precision: 10, scale: 2 }),
    pricePerSession: decimal("price_per_session", { precision: 10, scale: 2 }),

    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
  },
  (table) => {
    return [
      index("monthly_price_index").on(table.monthlyPrice),
      index("price_per_session").on(table.pricePerSession),
    ];
  }
);

export const stadiumImages = mysqlTable(
  "stadium_images",
  {
    id: char("id", { length: 36 })
      .primaryKey()
      .default(sql`(UUID())`)
      .notNull(),
    index: smallint("index").default(sql`0`),
    imageUri: varchar("image_uri").notNull(),
    stadiumId: char("stadium_id")
      .notNull()
      .references(() => stadiums.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
  },
  (table) => [index("stadim_id_index").on(table.stadiumId)]
);

export const reservations = mysqlTable(
  "reservations",
  {
    id: char("id", { length: 36 })
      .primaryKey()
      .default(sql`(UUID())`)
      .notNull(),
    startDateTime: timestamp("start_date_time", { mode: "string" }).notNull(),
    endDateTime: timestamp("end_date_time", { mode: "string" }).notNull(),
    status: RESERVATION_STATUS.default("PENDING").notNull(),
    sessionPrice: decimal("session_price", {
      precision: 10,
      scale: 2,
    }).notNull(),
    isPaid: boolean("is_paid").default(false).notNull(),
    paymentType: PAYMENT_TYPE.notNull(),

    // Relations
    stadiumId: char("stadium_id", { length: 36 })
      .notNull()
      .references(() => stadiums.id, { onDelete: "cascade" }),
    userId: char("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    monthlyPaymentId: char("monthly_payment_id", { length: 36 }),
    reservationSeriesId: char("reservation_series_id", { length: 36 }),

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
      index("start_date_time_index").on(table.startDateTime),
      index("end_date_time_index").on(table.endDateTime),
      index("status_index").on(table.status),
      index("user_id_index").on(table.userId),
      index("stadium_id_index").on(table.stadiumId),
      index("monthly_payment_id_index").on(table.monthlyPaymentId),
      index("reservation_series_id_index").on(table.reservationSeriesId),
      index("created_at_index").on(table.createdAt),
      index("is_paid_index").on(table.isPaid),
      index("start_date_time_stadium_id_index").on(
        table.startDateTime,
        table.stadiumId
      ),
      index("status_start_date_time_index").on(
        table.status,
        table.startDateTime
      ),
    ];
  }
);
export const reservationSeries = mysqlTable(
  "reservation_series",
  {
    id: char("id", { length: 36 })
      .primaryKey()
      .default(sql`(UUID())`)
      .notNull(),
    startTime: timestamp("start_time", { mode: "string" }).notNull(),
    endTime: timestamp("end_time", { mode: "string" }).notNull(),
    dayOfWeek: smallint("day_of_week", { unsigned: true }).notNull(),
    recurrenceEndDate: timestamp("recurrence_end_date", { mode: "string" }),
    isFixed: boolean("is_fixed").default(true).notNull(),
    billingType: BILLING_TYPE.notNull(),
    monthlyPrice: decimal("monthly_price", { precision: 10, scale: 2 }),
    pricePerSession: decimal("price_per_session", { precision: 10, scale: 2 }),

    // Relations
    stadiumId: char("stadium_id", { length: 36 })
      .notNull()
      .references(() => stadiums.id),
    userId: char("user_id", { length: 36 })
      .notNull()
      .references(() => users.id),

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
      index("user_id_index").on(table.userId),
      index("stadium_id_index").on(table.stadiumId),
      index("day_of_week_index").on(table.dayOfWeek),
      index("billing_type_index").on(table.billingType),
      index("created_at_index").on(table.createdAt),
      index("recurrence_end_date_index").on(table.recurrenceEndDate),
      index("start_time_end_time_index").on(table.startTime, table.endTime),
    ];
  }
);
//--------------------- Relations -----------------------

export const usersRelations = relations(users, ({ many }) => ({
  notifications: many(notifications, { relationName: "userNotifications" }),
  actorNotifications: many(notifications, {
    relationName: "actorNotifications",
  }),
  clubs: many(clubs, { relationName: "userClubs" }),
}));

export const clubRelations = relations(clubs, ({ one }) => ({
  user: one(users, {
    fields: [clubs.userId],
    references: [users.id],
    relationName: "userClubs",
  }),
  sports: one(sports, {
    fields: [clubs.sportId],
    references: [sports.id],
    relationName: "sportClub",
  }),
}));

export const sportRelations = relations(sports, ({ many }) => ({
  clubs: many(clubs, { relationName: "sport_club" }),
  stadiums: many(stadiums, { relationName: "stadium_sports" }),
}));

export const stadiumRelations = relations(sports, ({ many }) => ({
  sports: many(sports, { relationName: "stadium_sports" }),
  images: many(stadiumImages, { relationName: "stadium_images" }),
}));

export const stadiumImagesRelations = relations(stadiumImages, ({ one }) => ({
  stadium: one(stadiums, {
    fields: [stadiumImages.stadiumId],
    references: [stadiums.id],
    relationName: "stadium_images",
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
    relationName: "userNotifications",
  }),
  actorUser: one(users, {
    fields: [notifications.actorUserId],
    references: [users.id],
    relationName: "actorNotifications",
  }),
}));
