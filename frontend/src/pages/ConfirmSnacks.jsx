import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import "./Snacks.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const cartKey = (table) => `sn_cart_${table || "unknown"}`;

export default function ConfirmSnacks() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const table = state?.table || "";
  const itemsFromNav = Array.isArray(state?.items) ? state.items : [];

  // persist cart
  const [items, setItems] = useState(() => {
    try {
      const saved = sessionStorage.getItem(cartKey(table));
      if (saved) return JSON.parse(saved);
    } catch {}
    return itemsFromNav;
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(cartKey(table), JSON.stringify(items));
    } catch {}
  }, [items, table]);

  const selected = useMemo(() => items.filter((it) => it.qty > 0), [items]);
  const total = useMemo(() => selected.reduce((s, it) => s + it.qty * it.price, 0), [selected]);
  const THB = (n) => `${Number(n).toFixed(2)} ฿`;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [askClear, setAskClear] = useState(false);
  const [askRemoveId, setAskRemoveId] = useState(null);

  const removeOne = (id) => {
    setAskRemoveId(null);
    setItems((list) => list.filter((x) => x.id !== id));
  };
  const clearAll = () => {
    setAskClear(false);
    setItems([]);
  };

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      // ตัวอย่างถ้าจะต่อหลังบ้าน:
      // await fetch(`${API_BASE}/orders`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ type:'snacks', table, items:selected, total }) });
      alert("ส่งคำสั่งซื้อแล้ว ✅");
      sessionStorage.removeItem(cartKey(table));
      navigate(-1);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dr-page dr-page--confirm">
      <header className="dr-topbar">
        <button className="dr-back" onClick={() => navigate(-1)} aria-label="ย้อนกลับ">‹</button>
        <div className="dr-title">ตรวจสอบรายการ (ของทานเล่น)</div>
        <span className="dr-topbar-spacer" />
      </header>

      <main className="dr-container dr-container--pb">
        <h2 className="dr-sectionTitle">
          ตะกร้าโต๊ะ <strong>{table || "-"}</strong>
        </h2>

        {selected.length === 0 ? (
          <div className="dr-empty">
            <p>ยังไม่มีการสั่งของทานเล่น</p>
            <button className="dr-ghostBtn" onClick={() => navigate(-1)}>เลือกเมนู</button>
          </div>
        ) : (
          <>
            <ul className="dr-list">
              {selected.map((it) => (
                <li key={it.id} className="dr-row dr-row--confirm">
                  <div className="dr-left">
                    <img src={it.img} alt={it.name} className="dr-thumb" />
                  </div>

                  <div className="dr-mid">
                    <h3 className="dr-name">{it.name}</h3>
                    <div className="dr-meta">
                      <span className="dr-qtyPill">× {it.qty}</span>
                      <span className="dr-priceUnit">{THB(it.price)}</span>
                    </div>
                  </div>

                  <div className="dr-right" style={{ gap: 8 }}>
                    <div className="dr-lineTotal">{THB(it.qty * it.price)}</div>
                    <button className="dr-chipDanger" onClick={() => setAskRemoveId(it.id)}>ลบ</button>
                  </div>

                  <hr className="dr-divider" />
                </li>
              ))}
            </ul>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
              <button className="dr-chipDangerOutline" onClick={() => setAskClear(true)}>ลบทั้งหมด</button>
            </div>
          </>
        )}
      </main>

      {selected.length > 0 && (
        <div className="dr-summaryBar" role="region" aria-label="สรุปคำสั่งซื้อ">
          <div className="dr-summaryInfo">
            <div className="dr-summaryText">
              <span>รวม {selected.length} รายการ</span>
              <strong className="dr-grand">{THB(total)}</strong>
            </div>
            <div className="dr-summarySub">โต๊ะ: <strong>{table || "-"}</strong></div>
          </div>

          <button className="dr-confirmBtn" onClick={handleConfirm} disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting ? "กำลังส่ง..." : "ยืนยันการสั่งซื้อ"}
          </button>
        </div>
      )}

      {askClear && (
        <div className="dr-modal" role="dialog" aria-modal="true">
          <div className="dr-dialog">
            <h3 className="dr-dialogTitle">ลบรายการทั้งหมด?</h3>
            <div className="dr-actions">
              <button className="dr-dialogBtnDanger" onClick={clearAll}>ลบ</button>
              <button className="dr-dialogBtn" onClick={() => setAskClear(false)}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}

      {askRemoveId !== null && (
        <div className="dr-modal" role="dialog" aria-modal="true">
          <div className="dr-dialog">
            <h3 className="dr-dialogTitle">ลบรายการนี้?</h3>
            <div className="dr-actions">
              <button className="dr-dialogBtnDanger" onClick={() => removeOne(askRemoveId)}>ลบ</button>
              <button className="dr-dialogBtn" onClick={() => setAskRemoveId(null)}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
