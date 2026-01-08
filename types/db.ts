import { notificationModelValues, notifications, notificationTypes, users } from "@/drizzle/schema";

export type UserType = typeof users.$inferSelect;
export type InsertUserType = typeof users.$inferInsert;
export type UserRoleType = "ADMIN" | "CLUB";
export type UserPreferredLocaleType = "FR" | "EN" | "AR";

export type NotificationType = typeof notifications.$inferSelect;
export type InsertNotificationType = typeof notifications.$inferInsert;
export type NotificationTypes = (typeof notificationTypes)[number];
export type NotificationModels = (typeof notificationModelValues)[number];


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
