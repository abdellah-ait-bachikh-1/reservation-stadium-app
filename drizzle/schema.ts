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
  unique,
  foreignKey,
  primaryKey,
} from "drizzle-orm/mysql-core";

//--------------------- Enums -----------------------

export const USER_ROLES = mysqlEnum("role", ["ADMIN", "CLUB"]);
export const USER_PREFERRED_LOCALE = mysqlEnum("preferred_locale", [
  "EN",
  "FR",
  "AR",
]);

export const notificationModelValues = [
  "USER",
  "RESERVATION",
  "PAYMENT",
  "SUBSCRIPTION",
  "SYSTEM",
] as const;
export const NOTIFICATION_MODELS = mysqlEnum("model", notificationModelValues);
export const notificationTypes = [
  "USER_CREATED",
  "USER_APPROVED",
  "USER_PROFILE_UPDATED",
  "USER_EMAIL_VERIFIED",
  "RESERVATION_REQUESTED",
  "RESERVATION_APPROVED",
  "RESERVATION_DECLINED",
  "RESERVATION_CANCELLED",
  "RESERVATION_REMINDER",
  "PAYMENT_RECEIVED",
  "PAYMENT_OVERDUE",
  "PAYMENT_REFUNDED",
  "SUBSCRIPTION_PAYMENT",
  "SYSTEM_MAINTENANCE",
  "SYSTEM_UPDATE",
  "SYSTEM_NEW_FEATURE",
  "SYSTEM_ANNOUNCEMENT",
] as const;

export const RESERVATION_STATUS = mysqlEnum("status", [
  "PENDING",
  "APPROVED",
  "DECLINED",
  "CANCELLED",
  "PAID",
  "UNPAID",
]);

export const PAYMENT_STATUS = mysqlEnum("status", [
  "PENDING",
  "PAID",
  "OVERDUE",
  "PARTIALLY_PAID",
]);

export const PAYMENT_TYPE = mysqlEnum("payment_type", [
  "SINGLE_SESSION",
  "MONTHLY_SUBSCRIPTION",
]);

export const BILLING_TYPE = mysqlEnum("billing_type", [
  "PER_SESSION",
  "MONTHLY_SUBSCRIPTION",
]);

export const SUBSCRIPTION_STATUS = mysqlEnum("status", [
  "ACTIVE",
  "CANCELLED",
  "EXPIRED",
  "SUSPENDED",
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
  (table) => [
    index("role_index").on(table.role),
    index("deleted_at_index").on(table.deletedAt),
  ]
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

export const clubs = mysqlTable(
  "clubs",
  {
    id: char("id", { length: 36 })
      .primaryKey()
      .default(sql`(UUID())`)
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    address: varchar("address", { length: 255 }),
    monthlyFee: decimal("monthly_fee", { precision: 10, scale: 2 }),
    paymentDueDay: smallint("payment_due_day", {
      unsigned: true,
    }).$type<PaymentDueDay>(),
    userId: char("user_id", { length: 36 }).notNull(),
    sportId: char("sport_id", { length: 36 }),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
  },
  (table) => [
    // Named foreign keys
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "fk_clubs_user",
    }).onDelete("cascade"),

    foreignKey({
      columns: [table.sportId],
      foreignColumns: [sports.id],
      name: "fk_clubs_sport",
    }).onDelete("set null"),

    index("user_id_index").on(table.userId),
    index("sport_id_index").on(table.sportId),
    index("name_index").on(table.name),
    index("user_id_sport_id_index").on(table.userId, table.sportId),
  ]
);

