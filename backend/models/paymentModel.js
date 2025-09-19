const db = require('../DB/db');

const Payments = {
  // ดึงข้อมูลการชำระเงินทั้งหมด
  getAll: async () => {
    const sql = `
      SELECT p.*, o.table_id
      FROM payments p
      LEFT JOIN orders o ON p.order_id = o.order_id
      ORDER BY p.payment_time DESC
    `;
    const [results] = await db.query(sql);
    return results;
  },

  // ดึงข้อมูลการชำระเงินตาม ID
  getById: async (id) => {
    const sql = "SELECT * FROM payments WHERE payment_id = ?";
    const [results] = await db.query(sql, [id]);
    return results[0];
  },

  // สร้างการชำระเงินใหม่
  create: async ({ order_id, amount, method }) => {
    const sql = "INSERT INTO payments (order_id, amount, method) VALUES (?, ?, ?)";
    const [result] = await db.query(sql, [order_id, amount, method]);
    return result.insertId;
  },

  // อัปเดตการชำระเงิน
  update: async (payment_id, { order_id, amount, method }) => {
    const sql = "UPDATE payments SET order_id=?, amount=?, method=? WHERE payment_id=?";
    const [result] = await db.query(sql, [order_id, amount, method, payment_id]);
    return result.affectedRows;
  },

  // ลบการชำระเงิน
  remove: async (payment_id) => {
    const sql = "DELETE FROM payments WHERE payment_id=?";
    const [result] = await db.query(sql, [payment_id]);
    return result.affectedRows;
  }
};

module.exports = Payments;
