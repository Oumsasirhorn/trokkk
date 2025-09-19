const express = require("express");
const router = express.Router();
const controller = require("../controllers/mainDishController");

router.get("/", controller.getAllMainDishes);
router.get("/:item_id", controller.getMainDishById);
router.post("/", controller.addMainDish);
router.put("/:item_id", controller.updateMainDish);
router.delete("/:item_id", controller.deleteMainDish);

module.exports = router;
