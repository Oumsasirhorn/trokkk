const Reservations = require('../models/reservationModel');

// ดึงทั้งหมด
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservations.getAll();
    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || "Internal server error" });
  }
};

// สร้างใหม่
const createReservation = async (req, res) => {
  try {
    const { table_id, customer_name, phone, reservation_time } = req.body;
    const id = await Reservations.create({ table_id, customer_name, phone, reservation_time });
    res.status(201).json({ message: "Reservation created successfully", reservation_id: id });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || "Failed to create reservation" });
  }
};

// เช็คอิน
const checkInReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Reservations.checkIn(id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || "Failed to check in" });
  }
};

// ยกเลิก
const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Reservations.cancel(id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || "Failed to cancel reservation" });
  }
};

module.exports = {
  getAllReservations,
  createReservation,
  checkInReservation,
  cancelReservation
};
