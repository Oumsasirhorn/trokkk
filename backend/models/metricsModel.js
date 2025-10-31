// backend/models/metricsModel.js
"use strict";

// ใช้ path DB ของคุณ
const { pool } = require("../DB/db");

/**
 * สรุปยอดขายจากตาราง order_items เพียวๆ (ไม่พึ่ง orders)
 * - total_sales   = SUM(price * quantity)
 * - orders_count  = COUNT(DISTINCT order_id)
 * - items_count   = SUM(quantity)
 * NOTE: เวอร์ชันนี้ยังไม่รองรับช่วงเวลา (from/to) เพราะไม่รู้ชื่อคอลัมน์วันที่จริง
 */
exports.getSalesSummary = async () => {
  const conn = await pool.getConnection();
  try {
    // 1) นับจำนวนออเดอร์จาก DISTINCT order_id
    const [[rowOrders]] = await conn.query(`
      SELECT COALESCE(COUNT(DISTINCT order_id), 0) AS orders_count
      FROM order_items
    `);

    // 2) นับจำนวนรายการ และยอดรวม (GMV)
    const [[rowAgg]] = await conn.query(`
      SELECT
        COALESCE(SUM(quantity), 0)                AS items_count,
        COALESCE(SUM(price * quantity), 0)        AS total_sales
      FROM order_items
    `);

    const orders_count = Number(rowOrders?.orders_count || 0);
    const items_count  = Number(rowAgg?.items_count  || 0);
    const total_sales  = Number(rowAgg?.total_sales  || 0);
    const avg_order_value =
      orders_count > 0 ? Number((total_sales / orders_count).toFixed(2)) : 0;

    return { total_sales, orders_count, items_count, avg_order_value };
  } finally {
    conn.release();
  }
};