export const stadiums = mysqlTable(
  "stadiums",
  {
    id: char("id", { length: 36 })
      .primaryKey()
      .default(sql`(UUID())`)
      .notNull(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    address: varchar("address", { length: 255 }).notNull(),
    googleMapsUrl: varchar("google_map_url", { length: 500 }),
    monthlyPrice: decimal("monthly_price", { precision: 10, scale: 2 }),
    pricePerSession: decimal("price_per_session", { precision: 10, scale: 2 }),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
  },
  (table) => [
    index("monthly_price_index").on(table.monthlyPrice),
    index("price_per_session").on(table.pricePerSession),
    index("deleted_at_index").on(table.deletedAt),
    index("address_index").on(table.address),
  ]
);

export const stadiumImages = mysqlTable(
  "stadium_images",
  {
    id: char("id", { length: 36 })
      .primaryKey()
      .default(sql`(UUID())`)
      .notNull(),
    index: smallint("index").default(sql`0`),
    imageUri: varchar("image_uri", { length: 500 }).notNull(),
    stadiumId: char("stadium_id", { length: 36 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
  },
  (table) => [
    // Named foreign key
    foreignKey({
      columns: [table.stadiumId],
      foreignColumns: [stadiums.id],
      name: "fk_stadium_images_stadium",
    }).onDelete("cascade"),

    index("stadium_id_index").on(table.stadiumId),
  ]
);

export const stadiumSports = mysqlTable(
  "stadium_sports",
  {
    stadiumId: char("stadium_id", { length: 36 }).notNull(),
    sportId: char("sport_id", { length: 36 }).notNull(),
  },
  (table) => [
    // Named foreign keys
    foreignKey({
      columns: [table.stadiumId],
      foreignColumns: [stadiums.id],
      name: "fk_stadium_sports_stadium",
    }).onDelete("cascade"),

    foreignKey({
      columns: [table.sportId],
      foreignColumns: [sports.id],
      name: "fk_stadium_sports_sport",
    }).onDelete("cascade"),
    primaryKey({ columns: [table.stadiumId, table.sportId] }),
  ]
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
    stadiumId: char("stadium_id", { length: 36 }).notNull(),
    userId: char("user_id", { length: 36 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
  },
  (table) => [
    // Named foreign keys
    foreignKey({
      columns: [table.stadiumId],
      foreignColumns: [stadiums.id],
      name: "fk_reservation_series_stadium",
    }).onDelete("cascade"),

    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "fk_reservation_series_user",
    }).onDelete("cascade"),

    index("user_id_index").on(table.userId),
    index("stadium_id_index").on(table.stadiumId),
    index("day_of_week_index").on(table.dayOfWeek),
    index("billing_type_index").on(table.billingType),
    index("created_at_index").on(table.createdAt),
    index("recurrence_end_date_index").on(table.recurrenceEndDate),
    index("start_time_end_time_index").on(table.startTime, table.endTime),
  ]
);

export const monthlySubscriptions = mysqlTable(
  "monthly_subscriptions",
  {
    id: char("id", { length: 36 })
      .primaryKey()
      .default(sql`(UUID())`)
      .notNull(),
    userId: char("user_id", { length: 36 }).notNull(),
    reservationSeriesId: char("reservation_series_id", { length: 36 })
      .notNull()
      .unique(),
    startDate: timestamp("start_date", { mode: "string" })
      .defaultNow()
      .notNull(),
    endDate: timestamp("end_date", { mode: "string" }),
    monthlyAmount: decimal("monthly_amount", {
      precision: 10,
      scale: 2,
    }).notNull(),
    status: SUBSCRIPTION_STATUS.default("ACTIVE").notNull(),
    autoRenew: boolean("auto_renew").default(true).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
  },
  (table) => [
    // Named foreign keys
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "fk_subscriptions_user",
    }).onDelete("cascade"),

    foreignKey({
      columns: [table.reservationSeriesId],
      foreignColumns: [reservationSeries.id],
      name: "fk_subscriptions_series",
    }).onDelete("cascade"),

    index("user_id_index").on(table.userId),
    index("status_index").on(table.status),
    index("start_date_index").on(table.startDate),
    index("end_date_index").on(table.endDate),
    index("created_at_index").on(table.createdAt),
  ]
);

export const monthlyPayments = mysqlTable(
  "monthly_payments",
  {
    id: char("id", { length: 36 })
      .primaryKey()
      .default(sql`(UUID())`)
      .notNull(),
    month: smallint("month", { unsigned: true }).notNull(),
    year: smallint("year", { unsigned: true }).notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    status: PAYMENT_STATUS.default("PENDING").notNull(),
    paymentDate: timestamp("payment_date", { mode: "string" }),
    receiptNumber: varchar("receipt_number", { length: 255 }),
    userId: char("user_id", { length: 36 }).notNull(),
    reservationSeriesId: char("reservation_series_id", {
      length: 36,
    }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
  },
  (table) => [
    // Named foreign keys
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "fk_monthly_payments_user",
    }).onDelete("cascade"),

    foreignKey({
      columns: [table.reservationSeriesId],
      foreignColumns: [reservationSeries.id],
      name: "fk_monthly_payments_series",
    }).onDelete("cascade"),

    index("user_id_index").on(table.userId),
    index("status_index").on(table.status),
    index("month_year_index").on(table.month, table.year),
    index("payment_date_index").on(table.paymentDate),
    index("created_at_index").on(table.createdAt),
    unique("month_year_series_unique").on(
      table.month,
      table.year,
      table.reservationSeriesId
    ),
  ]
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
    stadiumId: char("stadium_id", { length: 36 }).notNull(),
    userId: char("user_id", { length: 36 }).notNull(),
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
  (table) => [
    // Named foreign keys
    foreignKey({
      columns: [table.stadiumId],
      foreignColumns: [stadiums.id],
      name: "fk_reservations_stadium",
    }).onDelete("cascade"),

    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "fk_reservations_user",
    }).onDelete("cascade"),

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
    index("status_start_date_time_index").on(table.status, table.startDateTime),
  ]
);

