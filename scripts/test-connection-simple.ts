// scripts/test-connection.ts
import { config } from "dotenv";
config({ path: '.env' });

console.log("🔍 Testing MySQL connection...");
console.log("Environment variables:");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "✅ Set" : "❌ Missing");
console.log("DB_NAME:", process.env.DB_NAME);

import mysql from "mysql2/promise";

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    
    console.log("\n✅ MySQL connection successful!");
    
    const [rows] = await connection.query("SELECT 1 as test");
    console.log("Test query result:", rows);
    
    // Check if database exists
    const [databases] = await connection.query("SHOW DATABASES");
    console.log("\n📊 Available databases:");
    (databases as any[]).forEach(db => {
      console.log(`  - ${db.Database}`);
    });
    
    await connection.end();
    
  } catch (error: any) {
    console.error("\n❌ MySQL connection failed!");
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("\n💡 Try these commands:");
    console.error("1. Check if MySQL is running:");
    console.error("   sudo systemctl status mysql");
    console.error("2. Start MySQL if not running:");
    console.error("   sudo systemctl start mysql");
    console.error("3. Test login manually:");
    console.error(`   mysql -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD}`);
  }
}

testConnection();