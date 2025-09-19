const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Middlewares
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express.json());


// ✅ ใช้ routes index รวมทุกไฟล์
const routes = require("./backend/routes/index");
app.use("/", routes);

app.get("/", (req, res) => res.send("Restaurant API is running 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
