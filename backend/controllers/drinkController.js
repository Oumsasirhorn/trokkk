const Drink = require("../models/drinkModel");

// ดึงเครื่องดื่มทั้งหมด
exports.getAllDrinks = async (req, res) => {
  try {
    const drinks = await Drink.getAll();
    res.json(drinks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ดึงราคาตาม item_id + temperature
exports.getDrinkPrice = async (req, res) => {
  const { item_id } = req.params;
  const { temperature } = req.query;

  if (!temperature) {
    return res.status(400).json({ message: "กรุณาเลือก temperature" });
  }

  try {
    const results = await Drink.getPriceByItemAndTemp(item_id, temperature);
    if (!results.length) {
      return res.status(404).json({ message: "ไม่พบเครื่องดื่มหรือ temperature นี้" });
    }
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// เพิ่มเครื่องดื่มใหม่
exports.addDrink = async (req, res) => {
  const { name, sweetness, toppings, extra_price } = req.body;

  try {
    const result = await Drink.create(name, sweetness, toppings, extra_price || 0);
    res.json({ message: "เพิ่มเครื่องดื่มเรียบร้อย", item_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// อัพเดทเครื่องดื่ม
exports.updateDrink = async (req, res) => {
  const { item_id } = req.params;
  const { name, sweetness, toppings, extra_price } = req.body;

  try {
    const result = await Drink.update(item_id, name, sweetness, toppings, extra_price || 0);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบเครื่องดื่มนี้" });
    }
    res.json({ message: "แก้ไขเครื่องดื่มเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ลบเครื่องดื่ม
exports.deleteDrink = async (req, res) => {
  const { item_id } = req.params;

  try {
    const result = await Drink.remove(item_id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบเครื่องดื่มนี้" });
    }
    res.json({ message: "ลบเครื่องดื่มเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
