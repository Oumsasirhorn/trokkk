const db = require("../DB/db");

// ดึง admin ทั้งหมด
exports.getAllAdmins = async () => {
  const [rows] = await db.query("SELECT * FROM admins");
  return rows;
};

// ดึง admin ตาม id
exports.getAdminById = async (id) => {
  const [rows] = await db.query("SELECT * FROM admins WHERE admin_id = ?", [id]);
  return rows[0];
};

// ดึง admin ตาม username (สำหรับ login)
exports.getAdminByUsername = async (username) => {
  const [rows] = await db.query("SELECT * FROM admins WHERE username = ?", [username]);
  return rows[0];
};

// เพิ่ม admin ใหม่
exports.createAdmin = async (username, password, fullname, role) => {
  const [result] = await db.query(
    "INSERT INTO admins (username, password, fullname, role) VALUES (?, ?, ?, ?)",
    [username, password, fullname, role]
  );
  return result.insertId;
};

// อัปเดต admin
exports.updateAdmin = async (id, username, fullname, role) => {
  await db.query(
    "UPDATE admins SET username = ?, fullname = ?, role = ? WHERE admin_id = ?",
    [username, fullname, role, id]
  );
};

// ลบ admin
exports.deleteAdmin = async (id) => {
  await db.query("DELETE FROM admins WHERE admin_id = ?", [id]);
};
