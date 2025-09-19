const mysql = require('mysql2');

// สร้าง connection pool เพื่อประสิทธิภาพที่ดี
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',   // host ของฐานข้อมูล
  user: process.env.DB_USER || 'root',        // user ของ MySQL
  password: process.env.DB_PASSWORD || '123456',    // password ของ MySQL
  database: process.env.DB_NAME || 'restaurant_db', // ชื่อ database
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ใช้ promise wrapper เพื่อให้รองรับ async/await
const db = pool.promise();

module.exports = db;
