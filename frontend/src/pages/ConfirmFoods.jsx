// src/pages/ConfirmFoods.jsx
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import "./Foods.css";

const cartKey = (table) => `fd_cart_${table || "unknown"}`;

const DEFAULTS = {
  special: "ธรรมดา",      // "ธรรมดา" | "พิเศษ +10"
  eatWhere: "ทานที่ร้าน", // "เอากลับบ้าน" | "ทานที่ร้าน"
};
const SPECIAL_OPTS = ["ธรรมดา", "พิเศษ +10"];
const EATWHERE_OPTS = ["เอากลับบ้าน", "ทานที่ร้าน"];
const SPECIAL_ADD = 10;

export default function ConfirmFoods() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const table = sp.get("table") || "";
  const location = useLocation();
  const { items: itemsFromNav } = location.state || { items: [] };

  // ---------- Persisted cart ----------
  const [items, setItems] = useState(() => {
    try {
      const saved = sessionStorage.getItem(cartKey(table));
      const base = saved ? JSON.parse(saved) : Array.isArray(itemsFromNav) ? itemsFromNav : [];
      return (base || []).map((it) => ({
        ...it,
        special: it.special || DEFAULTS.special,
        eatWhere: it.eatWhere || DEFAULTS.eatWhere,
        // รองรับหมายเหตุรายเมนู (ถ้าจะใช้ภายหลัง)
        itemNote: typeof it.itemNote === "string" ? it.itemNote : "",
      }));
    } catch {
      const base = Array.isArray(itemsFromNav) ? itemsFromNav : [];
      return base.map((it) => ({
        ...it,
        special: it.special || DEFAULTS.special,
        eatWhere: it.eatWhere || DEFAULTS.eatWhere,
        itemNote: typeof it.itemNote === "string" ? it.itemNote : "",
      }));
    }
  });

  // หมายเหตุรวมทั้งออเดอร์ (ช่อง “รายละเอียด”)
  const [orderNote, setOrderNote] = useState(() => {
    try {
      const saved = sessionStorage.getItem(cartKey(`${table}_order_note`));
      return saved || "";
    } catch { return ""; }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(cartKey(table), JSON.stringify(items));
      sessionStorage.setItem(cartKey(`${table}_order_note`), orderNote);
    } catch {}
  }, [items, orderNote, table]);

  // ---------- Derived ----------
  const selected = useMemo(() => items.filter((it) => it.qty > 0), [items]);

  const extraPerPiece = (it) => (it.special === "พิเศษ +10" ? SPECIAL_ADD : 0);

  const lineTotal = (it) => {
    const price = Number(it.price || 0);
    return it.qty * (price + extraPerPiece(it));
  };

  const total = useMemo(
    () => selected.reduce((sum, it) => sum + lineTotal(it), 0),
    [selected]
  );

  const THB = (n) => `${Number(n).toFixed(2)} ฿`;

  // ---------- UI state ----------
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [askClear, setAskClear] = useState(false);
  const [askRemoveId, setAskRemoveId] = useState(null);

  // ---------- Actions ----------
  const updateItem = (id, patch) => {
    setItems((list) => list.map((x) => (x.id === id ? { ...x, ...patch } : x)));
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
      // TODO: POST ไปหลังบ้าน
      // await api.post('/orders/foods', {
      //   table,
      //   note: orderNote,
      //   items: selected.map((it) => ({
      //     id: it.id,
      //     name: it.name,
      //     qty: it.qty,
      //     price: Number(it.price),
      //     special: it.special,
      //     eatWhere: it.eatWhere,
      //     itemNote: it.itemNote || "",
      //     extraPerPiece: extraPerPiece(it),
      //     lineTotal: lineTotal(it),
      //   })),
      //   total,
      // });

      alert("ส่งคำสั่งซื้อแล้ว ✅");
      sessionStorage.removeItem(cartKey(table));
      sessionStorage.removeItem(cartKey(`${table}_order_note`));
      navigate(`/foods?table=${encodeURIComponent(table)}`);
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
          onClick={() => navigate(`/foods?table=${encodeURIComponent(table)}`)}
          aria-label="ย้อนกลับ"
        >
          ‹
        </button>
        <div className="dr-title">ตรวจสอบรายการอาหาร</div>
        <span className="dr-topbar-spacer" aria-hidden="true"></span>
      </header>

      <main className="dr-container dr-container--pb">
        <h2 className="dr-sectionTitle">
          ตะกร้าโต๊ะ <strong>{table || "-"}</strong>
        </h2>

        {selected.length === 0 ? (
          <div className="dr-empty">
            <p>ยังไม่มีการสั่งอาหาร</p>
            <button
              className="dr-ghostBtn"
              onClick={() => navigate(`/foods?table=${encodeURIComponent(table)}`)}
            >
              เลือกอาหาร
            </button>
          </div>
        ) : (
          <>
            <ul className="dr-cardList">
              {selected.map((it, idx) => (
                <li key={it.id} className="dr-card">
                  <div className="dr-card__left">
                    <img src={it.img} alt={it.name} className="dr-card__thumb" />
                  </div>

                  <div className="dr-card__body">
                    <div className="dr-card__head">
                      <div className="dr-card__title">({idx + 1}) {it.name}</div>
                      <div className="dr-card__unitPrice">{THB(it.price)}</div>
                    </div>

                    <div className="dr-card__meta">
                      <span className="dr-qtyPill">× {it.qty}</span>
                      <span className="dr-lineTotal">{THB(lineTotal(it))}</span>
                    </div>

                    {/* บรรทัด 1: ธรรมดา / พิเศษ +10 (แสดงรายละเอียดเพิ่ม) */}
                    <div className="dr-optionGroup">
                      {SPECIAL_OPTS.map((s) => (
                        <label key={s} className="dr-radio">
                          <input
                            type="radio"
                            name={`sp_${it.id}`}
                            checked={it.special === s}
                            onChange={() => updateItem(it.id, { special: s })}
                          />
                          <span>
                            {s}
                            {s === "พิเศษ +10" && (
                              <> (เพิ่ม {THB(SPECIAL_ADD)} × {it.qty})</>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* บรรทัด 2: เอากลับบ้าน / ทานที่ร้าน */}
                    <div className="dr-optionGroup">
                      {EATWHERE_OPTS.map((e) => (
                        <label key={e} className="dr-radio">
                          <input
                            type="radio"
                            name={`ew_${it.id}`}
                            checked={it.eatWhere === e}
                            onChange={() => updateItem(it.id, { eatWhere: e })}
                          />
                          <span>{e}</span>
                        </label>
                      ))}
                    </div>

                    {/* ถ้าต้องการเปิดหมายเหตุรายเมนู ให้เอาคอมเมนต์ออกได้ */}
                    {/* <textarea
                      className="dr-itemNote"
                      placeholder="หมายเหตุของเมนูนี้ เช่น ไข่ดาวสุกมาก"
                      value={it.itemNote}
                      onChange={(e) => updateItem(it.id, { itemNote: e.target.value })}
                    /> */}
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

            {/* รายละเอียดรวม (เหมือนกล่อง "รายละเอียด" ในภาพตัวอย่าง) */}
            <div className="dr-noteWrap">
              <label className="dr-noteLabel">รายละเอียด</label>
              <textarea
                className="dr-noteArea"
                placeholder="เช่น แยกน้ำจิ้ม, ไม่ใส่ช้อนส้อม, เสิร์ฟพร้อมกัน"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
              <button className="dr-chipDangerOutline" onClick={() => setAskClear(true)}>
                ลบทั้งหมด
              </button>
            </div>
          </>
        )}
      </main>

      {/* Summary fixed bottom */}
      {selected.length > 0 && (
        <div className="dr-summaryBar" role="region" aria-label="สรุปคำสั่งซื้อ">
          <div className="dr-summaryInfo">
            <div className="dr-summaryText">
              <span>รวม {selected.length} รายการ</span>
              <strong className="dr-grand">{THB(total)}</strong>
            </div>
            <div className="dr-summarySub">โต๊ะ: <strong>{table}</strong></div>
          </div>

          <button
            className="dr-confirmBtn"
            onClick={handleConfirm}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "กำลังส่ง..." : "ยืนยันการสั่งซื้อ"}
          </button>
        </div>
      )}

      {/* ----- Modal: ลบทั้งหมด ----- */}
      {askClear && (
        <div className="dr-modal" role="dialog" aria-modal="true">
          <div className="dr-dialog">
            <h3 className="dr-dialogTitle">ลบรายการ</h3>
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
