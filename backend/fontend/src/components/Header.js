import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";
import "./common.css";

export default function Header() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const isMain = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const backgroundColor = isMain && !hamburgerOpen ? "transparent" : "white";
  const opacity = isMain && !hamburgerOpen ? (scrolled ? 0.8 : 1) : 0.98;
  const [hovering, setHovering] = useState(false);
  const isHoverOrScrolledOrOpen = hovering || scrolled || hamburgerOpen;
  const categories = [
    "1/2 TEE",
    "HOOD",
    "SWEAT SHIRT",
    "LONG SLEEVES",
    "OUTER",
    "BOTTOM",
    "KNIT",
    "OTHER",
  ];

  useEffect(() => {
    axios
      .get("/api/users/me", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/users/logout", {}, { withCredentials: true });
      alert("로그아웃 되었습니다");
      setUser(null);
      window.location.href = "/";
    } catch (err) {
      alert("로그아웃 실패");
    }
  };

  const isLoggedIn = !!user;

  const linkStyle = {
    color: isMain && !isHoverOrScrolledOrOpen ? "#fff" : "#000",
    textDecoration: "none",
    marginRight: 20,
    fontSize: 13,
  };

  const rightLinkStyle = {
    textDecoration: "none",
    color: isMain && !isHoverOrScrolledOrOpen ? "#fff" : "#000",
    marginRight: 20,
    fontSize: 13,
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`${isMain ? "headerhover" : ""} ${hamburgerOpen ? "hamburger-open" : ""
        }`}
      style={{
        backgroundColor: isMain && !(hovering || scrolled || hamburgerOpen) ? "transparent" : "white",
        opacity,
        boxShadow: !isMain && scrolled ? "0 2px 10px rgba(0, 0, 0, 0.1)" : "none"
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        className="header-in"
        style={{
          maxWidth: 1700,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 20,
          position: "relative",
        }}
      >
        {/* 왼쪽 메뉴: 햄버거 */}
        <div className="hamburger_hide">
          <HamburgerMenu onToggle={setHamburgerOpen} dark={isHoverOrScrolledOrOpen} user={user} onLogout={handleLogout} />
        </div>

        {/* 왼쪽 메뉴 */}
        <div
          className="main_nav Pretendard"
          style={{ display: "flex",marginTop:5, fontSize: 12 }}
        >
          <nav className="dropdown-wrapper">
            <div className="dropdown">
              <span
                style={linkStyle}
                className={`dropdown-toggle ${isMain ? "hover" : ""}`}
              >
                SHOP
              </span>
              <ul
                style={{ borderRadius: 0, fontSize: 12 }}
                className="dropdown-menu list-unstyled m-0"
              >
                {categories.map((cat) => (
                  <li key={cat}>
                    <Link
                      to={`/products/category/${encodeURIComponent(cat)}`}
                      className="dropdown-item text-dark"
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
          <nav>
            <Link
              to="/notices"
              style={linkStyle}
              className={isMain ? "hover" : ""}
            >
              NOTICE
            </Link>
            <Link
              to="/datarooms"
              style={linkStyle}
              className={isMain ? "hover" : ""}
            >
              DATAROOM
            </Link>
          </nav>
        </div>

        {/* 가운데 로고 */}
        <h1
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            margin: 0,
            width: 177,
          }}
        >
          <Link className="logo1024" to="/" style={{ display: "block" }}>
            <img
              src="/img/logo-black.jpg" // 검정 로고 한 장만 사용
              alt="로고"
              style={{
                width: "100%",
                filter:
                  isMain && !isHoverOrScrolledOrOpen
                    ? "invert(100%)" // 메인에서 흰색처럼 보이게
                    : "invert(0%)", // 나머지는 원래 색 (검정)
              }}
            />
          </Link>
        </h1>
        <div className="cart1024" style={{width:32, marginTop:3}}>
          <Link
            to="/cart"
            style={rightLinkStyle}
            className={isMain ? "hover" : ""}
          >
            <img style={{width:32, 
                width: "100%",
                filter:
                  isMain && !isHoverOrScrolledOrOpen
                    ? "invert(100%)" // 메인에서 흰색처럼 보이게
                    : "invert(0%)", // 나머지는 원래 색 (검정)
              }} src="/img/cart.svg" />
          </Link>
        </div>
        {/* 오른쪽 메뉴 */}
        <nav
          className="Pretendard"
          style={{ display: "flex", alignItems: "center", paddingTop:5, }}
        >
          {user?.role === "ADMIN" && (
            <Link
              to="/admin"
              style={{ ...linkStyle, fontSize: 12, color: "red" }}
            >
              ADMIN
            </Link>
          )}
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                style={rightLinkStyle}
                className={isMain ? "hover" : ""}
              >
                LOGIN
              </Link>
              <Link
                to="/register"
                style={rightLinkStyle}
                className={isMain ? "hover" : ""}
              >
                JOIN US
              </Link>
            </>
          ) : (
            <>
              {user?.role !== "ADMIN" && (
                <>
                  <Link
                    to="/mypage"
                    style={rightLinkStyle}
                    className={isMain ? "hover" : ""}
                  >
                    MY PAGE
                  </Link>
                  <Link
                    to="/cart"
                    style={rightLinkStyle}
                    className={isMain ? "hover" : ""}
                  >
                    CART
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                style={{
                  ...rightLinkStyle,
                  background: "none",
                  border: "none",
                  padding: 0,
                  margin: 0
                }}
                className={isMain ? "hover" : ""}
              >
                LOGOUT
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
