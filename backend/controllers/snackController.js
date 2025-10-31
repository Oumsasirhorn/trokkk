"use strict";
const Snacks = require("../models/snackModel");

exports.getAllSnacks = async (req, res) => {
  try {
    const withTotal = String(req.query.with_total || "").trim() === "1";
    const limit  = Number.parseInt(req.query.limit ?? "100", 10);
    const offset = Number.parseInt(req.query.offset ?? "0", 10);
    const q      = (req.query.q || "").trim();

    const rows = await Snacks.getAll({ limit, offset, q });
    if (withTotal) {
      const total = await Snacks.countAll({ q });
      return res.json({ data: rows, total });
    }
    res.json(rows);
  } catch (err) {
    console.error("getAllSnacks failed:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getSnackById = async (req, res) => {
  try {
    const s = String(req.params.item_id || "").trim();
    if (!/^\d+$/.test(s)) return res.status(400).json({ error: "bad id" });
    const id = Number(s);
    const snack = await Snacks.getByIdFlexible(id);
    if (!snack) return res.status(404).json({ message: "Snack not found" });
    res.json(snack);
  } catch (err) {
    console.error("getSnackById failed:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.createSnack = async (req, res) => {
  try {
    const { name, description = null, price = null, images_data = null } = req.body || {};
    if (!name) return res.status(400).json({ error: "name is required" });
    const snackId = await Snacks.create({ name, description, price, images_data });
    res.status(201).json({ message: "Snack added!", snackId });
  } catch (err) {
    console.error("createSnack failed:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateSnack = async (req, res) => {
  try {
    const s = String(req.params.item_id || "").trim();
    if (!/^\d+$/.test(s)) return res.status(400).json({ error: "bad id" });
    const item_id = Number(s);
    const { name, description, price = null, images_data } = req.body || {};
    const affected = await Snacks.update(item_id, { name, description, price, images_data });
    if (!affected) return res.status(404).json({ message: "Snack not found" });
    res.json({ message: "Snack updated!" });
  } catch (err) {
    console.error("updateSnack failed:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSnack = async (req, res) => {
  try {
    const s = String(req.params.item_id || "").trim();
    if (!/^\d+$/.test(s)) return res.status(400).json({ error: "bad id" });
    const item_id = Number(s);
    const affected = await Snacks.removeFlexible(item_id);
    if (!affected) return res.status(404).json({ message: "Snack not found" });
    res.json({ message: "Snack deleted!" });
  } catch (err) {
    console.error("deleteSnack failed:", err);
    res.status(500).json({ error: err.message });
  }
};
