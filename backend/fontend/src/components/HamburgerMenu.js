import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./HamburgerMenu.css";

export default function HamburgerMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const drawerRef = useRef(null);
  const hamburgerRef = useRef(null);

  const isMain = location.pathname === "/";

  const categories = [
    "1/2 TEE", "HOOD", "SWEAT SHIRT", "LONG SLEEVES",
    "OUTER", "BOTTOM", "KNIT", "OTHER",
  ];

  // 외부 클릭 시 드로어 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(e.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  // 스크롤 상태 감지
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const getBarColor = () => {
    if (isMain && !scrolled && !open) return "#fff";
    return "#000";
  };

  return (
    <>
      {/* 햄버거 아이콘 */}
      <div
        ref={hamburgerRef}
        className={`hamburger ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
        style={{ position: "fixed", top: 20, left: 20, zIndex: 10001 }}
      >
        <span style={{ backgroundColor: getBarColor() }}></span>
        <span style={{ backgroundColor: getBarColor() }}></span>
        <span style={{ backgroundColor: getBarColor() }}></span>
      </div>

      {/* 드로어 메뉴 */}
      <div
        className={`drawer ${open ? "open" : ""}`}
        ref={drawerRef}
        style={{ zIndex: 10000 }}
      >
        <div className="drawer-header" style={{ display: 'flex', alignItems: 'flex-start' }}>
          <h4 style={{ margin: 0, marginTop: 50 }}>MENU</h4>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px" }}>
            {user ? (
              <button onClick={onLogout} style={loginBtnStyle}>LOGOUT</button>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} style={loginBtnStyle}>LOGIN</Link>
            )}
          </div>
        </div>

        <div className="drawer-content" style={{ marginTop: 30 }}>
          <div className="drawer-section">
            <h6>SHOP</h6>
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/products/category/${encodeURIComponent(cat)}`}
                onClick={() => setOpen(false)}
              >
                {cat}
              </Link>
            ))}
          </div>
          <hr style={{margin:0}}></hr>

          <div className="drawer-section">
            <h6>COMMUNITY</h6>
            <Link to="/notices" onClick={() => setOpen(false)}>NOTICE</Link>
            <Link to="/datarooms" onClick={() => setOpen(false)}>DATAROOM</Link>
          </div>
          <hr style={{margin:0}}></hr>
          <div className="drawer-section">

            {user ? (
  user.role === 'ADMIN' ? (
    <>
      <h6>ADMIN</h6>
      <Link to="/admin" style={{color:'red'}} onClick={() => setOpen(false)}>관리자</Link>
    </>
  ) : (
    <>
      <h6>MYPAGE</h6>
      <Link to="/mypage" onClick={() => setOpen(false)}>MYPAGE</Link>
      <Link to="/cart" onClick={() => setOpen(false)}>CART</Link>
    </>
  )
) : (
  <Link
    to="/register"
    onClick={() => setOpen(false)}
    style={{
      textDecoration: 'none',
      fontSize: 13,
      borderRadius: 5,
      color: '#0d6efd'
    }}
  >
    JOIN US
  </Link>
)}

          </div>
        </div>
      </div>
    </>
  );
}

const loginBtnStyle = {
  padding: "6px 10px",
  fontSize: "12px",
  backgroundColor: "#000",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  textDecoration: "none",
  cursor: "pointer",
};
