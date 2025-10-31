// server.js
"use strict";
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express.json());

// รวมทุก routes
const routes = require("./routes/index");
app.use("/", routes);  // ถ้าอยากใช้ prefix `/api` เปลี่ยนเป็น app.use("/api", routes);

app.get("/", (_req, res) => res.send("Restaurant API is running 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
