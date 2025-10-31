"use strict";
const db = require("../DB/db");

/* -------------------- Helpers -------------------- */
const _colCache = new Map();
async function columnExists(table, column) {
  const key = `${table}.${column}`;
  if (_colCache.has(key)) return _colCache.get(key);

  const sql = `
    SELECT 1
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = ?
      AND COLUMN_NAME = ?
    LIMIT 1
  `;
  const [rows] = await db.query(sql, [table, column]);
  const ok = rows.length > 0;
  _colCache.set(key, ok);
  return ok;
}

async function getEnumOptions(table, column) {
  const sql = `
    SELECT COLUMN_TYPE
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = ?
      AND COLUMN_NAME = ?
  `;
  const [rows] = await db.query(sql, [table, column]);
  if (!rows.length) return [];
  const type = rows[0].COLUMN_TYPE || "";
  const m = type.match(/^enum\((.+)\)$/i);
  if (!m) return [];
  return m[1]
    .split(/,(?=(?:[^']*'[^']*')*[^']*$)/)
    .map(s => s.trim().replace(/^'(.*)'$/, "$1"));
}

function normalizeType(raw) {
  const t = String(raw || "").trim().toLowerCase();
  if (["drink","drinks","beverage"].includes(t)) return "drink";
  if (["snack","snacks"].includes(t)) return "snack";
  if (["main_dish","main","maindish","food","foods","main-dish","main dish"].includes(t)) return "main_dish";
  return t || "drink";
}

function normalizeMethod(input, enumOptions) {
  const val = String(input || "").trim().toLowerCase();
  if (!enumOptions || !enumOptions.length) return input || null;

  const groups = [
    { key: "cash",       aliases: ["cash", "เงินสด"] },
    { key: "card",       aliases: ["card", "credit", "บัตร", "บัตรเครดิต"] },
    { key: "transfer",   aliases: ["transfer", "โอน", "โอนเงิน", "bank", "bank transfer"] },
    { key: "qr",         aliases: ["qr", "qr code", "คิวอาร์", "คิวอาร์โค้ด"] },
    { key: "promptpay",  aliases: ["promptpay", "พร้อมเพย์", "pp"] },
  ];

  let groupKey = null;
  for (const g of groups) if (g.aliases.some(a => a.toLowerCase() === val)) groupKey = g.key;
  if (groupKey) {
    let hit = enumOptions.find(o => o.toLowerCase() === groupKey);
    if (hit) return hit;
    const g = groups.find(x => x.key === groupKey);
    hit = enumOptions.find(o => g.aliases.includes(o.toLowerCase()));
    if (hit) return hit;
  }

  const direct = enumOptions.find(o => o.toLowerCase() === val);
  if (direct) return direct;

  return null;
}

/* -------------------- Orders Model -------------------- */
const Orders = {
  async getAll() {
    const hasTableNumber = await columnExists("orders", "table_number");
    const tSel = hasTableNumber ? "o.table_number" : "o.table_label";
    const sql = `
      SELECT o.*, ${tSel} AS table_number
      FROM orders o
      ORDER BY o.order_time DESC
    `;
    const [rows] = await db.query(sql);
    return rows;
  },

  async getByTable(table_number) {
    const sql = `
      SELECT *
      FROM orders
      WHERE table_number = ?
      ORDER BY order_time DESC
    `;
    const [rows] = await db.query(sql, [table_number]);
    return rows;
  },

  async createFull({ table_number, table_label, items, payment_method, order_note }) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const statusInit = (payment_method === "cash" || payment_method === "card") ? "ชำระเงินแล้ว" : "รอดำเนินการ";

      // 1) สร้าง order
      const [orderRes] = await conn.query(
        `INSERT INTO orders (table_number, status, order_time) VALUES (?, ?, NOW())`,
        [table_number || null, statusInit]
      );
      const order_id = orderRes.insertId;

      // อัปเดต table_label / order_note / payment_method ถ้ามี column
      if (table_label && (await columnExists("orders", "table_label"))) {
        await conn.query(`UPDATE orders SET table_label=? WHERE order_id=?`, [table_label, order_id]);
      }
      if (order_note && (await columnExists("orders", "order_note"))) {
        await conn.query(`UPDATE orders SET order_note=? WHERE order_id=?`, [order_note, order_id]);
      }
      if (payment_method && (await columnExists("orders", "payment_method"))) {
        await conn.query(`UPDATE orders SET payment_method=? WHERE order_id=?`, [payment_method, order_id]);
      }

      // 2) แทรก order_items
      const hasQtyNew = await columnExists("order_items", "qty");
      const hasPrice  = await columnExists("order_items", "price");
      const qtyCol    = hasQtyNew ? "qty" : "quantity";

      const normItems = (items || []).map(x => {
        const type = normalizeType(x.item_type);
        const id   = String(x.ref_id || "").trim();
        const name = String(x.name || "-").trim();
        const price= Number(x.price) || 0;
        const qty  = Number(x.qty) || 0;
        return { type, id, name, price, qty, itemNote: x.itemNote || null };
      }).filter(x => x.id && x.qty > 0);

      if (!normItems.length) throw new Error("NO_ITEMS");

      const sqlItem = `
        INSERT INTO order_items (order_id, item_type, item_id, name, ${qtyCol}, price)
        VALUES (?,?,?,?,?,?)
      `;
      for (const it of normItems) {
        await conn.query(sqlItem, [order_id, it.type, it.id, it.name, it.qty, it.price]);
      }

      // 3) คำนวณ total_amount
      const [[row]] = await conn.query(
        `SELECT COALESCE(SUM(${qtyCol} * price),0) AS s FROM order_items WHERE order_id=?`,
        [order_id]
      );
      const total_amount = Number(row?.s || 0);
      if (await columnExists("orders", "total_amount")) {
        await conn.query(`UPDATE orders SET total_amount=? WHERE order_id=?`, [total_amount, order_id]);
      }

      // 4) payments
      const [pTbl] = await conn.query(`
        SELECT 1 FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME='payments' LIMIT 1
      `);
      if (pTbl.length) {
        const enumOptions = await getEnumOptions("payments", "method");
        const methodForDb = normalizeMethod(payment_method, enumOptions);
        const amountToPay = (payment_method === "cash" || payment_method === "card") ? total_amount : 0;
        await conn.query(
          `INSERT INTO payments (order_id, amount, method, payment_time) VALUES (?,?,?,NOW())`,
          [order_id, amountToPay, methodForDb]
        );
      }

      await conn.commit();
      return { order_id, total_amount, status: statusInit };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  async updateStatus(order_id, status) {
    await db.query("UPDATE orders SET status=? WHERE order_id=?", [status, order_id]);
  },

  async pay(order_id) {
    await db.query("UPDATE orders SET status='ชำระเงินแล้ว' WHERE order_id=?", [order_id]);
  },

  async remove(order_id) {
    await db.query("DELETE FROM order_items WHERE order_id=?", [order_id]);
    await db.query("DELETE FROM payments WHERE order_id=?", [order_id]);
    await db.query("DELETE FROM orders WHERE order_id=?", [order_id]);
  }
};

module.exports = Orders;
