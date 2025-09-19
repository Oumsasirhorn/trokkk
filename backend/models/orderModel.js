const db = require("../DB/db");

const Orders = {
  // ดึงออเดอร์ทั้งหมด
  getAll: async () => {
    const sql = `
      SELECT o.*, t.table_number
      FROM orders o
      LEFT JOIN tables t ON o.table_id = t.table_id
      ORDER BY o.order_time DESC
    `;
    const [rows] = await db.query(sql);
    return rows;
  },

  // ดึงออเดอร์ตาม table_id
  getByTableId: async (table_id) => {
    const sql = `
      SELECT o.*, t.table_number
      FROM orders o
      LEFT JOIN tables t ON o.table_id = t.table_id
      WHERE o.table_id = ?
    `;
    const [rows] = await db.query(sql, [table_id]);
    return rows;
  },

  // สร้างออเดอร์ใหม่
  create: async (table_id) => {
    const sql = "INSERT INTO orders (table_id) VALUES (?)";
    const [result] = await db.query(sql, [table_id]);
    return result.insertId;
  },

  // อัปเดตสถานะ
  updateStatus: async (order_id, status) => {
    const sql = "UPDATE orders SET status=? WHERE order_id=?";
    await db.query(sql, [status, order_id]);
  },

  // ลบออเดอร์ + order_items ที่เกี่ยวข้อง
  remove: async (order_id) => {
    await db.query("DELETE FROM order_items WHERE order_id=?", [order_id]);
    await db.query("DELETE FROM orders WHERE order_id=?", [order_id]);
  }
};

module.exports = Orders;