export const cashPaymentRecords = mysqlTable(
  "cash_payment_records",
  {
    id: char("id", { length: 36 })
      .primaryKey()
      .default(sql`(UUID())`)
      .notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    paymentDate: timestamp("payment_date", { mode: "string" })
      .defaultNow()
      .notNull(),
    receiptNumber: varchar("receipt_number", { length: 255 }).notNull(),
    notes: text("notes"),
    reservationId: char("reservation_id", { length: 36 }),
    monthlyPaymentId: char("monthly_payment_id", { length: 36 }),
    userId: char("user_id", { length: 36 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
  },
  (table) => [
    // Named foreign keys
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "fk_cash_payments_user",
    }).onDelete("cascade"),

    foreignKey({
      columns: [table.reservationId],
      foreignColumns: [reservations.id],
      name: "fk_cash_payments_reservation",
    }).onDelete("set null"),

    foreignKey({
      columns: [table.monthlyPaymentId],
      foreignColumns: [monthlyPayments.id],
      name: "fk_cash_payments_monthly",
    }).onDelete("set null"),

    index("user_id_index").on(table.userId),
    index("reservation_id_index").on(table.reservationId),
    index("monthly_payment_id_index").on(table.monthlyPaymentId),
    index("payment_date_index").on(table.paymentDate),
    index("created_at_index").on(table.createdAt),
  ]
);

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
    model: NOTIFICATION_MODELS.notNull(),
    referenceId: char("reference_id", { length: 36 }).notNull(),
    titleEn: varchar("title_en", { length: 255 }).notNull(),
    titleFr: varchar("title_fr", { length: 255 }).notNull(),
    titleAr: varchar("title_ar", { length: 255 }).notNull(),
    messageEn: text("message_en").notNull(),
    messageFr: text("message_fr").notNull(),
    messageAr: text("message_ar").notNull(),
    link: varchar("link", { length: 255 }),
    isRead: boolean("is_read").default(false).notNull(),
    userId: char("user_id", { length: 36 }).notNull(),
    actorUserId: char("actor_user_id", { length: 36 }),
    metadata: json("metadata"),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    // Named foreign keys
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "fk_notifications_user",
    }).onDelete("cascade"),

    foreignKey({
      columns: [table.actorUserId],
      foreignColumns: [users.id],
      name: "fk_notifications_actor",
    }).onDelete("cascade"),

    index("user_id_idx").on(table.userId),
    index("model_idx").on(table.model),
    index("reference_id_idx").on(table.referenceId),
    index("is_read_idx").on(table.isRead),
    index("created_at_idx").on(table.createdAt),
    index("type_idx").on(table.type),
    index("actor_user_id_idx").on(table.actorUserId),
  ]
);
//--------------------- Relations -----------------------

export const clubRelations = relations(clubs, ({ one }) => ({
  user: one(users, {
    fields: [clubs.userId],
    references: [users.id],
    relationName: "userClubs",
  }),
  sport: one(sports, {
    fields: [clubs.sportId],
    references: [sports.id],
    relationName: "sportClub",
  }),
}));

export const sportRelations = relations(sports, ({ many }) => ({
  clubs: many(clubs, { relationName: "sportClub" }),
  stadiumSports: many(stadiumSports, { relationName: "sport_stadiums" }),
}));

