const MainDish = require("../models/mainDishModel");

// ดึงทั้งหมด
exports.getAllMainDishes = async (req, res) => {
  try {
    const results = await MainDish.getAll();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ดึงตาม item_id
exports.getMainDishById = async (req, res) => {
  const { item_id } = req.params;
  try {
    const results = await MainDish.getById(item_id);
    if (!results.length) return res.status(404).json({ message: "Main dish not found" });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// เพิ่มเมนู
exports.addMainDish = async (req, res) => {
  const { name, description, price } = req.body;
  try {
    const result = await MainDish.create(name, description, price);
    res.json({ message: "Main dish added!", itemId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// อัปเดตเมนู
exports.updateMainDish = async (req, res) => {
  const { item_id } = req.params;
  const { name, description, price } = req.body;
  try {
    const result = await MainDish.update(item_id, name, description, price);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Main dish not found" });
    res.json({ message: "Main dish updated!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ลบเมนู
exports.deleteMainDish = async (req, res) => {
  const { item_id } = req.params;
  try {
    const result = await MainDish.remove(item_id);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Main dish not found" });
    res.json({ message: "Main dish deleted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }ห
};
