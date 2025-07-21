import { useEffect, useState } from "react";
import { fetchReviewsByProduct } from "../api";
import PhotoReviewModal from "./PhotoReviewModal"; // 모달 import

export default function PhotoReviewGallery({ productId }) {
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchReviewsByProduct(productId).then((res) => {
      const photoReviews = res.data.filter((r) => r.imagePath);
      setImages(photoReviews.map((r) => r.imagePath));
    });
  }, [productId]);

  if (images.length === 0) return null;

  return (
    <div style={{ padding: 15 }}>
      <div style={{ fontWeight: "bold", marginBottom: 10 }}>
        포토 ({images.length})
        <span
          style={{
            float: "right",
            color: "#888",
            cursor: "pointer",
            textDecoration: "underline",
            fontSize: 13,
          }}
          onClick={() => setShowModal(true)}
        >
          전체보기
        </span>
      </div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
        {images.slice(0, 6).map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`리뷰 이미지 ${idx + 1}`}
            style={{
              width: 100,
              maxHeight: 120,
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
        ))}
      </div>

      {showModal && (
        <PhotoReviewModal
          productId={productId}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
