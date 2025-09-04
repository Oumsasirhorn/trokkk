import { useNavigate, useLocation } from "react-router-dom";
import "./ConfirmSuccess.css";

export default function ConfirmSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const tableNo = state?.tableNo || "A1";
  const name = state?.name || "แบบบนี้";
  const staff = state?.staff || "ภานุ";
  const zone = state?.zone || "inside";

  return (
    <div className="success-page">
      {/* Header */}
      <header className="success-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="ย้อนกลับ">←</button>
        <h2 className="title">จองโต๊ะ</h2>
        <div className="spacer" />
      </header>

      {/* Card */}
      <div className="success-card">
        {/* แถวบน: เลขโต๊ะ + ปุ่มรายละเอียด */}
        <div className="top-row">
          <div className="field-inline">
            <label>เลขโต๊ะ:</label>
            <input value={tableNo} readOnly />
          </div>

          <button
            className="detail-btn"
            type="button"
            onClick={() =>
              alert(`รายละเอียดการจอง
โต๊ะ: ${tableNo}
โซน: ${zone === "inside" ? "ในร้าน" : "นอกร้าน"}
ผู้จอง: ${name}`)
            }
          >
            รายละเอียดการจอง
          </button>
        </div>

        {/* ผู้จอง */}
        <div className="field-block">
          <label>ผู้จอง</label>
          <input defaultValue={name} readOnly />
        </div>

        {/* กล่องสำเร็จ (ไอคอนเช็ค) */}
        <div className="success-box">
          <div className="check">✓</div>
          <div className="success-text">จองสำเร็จ</div>
        </div>

        {/* พนักงาน */}
        <div className="field-block">
          <label>พนักงาน</label>
          <input defaultValue={staff} readOnly />
        </div>
      </div>
    </div>
  );
}
