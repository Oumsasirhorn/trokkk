"use strict";
const db = require("../DB/db");
const toNum = (v) => (v === "" || v == null ? null : Number(v));

const Drink = {
  async getAll() {
    const [rows] = await db.query("SELECT * FROM drinks ORDER BY name ASC");
    return rows.map((d) => ({
      ...d,
      image: d.images_data
        ? (Buffer.isBuffer(d.images_data)
            ? d.images_data.toString("base64")
            : String(d.images_data))
        : null,
    }));
  },

  async getByIdFlexible(item_id) {
    const cols = ["item_id","drink_id","id","menu_id","m_id"];
    for (const c of cols) {
      try {
        const [rows] = await db.query(`SELECT * FROM drinks WHERE ${c}=? LIMIT 1`, [item_id]);
        if (rows.length) return rows[0];
      } catch (e) {
        if (e && e.code === "ER_BAD_FIELD_ERROR") continue;
        throw e;
      }
    }
    return null;
  },

  async create({ name, sweetness=null, price_hot=null, price_iced=null, price_frappe=null, images_data=null }) {
    const buf = images_data
      ? Buffer.from(
          (String(images_data).includes(",")
            ? String(images_data).split(",")[1]
            : String(images_data)),
          "base64"
        )
      : null;

    const [r] = await db.query(
      `INSERT INTO drinks (name, sweetness, images_data, price_hot, price_iced, price_frappe)
       VALUES (?,?,?,?,?,?)`,
      [name, sweetness, buf, toNum(price_hot), toNum(price_iced), toNum(price_frappe)]
    );
    return r.insertId;
  },

  async update(item_id, { name, sweetness, price_hot=null, price_iced=null, price_frappe=null, images_data=undefined }) {
    const fields = [], values = [];
    if (name !== undefined)        { fields.push("name=?");        values.push(name); }
    if (sweetness !== undefined)   { fields.push("sweetness=?");   values.push(sweetness || null); }
    if (price_hot !== null)        { fields.push("price_hot=?");   values.push(toNum(price_hot)); }
    if (price_iced !== null)       { fields.push("price_iced=?");  values.push(toNum(price_iced)); }
    if (price_frappe !== null)     { fields.push("price_frappe=?");values.push(toNum(price_frappe)); }

    if (images_data !== undefined) {
      const buf = images_data
        ? Buffer.from(
            (String(images_data).includes(",")
              ? String(images_data).split(",")[1]
              : String(images_data)),
            "base64"
          )
        : null;
      fields.push("images_data=?"); values.push(buf);
    }
    if (!fields.length) return 0;

    const where = ["item_id","drink_id","id","menu_id","m_id"];
    let affected = 0, lastErr = null;

    for (const col of where) {
      try {
        const sql = `UPDATE drinks SET ${fields.join(", ")} WHERE ${col}=?`;
        const [r]  = await db.query(sql, [...values, item_id]);
        affected = r.affectedRows;
        if (affected) break;
      } catch (e) {
        if (e && e.code === "ER_BAD_FIELD_ERROR") { lastErr = e; continue; }
        throw e;
      }
    }
    if (!affected && lastErr) throw lastErr;
    return affected;
  },

  async remove(item_id) {
    const where = ["item_id","drink_id","id","menu_id","m_id"];
    for (const col of where) {
      const [r] = await db.query(`DELETE FROM drinks WHERE ${col}=?`, [item_id]);
      if (r.affectedRows) return r.affectedRows;
    }
    return 0;
  },
};

module.exports = Drink;
