// components/MainBanner.js
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MainBanner() {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    axios.get("/api/banner/list", { withCredentials: true })
      .then(res => {
        const banners = res.data;
        if (banners.length > 0) {
          setBanner(banners[banners.length - 1]); // 최신 배너 하나
        }
      })
      .catch(err => {
        console.error("배너 불러오기 실패", err);
      });
  }, []);

  if (!banner) return null;

  return (
    <div style={{
      width: "100%",
      maxWidth: "1920px",
      height: "300px",
      overflow: "hidden",
      margin: "0 auto 40px",
      borderRadius: "10px",
      position: "relative"
    }}>
      <img
        src={banner.imageUrl}
        alt="이벤트 배너"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center"
        }}
      />
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        color: "#fff",
        backgroundColor: "rgba(0,0,0,0.4)",
        padding: "10px 30px",
        borderRadius: "6px",
        fontSize: "22px",
        fontWeight: "bold",
        whiteSpace: "pre-wrap",
        textAlign: "center",
        maxWidth: "90%"
      }}>
        {banner.text}
      </div>
    </div>
  );
}
