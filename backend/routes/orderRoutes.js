const express = require("express");
const router = express.Router();
const controller = require("../controllers/orderController");

router.get("/", controller.getOrders);
router.get("/:table_id", controller.getOrdersByTable);
router.post("/", controller.createOrder);
router.put("/:id", controller.updateOrder);
router.delete("/:id", controller.deleteOrder);

module.exports = router;
