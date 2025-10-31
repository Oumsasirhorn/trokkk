"use strict";

const db = require("../DB/db");

/* =================== Utils =================== */
const toNum = (v) => (v === "" || v == null ? null : Number(v));
const isFiniteNum = (v) => Number.isFinite(Number(v));

const normalizeId = (row) =>
  row.item_id ?? row.drink_id ?? row.id ?? row.menu_id ?? row.m_id ?? null;

const normalizePrices = (row) => ({
  price_hot:     toNum(row.price_hot) ?? null,
  price_iced:    toNum(row.price_iced) ?? null,
  price_frappe:  toNum(row.price_frappe) ?? null,
});

function computePrice(row, temp) {
  const { price_hot, price_iced, price_frappe } = normalizePrices(row);
  const map = { "ร้อน": price_hot, "เย็น": price_iced, "ปั่น": price_frappe };

  let base = temp ? map[temp] : null;
  if (base == null) {
    // default = เลือกราคาที่มีค่าต่ำสุดที่ > 0
    const cands = [price_hot, price_iced, price_frappe]
      .map(toNum)
      .filter((n) => n != null && n > 0);
    base = cands.length ? Math.min(...cands) : null;
  }
  return base == null ? null : Number(base);
}

function bufferToBase64(raw) {
  if (!raw) return null;
  try {
    const buf = Buffer.isBuffer(raw) ? raw : Buffer.from(raw);
    return buf.toString("base64");
  } catch { return null; }
}

function base64ToBuffer(maybeDataUrlOrB64) {
  if (!maybeDataUrlOrB64) return null;
  try {
    const s = String(maybeDataUrlOrB64).trim();
    const pure = s.startsWith("data:") ? s.slice(s.indexOf(",") + 1) : s;
    return Buffer.from(pure, "base64");
  } catch { return null; }
}

async function findDrinkByAnyId(conn, id) {
  const cols = ["item_id", "drink_id", "id", "menu_id", "m_id"];
  for (const col of cols) {
    try {
      const [rows] = await conn.query(`SELECT * FROM drinks WHERE ${col}=? LIMIT 1`, [id]);
      if (rows.length) return rows[0];
    } catch (e) {
      if (e && e.code === "ER_BAD_FIELD_ERROR") continue;
      throw e;
    }
  }
  return null;
}

/* ================= Controllers ================ */

// GET /drinks
async function getAllDrinks(_req, res) {
  try {
    const [rows] = await db.query(`SELECT * FROM drinks ORDER BY name ASC`);
    const items = rows.map((r) => {
      const id = normalizeId(r);
      const { price_hot, price_iced, price_frappe } = normalizePrices(r);
      const rawImg = r.images_data ?? r.image ?? null;

      return {
        id,
        item_id: id,
        name: r.name,
        sweetness: r.sweetness ?? null,
        price_hot,
        price_iced,
        price_frappe,
        image: bufferToBase64(rawImg), // base64 (ไม่ใส่ data: prefix)
        updated_at: r.updated_at || r.modified_at || null,
      };
    });
    res.json(items);
  } catch (err) {
    console.error("getAllDrinks failed:", err);
    res.status(500).json({ error: err.message });
  }
}

