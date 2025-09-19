const express = require("express");
const router = express.Router();
const controller = require("../controllers/drinkController");

router.get("/", controller.getAllDrinks);
router.get("/:item_id/price", controller.getDrinkPrice);
router.post("/", controller.addDrink);
router.put("/:item_id", controller.updateDrink);
router.delete("/:item_id", controller.deleteDrink);

module.exports = router;
