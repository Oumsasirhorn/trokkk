// backend/controllers/metricsController.js
"use strict";

const Metrics = require("../models/metricsModel");

exports.getSalesSummary = async (_req, res) => {
  try {
    const data = await Metrics.getSalesSummary();
    res.json({ range: { from: null, to: null }, ...data });
  } catch (err) {
    console.error("metrics summary error:", err);
    res.status(500).json({ error: err.message });
  }
};
