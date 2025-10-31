"use strict";
const express = require("express");
const multer = require("multer");
const ctrl = require("../controllers/bookingsController");

const router = express.Router();

const storage = multer.memoryStorage();
const okTypes = new Set(["image/png","image/jpeg","image/webp","application/pdf","image/heic","image/heif"]);
const fileFilter = (_req, file, cb) => {
  if (okTypes.has(file.mimetype)) cb(null, true);
  else cb(new Error("Unsupported file type: " + file.mimetype));
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5*1024*1024 } });

router.get("/", ctrl.list);
router.post("/", upload.single("slip"), ctrl.create);
router.put("/:id", upload.single("slip"), ctrl.update);
router.delete("/:id", ctrl.remove);
router.get("/:id/slip", ctrl.streamSlip);

module.exports = router;
