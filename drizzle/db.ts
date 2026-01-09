import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import {
  cashPaymentRecords,
  clubs,
  monthlyPayments,
  monthlySubscriptions,
  notifications,
  reservations,
  reservationSeries,
  sports,
  stadiumImages,
  stadiums,
  stadiumSports,
  users,
} from "./schema";

// Create a MySQL connection pool
const pool = mysql.createPool(process.env.DATABASE_URL!);

export const db = drizzle(pool, {
  schema: {
    users,
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
  },
  mode: "default",
});
