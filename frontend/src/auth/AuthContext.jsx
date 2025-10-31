// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const KEY = "admin_session";

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // โหลด session จาก localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data?.username) {
          setAdmin(data);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem(KEY);
        }
      }
    } catch {
      localStorage.removeItem(KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 เรียก API จริงในการ login
  const login = async (username, password) => {
    try {
      const res = await fetch("http://localhost:5000/admins/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { ok: false, message: data.message || "เข้าสู่ระบบไม่สำเร็จ" };
      }

      // ถ้า login สำเร็จ
      const profile = {
        admin_id: data.admin_id,
        username: data.username,
      };

      localStorage.setItem(KEY, JSON.stringify(profile));
      setAdmin(profile);
      setIsAuthenticated(true);

      return { ok: true };
    } catch (err) {
      return { ok: false, message: "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์" };
    }
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    setAdmin(null);
    setIsAuthenticated(false);
  };
  

  const value = {
    admin,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
