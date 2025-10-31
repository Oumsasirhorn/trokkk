"use strict";
const express = require("express");
const router = express.Router();
const c = require("../controllers/drinkController");




router.get("/", c.getAllDrinks);
router.get("/:item_id/price", c.getDrinkPrice);
router.get("/:item_id/image", c.getDrinkImage); // optional
router.post("/", c.addDrink);
router.put("/:item_id", c.updateDrink);
router.delete("/:item_id", c.deleteDrink);

module.exports = router;
