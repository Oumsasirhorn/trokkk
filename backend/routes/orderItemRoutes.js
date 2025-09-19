const express = require("express");
const router = express.Router();
const controller = require("../controllers/orderItemController");

router.post("/", controller.addOrderItem);
router.get("/:order_id", controller.getOrderItems);
router.put("/:order_item_id", controller.updateOrderItem);
router.delete("/:order_item_id", controller.deleteOrderItem);

module.exports = router;
