const db = require('../DB/db');

const Reservations = {
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT r.*, t.table_number
      FROM reservations r
      LEFT JOIN tables t ON r.table_id = t.table_id
      ORDER BY r.reservation_time DESC
    `);
    return rows;
  },

  create: async ({ table_id, customer_name, phone, reservation_time }) => {
  // ตรวจสอบว่ามีการจองโต๊ะนี้เวลาเดียวกันหรือยัง
  const [exists] = await db.query(
    'SELECT * FROM reservations WHERE table_id = ? AND reservation_time = ? AND status != ?',
    [table_id, reservation_time, 'ยกเลิก'] // ถ้าโต๊ะนี้ถูกจองแล้วยังไม่ถูกยกเลิก
  );

  if (exists.length > 0) {
    throw { status: 400, message: "โต๊ะนี้ถูกจองแล้วในเวลานี้" };
  }

  // ถ้าว่าง → insert
  const [result] = await db.query(
    'INSERT INTO reservations (table_id, customer_name, phone, reservation_time) VALUES (?, ?, ?, ?)',
    [table_id, customer_name, phone, reservation_time]
  );

  return result.insertId;
},


  checkIn: async (reservationId) => {
    const [result] = await db.query(
      'UPDATE reservations SET status = ? WHERE reservation_id = ?',
      ['เช็คอิน', reservationId]
    );
    if (result.affectedRows === 0) throw { status: 404, message: "Reservation not found" };
    return { message: "Checked in successfully" };
  },

  cancel: async (reservationId) => {
    const [result] = await db.query(
      'UPDATE reservations SET status = ? WHERE reservation_id = ?',
      ['ยกเลิก', reservationId]
    );
    if (result.affectedRows === 0) throw { status: 404, message: "Reservation not found" };
    return { message: "Reservation cancelled successfully" };
  }
};

module.exports = Reservations;
