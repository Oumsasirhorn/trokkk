const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentController');

router.get('/', paymentsController.getAllPayments);
router.get('/:id', paymentsController.getPaymentById);
router.post('/', paymentsController.createPayment);

module.exports = router;
