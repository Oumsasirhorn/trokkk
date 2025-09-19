// src/pages/ConfirmDrinks.jsx
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import "./drinks.css";

const cartKey = (table) => `dr_cart_${table || "unknown"}`;

// ค่าเริ่มต้นของตัวเลือกในแต่ละเมนู
const DEFAULTS = {
  temp: "เย็น",            // "ร้อน" | "เย็น"
  sweet: "หวานปกติ",       // "หวานน้อย" | "หวานปกติ" | "หวานมาก"
  note: "",                // หมายเหตุของเมนูนั้นๆ (ถ้าต้องการเก็บแยกรายการ)
};

const SWEET_LEVELS = ["หวานน้อย", "หวานปกติ", "หวานมาก"];
const TEMPS = ["ร้อน", "เย็น"];

export default function ConfirmDrinks() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const table = sp.get("table") || "";
  const location = useLocation();
  const { items: itemsFromNav } = location.state || { items: [] };

  // ---------- Persisted cart ----------
  const [items, setItems] = useState(() => {
    try {
      // 1) โหลดจาก storage ก่อน
      const saved = sessionStorage.getItem(cartKey(table));
      const base = saved ? JSON.parse(saved) : Array.isArray(itemsFromNav) ? itemsFromNav : [];
      // 2) ใส่ค่า default ให้เมนูที่ยังไม่มีตัวเลือก
      return (base || []).map((it) => ({
        ...it,
        temp: it.temp || DEFAULTS.temp,
        sweet: it.sweet || DEFAULTS.sweet,
        note: typeof it.note === "string" ? it.note : DEFAULTS.note,
      }));
    } catch {
      const base = Array.isArray(itemsFromNav) ? itemsFromNav : [];
      return base.map((it) => ({
        ...it,
        temp: it.temp || DEFAULTS.temp,
        sweet: it.sweet || DEFAULTS.sweet,
        note: typeof it.note === "string" ? it.note : DEFAULTS.note,
      }));
    }
  });

  // หมายเหตุภาพรวมทั้งออเดอร์ (ตาม UI ในภาพ)
  const [orderNote, setOrderNote] = useState(() => {
    try {
      const saved = sessionStorage.getItem(cartKey(`${table}_order_note`));
      return saved || "";
    } catch {
      return "";
    }
  });

  // เขียนลง storage เมื่อ items / orderNote เปลี่ยน
  useEffect(() => {
    try {
      sessionStorage.setItem(cartKey(table), JSON.stringify(items));
      sessionStorage.setItem(cartKey(`${table}_order_note`), orderNote);
    } catch {}
  }, [items, orderNote, table]);

  // ---------- Derived ----------
  const selected = useMemo(() => items.filter((it) => it.qty > 0), [items]);
  const total = useMemo(
    () => selected.reduce((sum, it) => sum + it.qty * it.price, 0),
    [selected]
  );
  const THB = (n) => `${Number(n).toFixed(2)} ฿`;

  // ---------- UI state ----------
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [askClear, setAskClear] = useState(false);
  const [askRemoveId, setAskRemoveId] = useState(null);

  // ---------- Actions ----------
  const updateItem = (id, patch) => {
    setItems((list) =>
      list.map((x) => (x.id === id ? { ...x, ...patch } : x))
    );
  };

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

      // ===== ส่งคำสั่งซื้อไปหลังบ้านได้ตรงนี้ =====
      // await api.post('/orders', {
      //   table,
      //   note: orderNote,
      //   items: selected.map(({ id, name, qty, price, temp, sweet, note }) => ({
      //     id, name, qty, price, temp, sweet, note,
      //   })),
      //   total
      // });

      alert("ส่งคำสั่งซื้อแล้ว ✅");

      // ✅ เคลียร์เฉพาะเมื่อยืนยันสำเร็จเท่านั้น
      sessionStorage.removeItem(cartKey(table));
      sessionStorage.removeItem(cartKey(`${table}_order_note`));

      // กลับหน้าเลือกเครื่องดื่ม พร้อม query เดิม
      navigate(`/drinks?table=${encodeURIComponent(table)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dr-page dr-page--confirm">
      {/* Top Bar */}
      <header className="dr-topbar">
        <button
          className="dr-back"
          onClick={() => navigate(`/drinks?table=${encodeURIComponent(table)}`)}
          aria-label="ย้อนกลับ"
        >
          ‹
        </button>
        <div className="dr-title">หมายเลขโต๊ะ: {table || "-"}</div>
        <span className="dr-topbar-spacer" aria-hidden="true"></span>
      </header>

      <main className="dr-container dr-container--pb">
        {selected.length === 0 ? (
          <div className="dr-empty">
            <p>ยังไม่มีการสั่งเครื่องดื่ม</p>
            <button
              className="dr-ghostBtn"
              onClick={() => navigate(`/drinks?table=${encodeURIComponent(table)}`)}
            >
              เลือกเครื่องดื่ม
            </button>
          </div>
        ) : (
          <>
            {/* การ์ดรายการแบบในภาพ */}
            <ul className="dr-cardList">
              {selected.map((it, idx) => (
                <li key={it.id} className="dr-card">
                  <div className="dr-card__left">
                    <img src={it.img} alt={it.name} className="dr-card__thumb" />
                  </div>

                  <div className="dr-card__body">
                    <div className="dr-card__head">
                      <div className="dr-card__title">
                        ({idx + 1}) {it.name}
                      </div>
                      <div className="dr-card__unitPrice">{THB(it.price)}</div>
                    </div>

                    <div className="dr-card__meta">
                      <span className="dr-qtyPill">× {it.qty}</span>
                      <span className="dr-lineTotal">{THB(it.qty * it.price)}</span>
                    </div>

                    {/* กลุ่มตัวเลือก: ร้อน/เย็น */}
                    <div className="dr-optionGroup">
                      {TEMPS.map((t) => (
                        <label key={t} className="dr-radio">
                          <input
                            type="radio"
                            name={`temp_${it.id}`}
                            checked={it.temp === t}
                            onChange={() => updateItem(it.id, { temp: t })}
                          />
                          <span>{t}</span>
                        </label>
                      ))}
                    </div>

                    {/* กลุ่มตัวเลือก: ระดับความหวาน */}
                    <div className="dr-optionGroup">
                      {SWEET_LEVELS.map((s) => (
                        <label key={s} className="dr-radio">
                          <input
                            type="radio"
                            name={`sweet_${it.id}`}
                            checked={it.sweet === s}
                            onChange={() => updateItem(it.id, { sweet: s })}
                          />
                          <span>{s}</span>
                        </label>
                      ))}
                    </div>

                
                  </div>

                  <div className="dr-card__right">
                    <button
                      className="dr-chipDanger"
                      onClick={() => setAskRemoveId(it.id)}
                      aria-label={`ลบ ${it.name}`}
                    >
                      ลบ
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* หมายเหตุรวมทั้งออเดอร์ (เหมือนกล่อง "รายละเอียด" ในภาพ) */}
            <div className="dr-noteWrap">
              <label className="dr-noteLabel">รายละเอียด</label>
              <textarea
                className="dr-noteArea"
                placeholder="เช่น ไม่ใส่หลอด, เสิร์ฟทีเดียว"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <button className="dr-chipDangerOutline" onClick={() => setAskClear(true)}>
                ลบทั้งหมด
              </button>
            </div>
          </>
        )}
      </main>

      {/* แถบสรุปติดล่างแบบปุ่มในภาพ */}
      {selected.length > 0 && (
        <div className="dr-summaryBar" role="region" aria-label="สรุปคำสั่งซื้อ">
          <div className="dr-summaryInfo">
            <div className="dr-summaryText">
              <span>รวม {selected.length} รายการ</span>
              <strong className="dr-grand">{THB(total)}</strong>
            </div>
            <div className="dr-summarySub">โต๊ะ: <strong>{table}</strong></div>
          </div>

          {/* ปุ่มสไตล์ "เพิ่มลงตะกร้า 50.00 ฿" */}
          <button
            className="dr-confirmBtn"
            onClick={handleConfirm}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "กำลังส่ง..." : `เพิ่มลงตะกร้า ${THB(total)}`}
          </button>
        </div>
      )}

      {/* ----- Modal: ลบทั้งหมด ----- */}
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

      {/* ----- Modal: ลบ 1 รายการ ----- */}
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
