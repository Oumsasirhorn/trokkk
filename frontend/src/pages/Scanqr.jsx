import { useState, useEffect } from "react";
import QrReader from "react-qr-reader";

const API_BASE = "http://localhost:5000";

export default function OrderPage() {
  const [table, setTable] = useState(null);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const handleScan = async (data) => {
    if (data) {
      try {
        const payload = JSON.parse(data);
        const res = await fetch(`${API_BASE}/tables/${payload.table_id}`);
        const tableData = await res.json();
        setTable(tableData);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleError = (err) => console.error(err);

  const addItem = (name, price) => {
    setItems((prev) => [...prev, { name, price }]);
    setTotal((prev) => prev + price);
  };

  const submitOrder = async () => {
    if (!table) return alert("ไม่พบโต๊ะ");
    await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table_id: table.table_id, items, total })
    });
    alert("สั่งอาหารเรียบร้อย!");
  };

  const payOrder = async (order_id) => {
    await fetch(`${API_BASE}/orders/${order_id}/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table_id: table.table_id })
    });
    alert("ชำระเงินเรียบร้อย โต๊ะว่างแล้ว!");
    setTable(null);
    setItems([]);
    setTotal(0);
  };

  return (
    <div>
      {!table && <QrReader onScan={handleScan} onError={handleError} />}
      {table && (
        <>
          <h2>โต๊ะ {table.table_number}</h2>
          <div>
            <button onClick={() => addItem("ข้าวผัด", 50)}>ข้าวผัด 50฿</button>
            <button onClick={() => addItem("ต้มยำ", 70)}>ต้มยำ 70฿</button>
          </div>
          <div>
            <h3>รายการอาหาร</h3>
            <ul>
              {items.map((i, idx) => <li key={idx}>{i.name} - {i.price}฿</li>)}
            </ul>
            <p>รวม: {total}฿</p>
          </div>
          <button onClick={submitOrder}>ยืนยันสั่งอาหาร</button>
          <button onClick={() => payOrder(1)}>ชำระเงิน</button>
        </>
      )}
    </div>
  );
}
