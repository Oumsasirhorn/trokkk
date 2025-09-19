const DrinkBasePrice = require("../models/drinkBasePriceModel");

// 📋 ดูราคาฐานเครื่องดื่มทั้งหม// ดูราคาฐานเครื่องดื่มทั้งหมด
exports.getAllDrinkBasePrices = async (req, res) => {
  try {
    const result = await DrinkBasePrice.getAll();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ➕ เพิ่มราคาฐานเครื่องดื่ม
exports.addDrinkBasePrice = async (req, res) => {
  try {
    const { drink_id, temperature, base_price } = req.body;
    if (!drink_id || !temperature || !base_price) {
      return res.status(400).json({ message: "กรอกข้อมูลไม่ครบ" });
    }

    const insertId = await DrinkBasePrice.create(drink_id, temperature, base_price);
    res.json({ message: "เพิ่มราคาฐานเรียบร้อย", id: insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ แก้ไขราคาฐานเครื่องดื่ม
exports.updateDrinkBasePrice = async (req, res) => {
  try {
    const { drink_id, temperature } = req.params;
    const { base_price } = req.body;

    const result = await DrinkBasePrice.update(drink_id, temperature, base_price);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบราคาฐานเครื่องดื่มนี้" });
    }

    res.json({ message: "แก้ไขราคาฐานเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ ลบราคาฐานเครื่องดื่ม
exports.deleteDrinkBasePrice = async (req, res) => {
  try {
    const { drink_id, temperature } = req.params;

    const result = await DrinkBasePrice.remove(drink_id, temperature);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบราคาฐานเครื่องดื่มนี้" });
    }

    res.json({ message: "ลบราคาฐานเครื่องดื่มเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
