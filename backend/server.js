// server.js
"use strict";
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const app = express();

/* ========= CORS ========= */
// อนุญาต origin จาก env หลายตัว คั่นด้วยจุลภาค
// ตัวอย่างบน Render: CORS_ORIGINS=https://trokkk.vercel.app,http://localhost:5173
const ALLOWED = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(/[,\s]+/)
  .map(s => s.trim().replace(/\/+$/, "")) // ตัด / ท้าย
  .filter(Boolean);

// รองรับโดเมน preview ของ Vercel: trokkk-<branch>-<hash>.vercel.app
const VERCEL_PREVIEW_RE = /^https:\/\/trokkk(?:-[\w-]+)?\.vercel\.app$/;

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true); // allow tools/postman
    const clean = origin.replace(/\/+$/, "");
    if (ALLOWED.includes(clean) || VERCEL_PREVIEW_RE.test(clean)) {
      return cb(null, true);
    }
    return cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json());

/* ========= Static: รูปอัปโหลด ========= */
// เสิร์ฟไฟล์ภายใต้ /uploads -> backend/uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ========= Routes ========= */
const routes = require("./routes/index");
// ถ้า routes ของคุณเขียนให้ใช้แบบไม่มี prefix ให้คงไว้ที่ "/" ตามนี้
// ถ้าในโปรเจกต์เดิมใช้ /api ให้เปลี่ยนเป็น app.use("/api", routes);
app.use("/", routes);

/* ========= Health ========= */
app.get("/health", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

/* ========= Root ========= */
app.get("/", (_req, res) => res.send("Restaurant API is running 🚀"));

/* ========= Start ========= */
const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on :${PORT}`);
  console.log(`   Allowed origins: ${ALLOWED.join(", ")}`);
});
