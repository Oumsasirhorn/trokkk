// backend/DB/db.js
const mysql = require("mysql2/promise"); // ใช้ promise ล้วน

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "123456",
  database: process.env.DB_NAME || "restaurant_db",
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: false,
});

async function assertDb() {
  const conn = await pool.getConnection();
  await conn.ping();
  conn.release();
  console.log("✅ DB connected");
}

async function query(sql, params) {
  return pool.query(sql, params);
}

async function getConnection() {
  // คืน promise แบบใช้ await ได้
  return pool.getConnection();
}

module.exports = { pool, query, getConnection, assertDb };
