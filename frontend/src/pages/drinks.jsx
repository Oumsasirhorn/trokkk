// src/pages/Drinks.jsx
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./drinks.css";

// key สำหรับ sessionStorage แยกตามโต๊ะ
const cartKey = (table) => `dr_cart_${table || "unknown"}`;

export default function Drinks() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const tableLabel = sp.get("table") || ""; // ดึงหมายเลขโต๊ะจาก query param

  const [loading, setLoading] = useState(true);   // state โหลดข้อมูล
  const [error, setError] = useState(null);       // state error
  const [items, setItems] = useState([]);         // รายการเมนู

  // โหลดจาก backend + merge กับ sessionStorage
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setError(null);
        setLoading(true);

        const res = await fetch("http://localhost:5000/drinks"); // เรียก API
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log("👉 API drinks:", data); // debug response

        // รองรับทั้ง array ตรง ๆ หรือ {items:[...]}
        const payload = Array.isArray(data) ? data : (data.items || []);

        // map ข้อมูลจาก backend → โครงสร้างที่ใช้ใน UI
        const base = payload.map((d) => ({
          id: d.id ?? d.item_id,   // ใช้ id หรือ item_id
          name: d.name,
          price: Number(d.default_price ?? 0) + Number(d.extra_price ?? 0),
          img: d.img || "/images/drinks/placeholder.jpg",
          base_prices: d.base_prices || {},
          extra_price: Number(d.extra_price ?? 0),
          default_temp: (() => {  // เลือก temp เริ่มต้น
            const bp = d.base_prices || {};
            if (bp["เย็น"] != null) return "เย็น";
            if (bp["ร้อน"] != null) return "ร้อน";
            if (bp["ปั่น"] != null) return "ปั่น";
            return null;
          })(),
          toppings: d.toppings || [],
          default_sweetness: d.sweetness || "ปกติ",
          qty: 0, // เริ่มต้นยังไม่เลือก
        }));

        // merge qty จาก sessionStorage
        const saved = sessionStorage.getItem(cartKey(tableLabel));
        if (saved) {
          const savedArr = JSON.parse(saved);
          const byId = Object.fromEntries(savedArr.map((x) => [x.id, x]));
          for (const it of base) {
            it.qty = Math.max(0, byId[it.id]?.qty ?? 0);
          }
        }

        if (alive) setItems(base);
      } catch (e) {
        console.error(e);
        if (alive) setError(e.message || "โหลดข้อมูลล้มเหลว");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [tableLabel]);

  // บันทึกกลับลง sessionStorage ทุกครั้งที่ items เปลี่ยน
  useEffect(() => {
    try {
      sessionStorage.setItem(cartKey(tableLabel), JSON.stringify(items));
    } catch {}
  }, [items, tableLabel]);

  // ฟังก์ชันลดจำนวน
  const dec = (id) =>
    setItems((list) =>
      list.map((it) =>
        it.id === id ? { ...it, qty: Math.max(0, it.qty - 1) } : it
      )
    );

  // ฟังก์ชันเพิ่มจำนวน
  const inc = (id) =>
    setItems((list) =>
      list.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it))
    );

  // รวมจำนวนทั้งหมดในตะกร้า
  const cartCount = useMemo(
    () => items.reduce((sum, it) => sum + it.qty, 0),
    [items]
  );

  // ไปหน้า confirm โดยพกหมายเลขโต๊ะ
  const goCart = () => {
    navigate(`/drinks/confirm?table=${encodeURIComponent(tableLabel)}`);
  };

  if (loading) {
    return (
      <div className="dr-page">
        <header className="dr-topbar">
          <button className="dr-back" onClick={() => navigate(-1)} aria-label="ย้อนกลับ">‹</button>
          <div className="dr-title">หมายเลขโต๊ะ: <strong>{tableLabel}</strong></div>
          <button className="dr-cart" disabled>
            <span className="dr-cartIcon">🧺</span>
            <span className="dr-badge">0</span>
          </button>
        </header>
        <main className="dr-container">
          <p>กำลังโหลดรายการเครื่องดื่ม…</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dr-page">
        <header className="dr-topbar">
          <button className="dr-back" onClick={() => navigate(-1)} aria-label="ย้อนกลับ">‹</button>
          <div className="dr-title">หมายเลขโต๊ะ: <strong>{tableLabel}</strong></div>
        </header>
        <main className="dr-container">
          <p style={{ color: "crimson" }}>❌ โหลดข้อมูลล้มเหลว: {error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="dr-page">
      <header className="dr-topbar">
        <button
          className="dr-back"
          onClick={() => navigate("/")}
          aria-label="ย้อนกลับ"
        >
          ‹
        </button>
        <div className="dr-title">
          หมายเลขโต๊ะ: <strong>{tableLabel}</strong>
        </div>
        <button className="dr-cart" onClick={goCart} aria-label="ไปตะกร้า">
          <span className="dr-cartIcon">🧺</span>
          <span className="dr-badge">{cartCount}</span>
        </button>
      </header>

      <main className="dr-container">
        <h2 className="dr-sectionTitle">- เครื่องดื่ม -</h2>

        <ul className="dr-list">
          {items.map((it) => (
            <li key={it.id} className="dr-row">
              <div className="dr-left">
                <img className="dr-thumb" src={it.img} alt={it.name} />
              </div>
              <div className="dr-mid">
                <h3 className="dr-name">{it.name}</h3>
                <div className="dr-price">{it.price.toFixed(2)} ฿</div>
              </div>
              <div className="dr-right">
                <button className="dr-circle" onClick={() => dec(it.id)} aria-label={`ลด ${it.name}`}>–</button>
                <span className="dr-qty" aria-live="polite">{it.qty}</span>
                <button className="dr-circle" onClick={() => inc(it.id)} aria-label={`เพิ่ม ${it.name}`}>+</button>
              </div>
              <hr className="dr-divider" />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
