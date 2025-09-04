import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Drinks.css";

const RAW_DRINKS = [
  { id: 1,  name: "ปีโป้บาลมิลลกวอลมอลต์", price: 45, img: "/images/drinks/pipo.jpg" },
  { id: 2,  name: "กาแฟ",                   price: 40, img: "/images/drinks/coffee.jpg" },
  { id: 3,  name: "โอวัลตินนมสดเย็น",       price: 50, img: "/images/drinks/ovaltine.jpg" },
  { id: 4,  name: "ชาดำเย็น",               price: 50, img: "/images/drinks/blacktea.jpg" },
  { id: 5,  name: "ซ่าเขียวมะนาวโซดา",      price: 35, img: "/images/drinks/lime-soda.jpg" },
  { id: 6,  name: "นมสดปั่นโอริโอ้",        price: 45, img: "/images/drinks/oreo-milkshake.jpg" },
  { id: 7,  name: "มีกลิ่นวานิลลา",         price: 40, img: "/images/drinks/vanilla.jpg" },
];

export default function Drinks() {
  const navigate = useNavigate();

  // ปกติเลขโต๊ะควรมาจาก state/context/URL query – ตัวอย่างนี้ฮาร์ดโค้ดให้เหมือนภาพ
  const tableLabel = "A: 3";

  const initial = useMemo(
    () => RAW_DRINKS.map((d) => ({ ...d, qty: 1 })),
    []
  );
  const [items, setItems] = useState(initial);

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

  const cartCount = items.reduce((sum, it) => sum + it.qty, 0);

  const goCart = () => {
    // คุณจะส่ง items ไป cart ด้วย context/state management ก็ได้
    navigate("/confirm", { state: { table: tableLabel, items } });
  };

  return (
    <div className="dr-page">
      {/* Top Bar */}
      <header className="dr-topbar">
        <button className="dr-back" onClick={() => navigate(-1)} aria-label="ย้อนกลับ">
          ◀
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
        <h2 className="dr-sectionTitle">- เครื่องดื่ม -</h2>

        <ul className="dr-list">
          {items.map((it) => (
            <li key={it.id} className="dr-row">
              <div className="dr-left">
                <img className="dr-thumb" src={it.img} alt={it.name} />
              </div>

              <div className="dr-mid">
                <h3 className="dr-name">{it.name}</h3>
                <div className="dr-price">
                  {it.price.toFixed(2)} ฿
                </div>
              </div>

              <div className="dr-right">
                <button
                  className="dr-circle"
                  onClick={() => dec(it.id)}
                  aria-label={`ลด ${it.name}`}
                >
                  –
                </button>
                <span className="dr-qty" aria-live="polite">{it.qty}</span>
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

        <div className="dr-actions">
          <Link to="/" className="dr-ghostBtn">← เมนูหลัก</Link>
          <button className="dr-primaryBtn" onClick={goCart}>
            ไปตะกร้า ({cartCount})
          </button>
        </div>
      </main>
    </div>
  );
}
