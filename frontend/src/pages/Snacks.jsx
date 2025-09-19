import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Snacks.css"; // ใช้สไตล์เดิมร่วมกัน

const cartKey = (table) => `sn_cart_${table || "unknown"}`;

export default function Snacks() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const tableLabel = sp.get("table") || ""; // ดึงหมายเลขโต๊ะจาก query param

  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [items, setItems]   = useState([]);

  // โหลดจาก backend + merge กับของใน sessionStorage
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setError(null);
        setLoading(true);

        const res = await fetch("http://localhost:5000/snacks");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // รองรับทั้ง {items:[...]} หรือ array ตรง ๆ
        const payload = Array.isArray(data) ? data : (data.items || data.snacks || []);

        const base = payload.map((d) => ({
          id:    d.id ?? d.item_id ?? d.snack_id,
          name:  d.name,
          price: Number(d.price ?? d.default_price ?? 0),
          img:   d.img || "/images/snacks/placeholder.jpg",
          qty:   0,
        }));

        // merge qty จาก session
        const saved = sessionStorage.getItem(cartKey(tableLabel));
        if (saved) {
          const savedArr = JSON.parse(saved);
          const byId = Object.fromEntries(savedArr.map((x) => [x.id, x]));
          for (const it of base) it.qty = Math.max(0, byId[it.id]?.qty ?? 0);
        }

        if (alive) setItems(base);
      } catch (e) {
        if (alive) setError(e.message || "โหลดข้อมูลล้มเหลว");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [tableLabel]);

  // เขียนกลับ sessionStorage เมื่อ items เปลี่ยน
  useEffect(() => {
    try {
      sessionStorage.setItem(cartKey(tableLabel), JSON.stringify(items));
    } catch {}
  }, [items, tableLabel]);

  const dec = (id) =>
    setItems((list) => list.map((it) => it.id === id ? { ...it, qty: Math.max(0, it.qty - 1) } : it));

  const inc = (id) =>
    setItems((list) => list.map((it) => it.id === id ? { ...it, qty: it.qty + 1 } : it));

  const cartCount = useMemo(() => items.reduce((s, it) => s + it.qty, 0), [items]);

  const goCart = () => {
    navigate("/snacks/confirm", { state: { table: tableLabel, items } });
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
          <p>กำลังโหลดรายการของทานเล่น…</p>
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
        <button className="dr-back" onClick={() => navigate(-1)} aria-label="ย้อนกลับ">‹</button>
        <div className="dr-title">หมายเลขโต๊ะ: <strong>{tableLabel}</strong></div>
        <button className="dr-cart" onClick={goCart} aria-label="ไปตะกร้า">
          <span className="dr-cartIcon">🧺</span>
          <span className="dr-badge">{cartCount}</span>
        </button>
      </header>

      <main className="dr-container">
        <h2 className="dr-sectionTitle">- ของทานเล่น -</h2>
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
