const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");



// --------------------------
// CRUD สำหรับ Admin
// --------------------------

// GET: ดึง admin ทั้งหมด
router.get("/", adminController.getAllAdmins);

// GET: ดึง admin ตาม id
router.get("/:id", adminController.getAdminById);

// POST: เพิ่ม admin
router.post("/", adminController.createAdmin);

// PUT: อัปเดต admin
router.put("/:id", adminController.updateAdmin);

// DELETE: ลบ admin
router.delete("/:id", adminController.deleteAdmin);

// --------------------------
// เพิ่ม login สำหรับ frontend
// --------------------------

router.post("/login", adminController.loginAdmin);


module.exports = router;
