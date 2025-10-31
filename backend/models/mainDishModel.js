"use strict";

const db = require("../DB/db");

/* ===== Utils ===== */
const toNum = (v) => (v === "" || v == null ? null : Number(v));

const normalizeId = (row) =>
  row.item_id ?? row.id ?? row.menu_id ?? row.m_id ?? null;

const bufferToBase64 = (raw) => {
  if (!raw) return null;
  try {
    const buf = Buffer.isBuffer(raw) ? raw : Buffer.from(raw);
    return buf.toString("base64"); // ★ คืน base64 string (ไม่มี data: prefix)
  } catch {
    return null;
  }
};

const base64ToBuffer = (maybeDataUrlOrB64) => {
  if (!maybeDataUrlOrB64) return null;
  try {
    const s = String(maybeDataUrlOrB64).trim();
    const pure = s.startsWith("data:") ? s.slice(s.indexOf(",") + 1) : s;
    return Buffer.from(pure, "base64");
  } catch {
    return null;
  }
};

const MainDish = {
  // options: {limit, offset, q}
  async getAll(options = {}) {
    const limit  = Number.isFinite(options.limit)  ? options.limit  : 100;
    const offset = Number.isFinite(options.offset) ? options.offset : 0;
    const q      = (options.q || "").trim();

    let sql = `SELECT * FROM main_dishes`;
    const params = [];

    if (q) {
      sql += ` WHERE name LIKE ? OR description LIKE ?`;
      params.push(`%${q}%`, `%${q}%`);
    }

    sql += ` ORDER BY item_id DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await db.query(sql, params);

    // ★ แปลงรูป Buffer -> base64 string
    return rows.map((r) => ({
      ...r,
      item_id: normalizeId(r),
      images_data: r.images_data ? bufferToBase64(r.images_data) : null,
      // แนบ field image ด้วย เผื่อโค้ดหน้าเว็บดู key นี้
      image: r.images_data ? bufferToBase64(r.images_data) : null,
    }));
  },

  async getByIdFlexible(item_id) {
    const cols = ["item_id", "id", "menu_id", "m_id"];
    for (const c of cols) {
      try {
        const [rows] = await db.query(`SELECT * FROM main_dishes WHERE ${c}=? LIMIT 1`, [item_id]);
        if (rows.length) {
          const r = rows[0];
          return {
            ...r,
            item_id: normalizeId(r),
            images_data: r.images_data ? bufferToBase64(r.images_data) : null,
            image: r.images_data ? bufferToBase64(r.images_data) : null,
          };
        }
      } catch (e) {
        if (e && e.code === "ER_BAD_FIELD_ERROR") continue;
        throw e;
      }
    }
    return null;
  },

  // payload: {name, description, price, images_data}
  async create({ name, description = null, price = null, images_data = null }) {
    const buf = images_data ? base64ToBuffer(images_data) : null;

    const [r] = await db.query(
      `INSERT INTO main_dishes (name, description, price, images_data)
       VALUES (?,?,?,?)`,
      [name, description, toNum(price), buf]
    );
    return r.insertId;
  },

  // images_data: undefined = ไม่แตะ, null/"" = ลบรูป, string = อัปเดต
  async update(item_id, { name, description, price = null, images_data = undefined }) {
    const fields = [];
    const values = [];

    if (name !== undefined)        { fields.push("name=?");        values.push(name); }
    if (description !== undefined) { fields.push("description=?"); values.push(description); }
    if (price !== null)            { fields.push("price=?");       values.push(toNum(price)); }

    if (images_data !== undefined) {
      const buf = images_data ? base64ToBuffer(images_data) : null;
      fields.push("images_data=?"); values.push(buf);
    }

    if (!fields.length) return 0;

    const sql = `UPDATE main_dishes SET ${fields.join(", ")} WHERE item_id=?`;
    const [r] = await db.query(sql, [...values, item_id]);
    return r.affectedRows;
  },

  async remove(item_id) {
    const [r] = await db.query(`DELETE FROM main_dishes WHERE item_id=?`, [item_id]);
    return r.affectedRows;
  },
};

module.exports = MainDish;
