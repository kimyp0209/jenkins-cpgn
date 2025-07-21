import React, { useEffect, useState } from 'react';
import { fetchMyReviews, deleteReview, getCurrentUser } from '../api';
import { useNavigate } from 'react-router-dom';

export default function MyReviewList() {
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  // 사용자 정보 로딩
  useEffect(() => {
    getCurrentUser()
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  // 페이지 또는 사용자 변경 시 리뷰 로딩
  useEffect(() => {
    if (user) {
      loadReviews(page);
    }
  }, [page, user]);

  // 리뷰 목록 불러오기
  const loadReviews = async (pageNum) => {
     console.log("리뷰 불러오는 중, 페이지:", pageNum);
    try {
      const res = await fetchMyReviews(pageNum);
      console.log("총 페이지 수:", res.data.totalPages);
      console.log("응답 전체:", res);
      setReviews(res.data.content);
      setTotalPages(res.data.page.totalPages); 
    } catch (err) {
      if (err.response?.status === 401) {
        alert("로그인이 필요합니다.");
        window.location.href = "/login";
      } else {
        console.error("리뷰 불러오기 실패", err);
      }
    }
  };

  

  // 리뷰 삭제
  const handleDelete = async (reviewId) => {
    if (!user?.userId) {
      alert("로그인 후 시도해주세요.");
      return;
    }

    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteReview(reviewId, user.userId);
        loadReviews(page); // 현재 페이지 기준으로 다시 로드
      } catch (err) {
        console.error("리뷰 삭제 실패", err);
        alert("리뷰 삭제에 실패했습니다.");
      }
    }
  };

  return (
    <div style={{ padding: 0 }}>
      <h3 style={{ margin: 0, fontWeight: 'bold', borderBottom: '2px solid #000', paddingBottom: 10 }}>내 리뷰</h3>

      <ul className="list-group" style={{ width: "100%", border: 0, padding: 0 }}>
        {reviews.length === 0 ? (
          <li style={{ border: 0, padding: '20px 0', textAlign: 'center' }} className="list-group-item">
            작성한 리뷰가 없습니다.
          </li>
        ) : (
          reviews.map(review => (
            <li
              key={review.id}
              style={{
                fontSize: 14,
                padding: '20px 0',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '1px solid #DEDEDE'
              }}
            >
              <div>
                <div style={{ marginTop: 5, color: '#888' }}>
                  {review.createdAt?.substring(0, 10) || "날짜 없음"} | 평점: {review.rating}점
                </div>
                <div style={{ fontWeight: 'bold', marginBottom: 10 }}>{review.product}</div>
                {review.imagePath && (
                  <div style={{ marginBottom: 10 }}>
                    <img style={{ width: 150 }} src={review.imagePath} alt="review" />
                  </div>
                )}
                <div style={{ marginTop: 5 }}>{review.content}</div>
              </div>
              <div className="mt-2" style={{ display: 'flex', flexDirection: 'column' }}>
                <button
                  style={{ borderRadius: 0, marginBottom: 10 }}
                  className="btn btn-sm btn-outline-primary"
                  onClick={() =>
                    navigate(`/reviews/write?productId=${review.productId}&orderId=${review.orderId}&reviewId=${review.id}`)
                  }
                >
                  수정
                </button>
                <button
                  style={{ borderRadius: 0 }}
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(review.id)}
                >
                  삭제
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* 페이지네이션 */}
      <nav className="d-flex justify-content-center mt-3">
        <ul className="pagination">
          {[...Array(totalPages)].map((_, i) => (
            <li key={i} className={`page-item ${page === i ? "active" : ""}`}>
              <button className="page-link" onClick={() => setPage(i)}>
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
