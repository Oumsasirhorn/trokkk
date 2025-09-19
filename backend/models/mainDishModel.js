const db = require("../DB/db");

// ดึงทั้งหมด
exports.getAll = async () => {
  const [rows] = await db.query("SELECT * FROM main_dishes");
  return rows;
};

// ดึงตาม item_id
exports.getById = async (id) => {
  const [rows] = await db.query("SELECT * FROM main_dishes WHERE item_id=?", [id]);
  return rows;
};

// เพิ่มเมนู
exports.create = async (name, description, price) => {
  const [result] = await db.query(
    "INSERT INTO main_dishes (name, description, price) VALUES (?, ?, ?)",
    [name, description, price]
  );
  return result;
};

// อัปเดตเมนู
exports.update = async (id, name, description, price) => {
  const [result] = await db.query(
    "UPDATE main_dishes SET name=?, description=?, price=? WHERE item_id=?",
    [name, description, price, id]
  );
  return result;
};

// ลบเมนู
exports.remove = async (id) => {
  const [result] = await db.query("DELETE FROM main_dishes WHERE item_id=?", [id]);
  return result;
};
