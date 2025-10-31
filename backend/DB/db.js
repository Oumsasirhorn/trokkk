// backend/DB/db.js
"use strict";
const mysql = require("mysql2/promise");

// แยก local/prod เพื่อเปิด SSL เฉพาะตอนต่อคลาวด์
const isLocalHost = ["localhost", "127.0.0.1"].includes(String(process.env.DB_HOST || "").toLowerCase());
const useSSL = !isLocalHost && String(process.env.DB_SSL || "false").toLowerCase() === "true";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "restaurant_db",
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: false,
  charset: "utf8mb4",
  supportBigNumbers: true,
  dateStrings: true,       // กัน timezone เพี้ยนเวลา serialize
  ssl: useSSL ? { rejectUnauthorized: true } : undefined, // จำเป็นสำหรับ Railway/คลาวด์
});

// (ไม่บังคับ) ตั้งค่าบางอย่างระดับ session
pool.on("connection", async (conn) => {
  try {
    await conn.query("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
    await conn.query("SET time_zone = '+07:00'"); // ปรับตามโซนที่ต้องการ
  } catch (e) {
    console.warn("Session init skipped:", e.message);
  }
});

async function assertDb() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log("✅ DB connected (ssl:", useSSL, ")"); 
  } catch (err) {
    console.error("❌ DB connect failed:", err.message);
    throw err;
  }
}

async function query(sql, params) {
  return pool.query(sql, params);
}

async function getConnection() {
  return pool.getConnection();
}

module.exports = { pool, query, getConnection, assertDb };
