const Payments = require('../models/paymentModel');

const paymentsController = {
  getAllPayments: async (req, res) => {
    try {
      const results = await Payments.getAll();
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getPaymentById: async (req, res) => {
    try {
      const id = req.params.id;
      const payment = await Payments.getById(id);
      if (!payment) return res.status(404).json({ message: "Payment not found" });
      res.json(payment);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  createPayment: async (req, res) => {
    try {
      const { order_id, amount, method } = req.body;
      if (!order_id || !amount || !method) {
        return res.status(400).json({ error: "order_id, amount, method ต้องไม่ว่าง" });
      }
      const paymentId = await Payments.create({ order_id, amount, method });
      res.json({ message: "Payment added successfully!", paymentId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updatePayment: async (req, res) => {
    try {
      const id = req.params.id;
      const { order_id, amount, method } = req.body;
      const affectedRows = await Payments.update(id, { order_id, amount, method });
      if (affectedRows === 0) return res.status(404).json({ message: "Payment not found" });
      res.json({ message: "Payment updated successfully!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deletePayment: async (req, res) => {
    try {
      const id = req.params.id;
      const affectedRows = await Payments.remove(id);
      if (affectedRows === 0) return res.status(404).json({ message: "Payment not found" });
      res.json({ message: "Payment deleted successfully!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = paymentsController;
