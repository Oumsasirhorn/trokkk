const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");

// ดึง admin ทั้งหมด
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.getAllAdmins();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ดึง admin ตาม id
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.getAdminById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// เพิ่ม admin
exports.createAdmin = async (req, res) => {
  try {
    const { username, password, fullname, role } = req.body;

    if (!username || !password || !fullname || !role) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newId = await Admin.createAdmin(username, hashedPassword, fullname, role);
    res.status(201).json({ message: "Admin created", admin_id: newId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// อัปเดต admin
exports.updateAdmin = async (req, res) => {
  try {
    const { username, fullname, role } = req.body;

    if (!username || !fullname || !role) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }

    await Admin.updateAdmin(req.params.id, username, fullname, role);
    res.json({ message: "Admin updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ลบ admin
exports.deleteAdmin = async (req, res) => {
  try {
    await Admin.deleteAdmin(req.params.id);
    res.json({ message: "Admin deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --------------------------
// Login admin
// --------------------------
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "กรุณากรอก username และ password" });
    }

    // ดึง admin ตาม username
    const admin = await Admin.getAdminByUsername(username);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // เปรียบเทียบรหัสผ่าน
    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });

    // ส่งกลับข้อมูล admin (หรือ token ถ้าใช้ JWT)
    res.json({ message: "Login successful", admin_id: admin.admin_id, username: admin.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
