// src/components/ScrollToTop.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 페이지 전환 시 스크롤을 맨 위로
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
