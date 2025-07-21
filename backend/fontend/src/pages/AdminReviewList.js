import { useEffect, useState } from "react";
import { fetchAdminReviews, deleteAdminReview } from "../api";

export default function AdminReviewList() {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchReviews = async () => {
    try {
      setReviews([]);
      const res = await fetchAdminReviews(page);
      console.log("응답 개수:", res.data.content.length);
      setReviews(res.data.content);
      setTotalPages(res.data.page.totalPages);
    } catch (err) {
      console.error("리뷰 목록 불러오기 실패", err);
      alert("리뷰 로딩 실패");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteAdminReview(id);
      fetchReviews(); // 삭제 후 목록 갱신
    } catch (err) {
      alert("리뷰 삭제 실패");
    }
  };

  const formatDate = (dt) => {
  const date = new Date(dt);
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const day = (`0${date.getDate()}`).slice(-2);
  return `${year}.${month}.${day}.`;
};

  useEffect(() => {
    fetchReviews();
  }, [page]);

  return (
    <div className="container none" style={{paddingBottom:100}}>
      <h2 className="" style={{ fontWeight: 'bold' }}>리뷰 관리</h2>
      <div className="table-responsive">
      <table className="table table-bordered text-center align-middle">
  <thead className="table-dark">
    <tr style={{ whiteSpace: "nowrap" }}>
      <th>#</th>
      <th>작성자</th>
      <th>상품</th>
      <th>⭐</th>
      <th>내용</th>
      <th>작성일</th>
      <th>이미지</th>
      <th>삭제</th>
    </tr>
  </thead>
  <tbody>
  {reviews.length === 0 ? (
    <tr>
      <td colSpan="8" className="text-center text-muted">
        등록된 리뷰가 없습니다.
      </td>
    </tr>
  ) : (
    reviews.map((review, idx) => (
      <tr key={review.id}>
        <td>{review.id}</td>
        <td>{review.username || "알 수 없음"}</td>
        <td>{review.productName}</td>
        <td>{review.rating}</td>
        <td style={{ whiteSpace: "pre-line" }}>{review.content}</td>
        <td>{formatDate(review.createdAt)}</td>
        <td>
          {review.imagePath ? (
            <img
              src={review.imagePath}
              alt="리뷰 이미지"
              style={{ width: 60, height: 60, objectFit: "cover" }}
            />
          ) : (
            "-"
          )}
        </td>
        <td>
          <button
            style={{ borderRadius: 0, whiteSpace: "nowrap" }}
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(review.id)}
          >
            삭제
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>

</table>

      </div>

      {/* 페이지네이션 */}
      <nav className="d-flex justify-content-center">
        <ul className="pagination">
          {[...Array(totalPages)].map((_, i) => (
            <li key={i} className={`page-item ${i === page ? "active" : ""}`}>
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
