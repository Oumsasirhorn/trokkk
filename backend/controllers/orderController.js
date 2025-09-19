const Order = require("../models/orderModel");

// ✅ GET: ดึงออเดอร์ทั้งหมด
exports.getOrders = async (req, res) => {
  try {
    const results = await Order.getAll();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET: ดึงออเดอร์จาก table_id
exports.getOrdersByTable = async (req, res) => {
  try {
    const { table_id } = req.params;
    const results = await Order.getByTableId(table_id);
    if (!results.length)
      return res.status(404).json({ message: "No orders found for this table" });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ POST: สร้างออเดอร์ใหม่
exports.createOrder = async (req, res) => {
  try {
    const { table_id } = req.body;
    if (!table_id) return res.status(400).json({ error: "table_id ต้องไม่ว่าง" });

    const orderId = await Order.create(table_id);
    res.json({ message: "Order created successfully!", orderId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ PUT: อัปเดตสถานะออเดอร์
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Order.updateStatus(id, status);
    res.json({ message: "Order updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE: ลบออเดอร์และ order_items
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await Order.remove(id);
    res.json({ message: "Order and related items deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
