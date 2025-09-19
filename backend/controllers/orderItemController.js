const OrderItem = require("../models/orderItemModel");

// ✅ POST: เพิ่ม order item
exports.addOrderItem = async (req, res) => {
  try {
    const { order_id, item_type, item_id, quantity } = req.body;

    if (!order_id || !item_type || !item_id || !quantity) {
      return res.status(400).json({ error: "order_id, item_type, item_id, quantity ต้องไม่ว่าง" });
    }

    // ดึงราคาและชื่อ item
    const item = await OrderItem.getItemPrice(item_type, item_id);
    if (!item) return res.status(404).json({ error: "ไม่พบ item_id ในตารางนี้" });

    const total = item.price * quantity;

    const insertResult = await OrderItem.create(order_id, item_type, item_id, quantity, item.price, total);

    res.json({
      message: "Order item added successfully!",
      orderItemId: insertResult.insertId,
      order_id,
      item_type,
      item_id,
      item_name: item.name,
      quantity,
      price: item.price,
      total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET: ดึง order items ตาม order_id
exports.getOrderItems = async (req, res) => {
  try {
    const { order_id } = req.params;
    const results = await OrderItem.getByOrderId(order_id);
    if (!results.length) return res.status(404).json({ message: "No order items found" });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ PUT: อัปเดต order item
exports.updateOrderItem = async (req, res) => {
  try {
    const { order_item_id } = req.params;
    const { order_id, item_type, item_id, quantity } = req.body;

    if (!order_id || !item_type || !item_id || !quantity) {
      return res.status(400).json({ error: "order_id, item_type, item_id, quantity ต้องไม่ว่าง" });
    }

    const item = await OrderItem.getItemPrice(item_type, item_id);
    if (!item) return res.status(404).json({ error: "ไม่พบ item_id ในตารางนี้" });

    const total = item.price * quantity;
    const updateResult = await OrderItem.update(order_item_id, order_id, item_type, item_id, quantity, item.price, total);

    if (updateResult.affectedRows === 0) return res.status(404).json({ message: "Order item not found" });

    res.json({
      message: "Order item updated successfully!",
      updated: { order_item_id, order_id, item_type, item_id, item_name: item.name, quantity, price: item.price, total },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE: ลบ order item
exports.deleteOrderItem = async (req, res) => {
  try {
    const { order_item_id } = req.params;
    const result = await OrderItem.remove(order_item_id);

    if (result.affectedRows === 0) return res.status(404).json({ message: "Order item not found" });

    res.json({ message: "Order item deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
