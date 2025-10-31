"use strict";
const Orders = require("../models/orderModel");

const toNum = (v, fb = 0) => (Number.isFinite(Number(v)) ? Number(v) : fb);
const asStr = (v, fb = "") => (typeof v === "string" ? v : fb);

async function getAllOrders(req, res) {
  try {
    const rows = await Orders.getAll();
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB_ERROR", message: e.message || String(e) });
  }
}

async function getOrdersByTable(req, res) {
  try {
    const table_number = Number(req.params.table_number);
    if (!Number.isFinite(table_number))
      return res.status(400).json({ error: "BAD_TABLE_NUMBER" });

    const rows = await Orders.getByTable(table_number);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB_ERROR", message: e.message || String(e) });
  }
}

async function createOrder(req, res) {
  try {
    const body = req.body || {};
    const table_number  = Number.isFinite(Number(body.table_number)) ? Number(body.table_number) : null;
    const table_label   = asStr(body.table_label || "unknown");
    const payment_method= asStr(body.payment_method || "unknown").toLowerCase();
    const order_note    = asStr(body.order_note || "");

    const itemsSrc = Array.isArray(body.items) ? body.items : [];
    const items = itemsSrc.map(it => ({
      item_type: asStr(it.item_type || "").toLowerCase(),
      ref_id: it.ref_id != null ? String(it.ref_id) : null,
      name: asStr(it.name || "-"),
      price: toNum(it.price),
      qty: toNum(it.qty),
      itemNote: asStr(it.itemNote || "")
    })).filter(x => x.qty > 0 && x.ref_id);

    if (!items.length) return res.status(400).json({ error: "NO_ITEMS", message: "ไม่มีรายการสินค้า" });

    const result = await Orders.createFull({
      table_number,
      table_label,
      items,
      payment_method,
      order_note
    });

    res.status(201).json({
      message: "ORDER_CREATED",
      order_id: result.order_id,
      total_amount: result.total_amount,
      status: result.status
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB_ERROR", message: e.message || String(e) });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const order_id = Number(req.params.order_id);
    const status = asStr(req.body.status || req.query.status || "");
    if (!order_id || !status) return res.status(400).json({ error: "BAD_REQUEST" });
    await Orders.updateStatus(order_id, status);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB_ERROR", message: e.message || String(e) });
  }
}

async function payOrder(req, res) {
  try {
    const order_id = Number(req.params.order_id);
    if (!order_id) return res.status(400).json({ error: "BAD_ORDER_ID" });
    await Orders.pay(order_id);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB_ERROR", message: e.message || String(e) });
  }
}

async function deleteOrder(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "BAD_ID" });
    await Orders.remove(id);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB_ERROR", message: e.message || String(e) });
  }
}

module.exports = {
  getAllOrders,
  getOrdersByTable,
  createOrder,
  updateOrderStatus,
  payOrder,
  deleteOrder,
};
