import { useEffect, useRef, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Booking from "./booking";
import ConfirmBooking from "./confirmBooking"
import ConfirmSuccess from "./confirmSuccess";
import Drinks from "./drinks";


import "./App.css";


const CATEGORIES = [
  { name: "อาหาร", icon: "🍜" },
  { name: "ของทานเล่น", icon: "🍤" },
  { name: "เครื่องดื่ม", icon: "🥤" },
  { name: "จองโต๊ะ", icon: "📲" },  // <- อันนี้จะลิงก์ไป /booking
];

const HEROES = [
  { img: "/images/p1.png", title: "หอมกระทะ กลมกล่อมทุกคำ!\nผัดซีอิ๊วสูตรเด็ด เส้นใหญ่เหนียวนุ่ม", price: "50 บาท", alt: "ผัดซีอิ๊วสูตรเด็ด" },
  { img: "/images/a1.png", title: "โอริโอ้ลาเต้เย็น \nโอริโอ้เข้ม ลาเต้หอม เย็นสดชื่น", price: "50 บาท", alt: "โอริโอ้ลาเต้เย็น" },
  { img: "/images/a2.png", title: "เกี๊ยวซ่าหมู\nกรอบนอก นุ่มใน ไส้หมูชุ่มฉ่ำ", price: "50 บาท", alt: "เกี๊ยวซ่าหมู" },
];

const PROMOS = [
  { id: 1, name: "ข้าวคลุกน้ำพริกปลาทู", price: "50 บาท", img: "/images/p5.png" },
  { id: 2, name: "ข้าวปลาแกะ",            price: "50 บาท", img: "/images/p4.png" },
  { id: 3, name: "ข้าวกุ้งผัดพริกขี้หนูสวน", price: "50 บาท", img: "/images/p3.png" },
  { id: 4, name: "หมี่ไก่ฉีก",             price: "50 บาท", img: "/images/p2.png" },
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
      {/* HERO (Carousel) */}
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
              <span key={i}>
                {t}{i < a.length - 1 && <br />}
              </span>
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

      {/* CATEGORIES (ลิงก์ “จองโต๊ะ”) */}
      {/* CATEGORIES (ให้ “เครื่องดื่ม” กับ “จองโต๊ะ” เป็นลิงก์) */}
<section className="cats">
  {CATEGORIES.map((c) => {
    const to =
      c.name === "จองโต๊ะ" ? "/booking" :
      c.name === "เครื่องดื่ม" ? "/drinks" :
      null;

    return to ? (
      <Link key={c.name} to={to} className="cat">
        <span className="cat__icon" aria-hidden>{c.icon}</span>
        <span className="cat__label">{c.name}</span>
      </Link>
    ) : (
      <button key={c.name} className="cat" type="button">
        <span className="cat__icon" aria-hidden>{c.icon}</span>
        <span className="cat__label">{c.name}</span>
      </button>
    );
  })}
</section>


      {/* PROMOTIONS */}
      <section className="section">
        <h2 className="section__title">โปรโมชั่น</h2>
        <div className="grid">
          {PROMOS.map((p) => (
            <article key={p.id} className="card">
              <div className="card__imgWrap">
                <div className="card__halo" />
                <img src={p.img} alt={p.name} />
              </div>
              <div className="card__body">
                <h3 className="card__name">{p.name}</h3>
                <span className="badge">{p.price}</span>
              </div>
            </article>
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
      <Route path="/success" element={<ConfirmSuccess />} /> {/* ✅ */}
      <Route path="/drinks" element={<Drinks />} />

    </Routes>
  );
}