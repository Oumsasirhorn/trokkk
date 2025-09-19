const db = require('../DB/db'); // ไฟล์เชื่อม MySQL

const Tables = {
  getAll: async () => {
    try {
      const [rows] = await db.query("SELECT * FROM tables-in");
      return rows;
    } catch (err) {
      throw err;
    }
  },

  getById: async (id) => {
    try {
      const [rows] = await db.query("SELECT * FROM tables-in WHERE table_id = ?", [id]);
      return rows[0];
    } catch (err) {
      throw err;
    }
  },

  create: async ({ table_number, status, qr_code }) => {
    try {
      const [result] = await db.query(
        "INSERT INTO tables-in (table_number, status, qr_code) VALUES (?, ?, ?)",
        [table_number, status, qr_code]
      );
      return result.insertId;
    } catch (err) {
      throw err;
    }
  },

  update: async (id, { table_number, status, qr_code }) => {
    try {
      await db.query(
        "UPDATE tables-in SET table_number = ?, status = ?, qr_code = ? WHERE table_id = ?",
        [table_number, status, qr_code, id]
      );
    } catch (err) {
      throw err;
    }
  },

  delete: async (id) => {
    try {
      await db.query("DELETE FROM tables-in WHERE table_id = ?", [id]);
    } catch (err) {
      throw err;
    }
  }
};

module.exports = Tables;
