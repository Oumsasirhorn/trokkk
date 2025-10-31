"use strict";
const express = require("express");
const router = express.Router();


const ctrl = require("../controllers/snackController"); 



router.get("/", ctrl.getAllSnacks);
router.get("/:item_id", ctrl.getSnackById);
router.post("/", ctrl.createSnack);
router.put("/:item_id", ctrl.updateSnack);
router.delete("/:item_id", ctrl.deleteSnack);

module.exports = router;
