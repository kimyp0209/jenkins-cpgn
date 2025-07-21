import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import ReviewForm from "./ReviewForm";

function ReviewFormPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { reviewId: paramReviewId } = useParams();
  const params = new URLSearchParams(location.search);
  const productId = params.get("productId");
  const orderId = params.get("orderId");
  const reviewId = paramReviewId || params.get("reviewId");
  const [user, setUser] = useState(null);
  const [initialValue, setInitialValue] = useState(null);
  const [userId, setUserId] = useState(null);

  // 🔐 유저 정보
  useEffect(() => {
    axios.get("/api/users/me", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
        setUserId(res.data.userId);
      })
      .catch(() => alert("로그인이 필요합니다"));
  }, []);

  // 기존 리뷰
  useEffect(() => {
    if (reviewId) {
      axios.get(`/api/reviews/product/${productId}`)
        .then((res) => {
          const found = res.data.find((r) => String(r.id) === reviewId);
          if (found) setInitialValue(found);
        })
        .catch((err) => {
          console.error("리뷰 로딩 실패", err);
          alert("리뷰 정보를 불러올 수 없습니다.");
        });
    }
  }, [reviewId, productId]);

  // 제출 처리
  // 수정된 handleSubmit 내부
const handleSubmit = async (reviewData) => {
  if (!userId) return alert("로그인 정보가 없습니다.");

  try {
    const formData = new FormData();

    // ✅ imagePath는 항상 string만 넣어야 함
    const imagePath =
      typeof reviewData.image === "string"
        ? reviewData.image
        : (reviewData.image?.path ?? ""); // 잘못된 객체가 들어오지 않도록

    const reviewBody = {
      userId,
      username: user?.username,
      content: reviewData.content,
      rating: reviewData.rating,
      orderId,
      imagePath: typeof reviewData.image === "string" ? reviewData.image : "",
    };

    formData.append("review", JSON.stringify(reviewBody));

    // 새 이미지 업로드된 경우만 파일 추가
    if (reviewData.image && typeof reviewData.image !== "string") {
      formData.append("image", reviewData.image); // ✅ key 이름 주의
    }

    if (reviewId) {
      await axios.put(`/api/reviews/update/${reviewId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("리뷰 수정 완료");
    } else {
      await axios.post(`/api/reviews/${productId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("리뷰 등록 완료");
    }

    navigate("/mypage?tab=reviews", { state: { refresh: Date.now() } });
    window.location.reload();
  } catch (err) {
    console.error("리뷰 등록 실패", err);
    alert("리뷰 처리 실패");
  }
};




  return (
    <div className="container" style={{ paddingTop: 150 }}>
      <h2 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 50 }}>
        {reviewId ? "리뷰 수정" : "리뷰 작성"}
      </h2>
      <ReviewForm
        editing={!!reviewId}
        initialValue={initialValue}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/orders/${orderId}`)}
        userId={userId}
        username={user?.username}
      />
    </div>
  );
}

export default ReviewFormPage;
