import { useEffect, useState } from "react";
import {
  fetchProductDetail,
  addToCart,
  getProfile,
  fetchReviewsByProduct,
} from "../api";
import { useParams, useNavigate } from "react-router-dom";
import ReviewList from "./ReviewList"; // ✅ 리뷰 목록 컴포넌트 (읽기 전용)
import "./style.css";

function renderStars(rating) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push("★");
    } else if (i - rating < 1) {
      stars.push("⯪"); // ❗️반쪽 별 없으면 그냥 ☆
    } else {
      stars.push("☆");
    }
  }
  return stars.join("");
}

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const discountedPrice = product
    ? product.price * (1 - product.percent / 100)
    : 0;
  const totalPrice = discountedPrice * quantity;
  const [activeTab, setActiveTab] = useState("info");
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchProductDetail(id).then((res) => setProduct(res.data));
    getProfile()
      .then((res) => setUserId(res.data.id))
      .catch(() => setUserId(null));

    fetchReviewsByProduct(id).then((res) => {
      setReviews(res.data);
      if (res.data.length > 0) {
        const total = res.data.reduce((sum, r) => sum + r.rating, 0);
        setAverageRating((total / res.data.length).toFixed(1));
      } else {
        setAverageRating(0);
      }
    });
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await getProfile(); // 로그인 확인
    } catch (err) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      await addToCart({
        productId: product.id,
        productName: product.name,
        price: product.price,
        percent: product.percent,
        quantity,
        thumbnailimg: product.thumbnailimg,
      });
      alert("장바구니에 추가되었습니다!");
      navigate("/cart");
    } catch (err) {
      console.error("장바구니 추가 실패", err);
    }
  };

  const handleScrollToReview = () => {
    setActiveTab("review");

    setTimeout(() => {
      const section = document.getElementById("review-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 200); // 리뷰 컴포넌트가 렌더링될 시간
  };

  const handleBuyNow = async () => {
  try {
    await getProfile(); // ✅ 로그인 확인
  } catch (err) {
    alert("로그인이 필요합니다.");
    navigate("/login");
    return;
  }

  navigate("/shipping", {
    state: {
      singleItem: {
        productId: product.id,
        productName: product.name,
        price: product.price,
        percent: product.percent,
        quantity,
        thumbnailimg: product.thumbnailimg,
        amount: Math.floor(
          product.price * quantity * (1 - product.percent / 100)
        ),
      },
    },
  });
};


  if (!product) return <p>🔄 로딩 중...</p>;

  return (
    <div className="container" style={{ paddingTop: 150 }}>
      <div
        className="detail_in"
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "85%",
          margin: "0 auto",
        }}
      >
        <div className="detail-img" style={{ width: "53%" }}>
          <img
            src={product.thumbnailimg}
            alt="썸네일"
            className="img-fluid mb-3"
          />
        </div>
        <div
          className="detail-text"
          style={{ borderTop: "2px solid #000", paddingTop: 20, width: "40%" }}
        >
          <h3 style={{ fontSize: 25, fontWeight: "bold" }}>{product.name}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <p style={{ fontSize: 12, margin: 0 }}>
              {renderStars(averageRating)}
            </p>

            <p
              style={{
                fontSize: 12,
                textDecoration: "underline",
                cursor: "pointer",
                margin: 0,
              }}
              onClick={handleScrollToReview}
            >
              총 {reviews.length}개의 리뷰보기
            </p>
          </div>
          {product.reviewAudioPath && (
            <div
              style={{
                padding: "10px 0",
                fontSize: 13,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <p style={{ margin: 0, color: "blue" }}>리뷰 요약 듣기</p>

              <audio controls style={{ height: 20, maxWidth: 220 }}>
                <source src={product.reviewAudioPath} type="audio/mpeg" />
                브라우저가 audio 태그를 지원하지 않습니다.
              </audio>
            </div>
          )}
          {product.percent > 0 && (
          <p style={{ fontSize: 14, color: "#555", marginBottom: 0 }}>
            <del>{product.price.toLocaleString()}원</del>
          </p>
          )}
          <div style={{ display: "flex" }}>
            {product.percent > 0 && (
  <p style={{ fontSize: 20, color: "red", fontWeight: "bold", marginRight: 10 }}>
    {product.percent}%
  </p>
)}
            <p style={{ fontSize: 20, fontWeight: "bold" }}>
              {(product.price * (1 - product.percent / 100)).toLocaleString()}원
            </p>
          </div>
          <div
            style={{
              marginTop: 20,
              display: "flex",
              color: "#555",
              borderTop: "1px solid #e3e3e3",
              padding: "20px 0",
              borderBottom: "1px solid #e3e3e3",
            }}
          >
            <p style={{ marginRight: 60, marginBottom: 0, fontSize: 13 }}>
              배송비
            </p>
            <p style={{ marginBottom: 0, fontSize: 13 }}>무료</p>
          </div>
          <div style={{ marginTop: 30 }} className="d-flex align-items-center">
            <label className="me-2">수량:</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="btn btn-outline-secondary"
                style={{ borderRadius: 0, width: 30, height: 30, padding: 0 }}
              >
                −
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
                className="form-control text-center"
                style={{
                  width: 50,
                  borderRadius: 0,
                  height: 30,
                  border: "1px solid #6c757d",
                  borderLeft: 0,
                  borderRight: 0,
                }}
              />
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="btn btn-outline-secondary"
                style={{ borderRadius: 0, width: 30, height: 30, padding: 0 }}
              >
                ＋
              </button>
            </div>
          </div>
          <div
            style={{
              borderTop: "2px solid #000",
              paddingTop: 20,
              marginTop: 30,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <p style={{ fontSize: 16, color: "#333" }}>총 상품 금액</p>
            <p>
              {(
                product.price *
                (1 - product.percent / 100) *
                quantity
              ).toLocaleString()}
              원
            </p>
          </div>

          <button
            style={{ width: "100%", borderRadius: 0, marginTop: 20 }}
            className="btn btn-dark"
            onClick={handleBuyNow}
          >
            BUY IT NOW
          </button>
          <button
            style={{ width: "100%", borderRadius: 0, marginTop: 10 }}
            className="btn btn-outline-dark"
            onClick={handleAddToCart}
          >
            ADD TO CART
          </button>
        </div>
      </div>
      <div style={{ marginTop: 100, borderTop: "2px solid #000" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            borderBottom: "1px solid #ddd",
          }}
        >
          <button
            onClick={() => setActiveTab("info")}
            style={{
              width: "100%",
              maxWidth: 300, // 버튼 최대 너비
              minWidth: 150, // 최소 너비
              padding: "15px 30px",
              border: "none",
              borderBottom: activeTab === "info" ? "3px solid #000" : "none",
              backgroundColor: "transparent",
              fontWeight: activeTab === "info" ? "bold" : "normal",
            }}
          >
            상품정보
          </button>
          <button
            onClick={() => setActiveTab("review")}
            style={{
              width: "100%",
              maxWidth: 300, // 버튼 최대 너비
              minWidth: 150, // 최소 너비
              padding: "15px 30px",
              border: "none",
              borderBottom: activeTab === "review" ? "3px solid #000" : "none",
              backgroundColor: "transparent",
              fontWeight: activeTab === "review" ? "bold" : "normal",
            }}
          >
            리뷰
          </button>
        </div>
      </div>

      <div style={{ padding: 30, marginTop: 30 }}>
        {activeTab === "info" ? (
          <>
            <p
              style={{
                textAlign: "center",
                whiteSpace: "pre-line",
                fontSize: 13,
              }}
            >
              {product.description}
            </p>
            <div style={{ textAlign: "center" }}>
              <img
                src={product.detailimg}
                alt="상세 이미지"
                className="img-fluid my-4"
              />
            </div>
          </>
        ) : (
          <ReviewList productId={product.id} />
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
