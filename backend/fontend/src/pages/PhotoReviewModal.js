import { useEffect, useState } from "react";
import { fetchReviewsByProduct } from "../api";

export default function PhotoReviewModal({ productId, onClose }) {
  const [photoReviews, setPhotoReviews] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    fetchReviewsByProduct(productId).then((res) => {
      const photos = res.data.filter((r) => r.imagePath);
      setPhotoReviews(photos);
    });
  }, [productId]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (photoReviews.length === 0) return null;

  const selected = photoReviews[selectedIndex];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          width: 800,
          height: 600,
          display: "flex",
          overflow: "hidden",
          borderRadius: 8,
          position: "relative",
        }}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 20,
            background: "transparent",
            border: "none",
            fontSize: 24,
            cursor: "pointer",
          }}
        >
          x
        </button>

        {/* 왼쪽 썸네일 */}
        <div style={{
  width: 400, // 또는 고정 너비도 가능
  padding: 20,
  background: "#f8f8f8",
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 10,
  overflowY: "auto"
}}>
  {photoReviews.map((r, i) => (
    <img
      key={i}
      src={r.imagePath}
      alt=""
      onClick={() => setSelectedIndex(i)}
      style={{
        width: "100%",
        height: 100,
        objectFit: "cover",
        border: i === selectedIndex ? "2px solid black" : "1px solid #ccc",
        cursor: "pointer"
      }}
    />
  ))}
</div>


        {/* 오른쪽 상세 */}
        <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
          <div style={{ fontWeight: "bold", marginBottom: 10 }}>
            ⭐ {selected.rating}점
          </div>
          <img
            src={selected.imagePath}
            alt=""
            style={{
              width: "100%",
              maxHeight: 400,
              objectFit: "contain",
              borderRadius: 10,
              border: "1px solid #ccc",
            }}
          />
          
          <p style={{ fontSize: 12, color: "#888",marginTop: 10 }}>
            {selected.username} / {selected.createdAt?.split("T")[0]}
          </p>
          <p style={{ whiteSpace: "pre-line" }}>{selected.content}</p>
        </div>
      </div>
    </div>
  );
}
