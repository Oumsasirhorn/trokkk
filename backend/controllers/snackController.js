const Snacks = require('../models/snackModel');

const snacksController = {
  getAllSnacks: async (req, res) => {
    try {
      const snacks = await Snacks.getAll();
      res.json(snacks);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  getSnackById: async (req, res) => {
    try {
      const id = req.params.id;
      const snack = await Snacks.getById(id);
      if (!snack) return res.status(404).json({ message: "Snack not found" });
      res.json(snack);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  createSnack: async (req, res) => {
    try {
      const { name, description, price } = req.body;
      const snackId = await Snacks.create({ name, description, price });
      res.json({ message: "Snack added!", snackId });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  updateSnack: async (req, res) => {
    try {
      const id = req.params.id;
      const { name, description, price } = req.body;
      await Snacks.update(id, { name, description, price });
      res.json({ message: "Snack updated!" });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  deleteSnack: async (req, res) => {
    try {
      const id = req.params.id;
      await Snacks.delete(id);
      res.json({ message: "Snack deleted!" });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
};

module.exports = snacksController;
