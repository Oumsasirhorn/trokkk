// backend/routes/mainDishImage.js
const express = require("express");
const router = express.Router();
const db = require("../DB/db");

router.get("/:item_id/image", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT images_data FROM main_dishes WHERE item_id=?",
      [req.params.item_id]
    );
    if (!rows.length || !rows[0].images_data)
      return res.status(404).send("No image");

    const buf = rows[0].images_data;
    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(buf);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error reading image");
  }
});

module.exports = router;
