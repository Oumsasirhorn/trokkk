"use strict";

const MainDish = require("../models/mainDishModel");

/* ========== Controllers ========== */

// GET /main_dishes?limit=&offset=&q=
exports.getAllMainDishes = async (req, res) => {
  try {
    const limit  = Number.parseInt(req.query.limit ?? "100", 10);
    const offset = Number.parseInt(req.query.offset ?? "0", 10);
    const q      = (req.query.q || "").trim();

    const rows = await MainDish.getAll({
      limit:  Number.isFinite(limit) && limit > 0 && limit <= 500 ? limit : 100,
      offset: Number.isFinite(offset) && offset >= 0 ? offset : 0,
      q,
    });
    res.json(rows);
  } catch (err) {
    console.error("getAllMainDishes failed:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET /main_dishes/:item_id
exports.getMainDishById = async (req, res) => {
  try {
    const id = Number(req.params.item_id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "bad id" });

    const dish = await MainDish.getByIdFlexible(id);
    if (!dish) return res.status(404).json({ message: "Main dish not found" });
    res.json(dish);
  } catch (err) {
    console.error("getMainDishById failed:", err);
    res.status(500).json({ error: err.message });
  }
};

// POST /main_dishes
// body: { name, description, price, images_data? (dataURL/base64) }
exports.addMainDish = async (req, res) => {
  try {
    const { name, description = null, price = null, images_data = null } = req.body || {};
    if (!name) return res.status(400).json({ error: "name is required" });

    const itemId = await MainDish.create({
      name,
      description,
      price,
      images_data,
    });
    res.status(201).json({ message: "Main dish added!", itemId });
  } catch (err) {
    console.error("addMainDish failed:", err);
    res.status(500).json({ error: err.message });
  }
};

// PUT /main_dishes/:item_id
// body: ฟิลด์ไหนไม่ส่ง = ไม่เปลี่ยน; images_data = null/"" เพื่อลบรูป
exports.updateMainDish = async (req, res) => {
  try {
    const item_id = Number(req.params.item_id);
    if (!Number.isFinite(item_id)) return res.status(400).json({ error: "bad id" });

    const { name, description, price = null, images_data } = req.body || {};
    const affected = await MainDish.update(item_id, { name, description, price, images_data });

    if (!affected) return res.status(404).json({ message: "Main dish not found" });
    res.json({ message: "Main dish updated!" });
  } catch (err) {
    console.error("updateMainDish failed:", err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE /main_dishes/:item_id
exports.deleteMainDish = async (req, res) => {
  try {
    const item_id = Number(req.params.item_id);
    if (!Number.isFinite(item_id)) return res.status(400).json({ error: "bad id" });

    const affected = await MainDish.remove(item_id);
    if (!affected) return res.status(404).json({ message: "Main dish not found" });
    res.json({ message: "Main dish deleted!" });
  } catch (err) {
    console.error("deleteMainDish failed:", err);
    res.status(500).json({ error: err.message });
  }
};
