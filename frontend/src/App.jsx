// App.jsx
import { useEffect, useRef, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

import Booking from "./pages/booking";
import ConfirmBooking from "./pages/confirmBooking";
import Drinks from "./pages/drinks";              // <- แก้เป็น D ใหญ่
import ConfirmDrinks from "./pages/ConfirmDrinks";
import Snacks from "./pages/Snacks";
import ConfirmSnacks from "./pages/ConfirmSnacks";
import Foods from "./pages/Foods";
import ConfirmFoods from "./pages/ConfirmFoods";

import "./App.css";

// ✅ หมวดหมู่
const CATEGORIES = [
  { name: "อาหาร",       icon: "🍜", to: "/foods" },
  { name: "ของทานเล่น", icon: "🍤", to: "/snacks" },
  { name: "เครื่องดื่ม", icon: "🥤", to: "/drinks?table=A1" }, // ใส่โต๊ะเริ่มต้น
  { name: "จองโต๊ะ",     icon: "📲", to: "/booking" },
];

// ✅ สไลด์โปรโมต
const HEROES = [
  { img: "/images/p1.png", title: "หอมกระทะ กลมกล่อมทุกคำ!\nผัดซีอิ๊วสูตรเด็ด เส้นใหญ่เหนียวนุ่ม", price: "50 บาท", alt: "ผัดซีอิ๊วสูตรเด็ด" },
  { img: "/images/a1.png", title: "โอริโอ้ลาเต้เย็น \nโอริโอ้เข้ม ลาเต้หอม เย็นสดชื่น", price: "50 บาท", alt: "โอริโอ้ลาเต้เย็น" },
  { img: "/images/a2.png", title: "เกี๊ยวซ่าหมู\nกรอบนอก นุ่มใน ไส้หมูชุ่มฉ่ำ", price: "50 บาท", alt: "เกี๊ยวซ่าหมู" },
];

// ✅ รายการโปรโมชั่น (โชว์อย่างเดียว)
const PROMOS = [
  { id: 1, name: "ข้าวคลุกน้ำพริกปลาทู",        price: "50 บาท", img: "/images/p5.png" },
  { id: 2, name: "ข้าวปลาแกะ",                   price: "50 บาท", img: "/images/p4.png" },
  { id: 3, name: "ข้าวกุ้งผัดพริกขี้หนูสวน",     price: "50 บาท", img: "/images/p3.png" },
  { id: 4, name: "หมี่ไก่ฉีก",                    price: "50 บาท", img: "/images/p2.png" },
];

function Home() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const next = () => setIndex((i) => (i + 1) % HEROES.length);
  const prev = () => setIndex((i) => (i - 1 + HEROES.length) % HEROES.length);
  const goTo = (i) => setIndex(i);

  useEffect(() => {
    startAuto();
    return stopAuto;
  }, [index]);

  const startAuto = () => {
    stopAuto();
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % HEROES.length);
    }, 3500);
  };
  const stopAuto = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const slide = HEROES[index];

  return (
    <div className="page">
      {/* HERO */}
      <section
        className="hero"
        onMouseEnter={stopAuto}
        onMouseLeave={startAuto}
        aria-roledescription="carousel"
        aria-label="เมนูแนะนำ"
      >
        <button className="nav-btn left" aria-label="ก่อนหน้า" onClick={prev} type="button">‹</button>

        <div className="hero__imgWrap" aria-live="polite">
          <img src={slide.img} alt={slide.alt} />
        </div>

        <div className="hero__text">
          <p className="hero__title">
            {slide.title.split("\n").map((t, i, a) => (
              <span key={i}>{t}{i < a.length - 1 && <br />}</span>
            ))}
          </p>
          <p className="hero__price">เพียง <strong>{slide.price}</strong></p>
        </div>

        <button className="nav-btn right" aria-label="ถัดไป" onClick={next} type="button">›</button>
      </section>

      {/* DOTS */}
      <div className="dots" role="tablist" aria-label="ตัวเลือกสไลด์">
        {HEROES.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === index ? "active" : ""}`}
            aria-label={`ไปสไลด์ที่ ${i + 1}`}
            aria-selected={i === index}
            role="tab"
            onClick={() => goTo(i)}
            type="button"
          />
        ))}
      </div>

      {/* CATEGORIES */}
      <section className="cats">
        {CATEGORIES.map((c) => (
          <Link key={c.name} to={c.to} className="cat">
            <span className="cat__icon" aria-hidden>{c.icon}</span>
            <span className="cat__label">{c.name}</span>
          </Link>
        ))}
      </section>

      {/* PROMOTIONS (ไม่กดได้) */}
      <section className="section">
        <h2 className="section__title">เมนูแนะนำ</h2>
        <div className="grid">
          {PROMOS.map((p) => (
            <div
              key={p.id}
              className="card"
              style={{ textAlign: "left", cursor: "default" }}
            >
              <div className="card__imgWrap">
                <div className="card__halo" />
                <img src={p.img} alt={p.name} />
              </div>
              <div className="card__body">
                <h3 className="card__name">{p.name}</h3>
                <span className="badge">{p.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/booking" element={<Booking />} />
      <Route path="/confirm" element={<ConfirmBooking />} />

      <Route path="/drinks" element={<Drinks />} />
      <Route path="/drinks/confirm" element={<ConfirmDrinks />} />

      <Route path="/snacks" element={<Snacks />} />
      <Route path="/snacks/confirm" element={<ConfirmSnacks />} />

      <Route path="/foods" element={<Foods />} />
      <Route path="/foods/confirm" element={<ConfirmFoods />} />
    </Routes>
  );
}
