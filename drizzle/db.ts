// drizzle/db.ts
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";
import 'dotenv/config'

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  charset: "utf8mb4",  // Ensure UTF-8 MB4 for full Unicode support
  // timezone: "+00:00",  // Set timezone if needed
});

export const db = drizzle(pool, {
  schema,
  mode: "default",
});