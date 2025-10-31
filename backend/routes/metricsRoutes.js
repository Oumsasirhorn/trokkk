// backend/routes/metricsRoutes.js
"use strict";

const express = require("express");
const router = express.Router();
const metricsController = require("../controllers/metricsController");

// GET /metrics/sales?from=2025-01-01&to=2025-02-01
router.get("/sales", metricsController.getSalesSummary);

module.exports = router;
