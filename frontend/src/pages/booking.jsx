import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Booking.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// ปรับช่วงโซนชั่วคราว: A1–A18 = inside (แก้ได้ตามผังจริง)
const INSIDE_MAX = 18;
const ZONES = ["inside", "outside"];

// เดาโซนจากชื่อโต๊ะถ้ายังไม่มี zone จาก backend
function deriveZoneFromLabel(label = "") {
  const m = String(label).match(/(\d+)/);
  const n = m ? Number(m[1]) : NaN;
  if (Number.isNaN(n)) return "inside";
  return n <= INSIDE_MAX ? "inside" : "outside";
}

export default function Booking() {
  const navigate = useNavigate();

  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [tables, setTables]     = useState([]);   // [{id, number, status, qr_code, zone}]
  const [selected, setSelected] = useState(null); // table_number
  const [zone, setZone]         = useState("inside");

  // โหลดรายการโต๊ะจาก backend (ตอนนี้ยังไม่แยกโซน server-side)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE}/tables-in`, { headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const rows = Array.isArray(data) ? data : (data.items || data.tables || []);
        const normalized = rows.map((r) => {
          const number = r.table_number ?? r.tableNo ?? r.number ?? `T${r.table_id ?? r.id ?? ""}`;
          // ถ้า backend ยังไม่มี r.zone → เดาจากหมายเลข, ถ้ามีแล้วจะใช้ค่าจาก backend ทันที
          const zone = (r.zone || r.area || r.section) ?? deriveZoneFromLabel(number);
          return {
            id:      r.table_id ?? r.id ?? r.tableId,
            number,
            status:  r.status ?? "ว่าง",
            qr_code: r.qr_code ?? null,
            zone, // <-- สำคัญ
          };
        });

        // เรียงตามเลขท้าย
        const ordered = normalized.sort((a, b) => {
          const na = Number(String(a.number).match(/\d+/)?.[0] ?? 1e9);
          const nb = Number(String(b.number).match(/\d+/)?.[0] ?? 1e9);
          return na - nb;
        });

        if (alive) setTables(ordered);
      } catch (e) {
        if (alive) setError(e.message || "โหลดข้อมูลโต๊ะไม่สำเร็จ");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // กรองตามโซนที่เลือก
  const visibleTables = useMemo(
    () => tables.filter((t) => t.zone === zone),
    [tables, zone]
  );

  // ถ้าเปลี่ยนโซนแล้วโต๊ะที่เลือกไม่อยู่ในโซนนั้น → เคลียร์
  useEffect(() => {
    if (selected && !visibleTables.some((t) => t.number === selected)) {
      setSelected(null);
    }
  }, [zone, visibleTables, selected]);

  const isReserved = (t) => (t.status || "").trim() !== "ว่าง";

  const onPick = (t) => {
    if (isReserved(t)) return;
    setSelected((prev) => (prev === t.number ? null : t.number));
  };

  const onConfirm = (e) => {
    e.preventDefault();
    if (!selected) return alert("โปรดเลือกโต๊ะก่อน");
    navigate("/confirm", { state: { tableNo: selected, zone }, replace: false });
  };

  return (
    <div className="booking-full">
      <header className="bk-titlebar">
        <button className="bk-back" onClick={() => navigate(-1)} aria-label="ย้อนกลับ">‹</button>
        <h1>จองโต๊ะ</h1>
      </header>

      {/* ปุ่มสลับโซน */}
      <div className="bk-zones">
        {ZONES.map((z) => (
          <button
            key={z}
            className={`bk-zone ${zone === z ? "active" : ""}`}
            onClick={() => setZone(z)}
            type="button"
          >
            {z === "inside" ? "โซนในร้าน" : "โซนนอกร้าน"}
          </button>
        ))}
      </div>

      <div className="bk-legend top">เวที</div>

      <div className="bk-map">
        {loading && <div className="bk-loading">กำลังโหลดโต๊ะ…</div>} 
        {error &&   <div className="bk-error">เกิดข้อผิดพลาด: {error}</div>}

        {!loading && !error && visibleTables.map((t) => {
          const reserved = isReserved(t);
          const isSel = selected === t.number;
          return (
            <button
              key={t.id ?? t.number}
              className={`seat ${reserved ? "seat--reserved" : ""} ${isSel ? "seat--selected" : ""}`}
              onClick={() => onPick(t)}
              type="button"
              disabled={reserved}
              aria-pressed={isSel}
              aria-label={reserved ? `${t.number} จองแล้ว` : `โต๊ะ ${t.number}`}
              title={reserved ? "จองแล้ว" : `เลือกโต๊ะ ${t.number}`}
            >
              {reserved ? "จองแล้ว" : t.number}
            </button>
          );
        })}
      </div>

      <div className="bk-legend bottom">ประตูร้าน</div>

      <form onSubmit={onConfirm} className="bk-actions">
        <div className="bk-summary">
          โต๊ะที่เลือก: <strong>{selected ?? "-"}</strong> / โซน: <strong>{zone === "inside" ? "ในร้าน" : "นอกร้าน"}</strong>
        </div>
        <button className="bk-submit" type="submit" disabled={!selected}>
          ยืนยันการจอง
        </button>
      </form>
    </div>
  );
}
