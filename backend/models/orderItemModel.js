const db = require("../DB/db");

// ดึงทั้งหมด (รวมรูปภาพเป็น Base64)
exports.getAll = async () => {
  const [rows] = await db.query("SELECT * FROM main_dishes");

  // แปลง Buffer → Base64
  const dishes = rows.map(d => ({
    ...d,
    image: d.images_data ? d.images_data.toString("base64") : null
  }));

  return dishes;
};

// ดึงตาม item_id (รวมรูปภาพ)
exports.getById = async (id) => {
  const [rows] = await db.query("SELECT * FROM main_dishes WHERE item_id=?", [id]);
  const dishes = rows.map(d => ({
    ...d,
    image: d.images_data ? d.images_data.toString("base64") : null
  }));
  return dishes;
};

// เพิ่มเมนู (สามารถใส่ images_data ด้วย)
exports.create = async (name, description, price, images_data = null) => {
  const [result] = await db.query(
    "INSERT INTO main_dishes (name, description, price, images_data) VALUES (?, ?, ?, ?)",
    [name, description, price, images_data]
  );
  return result;
};

// อัปเดตเมนู (รวมรูปภาพ)
exports.update = async (id, name, description, price, images_data = null) => {
  let sql, params;
  if (images_data) {
    sql = "UPDATE main_dishes SET name=?, description=?, price=?, images_data=? WHERE item_id=?";
    params = [name, description, price, images_data, id];
  } else {
    sql = "UPDATE main_dishes SET name=?, description=?, price=? WHERE item_id=?";
    params = [name, description, price, id];
  }
  const [result] = await db.query(sql, params);
  return result;
};

// ลบเมนู
exports.remove = async (id) => {
  const [result] = await db.query("DELETE FROM main_dishes WHERE item_id=?", [id]);
  return result;
};
