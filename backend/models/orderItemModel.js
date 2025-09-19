const db = require("../DB/db");

// ดึงข้อมูลราคาและชื่อจากตารางตาม item_type
exports.getItemPrice = async (item_type, item_id) => {
  let sql = "";
  if (item_type === "main_dish") {
    sql = "SELECT name, price FROM main_dishes WHERE item_id = ?";
  } else if (item_type === "snack") {
    sql = "SELECT name, price FROM snacks WHERE item_id = ?";
  } else if (item_type === "drink") {
    sql = "SELECT name, price FROM drinks WHERE item_id = ?";
  } else {
    throw new Error("Invalid item_type");
  }

  const [results] = await db.query(sql, [item_id]);
  return results[0];
};

// เพิ่ม order item
exports.create = async (order_id, item_type, item_id, quantity, price, total) => {
  const sql = `
    INSERT INTO order_items (order_id, item_type, item_id, quantity, price, total)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(sql, [order_id, item_type, item_id, quantity, price, total]);
  return result;
};

// ดึง order items ตาม order_id
exports.getByOrderId = async (order_id) => {
  const sql = `
    SELECT 
      oi.order_item_id,
      oi.order_id,
      oi.item_type,
      oi.item_id,
      oi.quantity,
      oi.price,
      oi.total,
      CASE 
        WHEN oi.item_type = 'main_dish' THEN md.name
        WHEN oi.item_type = 'snack' THEN s.name
        WHEN oi.item_type = 'drink' THEN d.name
      END AS item_name
    FROM order_items oi
    LEFT JOIN main_dishes md ON oi.item_type='main_dish' AND oi.item_id = md.item_id
    LEFT JOIN snacks s ON oi.item_type='snack' AND oi.item_id = s.item_id
    LEFT JOIN drinks d ON oi.item_type='drink' AND oi.item_id = d.item_id
    WHERE oi.order_id = ?
  `;
  const [results] = await db.query(sql, [order_id]);
  return results;
};

// อัปเดต order item
exports.update = async (order_item_id, order_id, item_type, item_id, quantity, price, total) => {
  const sql = `
    UPDATE order_items
    SET order_id=?, item_type=?, item_id=?, quantity=?, price=?, total=?
    WHERE order_item_id=?
  `;
  const [result] = await db.query(sql, [order_id, item_type, item_id, quantity, price, total, order_item_id]);
  return result;
};

// ลบ order item
exports.remove = async (order_item_id) => {
  const sql = "DELETE FROM order_items WHERE order_item_id=?";
  const [result] = await db.query(sql, [order_item_id]);
  return result;
};