export const stadiumRelations = relations(stadiums, ({ many }) => ({
  stadiumSports: many(stadiumSports, { relationName: "stadium_sports" }),
  images: many(stadiumImages, { relationName: "stadium_images" }),
  reservations: many(reservations, { relationName: "stadium_reservations" }),
  reservationSeries: many(reservationSeries, {
    relationName: "stadium_reservation_series",
  }),
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

export const stadiumSportsRelations = relations(stadiumSports, ({ one }) => ({
  stadium: one(stadiums, {
    fields: [stadiumSports.stadiumId],
    references: [stadiums.id],
    relationName: "stadium_sports",
  }),
  sport: one(sports, {
    fields: [stadiumSports.sportId],
    references: [sports.id],
    relationName: "sport_stadiums",
  }),
}));

export const reservationsRelations = relations(reservations, ({ one }) => ({
  stadium: one(stadiums, {
    fields: [reservations.stadiumId],
    references: [stadiums.id],
    relationName: "stadium_reservations",
  }),
  user: one(users, {
    fields: [reservations.userId],
    references: [users.id],
    relationName: "user_reservations",
  }),
  monthlyPayment: one(monthlyPayments, {
    fields: [reservations.monthlyPaymentId],
    references: [monthlyPayments.id],
    relationName: "monthly_payment_reservations",
  }),
  reservationSeries: one(reservationSeries, {
    fields: [reservations.reservationSeriesId],
    references: [reservationSeries.id],
    relationName: "reservation_series_reservations",
  }),
  cashPayment: one(cashPaymentRecords, {
    fields: [reservations.id],
    references: [cashPaymentRecords.reservationId],
    relationName: "reservation_cash_payment",
  }),
}));

export const reservationSeriesRelations = relations(
  reservationSeries,
  ({ one, many }) => ({
    stadium: one(stadiums, {
      fields: [reservationSeries.stadiumId],
      references: [stadiums.id],
      relationName: "stadium_reservation_series",
    }),
    user: one(users, {
      fields: [reservationSeries.userId],
      references: [users.id],
      relationName: "user_reservation_series",
    }),
    reservations: many(reservations, {
      relationName: "reservation_series_reservations",
    }),
    monthlyPayments: many(monthlyPayments, {
      relationName: "reservation_series_monthly_payments",
    }),
    subscription: one(monthlySubscriptions, {
      fields: [reservationSeries.id],
      references: [monthlySubscriptions.reservationSeriesId],
      relationName: "reservation_series_subscription",
    }),
  })
);

export const monthlyPaymentsRelations = relations(
  monthlyPayments,
  ({ one, many }) => ({
    user: one(users, {
      fields: [monthlyPayments.userId],
      references: [users.id],
      relationName: "user_monthly_payments",
    }),
    reservationSeries: one(reservationSeries, {
      fields: [monthlyPayments.reservationSeriesId],
      references: [reservationSeries.id],
      relationName: "reservation_series_monthly_payments",
    }),
    cashPayment: one(cashPaymentRecords, {
      fields: [monthlyPayments.id],
      references: [cashPaymentRecords.monthlyPaymentId],
      relationName: "monthly_payment_cash_payment",
    }),
    reservations: many(reservations, {
      relationName: "monthly_payment_reservations",
    }),
  })
);

export const cashPaymentRecordsRelations = relations(
  cashPaymentRecords,
  ({ one }) => ({
    reservation: one(reservations, {
      fields: [cashPaymentRecords.reservationId],
      references: [reservations.id],
      relationName: "reservation_cash_payment",
    }),
    monthlyPayment: one(monthlyPayments, {
      fields: [cashPaymentRecords.monthlyPaymentId],
      references: [monthlyPayments.id],
      relationName: "monthly_payment_cash_payment",
    }),
    user: one(users, {
      fields: [cashPaymentRecords.userId],
      references: [users.id],
      relationName: "user_cash_payments",
    }),
  })
);

export const monthlySubscriptionsRelations = relations(
  monthlySubscriptions,
  ({ one }) => ({
    user: one(users, {
      fields: [monthlySubscriptions.userId],
      references: [users.id],
      relationName: "user_subscriptions",
    }),
    reservationSeries: one(reservationSeries, {
      fields: [monthlySubscriptions.reservationSeriesId],
      references: [reservationSeries.id],
      relationName: "reservation_series_subscription",
    }),
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  notifications: many(notifications, { relationName: "userNotifications" }),
  actorNotifications: many(notifications, {
    relationName: "actorNotifications",
  }),
  clubs: many(clubs, { relationName: "userClubs" }),
  reservations: many(reservations, { relationName: "user_reservations" }),
  reservationSeries: many(reservationSeries, {
    relationName: "user_reservation_series",
  }),
  cashPayments: many(cashPaymentRecords, {
    relationName: "user_cash_payments",
  }),
  monthlyPayments: many(monthlyPayments, {
    relationName: "user_monthly_payments",
  }),
  subscriptions: many(monthlySubscriptions, {
    relationName: "user_subscriptions",
  }),
}));
