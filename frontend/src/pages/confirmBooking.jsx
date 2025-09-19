import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./ConfirmBooking.css";

export default function ConfirmBooking() {
  const navigate = useNavigate();
  const location = useLocation();

  const tableNo = location.state?.tableNo || "A1";
  const zone = location.state?.zone || "inside";

  const [form, setForm] = useState({
    name: "",
    date: "",
    time: "",
    phone: "",
    slip: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({ ...f, [name]: files ? files[0] : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/success", {
      state: {
        tableNo,
        zone,
        name: form.name,
        date: form.date,
        time: form.time,
        phone: form.phone,
      },
    });
  };

  // ✅ ปุ่มย้อนกลับ (มี fallback)
  const handleBack = () => {
    if (window.history.state && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/"); // หรือเปลี่ยนเป็น "/tables" ถ้าคุณอยากกลับไปหน้าเลือกโต๊ะ
    }
  };

  return (
    <div className="confirm-page">
      <header className="confirm-header">
          <button className="bk-back" onClick={() => navigate(-1)} aria-label="ย้อนกลับ">‹</button>
        <h2>จองโต๊ะ</h2>
      </header>

      <form className="confirm-form" onSubmit={handleSubmit}>
        <h3 className="form-title">รายละเอียดการจอง</h3>

        <label>
          เลขโต๊ะ
          <input type="text" value={tableNo} readOnly />
        </label>

        <label>
          โซน
          <input type="text" value={zone === "inside" ? "ในร้าน" : "นอกร้าน"} readOnly />
        </label>

        <label>
          ผู้จอง
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>

        <div className="row">
          <label>
            วันที่
            <input type="date" name="date" value={form.date} onChange={handleChange} required />
          </label>
          <label>
            เวลา
            <input type="time" name="time" value={form.time} onChange={handleChange} required />
          </label>
        </div>

        <label>
          เบอร์โทร
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
        </label>

        <label>
          หลักฐานการชำระเงิน
          <input type="file" name="slip" onChange={handleChange} />
        </label>

        <div className="btn-row">
          <button type="button" className="btn cancel" onClick={handleBack}>
            ยกเลิก
          </button>
          <button type="submit" className="btn confirm">ยืนยัน</button>
        </div>
      </form>
    </div>
  );
}
