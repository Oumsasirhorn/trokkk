// backend/controllers/drinkBasePriceController.js
const DrinkBasePrice = require("../models/drinkBasePriceModel");

// แปลงชื่ออุณหภูมิให้เป็นคีย์มาตรฐาน
function tempKey(temperature) {
  if (!temperature) return null;
  const t = String(temperature).trim();
  if (["ร้อน", "hot", "HOT"].includes(t)) return "hot";
  if (["เย็น", "cold", "COLD"].includes(t)) return "cold";
  if (["ปั่น", "blend", "BLEND"].includes(t)) return "blend";
  return t.toLowerCase();
}

function toNumber(n) {
  const v = Number(n);
  return Number.isFinite(v) ? v : null;
}

// 📋 เรียกแบบ raw
exports.getAllDrinkBasePricesRaw = async (req, res) => {
  try {
    const rows = await DrinkBasePrice.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📋 เรียกแบบจัดรูป (map)
exports.getAllDrinkBasePrices = async (req, res) => {
  try {
    const rows = await DrinkBasePrice.getAll(); // expect: drink_id, temperature, base_price
    const map = {};

    for (const r of rows) {
      const id = String(r.drink_id);
      const tk = tempKey(r.temperature);
      const price = toNumber(r.base_price);

      if (!map[id]) map[id] = { name: id, hot: null, cold: null, blend: null };
      if (tk && price != null) map[id][tk] = price;
    }

    res.json(map);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➕ เพิ่มราคาฐาน
exports.addDrinkBasePrice = async (req, res) => {
  try {
    const { drink_id, temperature, base_price } = req.body;
    if (!drink_id || !temperature || base_price == null) {
      return res.status(400).json({ message: "กรอกข้อมูลไม่ครบ" });
    }
    const result = await DrinkBasePrice.create(drink_id, temperature, base_price);
    res.json({ message: "เพิ่มราคาฐานเรียบร้อย", insertId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ แก้ไขราคาฐาน
exports.updateDrinkBasePrice = async (req, res) => {
  try {
    const { drink_id, temperature } = req.params;
    const { base_price } = req.body;
    if (!drink_id || !temperature || base_price == null) {
      return res.status(400).json({ message: "กรอกข้อมูลไม่ครบ" });
    }

    const result = await DrinkBasePrice.update(drink_id, temperature, base_price);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "ไม่พบรายการ" });

    res.json({ message: "อัปเดตราคาเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ ลบราคาฐาน
exports.deleteDrinkBasePrice = async (req, res) => {
  try {
    const { drink_id, temperature } = req.params;
    const result = await DrinkBasePrice.remove(drink_id, temperature);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "ไม่พบรายการ" });

    res.json({ message: "ลบเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
