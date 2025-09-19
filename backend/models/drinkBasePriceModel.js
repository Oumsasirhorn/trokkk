const db = require("../DB/db");

//เพิ่มราคาฐานเครื่องดื่ม
exports.create = async (drink_id, temperature, base_price) => {
  const sql = "INSERT INTO drink_base_prices (drink_id, temperature, base_price) VALUES (?, ?, ?)";
  const [result] = await db.query(sql, [drink_id, temperature, base_price]);
  return result;
};

//แก้ไขราคาฐานเครื่องดื่ม
exports.update = async (drink_id, temperature, base_price) => {
  const sql = "UPDATE drink_base_prices SET base_price=? WHERE drink_id=? AND temperature=?";
  const [result] = await db.query(sql, [base_price, drink_id, temperature]);
  return result;
};

// ลบราคาฐานเครื่องดื่ม
exports.remove = async (drink_id, temperature) => {
  const sql = "DELETE FROM drink_base_prices WHERE drink_id=? AND temperature=?";
  const [result] = await db.query(sql, [drink_id, temperature]);
  return result;
};

// ดึงราคาฐานเครื่องดื่มทั้งหมด
exports.getAll = async () => {
  const sql = "SELECT * FROM drink_base_prices ORDER BY drink_id, temperature";
  const [rows] = await db.query(sql);
  return rows;
};

// ดึงราคาฐานเครื่องดื่มตาม drink_id
exports.getByDrinkId = async (drink_id) => {
  const sql = "SELECT * FROM drink_base_prices WHERE drink_id=?";
  const [rows] = await db.query(sql, [drink_id]);
  return rows;
};