// GET /drinks/:item_id/price?temp=เย็น
async function getDrinkPrice(req, res) {
  const itemId = Number(req.params.item_id);
  const temp = req.query.temp || null;
  if (!isFiniteNum(itemId))
    return res.status(400).json({ error: "item_id ไม่ถูกต้อง" });

  let conn;
  try {
    conn = await db.getConnection();
    const row = await findDrinkByAnyId(conn, itemId);
    if (!row) return res.status(404).json({ error: "ไม่พบเครื่องดื่ม" });

    const price = computePrice(row, temp);
    if (price == null) return res.status(400).json({ error: `ไม่มีราคา temp=${temp || "-"}` });

    res.json({ item_id: itemId, temp, price });
  } catch (err) {
    console.error("getDrinkPrice failed:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
}

// GET /drinks/:item_id/image
async function getDrinkImage(req, res) {
  const itemId = Number(req.params.item_id);
  if (!isFiniteNum(itemId))
    return res.status(400).json({ error: "item_id ไม่ถูกต้อง" });

  try {
    const [rows] = await db.query(
      `SELECT images_data FROM drinks
       WHERE item_id=? OR drink_id=? OR id=? OR menu_id=? OR m_id=?
       LIMIT 1`,
      [itemId, itemId, itemId, itemId, itemId]
    );
    if (!rows.length) return res.status(404).end();

    const raw = rows[0].images_data;
    if (!raw) return res.status(204).end();

    res.setHeader("Content-Type", "image/jpeg"); // ปรับตามจริงถ้ารู้ชนิด
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.end(Buffer.isBuffer(raw) ? raw : Buffer.from(raw));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}

// POST /drinks
async function addDrink(req, res) {
  try {
    const {
      name,
      sweetness = null,
      price_hot = null,
      price_iced = null,
      price_frappe = null,
      images_data = null,      // รองรับ data URL/base64
      image_base64 = null,     // รองรับชื่อคีย์นี้ด้วย
    } = req.body || {};

    if (!name) return res.status(400).json({ error: "name ต้องไม่ว่าง" });

    const imgBuf = image_base64
      ? base64ToBuffer(image_base64)
      : images_data
      ? base64ToBuffer(images_data)
      : null;

    const [r] = await db.query(
      `INSERT INTO drinks (name, sweetness, images_data, price_hot, price_iced, price_frappe)
       VALUES (?,?,?,?,?,?)`,
      [
        name,
        sweetness || null,
        imgBuf,
        toNum(price_hot),
        toNum(price_iced),
        toNum(price_frappe),
      ]
    );

    res.status(201).json({ message: "เพิ่มเครื่องดื่มสำเร็จ", item_id: r.insertId });
  } catch (err) {
    console.error("addDrink failed:", err);
    res.status(500).json({ error: err.message });
  }
}

// PUT /drinks/:item_id
async function updateDrink(req, res) {
  const itemId = Number(req.params.item_id);
  if (!isFiniteNum(itemId))
    return res.status(400).json({ error: "item_id ไม่ถูกต้อง" });

  const {
    name,
    sweetness,
    price_hot = null,
    price_iced = null,
    price_frappe = null,
    images_data,    // undefined = ไม่แตะ, null/"" = ลบรูป, string = อัปเดต
    image_base64,   // รองรับชื่อคีย์นี้ด้วย
  } = req.body || {};

  try {
    const fields = [];
    const values = [];

    if (name !== undefined)        { fields.push("name=?");        values.push(name); }
    if (sweetness !== undefined)   { fields.push("sweetness=?");   values.push(sweetness || null); }
    if (price_hot !== null)        { fields.push("price_hot=?");   values.push(toNum(price_hot)); }
    if (price_iced !== null)       { fields.push("price_iced=?");  values.push(toNum(price_iced)); }
    if (price_frappe !== null)     { fields.push("price_frappe=?");values.push(toNum(price_frappe)); }

    if (images_data !== undefined || image_base64 !== undefined) {
      const src = image_base64 !== undefined ? image_base64 : images_data;
      const buf = src ? base64ToBuffer(src) : null; // ว่าง = ลบรูป
      fields.push("images_data=?"); values.push(buf);
    }

    if (!fields.length) return res.status(400).json({ error: "ไม่มีฟิลด์ให้อัปเดต" });

    const where = ["item_id","drink_id","id","menu_id","m_id"];
    let updated = 0, lastErr = null;

    for (const col of where) {
      try {
        const sql = `UPDATE drinks SET ${fields.join(", ")} WHERE ${col}=?`;
        const [rs] = await db.query(sql, [...values, itemId]);
        updated = rs.affectedRows;
        if (updated) break;
      } catch (e) {
        if (e && e.code === "ER_BAD_FIELD_ERROR") { lastErr = e; continue; }
        throw e;
      }
    }

    if (!updated) {
      if (lastErr) throw lastErr;
      return res.status(404).json({ error: "ไม่พบเครื่องดื่มที่ต้องการแก้ไข" });
    }

    res.json({ message: "อัปเดตเครื่องดื่มสำเร็จ" });
  } catch (err) {
    console.error("updateDrink failed:", err);
    res.status(500).json({ error: err.message });
  }
}

// DELETE /drinks/:item_id
async function deleteDrink(req, res) {
  const itemId = Number(req.params.item_id);
  if (!isFiniteNum(itemId))
    return res.status(400).json({ error: "item_id ไม่ถูกต้อง" });

  try {
    const where = ["item_id","drink_id","id","menu_id","m_id"];
    let deleted = 0, lastErr = null;

    for (const col of where) {
      try {
        const [rs] = await db.query(`DELETE FROM drinks WHERE ${col}=?`, [itemId]);
        deleted = rs.affectedRows;
        if (deleted) break;
      } catch (e) {
        if (e && e.code === "ER_BAD_FIELD_ERROR") { lastErr = e; continue; }
        throw e;
      }
    }

    if (!deleted) {
      if (lastErr) throw lastErr;
      return res.status(404).json({ error: "ไม่พบเครื่องดื่มที่ต้องการลบ" });
    }

    res.json({ message: "ลบเครื่องดื่มสำเร็จ" });
  } catch (err) {
    console.error("deleteDrink failed:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAllDrinks,
  getDrinkPrice,
  getDrinkImage,
  addDrink,
  updateDrink,
  deleteDrink,
};
