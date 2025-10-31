"use strict";
const db = require("../DB/db");

const toNum = (v) => (v === "" || v == null ? null : Number(v));

function asBase64(maybeBuf) {
  if (!maybeBuf) return null;
  try {
    if (Buffer.isBuffer(maybeBuf)) return maybeBuf.toString("base64");
    if (typeof maybeBuf === "object" && maybeBuf?.type === "Buffer" && Array.isArray(maybeBuf.data)) {
      return Buffer.from(maybeBuf.data).toString("base64");
    }
    const s = String(maybeBuf);
    if (s.startsWith("data:")) return s.split(",")[1] || null;
    if (/^[A-Za-z0-9+/=\s]+$/.test(s) && s.replace(/\s+/g, "").length > 60) return s.replace(/\s+/g, "");
    return null;
  } catch { return null; }
}

function sanitizeLimitOffset(limit, offset) {
  const lim = Math.max(0, Math.min(1000, Number(limit) | 0));
  const off = Math.max(0, Number(offset) | 0);
  return { lim, off };
}

const Snacks = {
  async getAll({ limit = 100, offset = 0, q = "" } = {}) {
    const { lim, off } = sanitizeLimitOffset(limit, offset);
    const params = [];
    let where = "";
    if (q) { where = "WHERE name LIKE ?"; params.push(`%${q}%`); }

    const sql = `
      SELECT * FROM snacks
      ${where}
      ORDER BY name ASC
      LIMIT ${lim} OFFSET ${off}
    `;
    try {
      const [rows] = await db.query(sql, params);
      return rows.map((s) => ({ ...s, image: asBase64(s.images_data) }));
    } catch (err) {
      console.error("[Snacks.getAll] SQL error:", err.message, "\nSQL =", sql, "\nparams =", params);
      throw err;
    }
  },

  async countAll({ q = "" } = {}) {
    const params = [];
    let where = "";
    if (q) { where = "WHERE name LIKE ?"; params.push(`%${q}%`); }
    const sql = `SELECT COUNT(*) AS c FROM snacks ${where}`;
    try {
      const [r] = await db.query(sql, params);
      return Number(r?.[0]?.c || 0);
    } catch (err) {
      console.error("[Snacks.countAll] SQL error:", err.message, "\nSQL =", sql, "\nparams =", params);
      throw err;
    }
  },

  async getByIdFlexible(item_id) {
    const cols = ["item_id", "snack_id", "id", "menu_id", "m_id"];
    for (const c of cols) {
      const sql = `SELECT * FROM snacks WHERE ${c}=? LIMIT 1`;
      try {
        const [rows] = await db.query(sql, [item_id]);
        if (rows.length) {
          const s = rows[0];
          return { ...s, image: asBase64(s.images_data) };
        }
      } catch (e) {
        if (e && e.code === "ER_BAD_FIELD_ERROR") continue;
        console.error("[Snacks.getByIdFlexible] SQL error:", e.message, "\nSQL =", sql);
        throw e;
      }
    }
    return null;
  },

  async create({ name, description = null, price = null, images_data = null }) {
    const buf = images_data
      ? Buffer.from((String(images_data).includes(",") ? String(images_data).split(",")[1] : String(images_data)), "base64")
      : null;
    const sql = "INSERT INTO snacks (name, description, price, images_data) VALUES (?,?,?,?)";
    try {
      const [r] = await db.query(sql, [name, description, toNum(price), buf]);
      return r.insertId;
    } catch (err) {
      console.error("[Snacks.create] SQL error:", err.message, "\nSQL =", sql);
      throw err;
    }
  },

  async update(item_id, { name, description, price = null, images_data = undefined }) {
    const fields = [], values = [];
    if (name !== undefined)        { fields.push("name=?");        values.push(name); }
    if (description !== undefined) { fields.push("description=?"); values.push(description || null); }
    if (price !== null)            { fields.push("price=?");       values.push(toNum(price)); }
    if (images_data !== undefined) {
      const buf = images_data
        ? Buffer.from((String(images_data).includes(",") ? String(images_data).split(",")[1] : String(images_data)), "base64")
        : null;
      fields.push("images_data=?"); values.push(buf);
    }
    if (!fields.length) return 0;

    const cols = ["item_id", "snack_id", "id", "menu_id", "m_id"];
    let affected = 0, lastErr = null;
    for (const c of cols) {
      const sql = `UPDATE snacks SET ${fields.join(", ")} WHERE ${c}=?`;
      try {
        const [r] = await db.query(sql, [...values, item_id]);
        if (r.affectedRows) { affected = r.affectedRows; break; }
      } catch (e) {
        if (e && e.code === "ER_BAD_FIELD_ERROR") { lastErr = e; continue; }
        console.error("[Snacks.update] SQL error:", e.message, "\nSQL =", sql);
        throw e;
      }
    }
    if (!affected && lastErr) throw lastErr;
    return affected;
  },

  async removeFlexible(item_id) {
    const cols = ["item_id", "snack_id", "id", "menu_id", "m_id"];
    let affected = 0, lastErr = null;
    for (const c of cols) {
      const sql = `DELETE FROM snacks WHERE ${c}=?`;
      try {
        const [r] = await db.query(sql, [item_id]);
        if (r.affectedRows) { affected = r.affectedRows; break; }
      } catch (e) {
        if (e && e.code === "ER_BAD_FIELD_ERROR") { lastErr = e; continue; }
        console.error("[Snacks.removeFlexible] SQL error:", e.message, "\nSQL =", sql);
        throw e;
      }
    }
    if (!affected && lastErr) throw lastErr;
    return affected;
  },
};

module.exports = Snacks;
