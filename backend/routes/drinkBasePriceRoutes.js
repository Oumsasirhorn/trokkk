// backend/routes/drinkBasePriceRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/drinkBasePriceController");

router.get("/", controller.getAllDrinkBasePrices); // ดึงทั้งหมด (ในรูปแบบ map)
router.get("/raw", controller.getAllDrinkBasePricesRaw); // ดึงแบบ array ตรง ๆ
router.post("/", controller.addDrinkBasePrice); // เพิ่ม
router.put("/:drink_id/:temperature", controller.updateDrinkBasePrice); // แก้ไข
router.delete("/:drink_id/:temperature", controller.deleteDrinkBasePrice); // ลบ

module.exports = router;
