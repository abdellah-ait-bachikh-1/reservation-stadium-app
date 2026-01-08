import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { clubs, notifications, sports, users } from "./schema";

// Create a MySQL connection pool
const pool = mysql.createPool(process.env.DATABASE_URL!);

export const db = drizzle(pool, {
  schema: { users, clubs, sports, notifications },
  mode: "default",
});
