// Booking.jsx
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Booking.css";

const INSIDE_COUNT = 18;
const TOTAL_TABLES = 33;

const insideTables = Array.from({ length: INSIDE_COUNT }, (_, i) => `A${i + 1}`);
const outsideTables = Array.from({ length: TOTAL_TABLES - INSIDE_COUNT }, (_, i) => `A${INSIDE_COUNT + i + 1}`);

// Booking.jsx
const RESERVED = {
  inside: [],   // ✅ ไม่มีโต๊ะถูกจองล่วงหน้า
  outside: [],  // ✅ ไม่มีโต๊ะถูกจองล่วงหน้า
};


export default function Booking() {
  const navigate = useNavigate();
  const [zone, setZone] = useState("inside");
  const [selected, setSelected] = useState(null);

  const tables = useMemo(() => (zone === "inside" ? insideTables : outsideTables), [zone]);
  const isReserved = (t) => RESERVED[zone]?.includes(t);

  const onPick = (t) => {
    if (isReserved(t)) return;
    setSelected((cur) => (cur === t ? null : t));
  };

  // ✅ เปลี่ยนให้เด้งไปหน้า /confirm พร้อมส่ง state
  const onConfirm = (e) => {
    e.preventDefault();
    if (!selected) return alert("โปรดเลือกโต๊ะก่อน");
    navigate("/confirm", {
      state: {
        tableNo: selected,
        zone,               // "inside" | "outside"
      },
      replace: false,
    });
  };

  useEffect(() => {
    if (selected && !tables.includes(selected)) setSelected(null);
  }, [zone, selected, tables]);

  return (
    <div className="booking-full">
      <header className="bk-titlebar">
        <button className="bk-back" onClick={() => navigate(-1)} aria-label="ย้อนกลับ">‹</button>
        <h1>จองโต๊ะ</h1>
      </header>

      <div className="bk-zones">
        <button className={`bk-zone ${zone === "inside" ? "active" : ""}`} onClick={() => setZone("inside")} type="button">โซนในร้าน</button>
        <button className={`bk-zone ${zone === "outside" ? "active" : ""}`} onClick={() => setZone("outside")} type="button">โซนนอกร้าน</button>
      </div>

      <div className="bk-legend top">เวที</div>

      <div className="bk-map">
        {tables.map((t) => {
          const reserved = isReserved(t);
          const isSel = selected === t;
          return (
            <button
              key={t}
              className={`seat ${reserved ? "seat--reserved" : ""} ${isSel ? "seat--selected" : ""}`}
              onClick={() => onPick(t)}
              type="button"
              disabled={reserved}
              aria-label={reserved ? `${t} จองแล้ว` : `โต๊ะ ${t}`}
            >
              {reserved ? "จองแล้ว" : t}
            </button>
          );
        })}
      </div>

      <div className="bk-side-label">บาร์</div>
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
