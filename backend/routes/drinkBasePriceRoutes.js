const express = require("express");
const router = express.Router();
const controller = require("../controllers/drinkBasePriceController");

router.get("/", controller.getAllDrinkBasePrices); // ดูทั้งหมด
router.post("/", controller.addDrinkBasePrice);      // เพิ่ม
router.put("/:drink_id/:temperature", controller.updateDrinkBasePrice); // แก้ไข
router.delete("/:drink_id/:temperature", controller.deleteDrinkBasePrice); // ลบ

module.exports = router;
