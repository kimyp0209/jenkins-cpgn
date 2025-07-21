import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  fetchReviewsByProduct,
  deleteReview,
  getCurrentUser,
  fetchOrderList,
} from "../api";
import PhotoReviewGallery from "./PhotoReviewGallery";

function ReviewList({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [orderIdMap, setOrderIdMap] = useState({});
  const navigate = useNavigate();
  const [reviewCount, setReviewCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [likePercentage, setLikePercentage] = useState(0);
  const [showPhotoOnly, setShowPhotoOnly] = useState(false);
  const filteredReviews = showPhotoOnly
  ? reviews.filter((r) => r.imagePath) // 이미지가 있는 리뷰만
  : reviews;
  const location = useLocation();

  useEffect(() => {
    loadReviews();
    loadUser();
    loadOrders();
  }, [productId]);

  useEffect(() => {
  if (location.state?.photoOnly) {
    setShowPhotoOnly(true);
  }
}, [location.state]);

  const loadReviews = async () => {
    try {
      const res = await fetchReviewsByProduct(productId);
      setReviews(res.data);
      setReviewCount(res.data.length);

      if (res.data.length > 0) {
        const total = res.data.reduce((sum, review) => sum + review.rating, 0);
        const avg = total / res.data.length;
        setAverageRating(avg.toFixed(1));

        const likedCount = res.data.filter((r) => r.rating >= 4).length;
        setLikePercentage(Math.round((likedCount / res.data.length) * 100));

        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        res.data.forEach((r) => counts[r.rating]++);
        setRatingCounts(counts); // ⭐ 여기 추가
      } else {
        setAverageRating(0);
        setLikePercentage(0);
        setRatingCounts({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
      }
    } catch (err) {
      console.error("리뷰 불러오기 실패", err);
    }
  };

  const loadUser = async () => {
    try {
      const res = await getCurrentUser();
      setUsername(res.data.username);
      setUserId(res.data.userId);
    } catch {
      // 비회원일 경우 아무것도 안함
    }
  };

  const loadOrders = async () => {
    try {
      const res = await fetchOrderList();
      const orderIdMapTemp = {};
      res.data.forEach((order) => {
        order.items.forEach((item) => {
          if (item.productId === productId) {
            orderIdMapTemp[productId] = order.id;
          }
        });
      });
      setOrderIdMap(orderIdMapTemp);
    } catch (err) {
      console.error("주문 정보 불러오기 실패", err);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteReview(reviewId, userId); // ✅ userId 전달
      alert("리뷰가 삭제되었습니다.");
      loadReviews();
    } catch (err) {
      console.error("삭제 실패", err);
      alert("리뷰 삭제 중 오류 발생");
    }
  };

  const handleEdit = (reviewId) => {
    const orderId = orderIdMap[productId];
    navigate(
      `/reviews/write?productId=${productId}&reviewId=${reviewId}&orderId=${orderId}`
    );
  };

  const ratingTexts = {
    5: "아주 좋아요",
    4: "좋아요",
    3: "보통이에요",
    2: "그저 그래요",
    1: "별로예요",
  };

  const [ratingCounts, setRatingCounts] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });

  const totalReviews = Object.values(ratingCounts).reduce((a, b) => a + b, 0);

  return (
    <div
      id="review-section"
      className="mt-4"
      style={{ minHeight: 500, maxWidth: 750, margin: "0 auto" }}
    >
      <h5
        style={{ paddingBottom: 10, borderBottom: "1px solid #000", margin: 0 }}
      >
        REVIEW <span>({reviewCount})</span>
      </h5>

      <div
  style={{
    display: "flex",
    borderBottom: "1px solid #ddd",
    padding: "40px 20px",
    gap: 40,
    justifyContent: "center",
  }}
>
  {/* 왼쪽 영역 */}
  <div style={{ width: 300, textAlign: "center" }}>
    <div style={{ fontSize: 50, fontWeight: 700 }}>
      ★ <span style={{ fontSize: 60 }}>{averageRating}</span>
    </div>
    <div style={{ marginTop: 15, fontSize: 14, color: "#333" }}>
      <strong>{likePercentage}%</strong>의 구매자가 이 상품을 좋아합니다.
    </div>
  </div>

  {/* 세로 라인 */}
  <div style={{ width: 1, background: "#ddd" }}></div>

  {/* 오른쪽 영역 - 막대 그래프 */}
  <div style={{ width: 220 }}>
    {[5, 4, 3, 2, 1].map((score) => {
      const count = ratingCounts[score] || 0;
      const percent = reviewCount > 0 ? (count / reviewCount) * 100 : 0;

      return (
        <div
          key={score}
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 13,
            marginBottom: 8,
          }}
        >
          <div style={{ width: 70 }}>{ratingTexts[score]}</div>
          <div
            style={{
              flex: 1,
              backgroundColor: "#eee",
              height: 8,
              borderRadius: 4,
              margin: "0 8px",
              position: "relative",
            }}
          >
            <div
              style={{
                width: `${percent}%`,
                height: "100%",
                backgroundColor: score === 5 ? "#111" : "#bbb",
                borderRadius: 4,
              }}
            />
          </div>
          <div style={{ width: 24, textAlign: "right" }}>{count}</div>
        </div>
      );
    })}
  </div>
</div>


      <PhotoReviewGallery productId={productId} />
      {reviews.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: 30 }}>
          아직 작성된 리뷰가 없습니다.
        </div>
      ) : (
        reviews.map((r) => (
          <div key={r.id} className="mb-2">
            <div style={{ borderTop: "1px solid #d8dde5", padding: 15 }}>
              <p style={{ fontSize: 13, margin: 0 }}>
                {r.username.length > 3
                  ? r.username.slice(0, -3) + "***"
                  : r.username[0] + "*".repeat(r.username.length - 1)}
                님의 리뷰입니다.
              </p>
              <p style={{ color:'#000', margin: 0, fontSize: 13 }}>
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
                <span style={{color:'#000', fontSize: 14, marginLeft: 10 }}>
                  {ratingTexts[r.rating] || ""}
                </span>
              </p>
            </div>
            {r.imagePath && (
              <div style={{ padding: "0 15px" }}>
                <img
  src={typeof r.imagePath === "string" ? r.imagePath : r.imagePath?.path || ""}
  alt="리뷰 이미지"
  style={{
    maxWidth: 150,
    maxHeight: 150,
    border: "1px solid #ccc",
  }}
/>
              </div>
            )}
            <div style={{ padding: 15, whiteSpace: "pre-line" }}>{r.content}</div>
           
          </div>
        ))
      )}
    </div>
  );
}

export default ReviewList;
