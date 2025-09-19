const express = require('express');
const router = express.Router();
const reservationsController = require('../controllers/reservationController');

router.get('/', reservationsController.getAllReservations);
router.post('/', reservationsController.createReservation);
router.put('/:id/checkin', reservationsController.checkInReservation);
router.delete('/:id', reservationsController.cancelReservation);

module.exports = router;
