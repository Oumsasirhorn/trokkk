const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentController');
const orderController = require("../controllers/orderController");

router.get('/', paymentsController.getAllPayments);
router.get('/:id', paymentsController.getPaymentById);
router.post('/', paymentsController.createPayment);
router.put("/:order_id/:table_id", orderController.payOrder);


module.exports = router;
