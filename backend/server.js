// server.js
"use strict";
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const app = express();

// ===== CORS: allow หลาย origin จาก .env =====
const ALLOWED = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    // อนุญาตเครื่องมือ/API clients ที่ไม่มี Origin ด้วย
    if (!origin || ALLOWED.includes(origin)) return cb(null, true);
    cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json());

// Routes
const routes = require("./routes/index");
app.use("/", routes);

app.get("/", (_req, res) => res.send("Restaurant API is running 🚀"));

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, () => {
  console.log(`✅ Server running on :${PORT}`);
  console.log(`   Allowed origins: ${ALLOWED.join(", ")}`);
});
