// scripts/setup-database.ts
import { config } from "dotenv";
config();
import mysql from "mysql2/promise";

async function setupDatabase() {
  try {
    // Connect without database first
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    const dbName = process.env.DB_NAME;
    
    // Create database with utf8mb4
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` 
      CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    
    console.log(`✅ Database '${dbName}' is ready`);
    
    await connection.end();
  } catch (error: any) {
    console.error("❌ Database setup error:", error.message);
    process.exit(1);
  }
}

setupDatabase();