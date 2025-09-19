// src/pages/Foods.jsx
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Foods.css"; // ใช้สไตล์เดิมได้เลย

// อ่านฐาน URL ของ API จาก .env (Vite)
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
// endpoint หลังบ้านที่ใช้จริง
const FOODS_API = `${API_BASE}/main_dishes`;

const cartKey = (table) => `fd_cart_${table || "unknown"}`;

export default function Foods() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const tableLabel = sp.get("table") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);

  // โหลดจาก backend + merge กับของใน sessionStorage
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setError(null);
        setLoading(true);

        // ✅ เรียกหลังบ้านจริง
        const res = await fetch(`${FOODS_API}?limit=200`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log("👉 API foods:", data);

        // รองรับทั้ง {items:[...]} หรือ array ตรง ๆ
        const payload = Array.isArray(data) ? data : data.items || [];

        // สร้าง base list (map ฟิลด์ให้เข้ารูปแบบที่หน้า UI ใช้)
        const base = payload.map((d) => {
          const id = d.id ?? d.item_id;
          const img =
            d.img || d.image || d.image_url || "/images/foods/placeholder.jpg";

          // ถ้ามี base_prices (ธรรมดา/พิเศษ/เล็ก/กลาง/ใหญ่) ให้เลือกตัว default
          const bp = d.base_prices || {};
          const sizeOrder = ["พิเศษ", "ธรรมดา", "ใหญ่", "กลาง", "เล็ก"];
          const defaultPortion =
            sizeOrder.find((k) => bp[k] != null) || Object.keys(bp)[0] || null;

          const basePriceFromBP =
            defaultPortion && bp[defaultPortion] != null
              ? Number(bp[defaultPortion])
              : null;

          // fallback ถ้าไม่มี base_prices → ใช้ d.price หรือ d.default_price
          const basePrice =
            basePriceFromBP ?? Number(d.price ?? d.default_price ?? 0);

          const extra = Number(d.extra_price ?? 0);

          return {
            id,
            name: d.name,
            price: basePrice + extra,
            img,
            base_prices: bp,
            extra_price: extra,
            default_portion: defaultPortion,
            toppings: d.toppings || d.extras || [],
            default_spicy: d.spicy ?? "ปกติ",
            qty: 0,
          };
        });

        // merge qty จาก session
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

  // เขียนกลับ sessionStorage เมื่อ items เปลี่ยน
  useEffect(() => {
    try {
      sessionStorage.setItem(cartKey(tableLabel), JSON.stringify(items));
    } catch {}
  }, [items, tableLabel]);

  const dec = (id) =>
    setItems((list) =>
      list.map((it) =>
        it.id === id ? { ...it, qty: Math.max(0, it.qty - 1) } : it
      )
    );

  const inc = (id) =>
    setItems((list) =>
      list.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it))
    );

  const cartCount = useMemo(
    () => items.reduce((sum, it) => sum + it.qty, 0),
    [items]
  );

  // ไปหน้า confirm ของอาหาร (ใช้ query param พกหมายเลขโต๊ะ)
  const goCart = () => {
    navigate(`/foods/confirm?table=${encodeURIComponent(tableLabel)}`);
  };

  if (loading) {
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
          <p>กำลังโหลดรายการอาหาร…</p>
        </main>
      </div>
    );
  }

  if (error) {
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
        </header>
        <main className="dr-container">
          <p style={{ color: "crimson" }}>❌ โหลดข้อมูลล้มเหลว: {error}</p>
          <p style={{ fontSize: 12, opacity: 0.8 }}>
            ตรวจสอบ VITE_API_BASE ที่ .env และสถานะเซิร์ฟเวอร์ {API_BASE}
          </p>
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
        <h2 className="dr-sectionTitle">- อาหาร -</h2>

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
                <button
                  className="dr-circle"
                  onClick={() => dec(it.id)}
                  aria-label={`ลด ${it.name}`}
                >
                  –
                </button>
                <span className="dr-qty" aria-live="polite">
                  {it.qty}
                </span>
                <button
                  className="dr-circle"
                  onClick={() => inc(it.id)}
                  aria-label={`เพิ่ม ${it.name}`}
                >
                  +
                </button>
              </div>
              <hr className="dr-divider" />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
