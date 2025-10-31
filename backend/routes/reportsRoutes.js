// backend/routes/reportsRoutes.js
"use strict";
const express = require("express");
const router = express.Router();
const db = require("../DB/db");

// GET /reports/summary?from=YYYY-MM-DD&to=YYYY-MM-DD
// response: { total_amount, order_count }
router.get("/summary", async (req, res) => {
  try {
    const { from, to } = req.query;

    // เงื่อนไขเวลา อิง o.created_at (แก้ชื่อคอลัมน์ให้ตรงกับ DB คุณ)
    const where = [];
    const params = [];

    if (from) { where.push("o.created_at >= ?"); params.push(`${from} 00:00:00`); }
    if (to)   { where.push("o.created_at <= ?"); params.push(`${to} 23:59:59`); }

    // ตัดบิลยกเลิก ถ้าคุณมี status
    where.push("(o.status IS NULL OR o.status NOT IN ('void','cancel','cancelled'))");

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const sql = `
      SELECT
        COALESCE(SUM(oi.total), SUM(oi.quantity * oi.price), 0) AS total_amount,
        COUNT(DISTINCT oi.order_id)                            AS order_count
      FROM order_items oi
      JOIN orders o ON o.order_id = oi.order_id
      ${whereSql}
    `;

    const [rows] = await db.query(sql, params);
    const { total_amount = 0, order_count = 0 } = rows[0] || {};
    res.json({
      total_amount: Number(total_amount) || 0,
      order_count: Number(order_count) || 0,
    });
  } catch (e) {
    console.error("GET /reports/summary failed:", e);
    res.status(500).json({ error: e.message });
  }
});

// GET /reports/by-type?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get("/by-type", async (req, res) => {
  try {
    const { from, to } = req.query;
    const where = [];
    const params = [];

    if (from) { where.push("o.created_at >= ?"); params.push(`${from} 00:00:00`); }
    if (to)   { where.push("o.created_at <= ?"); params.push(`${to} 23:59:59`); }

    where.push("(o.status IS NULL OR o.status NOT IN ('void','cancel','cancelled'))");

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const sql = `
      SELECT 
        oi.item_type,
        SUM(oi.quantity) AS total_qty,
        SUM(oi.total) AS total_sales
      FROM order_items oi
      JOIN orders o ON o.order_id = oi.order_id
      ${whereSql}
      GROUP BY oi.item_type
    `;

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (e) {
    console.error("GET /reports/by-type failed:", e);
    res.status(500).json({ error: e.message });
  }
});


// GET /reports/top-items?from=YYYY-MM-DD&to=YYYY-MM-DD&limit=5
router.get("/top-items", async (req, res) => {
  try {
    const { from, to, limit = 5 } = req.query;
    const where = [];
    const params = [];

    if (from) { where.push("o.created_at >= ?"); params.push(`${from} 00:00:00`); }
    if (to)   { where.push("o.created_at <= ?"); params.push(`${to} 23:59:59`); }

    where.push("(o.status IS NULL OR o.status NOT IN ('void','cancel','cancelled'))");

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const sql = `
      SELECT 
        oi.item_type,
        oi.name,
        SUM(oi.quantity) AS sold_quantity,
        SUM(oi.total) AS total_sales
      FROM order_items oi
      JOIN orders o ON o.order_id = oi.order_id
      ${whereSql}
      GROUP BY oi.item_type, oi.name
      ORDER BY sold_quantity DESC
      LIMIT ?
    `;

    const [rows] = await db.query(sql, [...params, Number(limit)]);
    res.json(rows);
  } catch (e) {
    console.error("GET /reports/top-items failed:", e);
    res.status(500).json({ error: e.message });
  }
});


// GET /reports/trend?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get("/trend", async (req, res) => {
  try {
    const { from, to } = req.query;
    const where = [];
    const params = [];

    if (from) { where.push("o.created_at >= ?"); params.push(`${from} 00:00:00`); }
    if (to)   { where.push("o.created_at <= ?"); params.push(`${to} 23:59:59`); }

    where.push("(o.status IS NULL OR o.status NOT IN ('void','cancel','cancelled'))");

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const sql = `
      SELECT 
        DATE(o.created_at) AS date,
        SUM(oi.total) AS total_sales
      FROM order_items oi
      JOIN orders o ON o.order_id = oi.order_id
      ${whereSql}
      GROUP BY DATE(o.created_at)
      ORDER BY DATE(o.created_at)
    `;

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (e) {
    console.error("GET /reports/trend failed:", e);
    res.status(500).json({ error: e.message });
  }
});


module.exports = router;
