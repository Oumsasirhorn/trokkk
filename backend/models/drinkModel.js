const db = require("../DB/db");

// ดึงเครื่องดื่มทั้งหมด
exports.getAll = async () => {
  const [rows] = await db.query("SELECT * FROM drinks");
  return rows;
};

// ดึงราคาตาม item_id + temperature
exports.getPriceByItemAndTemp = async (item_id, temperature) => {
  const sql = `
    SELECT d.name, d.sweetness, d.toppings, d.extra_price, b.base_price, 
           (b.base_price + d.extra_price) AS final_price
    FROM drinks d
    JOIN drink_base_prices b ON d.item_id = b.drink_id
    WHERE d.item_id = ? AND b.temperature = ?
  `;
  const [rows] = await db.query(sql, [item_id, temperature]);
  return rows;
};

// เพิ่มเครื่องดื่มใหม่
exports.create = async (name, sweetness, toppings, extra_price) => {
  const sql = "INSERT INTO drinks (name, sweetness, toppings, extra_price) VALUES (?, ?, ?, ?)";
  const [result] = await db.query(sql, [name, sweetness, toppings, extra_price]);
  return result;
};

// อัพเดทเครื่องดื่ม
exports.update = async (item_id, name, sweetness, toppings, extra_price) => {
  const sql = "UPDATE drinks SET name=?, sweetness=?, toppings=?, extra_price=? WHERE item_id=?";
  const [result] = await db.query(sql, [name, sweetness, toppings, extra_price, item_id]);
  return result;
};

// ลบเครื่องดื่ม
exports.remove = async (item_id) => {
  const sql = "DELETE FROM drinks WHERE item_id=?";
  const [result] = await db.query(sql, [item_id]);
  return result;
};
