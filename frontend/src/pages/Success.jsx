// src/pages/Success.jsx
import { useLocation, useNavigate } from "react-router-dom";
import "./Success.css";

export default function Success() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    tableNo,
    zone,   // จาก ConfirmBooking ส่งค่าเป็นภาษาไทยแล้ว เช่น "โซนในร้าน"
    name,
    date,
    time,
    phone,
  } = location.state || {};

  const missingState = !tableNo || !zone || !name || !date || !time || !phone;

  if (missingState) {
    // ถ้าเข้าหน้านี้ตรง ๆ โดยไม่มี state ให้พากลับไปจองใหม่
    return (
      <div className="success-page">
        <div className="success-card">
          <div className="icon warn">!</div>
          <h2>ไม่พบข้อมูลการจอง</h2>
          <p className="muted">โปรดกลับไปเลือกโต๊ะและกรอกรายละเอียดใหม่อีกครั้ง</p>
          <div className="btn-row">
            <button className="btn primary" onClick={() => navigate("/booking")}>
              ไปหน้าเลือกโต๊ะ
            </button>
            <button className="btn ghost" onClick={() => navigate("/")}>
              กลับหน้าแรก
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="icon ok" aria-hidden="true">✓</div>
        <h2>จองสำเร็จ!</h2>
        <p className="muted">ระบบบันทึกคำขอของคุณเรียบร้อยแล้ว</p>

        <div className="summary">
          {/* --- เอาแถว "รหัสการจอง" ออกแล้ว --- */}
          <div className="row">
            <span className="label">ผู้จอง</span>
            <span className="value">{name}</span>
          </div>
          <div className="row">
            <span className="label">วันที่ / เวลา</span>
            <span className="value">{date} เวลา {time} น.</span>
          </div>
          <div className="row">
            <span className="label">โต๊ะ</span>
            <span className="value">{tableNo}</span>
          </div>
          <div className="row">
            <span className="label">โซน</span>
            <span className="value">{zone}</span>
          </div>
          <div className="row">
            <span className="label">เบอร์โทร</span>
            <span className="value">{phone}</span>
          </div>
        </div>

        {/* ปรับข้อความแนะนำ ไม่อ้างถึง "รหัสการจอง" แล้ว */}
        <div className="tip">
          โปรดแสดงรายละเอียดนี้ให้พนักงานเมื่อมาถึงร้าน หรือเก็บภาพหน้าจอไว้เป็นหลักฐาน
        </div>

        <div className="btn-row">
          <button className="btn primary" onClick={() => navigate("/")}>
            กลับหน้าแรก
          </button>
          <button className="btn ghost" onClick={() => navigate("/booking")}>
            จองเพิ่ม
          </button>
        </div>
      </div>
    </div>
  );
}
