const express = require("express");
const router = express.Router();





router.use("/order_items", require("./orderItemRoutes"));
router.use("/orders", require("./orderRoutes"));
router.use("/payments", require("./paymentRoutes"));
router.use("/reservations", require("./reservationRoutes"));
router.use("/tables-in", require("./tableinRoutes"));
router.use("/tables-out", require("./tableoutRoutes"));
router.use("/drinks", require("./drinkRoutes"));
router.use("/snacks", require("./snackRoutes"));
router.use("/main_dishes", require("./mainDishRoutes"));
router.use("/drink_base_prices", require("./drinkBasePriceRoutes"));

module.exports = router;
