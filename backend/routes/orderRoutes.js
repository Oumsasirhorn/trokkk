// backend/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrdersByTable,
  createOrder,
  updateOrderStatus,
  payOrder,
  deleteOrder,
} = require("../controllers/orderController");

// อย่ามีวงเล็บเวลาส่ง handler
router.get("/", getAllOrders);
router.get("/table/:table_id", getOrdersByTable);       // แยก path ชัดเจน
router.post("/", createOrder);
router.put("/:order_id/status", updateOrderStatus);
router.put("/:order_id/pay", payOrder);                  // ไม่ต้องมี :table_id
router.delete("/:id", deleteOrder);

module.exports = router;
