const db = require('../DB/db');

const Snacks = {
  getAll: async () => {
    try {
      const [rows] = await db.query("SELECT * FROM snacks");
      return rows;
    } catch (err) {
      throw err;
    }
  },

  getById: async (id) => {
    try {
      const [rows] = await db.query("SELECT * FROM snacks WHERE item_id = ?", [id]);
      return rows[0]; // คืนค่า row แรก
    } catch (err) {
      throw err;
    }
  },

  create: async ({ name, description, price }) => {
    try {
      const [result] = await db.query(
        "INSERT INTO snacks (name, description, price) VALUES (?, ?, ?)",
        [name, description, price]
      );
      return result.insertId; // คืน snack_id
    } catch (err) {
      throw err;
    }
  },

  update: async (id, { name, description, price }) => {
    try {
      await db.query(
        "UPDATE snacks SET name = ?, description = ?, price = ? WHERE item_id = ?",
        [name, description, price, id]
      );
    } catch (err) {
      throw err;
    }
  },

  delete: async (id) => {
    try {
      await db.query("DELETE FROM snacks WHERE item_id = ?", [id]);
    } catch (err) {
      throw err;
    }
  }
};

module.exports = Snacks;
