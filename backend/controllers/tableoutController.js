const Tables = require('../models/tableoutModel');

const tableoutController = {
  getAllTables: async (req, res) => {
    try {
      const tables = await Tables.getAll();
      res.json(tables);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  getTableById: async (req, res) => {
    try {
      const id = req.params.id;
      const table = await Tables.getById(id);
      if (!table) return res.status(404).json({ message: "Table not found" });
      res.json(table);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  createTable: async (req, res) => {
    try {
      const { table_number, status, qr_code } = req.body;
      const tableId = await Tables.create({ table_number, status, qr_code });
      res.json({ message: "Table added!", tableId });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  updateTable: async (req, res) => {
    try {
      const id = req.params.id;
      const { table_number, status, qr_code } = req.body;
      await Tables.update(id, { table_number, status, qr_code });
      res.json({ message: "Table updated!" });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  deleteTable: async (req, res) => {
    try {
      const id = req.params.id;
      await Tables.delete(id);
      res.json({ message: "Table deleted!" });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
};

module.exports = tableoutController;
