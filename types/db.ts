// Import Drizzle types
import {
  clubs,
  sports,
  notifications,
  stadiums,
  stadiumImages,
  reservations,
  reservationSeries,
  monthlyPayments,
  cashPaymentRecords,
  monthlySubscriptions,
  stadiumSports,
  users,
  notificationModelValues,notificationTypes,
} from "@/drizzle/schema";

// Base types from Drizzle schema
export type UserType = typeof users.$inferSelect;
export type InsertUserType = typeof users.$inferInsert;
export type ClubType = typeof clubs.$inferSelect;
export type InsertClubType = typeof clubs.$inferInsert;

export type SportType = typeof sports.$inferSelect;
export type InsertSportType = typeof sports.$inferInsert;

export type NotificationType = (typeof notificationTypes)[number];
export type NotificationModelType = (typeof notificationModelValues)[number];
export type InsertNotificationType = typeof notifications.$inferInsert;

export type StadiumType = typeof stadiums.$inferSelect;
export type InsertStadiumType = typeof stadiums.$inferInsert;

export type StadiumImageType = typeof stadiumImages.$inferSelect;
export type InsertStadiumImageType = typeof stadiumImages.$inferInsert;

export type ReservationType = typeof reservations.$inferSelect;
export type InsertReservationType = typeof reservations.$inferInsert;

export type ReservationSeriesType = typeof reservationSeries.$inferSelect;
export type InsertReservationSeriesType = typeof reservationSeries.$inferInsert;

export type MonthlyPaymentType = typeof monthlyPayments.$inferSelect;
export type InsertMonthlyPaymentType = typeof monthlyPayments.$inferInsert;

export type CashPaymentRecordType = typeof cashPaymentRecords.$inferSelect;
export type InsertCashPaymentRecordType =
  typeof cashPaymentRecords.$inferInsert;

export type MonthlySubscriptionType = typeof monthlySubscriptions.$inferSelect;
export type InsertMonthlySubscriptionType =
  typeof monthlySubscriptions.$inferInsert;

export type StadiumSportType = typeof stadiumSports.$inferSelect;
export type InsertStadiumSportType = typeof stadiumSports.$inferInsert;

// Enum types

export type UserPreferredLocaleType = "FR" | "EN" | "AR"
export type ReservationStatusType =
  | "PENDING"
  | "APPROVED"
  | "DECLINED"
  | "CANCELLED"
  | "PAID"
  | "UNPAID";

export type PaymentStatusType =
  | "PENDING"
  | "PAID"
  | "OVERDUE"
  | "PARTIALLY_PAID";

export type PaymentType = "SINGLE_SESSION" | "MONTHLY_SUBSCRIPTION";

export type BillingType = "PER_SESSION" | "MONTHLY_SUBSCRIPTION";

export type SubscriptionStatusType =
  | "ACTIVE"
  | "CANCELLED"
  | "EXPIRED"
  | "SUSPENDED";

// Special types
export type PaymentDueDay =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31;

// Helper types for form inputs or API requests
export interface CreateReservationInput {
  startDateTime: string;
  endDateTime: string;
  stadiumId: string;
  userId: string;
  paymentType: PaymentType;
  sessionPrice: string;
  monthlyPaymentId?: string;
  reservationSeriesId?: string;
}

export interface CreateReservationSeriesInput {
  startTime: string;
  endTime: string;
  dayOfWeek: number;
  stadiumId: string;
  userId: string;
  billingType: BillingType;
  monthlyPrice?: string;
  pricePerSession?: string;
  recurrenceEndDate?: string;
  isFixed?: boolean;
}

export interface CreateMonthlyPaymentInput {
  month: number;
  year: number;
  amount: string;
  userId: string;
  reservationSeriesId: string;
  status?: PaymentStatusType;
}

export interface CreateCashPaymentInput {
  amount: string;
  receiptNumber: string;
  userId: string;
  reservationId?: string;
  monthlyPaymentId?: string;
  notes?: string;
}

export interface CreateSubscriptionInput {
  monthlyAmount: string;
  userId: string;
  reservationSeriesId: string;
  startDate: string;
  endDate?: string;
  autoRenew?: boolean;
}

// Filter types for queries
export interface ReservationFilter {
  userId?: string;
  stadiumId?: string;
  status?: ReservationStatusType;
  startDateFrom?: string;
  startDateTo?: string;
  isPaid?: boolean;
}

export interface PaymentFilter {
  userId?: string;
  status?: PaymentStatusType;
  month?: number;
  year?: number;
  fromDate?: string;
  toDate?: string;
}

// Update types
export interface UpdateReservationStatus {
  status: ReservationStatusType;
  isPaid?: boolean;
}

export interface UpdatePaymentStatus {
  status: PaymentStatusType;
  paymentDate?: string;
  receiptNumber?: string;
}

export interface UpdateSubscriptionStatus {
  status: SubscriptionStatusType;
  endDate?: string;
  autoRenew?: boolean;
}

export interface NotificationDataType {
  id: string;
  type: NotificationType; // USER_CREATED, USER_APPROVED, etc.
  model: NotificationModelType; // USER, RESERVATION, PAYMENT, etc.
  referenceId: string;
  titleEn: string;
  titleFr: string;
  titleAr: string;
  messageEn: string;
  messageFr: string;
  messageAr: string;
  link?: string | null;
  metadata?: any;
  actorUserId?: string | null;
  userId: string;
  isRead: boolean;
  createdAt: string;
}

// For creating notifications
export interface CreateNotificationInput {
  type: NotificationType; // USER_CREATED, USER_APPROVED, etc.
  model: NotificationModelType; // USER, RESERVATION, PAYMENT, etc.
  referenceId: string;
  titleEn: string;
  titleFr: string;
  titleAr: string;
  messageEn: string;
  messageFr: string;
  messageAr: string;
  link?: string;
  metadata?: any;
  actorUserId?: string;
  userId: string;
}